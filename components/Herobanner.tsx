import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import SignButton from './SignButton';

const HeroBanner = () => {
  return (
    <section className="bg-gray-800 text-white md:px-8 md:mt-0">
      <section className="items-center md:flex md:flex-row  md:justify-between">
        <section className="md:w-1/2 py-8 px-4 lg:py-0 lg:px-4">
          <h1 className="text-4xl md:text-left font-bold pt-8 md:pt-4">Gamer On</h1>
          <p className="text-md mt-8 md:mt-4">
            Gamer On is a minimalist client that lets you access Steam data and functionalities.
            Use it to explore news, stats, achievements, profiles, friends, and games for any Steam user or game.
          </p>
          <SignButton />
        </section>
        <section className="md:w-1/2 relative bg-[url('/image/steam-on.png')] bg-[length:400px_400px] bg-[50%_0] h-96 bg-no-repeat md:bg-[80%] md:bg-[length:325px_325px] md:h-[465px]">
          
        </section>
      </section>
    </section>
  );
};

export default HeroBanner;