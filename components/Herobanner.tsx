import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import SignButton from './SignButton';

const HeroBanner = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      {/* Enhanced gaming glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple-glow/20 via-transparent to-gaming-cyan-glow/20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeIn">
            {/* Gaming-style title with enhanced glow */}
            <div className="relative">
              <h1 className="text-gaming-5xl md:text-gaming-7xl font-bold bg-gradient-to-r from-gaming-purple-light via-gaming-cyan-light to-gaming-purple-light bg-clip-text text-transparent">
                Game On
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-gaming-purple-glow to-gaming-cyan-glow rounded-gaming-lg blur opacity-25 animate-glow"></div>
            </div>

            {/* Enhanced gaming tagline */}
            <div className="space-y-4">
              <p className="text-gaming-xl md:text-gaming-2xl text-gaming-text-secondary leading-relaxed">
                Your ultimate{' '}
                <span className="text-gaming-purple-light font-semibold">
                  Steam companion
                </span>{' '}
                for exploring the gaming universe
              </p>
              <p className="text-gaming-lg text-gaming-text-tertiary leading-relaxed">
                Dive into news, stats, achievements, profiles, friends, and
                games.
                <span className="text-gaming-cyan-light font-medium">
                  {' '}
                  Level up your Steam experience.
                </span>
              </p>
            </div>

            {/* Enhanced feature highlights with gaming icons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 text-gaming-purple-light">
                <div className="w-2 h-2 bg-gaming-purple-glow rounded-full animate-pulse-glow"></div>
                <span className="text-gaming-sm font-medium">
                  Real-time Stats
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gaming-cyan-light">
                <div className="w-2 h-2 bg-gaming-cyan-glow rounded-full animate-pulse-glow"></div>
                <span className="text-gaming-sm font-medium">
                  Achievement Tracking
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gaming-purple-light">
                <div className="w-2 h-2 bg-gaming-purple-glow rounded-full animate-pulse-glow"></div>
                <span className="text-gaming-sm font-medium">
                  Friend Management
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gaming-cyan-light">
                <div className="w-2 h-2 bg-gaming-cyan-glow rounded-full animate-pulse-glow"></div>
                <span className="text-gaming-sm font-medium">
                  Game Discovery
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <SignButton />
            </div>
          </div>

          {/* Right Content - Enhanced Steam image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gaming-purple-light/20 to-gaming-cyan-light/20 rounded-gaming-xl p-8 backdrop-blur-sm border border-gaming-purple-light/20 shadow-gaming-xl">
              <div className="relative bg-[url('/image/steam-on.png')] bg-contain bg-no-repeat bg-center h-96 md:h-[500px] rounded-gaming-lg overflow-hidden">
                {/* Enhanced gaming overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-background-tertiary/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gaming-background-tertiary/20"></div>

                {/* Enhanced animated corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gaming-purple-glow rounded-tl-gaming"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gaming-cyan-glow rounded-tr-gaming"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gaming-purple-glow rounded-bl-gaming"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gaming-cyan-glow rounded-br-gaming"></div>
              </div>
            </div>

            {/* Enhanced floating gaming elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gaming-purple-light to-gaming-cyan-light rounded-full opacity-60 animate-bounce shadow-gaming-glow"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-gaming-cyan-light to-gaming-purple-light rounded-full opacity-60 animate-pulse-glow shadow-gaming-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
