import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <nav className="flex flex-row flex-wrap items-center p-3">
            <Link href="/">
              <a className="text-4xl font-bold mr-auto">PNFT</a>
            </Link>
            <Link href="/">
              <a className="mr-4 text-gray-500 hover:text-gray-600 font-medium">
                Marketplace
              </a>
            </Link>
            <Link href="/create-item">
              <a className="mr-6 text-gray-500 hover:text-gray-600 font-medium">
                Create
              </a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 text-gray-500 hover:text-gray-600 font-medium">
                My Digital Assets
              </a>
            </Link>
            <Link href="/creator-dashboard">
              <a className="mr-6 text-gray-500 hover:text-gray-600 font-medium">
                Creator Dashboard
              </a>
            </Link>
          </nav>
        </div>
      </div>
      <div className="container mx-auto">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default Marketplace