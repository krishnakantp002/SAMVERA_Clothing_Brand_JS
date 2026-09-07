import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-white hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25',
        destructive: 'bg-error text-white hover:bg-error/90',
        outline: 'border border-surface-700 bg-transparent hover:border-brand-500 hover:bg-brand-500/10 text-white',
        secondary: 'bg-surface-800 text-white hover:bg-surface-700',
        ghost: 'hover:bg-surface-800 hover:text-white text-surface-200',
        link: 'text-brand-500 underline-offset-4 hover:underline',
        glass: 'glass-light text-white hover:bg-white/10',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asMotion?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, asMotion = true, ...props }, ref) => {
    const Component = asMotion ? motion.button : 'button';
    
    // Type casting is needed because motion.button has different props than a standard button
    const motionProps = asMotion ? {
      whileTap: { scale: 0.97 },
      whileHover: { scale: 1.02 }
    } : {};

    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        disabled={isLoading || props.disabled}
        {...motionProps}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Component>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
