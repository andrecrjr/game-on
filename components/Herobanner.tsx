import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { cva } from 'class-variance-authority'

const HeroBanner = () => {

  return (
    <section className=" bg-gray-800 text-white md:px-8">
      <div className="w-screen md:container md:mx-auto flex 
              flex-col md:flex-row items-center md:justify-between">
        <div className="md:min-w-1/2 py-8 lg:py-0">
          <h1 className="text-4xl md:text-left font-bold pt-8 md:pt-4">Steam ON</h1>
          <p className="text-md mt-8 md:mt-4">
            A Steam ON é um client minimalista que permite que você acesse dados e
            funcionalidades do Steam. Você pode usar a Steam ON para
            obter notícias, estatísticas, conquistas, perfis, amigos e jogos de
            qualquer usuário ou jogo do Steam.
          </p>
          <Button className='bg-green-600 text-white px-6 py-3 mt-6 rounded'>
          <Link href={"/login"}
          >
            Sign In
          </Link>
          </Button>
        </div>
        <section className="w-1/2 relative">
          <Image
            src={'/public/steam-on-logo.png'}
            alt="Steam logo"
            width={400}
            height={400}
            className="object-contain"
          />
        </section>
      </div>
    </section>
  )
}

export default HeroBanner