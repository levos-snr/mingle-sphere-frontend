import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapPin, Clock, ArrowLeft, Check, X, Star } from 'lucide-react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

// mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const SingleEventPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 14
  })
  const [booking, setBooking] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [user, setUser] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
  }, [])

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`/events/${id}`)
        setEvent(eventResponse.data)

        const feedbackResponse = await axios.get(
          `/event_feedback?event_id=${id}`
        )
        setFeedbacks(feedbackResponse.data)

        if (user) {
          try {
            const bookingResponse = await axios.get(
              `/bookings/user/${user.id}/event/${id}`
            )
            setBooking(bookingResponse.data)
          } catch (bookingError) {
            console.error('Error fetching booking:', bookingError)
            if (bookingError.response && bookingError.response.status === 404) {
              setBooking(null)
            } else {
              setBookingError('Unable to fetch booking information')
            }
          }
        }

        if (eventResponse.data.location) {
          const geocodeResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              eventResponse.data.location
            )}`
          )
          if (geocodeResponse.data.length > 0) {
            const location = geocodeResponse.data[0]
            setViewState({
              longitude: parseFloat(location.lon),
              latitude: parseFloat(location.lat),
              zoom: 14
            })
          } else {
            console.error('Location not found')
          }
        }
      } catch (error) {
        setError('Failed to fetch event details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetails()
  }, [id, user])

  const handleBooking = () => {
    navigate(`/booking/${id}`)
  }

  const handleCancelBooking = async () => {
    try {
      await axios.delete(`/bookings/${booking.id}`)
      setBooking(null)
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setBookingError('Failed to cancel booking. Please try again.')
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRatingChange = newRating => {
    setUserRating(newRating)
  }

  const handleCommentChange = e => {
    setUserComment(e.target.value)
  }

  const submitFeedback = async () => {
    if (!user) {
      setFeedbackError('Please log in to submit feedback.')
      return
    }

    if (userRating === 0) {
      setFeedbackError('Please select a rating before submitting.')
      return
    }

    setFeedbackSubmitting(true)
    setFeedbackError(null)

    try {
      const response = await axios.post('/event_feedback', {
        event_id: id,
        user_id: user.id,
        rating: userRating,
        comment: userComment
      })

      setFeedbacks(prevFeedbacks => [
        ...prevFeedbacks,
        response.data.event_feedback
      ])
      setUserRating(0)
      setUserComment('')
      console.log('Feedback submitted successfully!')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setFeedbackError('Failed to submit feedback. Please try again.')
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  if (loading) {
    return <div className='text-center'>Loading event details...</div>
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>
  }

  if (!event) {
    return <div className='text-center'>Event not found.</div>
  }

  return (
    <div className='bg-white'>
      <div
        className='relative h-[400px] bg-cover bg-center'
        style={{
          backgroundImage: `url('${
            event.cover_photo_url ||
            'https://placehold.co/1200x400?text=Event+Image'
          }')`
        }}
      >
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-end'>
          <div className='container mx-auto px-4 py-8 text-white'>
            <h1 className='text-4xl font-bold mb-2'>{event.title}</h1>
            <p className='mb-4'>{event.location}</p>
            <Link
              to={`/map/${event.id}`}
              className='bg-white text-black px-4 py-2 rounded-full text-sm'
            >
              View map
            </Link>
          </div>
        </div>

        <div className='absolute top-8 right-8 bg-white rounded-lg shadow-lg p-4 w-72'>
          <h3 className='font-bold mb-2'>Date & time</h3>
          <p className='text-sm mb-2'>
            {new Date(event.start_datetime).toLocaleString()}
          </p>
          {bookingError ? (
            <p className='text-sm text-red-500 mb-2'>{bookingError}</p>
          ) : booking ? (
            <>
              <div
                className={`text-center p-2 rounded-md mb-2 ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status === 'confirmed' ? (
                  <Check className='inline-block mr-1' />
                ) : (
                  <X className='inline-block mr-1' />
                )}
                Booking {booking.status}
              </div>
              <button
                className='w-full bg-red-600 text-white py-2 rounded-md mb-2'
                onClick={handleCancelBooking}
              >
                Cancel booking
              </button>
            </>
          ) : (
            <button
              className='w-full bg-purple-600 text-white py-2 rounded-md mb-2'
              onClick={handleBooking}
            >
              Book now
            </button>
          )}
          <p className='text-xs text-center text-gray-500'>
            Reservation required • No Refunds
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-4'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-purple-600 hover:text-purple-800'
        >
          <ArrowLeft size={20} className='mr-2' />
          Back to Events
        </button>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-4'>Details</h2>
              <p className='text-gray-700 mb-4'>
                <span>Description: </span>
                {event.description || 'No description available'}
              </p>
              <p className='text-gray-700 mb-4'>
                <span>Category: </span>
                {event.category || 'No category available'}
              </p>
              <p className='text-gray-700 mb-4'>
                <span>Price:Ksh. </span>
                {event.price || 'No price available'}
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-4'>Hours</h2>
              <div className='flex items-center mb-2'>
                <Clock size={20} className='mr-2 text-gray-500' />
                <p>Starts on: {event.start_datetime || 'Not specified'}</p>
              </div>
              <div className='flex items-center'>
                <Clock size={20} className='mr-2 text-gray-500' />
                <p>Ends on: {event.end_datetime || 'Not specified'}</p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Organizer Contact</h2>
              <p className='text-gray-700'>
                Please go to{' '}
                <a
                  href={event.organizer_website || '#'}
                  className='text-blue-600'
                >
                  {event.organizer_website || "organizer's website"}
                </a>{' '}
                and refer the FAQ section for more detail
                {event.organizer}
              </p>
            </section>
          </div>

          <div>
            <section className='mb-8'>
              <h2 className='text-2xl font-bold mb-4'>Event location: </h2>
              <div className='h-48 rounded-lg mb-4 overflow-hidden'>
                <Map
                  initialViewState={viewState}
                  style={{ width: '100%', height: '100%' }}
                  mapStyle='mapbox://styles/mapbox/streets-v11'
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                >
                  <Marker
                    longitude={viewState.longitude}
                    latitude={viewState.latitude}
                    color='red'
                  />
                </Map>
              </div>
              <div className='flex items-start'>
                <MapPin size={20} className='mr-2 text-gray-500 mt-1' />
                <p className='text-gray-700'>{event.location}</p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Tags</h2>
              <div className='flex flex-wrap gap-2'>
                {event.tags &&
                  event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='bg-gray-200 px-3 py-1 rounded-full text-sm'
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Ratings and Feedback Section */}
      <div className='container mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold mb-4'>Ratings and Feedback</h2>

        {/* User Rating Input */}
        <div className='mb-4'>
          <p className='mb-2'>Rate this event:</p>
          <div className='flex'>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={24}
                onClick={() => handleRatingChange(star)}
                className={`cursor-pointer ${
                  star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* User Comment Input */}
        <div className='mb-4'>
          <textarea
            value={userComment}
            onChange={handleCommentChange}
            placeholder='Leave a comment...'
            className='w-full p-2 border rounded'
            rows='3'
          />
        </div>

        <button
          onClick={submitFeedback}
          disabled={feedbackSubmitting}
          className={`bg-purple-600 text-white py-2 px-4 rounded-md ${
            feedbackSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {feedbackError && <p className='text-red-500 mt-2'>{feedbackError}</p>}

        {/* Display Existing Feedbacks */}
        <div className='mt-8'>
          <h3 className='text-xl font-bold mb-4'>Event Feedbacks</h3>
          {feedbacks.length === 0 ? (
            <p>No feedbacks yet. Be the first to leave a review!</p>
          ) : (
            feedbacks.map((feedback, index) => (
              <div key={index} className='mb-4 p-4 border rounded'>
                <div className='flex items-center mb-2'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= feedback.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p>{feedback.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleEventPage
