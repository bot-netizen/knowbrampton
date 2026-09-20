"use client";

import { useEffect, useState } from "react";

/** The page is static, so the server-rendered number is correct only on the day
 *  it was built. Render that as the initial value (so it is right with JS off
 *  and there is no layout shift), then correct it on the client. */
export default function Countdown({
  targetIso,
  initial,
  className,
}: {
  targetIso: string;
  initial: number;
  className?: string;
}) {
  const [days, setDays] = useState(initial);

  useEffect(() => {
    const compute = () =>
      setDays(
        Math.max(0, Math.ceil((new Date(`${targetIso}T00:00:00-04:00`).getTime() - Date.now()) / 86_400_000)),
      );
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [targetIso]);

  return (
    <span className={className} suppressHydrationWarning>
      {days}
    </span>
  );
}
