"use client";

interface CornerFlourishProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
  className?: string;
}

export default function CornerFlourish({
  position = "top-left",
  size = 60,
  color = "#6b2737",
  className = "",
}: CornerFlourishProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${positionClasses[position]} ${className}`}
      style={{ opacity: 0.6 }}
    >
      {/* Ornamental corner flourish */}
      <path
        d="M2 2 Q10 2 15 8 T20 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M2 2 Q2 10 8 15 T20 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="2" fill={color} opacity="0.8" />
      <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.6" />
      <path
        d="M25 25 Q30 28 35 28 Q38 28 40 25"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
