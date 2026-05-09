import { useEffect, useState } from "react";
import { API_BASE, pingApi } from "../lib/api";

// Shows a fixed banner if the backend API is unreachable.
// Re-checks every 5 seconds while it's down.
const ApiHealthBanner = () => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const ok = await pingApi();
      if (!cancelled) setOnline(ok);
    };
    check();
    const id = setInterval(check, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (online) return null;

  // Render's free tier spins down after 15 min of idleness, so the first
  // request after a cold period can take ~30–60s. Show a friendly waking-up
  // message to real users, and keep the "start the backend" hint for local dev.
  const isDev = import.meta.env?.DEV;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] max-w-md pointer-events-none">
      <div className="pointer-events-auto bg-rosegold text-white px-5 py-3 rounded-2xl shadow-luxury text-sm flex items-start gap-3">
        <svg className="w-5 h-5 shrink-0 mt-0.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <div className="leading-snug">
          {isDev ? (
            <>
              <p className="font-medium">Backend not reachable</p>
              <p className="opacity-90 mt-0.5 text-xs">
                <code className="bg-white/15 px-1.5 py-0.5 rounded">{API_BASE}</code> is offline.
                Start it with <code className="bg-white/15 px-1.5 py-0.5 rounded">cd backend && npm run dev</code>
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Waking up the server…</p>
              <p className="opacity-90 mt-0.5 text-xs">
                This can take up to a minute on the first visit. Hang tight.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiHealthBanner;
