import React from 'react';
export type MenuItemProps = {
  title: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isShow?: boolean;
  isExternal: boolean;
  eventName?: string;
  isHover?: boolean;
  children?: React.ReactNode
  isExclusive?: boolean;
};
