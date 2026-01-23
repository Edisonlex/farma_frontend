"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Handler = (payload: any, sourceId?: string) => void;

interface RealtimeContextType {
  clientId: string;
  status: "disconnected" | "connecting" | "connected";
  subscribe: (topic: string, handler: Handler) => () => void;
  publish: (topic: string, payload: any) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

function genId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const clientIdRef = useRef<string>(genId());
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const handlersRef = useRef<Map<string, Set<Handler>>>(new Map());
  const bcRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const wsUrl = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_WS_URL : undefined;
  const reconnectDelayRef = useRef<number>(500);

  const dispatch = useCallback((topic: string, payload: any, sourceId?: string) => {
    const set = handlersRef.current.get(topic);
    if (!set) return;
    set.forEach((h) => h(payload, sourceId));
  }, []);

  const connectWS = useCallback(() => {
    if (!wsUrl) return;
    try {
      setStatus("connecting");
      const url = new URL(wsUrl);
      url.searchParams.set("clientId", clientIdRef.current);
      const ws = new WebSocket(url.toString());
      wsRef.current = ws;
      ws.onopen = () => {
        setStatus("connected");
        reconnectDelayRef.current = 500;
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data && typeof data.topic === "string") {
            dispatch(data.topic, data.payload, data.sourceId);
          }
        } catch {}
      };
      ws.onclose = () => {
        setStatus("disconnected");
        const d = Math.min(reconnectDelayRef.current, 8000);
        reconnectDelayRef.current = Math.min(d * 2, 16000);
        setTimeout(() => connectWS(), reconnectDelayRef.current);
      };
      ws.onerror = () => {
        try { ws.close(); } catch {}
      };
    } catch {}
  }, [wsUrl, dispatch]);

  useEffect(() => {
    try {
      bcRef.current = new BroadcastChannel("pharmacy-realtime");
      bcRef.current.onmessage = (ev) => {
        const data = ev.data as { topic: string; payload: any; sourceId?: string };
        if (data && typeof data.topic === "string") {
          dispatch(data.topic, data.payload, data.sourceId);
        }
      };
    } catch {}
    return () => {
      try { bcRef.current?.close(); } catch {}
    };
  }, [dispatch]);

  useEffect(() => {
    if (wsUrl) connectWS();
  }, [wsUrl, connectWS]);

  const subscribe = useCallback((topic: string, handler: Handler) => {
    const set = handlersRef.current.get(topic) || new Set<Handler>();
    set.add(handler);
    handlersRef.current.set(topic, set);
    return () => {
      const cur = handlersRef.current.get(topic);
      if (!cur) return;
      cur.delete(handler);
      if (cur.size === 0) handlersRef.current.delete(topic);
    };
  }, []);

  const publish = useCallback((topic: string, payload: any) => {
    const sourceId = clientIdRef.current;
    const msg = JSON.stringify({ topic, payload, sourceId });
    try {
      bcRef.current?.postMessage({ topic, payload, sourceId });
    } catch {}
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(msg);
      }
    } catch {}
  }, []);

  const value = useMemo<RealtimeContextType>(() => ({
    clientId: clientIdRef.current,
    status,
    subscribe,
    publish,
  }), [status, subscribe, publish]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime debe usarse dentro de RealtimeProvider");
  return ctx;
}