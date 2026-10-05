import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

/** A single shimmering skeleton placeholder */
export function Skeleton({ width = "100%", height = 20, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #e8edf0 25%, #f4f7f5 50%, #e8edf0 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.4s infinite",
        ...style,
      }}
    />
  );
}

/** Skeleton for a single todo row */
export function TodoSkeleton() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 0", borderBottom: "1px solid #f0f4f1",
    }}>
      <Skeleton width={20} height={20} borderRadius={4} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="35%" height={11} borderRadius={4} />
      </div>
      <Skeleton width={60} height={26} borderRadius={20} />
    </div>
  );
}

/** Skeleton for a client card */
export function ClientCardSkeleton() {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8e4", borderRadius: 14,
      padding: 24, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Skeleton width={44} height={44} borderRadius="50%" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="55%" height={16} />
          <Skeleton width="70%" height={12} />
        </div>
        <Skeleton width={72} height={24} borderRadius={20} />
      </div>
      <Skeleton width="40%" height={12} />
    </div>
  );
}

/** Injects the shimmer keyframe globally once */
export function SkeletonStyles() {
  return (
    <style>{`
      @keyframes skeleton-shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  );
}
