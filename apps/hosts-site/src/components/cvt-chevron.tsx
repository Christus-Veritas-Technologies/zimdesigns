interface CvtChevronProps {
  size?: number;
  opacity?: number;
  strokeWidth?: number;
  className?: string;
}

export default function CvtChevron({
  size = 320,
  opacity = 0.04,
  strokeWidth = 3,
  className,
}: CvtChevronProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
      className={className}
    >
      <polyline
        points="10,38 50,8 90,38"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="10,62 50,32 90,62"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
