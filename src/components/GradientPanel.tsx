const VARIANTS = {
  blush: "from-blush via-nude to-blush-dark",
  gold: "from-gold via-nude to-blush",
  clay: "from-clay/70 via-blush-dark to-nude",
  cream: "from-cream-dark via-blush to-nude",
} as const;

type Props = {
  variant?: keyof typeof VARIANTS;
  className?: string;
};

/**
 * Placeholder for real photography — no studio photos exist yet, and the
 * brand direction explicitly rules out stock/AI imagery. Swap for an
 * <Image> once real photos are available; every usage below is isolated to
 * one component instance so that's a local change, not a page rewrite.
 */
export function GradientPanel({ variant = "blush", className = "" }: Props) {
  return (
    <div
      className={`bg-gradient-to-br ${VARIANTS[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}
