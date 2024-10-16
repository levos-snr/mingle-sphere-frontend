import React, { useState, useEffect } from 'react'

const HomePage = () => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(
        'https://mingle-sphere-backend.onrender.com/events'
      )
      const data = await response.json()
      setEvents(data)
    }
    fetchEvents()
  }, [])

  return (
    <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
      <h2 className='text-4xl font-bold text-center text-orange-600 my-8'>
        Upcoming Events
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center'>
        {events &&
          events.map(event => (
            <div
              key={event.id}
              className='max-w-xs bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col'
            >
              <a href='#'>
                <img
                  className='rounded-t-lg w-full object-cover'
                  src={event.cover_photo_ur}
                  alt='Cover Image'
                />
              </a>
              <div className='p-5 flex-1'>
                <a href='#'>
                  <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                    {event.title}
                  </h5>
                </a>
                <p className='mb-4 font-normal text-gray-700 dark:text-gray-400 line-clamp-3'>
                  {event.description}
                </p>
                <a
                  href='#'
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-700'
                >
                  Read more
                  <svg
                    className='w-4 h-4 ml-2'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 14 10'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M1 5h12m0 0L9 1m4 4L9 9'
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default HomePage
