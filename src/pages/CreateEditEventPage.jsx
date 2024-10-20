import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'flowbite-react';
import { Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';



const CreateEditEventPage = () => {
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: '',
    location: '',
    start_datetime: '',
    end_datetime: '',
    description: '',
    cover_photo_url: '',
    cover_photo_file: null,
    capacity: '',
    category: '',
    is_private: false,
    price: '',
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  const geocodingClient = mapboxSdk({ accessToken:  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN });
  
  useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
  
      if (id) {
        setIsEditing(true);
        fetchEventData(id);
      }
    }, [id]);
  
  const fetchEventData = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      setEventData(data);
      
      // Pre-populate the form with fetched data
      setInitialValues({
        title: data.title || '',
        location: data.location || '',
        start_datetime: data.start_datetime ? new Date(data.start_datetime).toISOString().slice(0, 16) : '',
        end_datetime: data.end_datetime ? new Date(data.end_datetime).toISOString().slice(0, 16) : '',
        description: data.description || '',
        cover_photo_url: data.cover_photo_url || '',
        cover_photo_file: null,
        capacity: data.capacity || '',
        category: data.category || '',
        is_private: data.is_private || false,
        price: data.price || '',
      });
    } catch (error) {
      console.error('Error fetching event data:', error);
      setToastMessage('Error fetching event data: ' + error.message);
      setToastType('error');
      setShowToast(true);
    }
  };
  
  // Function to handle location input and suggest predictions
  const handleLocationChange = async (event) => {
    const locationQuery = event.target.value;
    if (locationQuery.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: locationQuery,
          limit: 5,
        })
        .send();

      if (response && response.body && response.body.features) {
        setLocationSuggestions(response.body.features);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };
  

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    location: Yup.string().required('Venue is required'),
    start_datetime: Yup.date().required('Start date and time is required'),
    end_datetime: Yup.date().required('End date and time is required')
      .min(Yup.ref('start_datetime'), 'End date must be after start date'),
    description: Yup.string(),
    cover_photo_url: Yup.string().url('Invalid URL'),
    capacity: Yup.number().positive('Capacity must be a positive number'),
    category: Yup.string(),
    is_private: Yup.boolean(),
    price: Yup.number().min(0, 'Price cannot be negative'),
  });


  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!user) {
      setToastMessage('You must be logged in to create or edit an event');
      setToastType('error');
      setShowToast(true);
      setSubmitting(false);
      return;
    }

    try {
      const eventData = Object.keys(values).reduce((acc, key) => {
        if (key !== 'cover_photo_file') {
          acc[key] = values[key];
        }
        return acc;
      }, {});

      eventData.organizer_id = user.id;
      

      const url = isEditing ? `/api/events/${id}` : '/api/events';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} event`);
      }

      setToastMessage(`Event ${isEditing ? 'updated' : 'created'} successfully`);
      setToastType('success');
      setShowToast(true);

      if (!isEditing) {
        resetForm();
      }

      // Handle file upload separately if a file was selected
      if (values.cover_photo_file) {
        const formData = new FormData();
        formData.append('cover_photo', values.cover_photo_file);
        
        const fileUploadResponse = await fetch('/api/events/upload-photo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
          body: formData,
        });

        if (!fileUploadResponse.ok) {
          throw new Error('Failed to upload cover photo');
        }
      }

      // Navigate back to the events page after successful submission
      setToastType('success');
      navigate(-1)
    } catch (error) {
      setToastMessage(`Error ${isEditing ? 'updating' : 'creating'} event: ` + error.message);
      setToastType('error');
      setShowToast(true);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow m-14">
        <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Event' : 'Create Event'}</h1>
  
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >       
            {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter event title"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Event Venue
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter event venue"
                  onChange={(e) => {
                    setFieldValue("location", e.target.value);
                    handleLocationChange(e);
                  }}
                />
                <ul className="absolute bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full max-h-48 overflow-y-auto z-50">
                  {locationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => {
                        setFieldValue("location", suggestion.place_name);
                        setLocationSuggestions([]);
                      }}
                      className="p-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                    >
                      {suggestion.place_name}
                    </li>
                  ))}
                </ul>
              </div>
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700">
                  Start Date and Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="datetime-local"
                    id="start_datetime"
                    name="start_datetime"
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <ErrorMessage name="start_datetime" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700">
                  End Date and Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="datetime-local"
                    id="end_datetime"
                    name="end_datetime"
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <ErrorMessage name="end_datetime" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Event Description</h2>
              <div className="mb-4">
                <label htmlFor="cover_photo_url" className="block text-sm font-medium text-gray-700">
                  Event Image URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    id="cover_photo_url"
                    name="cover_photo_url"
                    className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter image URL"
                  />
                </div>
                <ErrorMessage name="cover_photo_url" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* <div className="mb-4">
                <label htmlFor="cover_photo_file" className="block text-sm font-medium text-gray-700">
                  Or Upload Event Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="cover_photo_file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="cover_photo_file"
                          name="cover_photo_file"
                          type="file"
                          className="sr-only"
                          onChange={(event) => {
                            setFieldValue("cover_photo_file", event.currentTarget.files[0]);
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div> */}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Event Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Describe your event..."
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <Field
                  type="number"
                  id="capacity"
                  name="capacity"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter capacity"
                />
                <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a category</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Field
                type="number"
                id="price"
                name="price"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter price"
              />
              <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="flex items-center">
                <Field type="checkbox" name="is_private" className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-sm text-gray-700">Private Event</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </Form>
        )}
      </Formik>

        {showToast && (
              <div className="fixed top-5 right-5 z-50">
                  <Toast onClose={() => setShowToast(false)}>
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                          {toastType === 'success' ? (
                              <span className="text-2xl">✅</span>
                          ) : (
                              <span className="text-2xl">❌</span>
                          )}
                      </div>
                      <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                      <Toast.Toggle onDismiss={() => setShowToast(false)} />
                  </Toast>
              </div>
          )}
    </div>
  );
};

export default CreateEditEventPage;