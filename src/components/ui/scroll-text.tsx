'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

type TextAnimationProps = {
  text: string;
  classname?: string;
  variants?: {
    hidden: object;
    visible: object;
  };
  as?: React.ElementType;
  letterAnime?: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
};

const defaultVariants = {
  hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { ease: 'linear', duration: 0.5 },
  },
};

const TextAnimation = ({
  text,
  classname,
  variants,
  as: Tag = 'h2',
  letterAnime = false,
  direction = 'up',
}: TextAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  const getDirectionOffset = () => {
    switch (direction) {
      case 'right': return { x: -20 };
      case 'left': return { x: 20 };
      case 'down': return { y: -20 };
      case 'up': default: return { y: 20 };
    }
  };

  const directionOffset = getDirectionOffset();

  const combinedVariants = {
    hidden: { ...defaultVariants.hidden, ...directionOffset, ...(variants?.hidden || {}) },
    visible: { ...defaultVariants.visible, ...(variants?.visible || {}) },
  };

  const elements = letterAnime ? text.split('') : text.split(' ');
  const separator = letterAnime ? '' : ' ';

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: letterAnime ? 0.02 : 0.05,
      },
    },
  };

  return (
    <Tag ref={ref} className={cn(classname)} aria-label={text}>
      <motion.span
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="inline-block" // So Tag can control layout
      >
        {elements.map((el, i) => (
          <motion.span
            key={i}
            variants={combinedVariants}
            className="inline-block"
          >
            {el}{i < elements.length - 1 ? separator : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
};

export default TextAnimation;
