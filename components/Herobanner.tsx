import React from 'react'
import Image from 'next/image'

const HeroBanner = () => {
  return (
    <section className="bg-gray-900 text-white px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold">Steam ON</h1>
          <p className="text-lg mt-4">
            A Steam ON é um client minimalista que permite que você acesse dados e
            funcionalidades do Steam. Você pode usar a Steam ON para
            obter notícias, estatísticas, conquistas, perfis, amigos e jogos de
            qualquer usuário ou jogo do Steam.

          </p>
          <a
            href="#"
            className="inline-block bg-green-600 text-white px-6 py-3 mt-6 rounded"
          >
            Sign In
          </a>
        </div>
        <div className="w-1/2 relative">
          <Image
            src={'/public/steam-on-logo.png'}
            alt="Steam logo"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroBanner