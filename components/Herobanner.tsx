import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import SignButton from './SignButton';

const HeroBanner = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
      {/* Gaming glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-cyan-600/20 blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeIn">
            {/* Gaming-style title with glow */}
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Gamer On
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-25 animate-pulse"></div>
            </div>
            
            {/* Gaming tagline */}
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Your ultimate <span className="text-purple-400 font-semibold">Steam companion</span> for exploring the gaming universe
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Dive into news, stats, achievements, profiles, friends, and games. 
                <span className="text-cyan-400 font-medium"> Level up your Steam experience.</span>
              </p>
            </div>
            
            {/* Feature highlights with gaming icons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 text-purple-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time Stats</span>
              </div>
              <div className="flex items-center space-x-3 text-cyan-300">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Achievement Tracking</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Friend Management</span>
              </div>
              <div className="flex items-center space-x-3 text-cyan-300">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Game Discovery</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="pt-6">
              <SignButton />
            </div>
          </div>
          
          {/* Right Content - Enhanced Steam image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20">
              <div className="relative bg-[url('/image/steam-on.png')] bg-contain bg-no-repeat bg-center h-96 md:h-[500px] rounded-2xl overflow-hidden">
                {/* Gaming overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-900/20"></div>
                
                {/* Animated corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 rounded-br-lg"></div>
              </div>
            </div>
            
            {/* Floating gaming elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
