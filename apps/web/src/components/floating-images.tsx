import Image from "next/image";

type Shape = "circle" | "hexagon" | "diamond" | "pentagon" | "blob" | "blob2";

const CLIP_PATHS: Record<Shape, string> = {
  circle: "circle(50%)",
  hexagon: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
  diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  blob: "ellipse(50% 50% at 50% 50%)",
  blob2: "ellipse(50% 50% at 50% 50%)",
};

const BORDER_RADIUS: Partial<Record<Shape, string>> = {
  blob: "30% 70% 70% 30% / 30% 30% 70% 70%",
  blob2: "60% 40% 30% 70% / 60% 30% 70% 40%",
};

type FloatAnim = "zd-float" | "zd-float-down" | "zd-float-sway";

interface ImageConfig {
  seed: string;
  size: number;
  shape: Shape;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  opacity: number;
  animation: FloatAnim;
  delay: string;
  duration: string;
  entryDelay: string;
}

const AUTH_IMAGES: ImageConfig[] = [
  { seed: "arch1", size: 110, shape: "circle", top: "18%", left: "8%", opacity: 0.28, animation: "zd-float", delay: "0s", duration: "6.5s", entryDelay: "0.1s" },
  { seed: "harare2", size: 85, shape: "hexagon", top: "12%", right: "10%", opacity: 0.22, animation: "zd-float-down", delay: "1.2s", duration: "8s", entryDelay: "0.3s" },
  { seed: "zim3", size: 72, shape: "diamond", top: "42%", left: "4%", opacity: 0.2, animation: "zd-float-sway", delay: "0.6s", duration: "7s", entryDelay: "0.5s" },
  { seed: "design4", size: 95, shape: "blob", top: "38%", right: "6%", opacity: 0.25, animation: "zd-float", delay: "2s", duration: "9s", entryDelay: "0.2s" },
  { seed: "mobile5", size: 65, shape: "pentagon", bottom: "28%", left: "12%", opacity: 0.18, animation: "zd-float-down", delay: "0.9s", duration: "7.5s", entryDelay: "0.4s" },
  { seed: "tech6", size: 78, shape: "blob2", bottom: "18%", right: "12%", opacity: 0.2, animation: "zd-float-sway", delay: "1.8s", duration: "8.5s", entryDelay: "0.6s" },
];

const NOT_FOUND_IMAGES: ImageConfig[] = [
  { seed: "lost1", size: 130, shape: "blob", top: "5%", left: "2%", opacity: 0.2, animation: "zd-float", delay: "0s", duration: "7s", entryDelay: "0.2s" },
  { seed: "lost2", size: 90, shape: "circle", top: "8%", right: "5%", opacity: 0.18, animation: "zd-float-down", delay: "1s", duration: "9s", entryDelay: "0.3s" },
  { seed: "lost3", size: 75, shape: "hexagon", top: "40%", left: "3%", opacity: 0.15, animation: "zd-float-sway", delay: "0.5s", duration: "8s", entryDelay: "0.1s" },
  { seed: "lost4", size: 100, shape: "diamond", top: "35%", right: "3%", opacity: 0.16, animation: "zd-float", delay: "1.5s", duration: "6.5s", entryDelay: "0.4s" },
  { seed: "lost5", size: 80, shape: "blob2", bottom: "10%", left: "5%", opacity: 0.15, animation: "zd-float-down", delay: "0.8s", duration: "10s", entryDelay: "0.5s" },
  { seed: "lost6", size: 65, shape: "pentagon", bottom: "8%", right: "8%", opacity: 0.14, animation: "zd-float-sway", delay: "2s", duration: "7.5s", entryDelay: "0.6s" },
];

function FloatingImage({ config }: { config: ImageConfig }) {
  const clipPath = CLIP_PATHS[config.shape];
  const borderRadius = BORDER_RADIUS[config.shape];

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        width: config.size,
        height: config.size,
        top: config.top,
        bottom: config.bottom,
        left: config.left,
        right: config.right,
        opacity: config.opacity,
        clipPath,
        borderRadius,
        animation: `zd-entry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${config.entryDelay} both, ${config.animation} ${config.duration} ${config.delay} ease-in-out infinite`,
        willChange: "transform",
      }}
    >
      <Image
        src={`https://picsum.photos/seed/${config.seed}/${config.size * 2}/${config.size * 2}`}
        alt=""
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}

export function FloatingImages({ variant = "auth" }: { variant?: "auth" | "not-found" }) {
  const images = variant === "not-found" ? NOT_FOUND_IMAGES : AUTH_IMAGES;
  return (
    <>
      {images.map((img) => (
        <FloatingImage key={img.seed} config={img} />
      ))}
    </>
  );
}
