import React from 'react';

interface BadgeProps {
    children: React.ReactNode; 
    icon?: React.ReactNode; 
    className?: string; 
}

export default function Badge({children, icon, className=''} : BadgeProps) {
    return (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs ${className}`}>
            {icon && <span className='text-accent'>{icon}</span>}
            <span>{children}</span>
        </div>
    )
}