"use client";

interface DecorativeDividerProps {
  variant?: "ornate" | "simple" | "dots";
  width?: string;
  color?: string;
  className?: string;
}

export default function DecorativeDivider({
  variant = "ornate",
  width = "w-64",
  color = "#c9a961",
  className = "",
}: DecorativeDividerProps) {
  if (variant === "simple") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`h-px bg-gradient-to-r from-transparent via-gold to-transparent ${width}`} />
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-40" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-60" />
        <div className="w-2 h-2 rounded-full bg-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-60" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold opacity-40" />
      </div>
    );
  }

  // Ornate variant
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path
          d="M2 10 Q10 5 20 10 Q30 15 38 10"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="6" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="15" cy="15" r="3" fill={color} opacity="0.6" />
        <path d="M15 3 L15 9" stroke={color} strokeWidth="1" />
        <path d="M15 21 L15 27" stroke={color} strokeWidth="1" />
        <path d="M3 15 L9 15" stroke={color} strokeWidth="1" />
        <path d="M21 15 L27 15" stroke={color} strokeWidth="1" />
      </svg>
      
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path
          d="M2 10 Q10 15 20 10 Q30 5 38 10"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
