

import Link from "next/link"

export default function Hero() {

  return (
    <section className="lg:2/6 text-left my-28">
      <div className="text-6xl font-semibold text-gray-900 leading-none">Welcome to our amazing marketplace!</div>
      <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">Discover everything you need for pleasure, convenience, and inspiration. We bring together thousands of sellers and buyers from all around the world to create the most diverse and exciting shopping destination.</div>
      <div className="mt-5 sm:mt-8 flex lg:justify-start">
        <div className="rounded-md shadow">
          <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
          <Link href="/marketplace" >
            Get started
          </Link>
          </div>
          
        </div>
      </div>
    </section>
  )
}
