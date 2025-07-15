'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { LeftMenu, LeftMenuNotLogged } from './LeftMenu';
import RightMenu from './RightMenu';

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 flex mx-auto items-center sticky top-0 z-50 bg-gradient-to-r from-gaming-background-primary via-gaming-background-secondary to-gaming-background-primary border-b border-gaming-purple-light/30 shadow-gaming-lg">
      {/* Subtle gaming glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple-glow/5 via-transparent to-gaming-cyan-glow/5"></div>

      {/* Gaming accent line with improved visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gaming-purple-light to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-gaming flex items-center justify-between">
        <LeftMenu />
        <RightMenu />
      </div>
    </header>
  );
};

const HeaderNotLogged: React.FC = () => {
  return (
    <header className="w-full h-16 flex mx-auto items-center sticky bg-gradient-to-r from-gaming-background-primary via-gaming-background-secondary to-gaming-background-primary border-b border-gaming-purple-light/30 shadow-gaming-lg top-0 z-50">
      {/* Subtle gaming glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple-glow/5 via-transparent to-gaming-cyan-glow/5"></div>

      {/* Gaming accent line with improved visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gaming-purple-light to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-gaming flex items-center justify-between">
        <LeftMenuNotLogged />
      </div>
    </header>
  );
};

export { Header, HeaderNotLogged };
