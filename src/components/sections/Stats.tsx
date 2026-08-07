"use client";

import { useRef, useEffect } from "react";
import { Container } from "@/components/ui";
import { stats } from "@/content/services";

/**
 * Splits a stat into the parts a count-up needs: "179", "3.1", "70+", "100%".
 *
 * The previous version stripped every non-digit and ran parseInt, which turned
 * "3.1" into 31 — the home page advertised a 31-point average ACT increase.
 */
function parseStat(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return {
    prefix,
    suffix,
    target: parseFloat(digits),
    decimals: digits.split(".")[1]?.length ?? 0,
  };
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseStat(value);
    if (!el || !parsed) return;

    // Already on screen when we mount. Counting up now would blank out the
    // number the reader is looking at, so leave it exactly as rendered.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    const { prefix, suffix, target, decimals } = parsed;
    // The count-up writes to the node directly rather than through state. The
    // real value is what React renders, so it survives in the HTML; state here
    // would mean 60 re-renders per stat and would have to start from zero.
    const paint = (n: number) => {
      el.textContent = `${prefix}${n.toFixed(decimals)}${suffix}`;
    };
    paint(0);

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 2000;
        const steps = 60;
        let step = 0;
        timer = setInterval(() => {
          step += 1;
          paint(step >= steps ? target : (target * step) / steps);
          if (step >= steps) clearInterval(timer);
        }, duration / steps);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
      el.textContent = value;
    };
  }, [value]);

  // The real number, server-rendered: search engines, LLM crawlers, and anyone
  // with JavaScript off read 179, not 0.
  return <span ref={ref}>{value}</span>;
}

export function Stats() {
  return (
    <section className="py-20 bg-[var(--primary-800)]">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-2">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-[var(--secondary-300)] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
