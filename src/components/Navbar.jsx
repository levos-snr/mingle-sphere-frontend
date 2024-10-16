import React from 'react'

function Navbar () {
  return (
    <>
      <nav className='bg-transparent border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
          <a
            href='#'
            className='flex items-center space-x-3 rtl:space-x-reverse'
          >
            <img src='/logo.png' className='h-8' alt='Logo' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap text-orange-500 dark:text-white'>
              mingleSphere
            </span>
          </a>
          <div className='flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-3'>
            <button
              type='button'
              className='text-black bg-gray-100 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-800 dark:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-500'
            >
              Sign up
            </button>

            <button
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
