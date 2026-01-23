Backend Integration Readiness

Environment
- Set `NEXT_PUBLIC_API_URL` to the base HTTP API URL.
- Set `NEXT_PUBLIC_WS_URL` to the WebSocket endpoint.

HTTP Endpoints Expected
- Auth: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/password/reset`, `POST /auth/password/verify`, `POST /auth/password/apply`.
- Users: `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`.
- Clients: `GET /clients`, `POST /clients`, `PUT /clients/:id`, `DELETE /clients/:id`.
- Configuration: `PUT /config/notifications`, `PUT /config/security`, `PUT /config/inventory`, `PUT /config/users`, `PUT /config/system`, `PUT /config/backup`.
- Backups: `GET /backups/overview`, `POST /backups`, `GET /backups/:id/status`, `GET /backups/:id/download`.

WebSocket Topics
- `config.update` for configuration changes.
- `backup.update` for backup progress.
- Inventory topics used internally: `inventory.medication.add`, `inventory.medication.update`, `inventory.medication.delete`, `inventory.movement.add`, `inventory.category.*`, `inventory.supplier.*`.

Frontend Behavior
- If `NEXT_PUBLIC_API_URL` is defined, hooks and contexts call the backend; otherwise they use local storage and mock data.
- Downloads are handled in-browser via Blob.
- Real-time uses BroadcastChannel; if `NEXT_PUBLIC_WS_URL` is defined, it also uses WebSocket.

Extending
- Add new endpoints in `src/lib/api.ts` or new services in `src/services/*`.
- Wire hooks/contexts to services following the existing pattern.