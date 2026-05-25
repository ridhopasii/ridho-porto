import React from 'react';
export type ServiceProps = {
  color: string;
  title: string;
  description: string;
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  isShow?: boolean;
};
