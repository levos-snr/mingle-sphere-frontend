import React from 'react'

const Banner = () => {
  return (
    <>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-lg mt-5 bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
        <div className='px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56'>
          <h1 className='mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl'>
            We manage jjhcjceinne
          </h1>
          <p className='mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
            ratione impedit labore soluta in, magnam iusto quae quos. Similique
            beatae qui velit voluptate doloremque minima aliquid consequatur
            ipsam nihil porro. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Minima distinctio expedita accusantium laborum.
            Veritatis magni quidem odio, ullam totam alias ipsam consequatur.
            Nostrum consequuntur beatae quidem dolore quo est dolorum! Adipisci
            natus, tenetur praesentium quam ipsa non esse,
          </p>
          <div className='flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0'>
            <a
              href='#'
              className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900'
            >
              Get started
              <svg
                className='w-3.5 h-3.5 ms-2 rtl:rotate-180'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round' // Corrected
                  strokeLinejoin='round' // Corrected
                  strokeWidth='2'
                  d='M1 5h12m0 0L9 1m4 4L9 9'
                />
              </svg>
            </a>
            <a
              href='#'
              className='inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400'
            >
              More events
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner
