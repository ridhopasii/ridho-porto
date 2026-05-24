import React from "react";
import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as TbIcons from "react-icons/tb";
import * as Fa6Icons from "react-icons/fa6";
import * as RiIcons from "react-icons/ri";

const iconMap: Record<string, any> = {
  ...SiIcons,
  ...BiIcons,
  ...BsIcons,
  ...TbIcons,
  ...Fa6Icons,
  ...RiIcons,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function DynamicIcon({ name, size = 26, className = "" }: DynamicIconProps) {
  if (!name) return null;
  
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    // Fallback if icon not found
    return <span className={`text-xs ${className}`}>{name.substring(0,2)}</span>;
  }

  return <IconComponent size={size} className={className} />;
}
