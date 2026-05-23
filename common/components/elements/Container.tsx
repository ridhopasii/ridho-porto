"use client";

import { motion } from "framer-motion";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  [propName: string]: any;
}

const Container = ({ children, className = "", ...others }: ContainerProps) => {
  const { "data-aos": _, ...rest } = others;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`mt-20 p-8 lg:mt-0 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Container;
