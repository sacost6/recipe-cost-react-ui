import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
    children: React.ReactNode; 
    variant?: 'primary' | 'secondary' | 'outline';
    to?: string; //used to route in app 
    href?: string; // kept for external linkes  
    onClick?: () => void;
    className?: string; 
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    children, 
    variant='primary',
    to,
    href,
    onClick,
    className='',
    type = 'button'
} : ButtonProps) {
    // Base classes applied to all button variants
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ringfocus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    // Style variations
    // Style variations
    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white px-6 py-3 shadow-md shadow-primary/20 focus:ring-primary",
        secondary: "bg-surface hover:bg-slate-50 border border-border text-text px-6 py-3 shadow-xs focus:ring-slate-300",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 focus:ring-primary",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    // If a 'to' value is passed, internal client navigation
    if(to) {
        return(
            <Link to={to} onClick={onClick} className={combinedClasses}>
                {children}
            </Link>
        );
    }
    // If an href is passed, render an <a> tag for external link, otherwise render a <button>
    if(href) {
        return (
            <a href={href} className={combinedClasses}> 
                {children}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    )
}