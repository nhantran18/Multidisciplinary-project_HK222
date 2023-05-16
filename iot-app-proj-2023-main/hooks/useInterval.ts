import { useEffect, useRef, useCallback } from "react";

// Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, delayMillisecond: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delayMillisecond !== null) {
      const id = setInterval(tick, delayMillisecond);
      return () => clearInterval(id);
    }
  }, [delayMillisecond]);
}

// Source: https://blog.devgenius.io/how-to-better-poll-apis-in-react-312bddc604a4
export function useIntervalAsync<T = unknown>(
  fn: () => Promise<T>,
  ms: number,
) {
  const runningCount = useRef(0);
  const timeout = useRef<number>();
  const mountedRef = useRef(false);

  const next = useCallback(
    (handler: TimerHandler) => {
      if (mountedRef.current && runningCount.current === 0) {
        timeout.current = setTimeout(handler, ms);
      }
    },
    [ms],
  );

  const run = useCallback(async () => {
    runningCount.current += 1;
    const result = await fn();
    runningCount.current -= 1;

    next(run);

    return result;
  }, [fn, next]);

  useEffect(() => {
    mountedRef.current = true;
    run();

    return () => {
      mountedRef.current = false;
      clearTimeout(timeout.current);
    };
  }, [run]);

  const flush = useCallback(() => {
    clearTimeout(timeout.current);
    return run();
  }, [run]);

  return flush;
}
