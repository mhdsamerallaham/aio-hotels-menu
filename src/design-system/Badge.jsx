import React from 'react';

export default function Badge({
  children,
  variant = 'amber', // 'amber' | 'dark' | 'emerald' | 'rose' | 'slate' | 'gold'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-heading font-extrabold tracking-wide uppercase rounded-full shrink-0';

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-xs',
  };

  const variantStyles = {
    amber: 'bg-amber-100/90 border border-amber-300 text-amber-900',
    dark: 'bg-stone-900 text-stone-100 border border-stone-700',
    emerald: 'bg-emerald-100 border border-emerald-300 text-emerald-900',
    rose: 'bg-rose-100 border border-rose-300 text-rose-900',
    slate: 'bg-slate-800 text-slate-200 border border-slate-700',
    gold: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black shadow-sm',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  );
}
