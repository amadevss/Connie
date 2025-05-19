'use client'
import React, { type ReactNode } from "react";
import styles from "./styles.module.css";
import { cn } from "../../lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          styles.container,
          "bg-zinc-100 dark:bg-slate-900 transition-colors",
          className
        )}
        {...props}
      >
        <div className={styles.auroraContainer}>
          <div
            className={cn(
              styles.aurora,
              showRadialGradient && styles.radialGradient
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuroraBackground;