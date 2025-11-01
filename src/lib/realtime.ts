// In-memory SSE client registry (per process)
type SSEClient = {
  userId?: string | null;
  role?: string | null;
  send: (data: any) => void;
};

const sseClients: Set<SSEClient> = new Set();

export function registerSSEClient(client: SSEClient) {
  sseClients.add(client);
  return () => {
    sseClients.delete(client);
  };
}

export async function pushToUserSocket({
  userId,
  role,
  payload,
}: {
  userId?: string | null;
  role?: string | null;
  payload: any;
}): Promise<void> {
  try {
    // Broadcast to SSE clients that match userId (or role if provided). If neither provided, broadcast to all.
    for (const client of sseClients) {
      const userMatch = userId ? client.userId === userId : true;
      const roleMatch = role ? client.role === role : true;
      if (userMatch && roleMatch) {
        client.send(payload);
      }
    }
  } catch {
    // ignore
  }
}


