import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { cva } from 'class-variance-authority'

const HeroBanner = () => {
  return (
    <section className=" bg-gray-800 text-white md:px-8 mt-12 md:mt-0">
      <div className="items-center md:flex md:flex-row  md:justify-between">
        <div className="content md:w-1/2 py-8 px-4 lg:py-0 lg:px-4">
          <h1 className="title text-4xl md:text-left font-bold pt-8 md:pt-4">Steam ON</h1>
          <p className="description text-md mt-8 md:mt-4">
            Steam ON is a minimalist client that lets you access Steam data and functionalities. Use it to explore news, stats, achievements, profiles, friends, and games for any Steam user or game.
          </p>
          <Button className="btn bg-green-600 text-white px-6 py-3 mt-6 rounded">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        <section className="image-container md:w-1/2 hidden md:inline-block relative ">
          <Image
            src="/public/steam-on-logo.png"
            alt="Steam logo"
            width={400}
            height={400}
            className="object-contain"
          />
        </section>
      </div>
    </section>
  );
};

export default HeroBanner