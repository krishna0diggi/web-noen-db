import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "slide" | "scale" | "reflect";
}

const variants = {
  fade: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  reflect: {
    hidden: { 
      opacity: 0, 
      y: 30,
      rotateX: -15,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1
    }
  }
};

export function AnimatedCard({ 
  children, 
  className, 
  delay = 0, 
  variant = "reflect" 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      variants={variants[variant]}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={cn("group", className)}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-border/50 backdrop-blur-sm">
        {/* Reflection effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
          initial={false}
          animate={{
            background: [
              "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              "linear-gradient(225deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 group-hover:to-white/10 transition-all duration-300" />
        {children}
      </Card>
    </motion.div>
  );
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}