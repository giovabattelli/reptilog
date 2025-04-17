'use client'

import React from 'react';

export function GridBackground() {
    return (
        <div
            className="absolute inset-0 -z-10 min-h-screen w-full"
            style={{
                backgroundSize: "13rem 13rem",
                backgroundPosition: "center",
                maskImage: "radial-gradient(ellipse at top center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 65%)",
                WebkitMaskImage: "radial-gradient(ellipse at top center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 65%)",
            }}
        >
            <div className="bg-grid-pattern h-full w-full"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary-50/10 via-primary-50/5 to-transparent opacity-40"></div>
        </div>
    );
}