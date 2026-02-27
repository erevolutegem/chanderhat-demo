import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get("sportId");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    let intervalId: any;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const fetchAndPush = async () => {
                try {
                    const fetchUrl = sportId
                        ? `${apiUrl}/games/live?sportId=${sportId}`
                        : `${apiUrl}/games/live`;

                    const res = await fetch(fetchUrl, { cache: "no-store" });
                    const data = await res.json();

                    if (data && data.success && Array.isArray(data.results)) {
                        const message = `data: ${JSON.stringify(data.results)}\n\n`;
                        controller.enqueue(encoder.encode(message));
                    }
                } catch (e) {
                    // Ignore transient errors to keep stream alive
                }
            };

            // Initial fetch immediately
            await fetchAndPush();

            // Poll backend every 2.5 seconds (millisecond updates through SSE)
            intervalId = setInterval(fetchAndPush, 2500);
        },
        cancel() {
            if (intervalId) clearInterval(intervalId);
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no" // Important for NGINX / Coolify reverse proxies to disable buffering
        },
    });
}
