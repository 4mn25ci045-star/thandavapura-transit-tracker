interface Props {
  size?: "sm" | "lg";
  className?: string;
}

export function SplashLogo({ size = "lg", className = "" }: Props) {
  const mit = size === "lg" ? "text-7xl md:text-8xl" : "text-3xl";
  const sub = size === "lg" ? "text-2xl md:text-3xl" : "text-sm";
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`${mit} font-black tracking-tight animate-logo-pop`}
        style={{ color: "var(--brand-orange)", textShadow: "var(--shadow-glow)" }}
      >
        MIT
      </div>
      <div
        className={`${sub} font-medium mt-1 text-foreground animate-fade-up`}
        style={{ animationDelay: ".5s", letterSpacing: "0.15em" }}
      >
        THANDAVAPURA
      </div>
    </div>
  );
}