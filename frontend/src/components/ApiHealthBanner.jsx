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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] max-w-md pointer-events-none">
      <div className="pointer-events-auto bg-red-600 text-white px-5 py-3 rounded-2xl shadow-luxury text-sm flex items-start gap-3">
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="leading-snug">
          <p className="font-medium">Backend not reachable</p>
          <p className="opacity-90 mt-0.5 text-xs">
            <code className="bg-white/15 px-1.5 py-0.5 rounded">{API_BASE}</code> is offline.
            Start it with <code className="bg-white/15 px-1.5 py-0.5 rounded">cd d:/ZentoMart/backend && npm run dev</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiHealthBanner;
