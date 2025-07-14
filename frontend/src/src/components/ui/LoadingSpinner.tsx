import React from "react";

const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div
      className="animate-spin rounded-full border-t-2 border-b-2 border-primary"
      style={{ width: size, height: size }}
    ></div>
  </div>
);

export default LoadingSpinner;
