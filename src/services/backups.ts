import { apiGet, apiPost, apiDownload, hasApi, triggerDownload } from "@/lib/api";

export interface BackupOverview {
  lastBackup: string;
  lastBackupSize: string;
  lastBackupDuration: string;
  nextBackup: string;
  totalBackups: number;
  totalSize: string;
  availableSpace: string;
  backupHealth: "good" | "warning" | "error";
}

export async function getBackupOverview(): Promise<BackupOverview> {
  if (!hasApi()) {
    return {
      lastBackup: "2024-01-15 02:00:00",
      lastBackupSize: "2.3 GB",
      lastBackupDuration: "15 minutos",
      nextBackup: "2024-01-16 02:00:00",
      totalBackups: 28,
      totalSize: "64.2 GB",
      availableSpace: "156.8 GB",
      backupHealth: "good",
    };
  }
  const data = await apiGet("/backups/overview");
  return data as BackupOverview;
}

export async function requestBackup(): Promise<{ id: string }> {
  if (!hasApi()) {
    return { id: `local-${Date.now()}` };
  }
  const data = await apiPost("/backups", {});
  return data as { id: string };
}

export async function getBackupStatus(id: string): Promise<{ progress: number; ready: boolean; filename?: string }>{
  if (!hasApi()) {
    return { progress: 100, ready: true, filename: `backup-${id}.zip` };
  }
  const data = await apiGet(`/backups/${id}/status`);
  return data as { progress: number; ready: boolean; filename?: string };
}

export async function downloadBackup(id: string, filename?: string) {
  if (!hasApi()) {
    const blob = new Blob([`Respaldo simulado ${id}`], { type: "application/zip" });
    triggerDownload(blob, filename || `backup-${id}.zip`);
    return;
  }
  const blob = await apiDownload(`/backups/${id}/download`);
  triggerDownload(blob, filename || `backup-${id}.zip`);
}