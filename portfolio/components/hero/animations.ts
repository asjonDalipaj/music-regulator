// Framer Motion animation variants for Hero section

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

export const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100
    }
  }
};

export const taglineSegmentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

export const taglineContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 2.5
    }
  }
};

export const bulletContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 3.2
    }
  }
};

export const pulsingBulletAnimation = {
  scale: [1, 1.2, 1],
  opacity: [0.7, 1, 0.7]
};

export const pulsingBulletTransition = {
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut" as const
};

export const scrollIndicatorAnimation = {
  y: [0, 10, 0]
};

export const scrollDotAnimation = {
  y: [0, 12, 0],
  opacity: [0.5, 1, 0.5]
};

export const scrollTransition = {
  duration: 1.5,
  repeat: Infinity
};
