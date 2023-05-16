import React, { useEffect } from "react";

export function useMountEffect(fn: React.EffectCallback) {
  useEffect(fn, []);
}
