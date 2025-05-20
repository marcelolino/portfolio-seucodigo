import React from 'react';

interface RemixIconProps {
  name: string;
  className?: string;
}

export function RemixIcon({ name, className = "" }: RemixIconProps) {
  return (
    <i className={`${name} ${className}`}></i>
  );
}
