"use client";

import { useCountUp } from "../hooks/useCountUp";

export default function CountUp({ value, start }: { value: string; start: boolean }) {
  return <>{useCountUp(value, start)}</>;
}
