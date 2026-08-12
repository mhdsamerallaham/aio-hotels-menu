import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'admin'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  icon: Icon,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-bold rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none press-trigger disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-sm gap-2 rounded-xl',
    md: 'px-5 py-3 text-base gap-2.5 rounded-2xl',
    lg: 'px-7 py-4 text-lg gap-3 rounded-2xl',
  };

  const variantStyles = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg shadow-amber-600/20 active:bg-amber-800',
    secondary: 'bg-stone-900 hover:bg-black text-white shadow-md active:bg-stone-850',
    outline: 'border-2 border-stone-200 hover:border-amber-600 hover:text-amber-600 text-stone-800 bg-white/50 backdrop-blur-xs',
    ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
    admin: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold shadow-md shadow-sky-500/20',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />}
      <span>{children}</span>
    </button>
  );
}
