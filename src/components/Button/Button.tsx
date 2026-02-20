import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isFullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isFullWidth = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.button 
      className={`btn btn-${variant} ${isFullWidth ? 'btn-full' : ''} ${className}`}
      whileTap={{ scale: 0.98 }}
      {...props as any}
    >
      <span className="btn-content">{children}</span>
    </motion.button>
  );
};

export default Button;
