import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { registerSSEClient } from '@/lib/realtime';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Authenticate user
  const session = await getSessionFromRequest(request);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(event: any) {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      // Heartbeat every 25s to keep connection alive on proxies
      const heartbeat = setInterval(() => {
        try { controller.enqueue(encoder.encode(': ping\n\n')); } catch {}
      }, 25000);

      // Register client
      const unregister = registerSSEClient({
        userId: String(session.userId),
        role: undefined,
        send: (payload) => sendEvent(payload),
      });

      // Initial hello
      sendEvent({ type: 'sse:connected' });

      // Cleanup on close
      const close = () => {
        clearInterval(heartbeat);
        unregister();
        try { controller.close(); } catch {}
      };

      // Abort handling
      request.signal.addEventListener('abort', close);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}


