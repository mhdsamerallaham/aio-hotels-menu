import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  rightAction,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-meta text-stone-700 font-semibold flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-stone-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`w-full bg-white border border-stone-200 text-stone-900 rounded-2xl ${
            Icon ? 'pl-12' : 'pl-4'
          } ${
            rightAction ? 'pr-12' : 'pr-4'
          } py-3.5 text-base placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''
          } ${className}`}
          {...props}
        />
        {rightAction && (
          <div className="absolute right-3.5">
            {rightAction}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-semibold text-rose-600 mt-1">{error}</p>
      )}
    </div>
  );
}
