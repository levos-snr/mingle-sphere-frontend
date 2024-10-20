import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'attendee',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
      role: Yup.string().oneOf(['admin', 'organizer', 'attendee'], 'Invalid role').required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/register', {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        console.log('Registration successful:', response.data);
        setToastMessage('Registration successful! Redirecting to login...');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        setToastMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    },
  });

  return (
    <div className="flex h-screen bg-gray-800">
      <div className="hidden lg:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://www.eventbookings.com/wp-content/uploads/2024/01/Different-Types-of-Events-in-2024-Which-is-Right-for-You-1536x1024.jpg')" }}>
        <div className="w-full flex flex-col justify-center items-center backdrop-blur-sm bg-black/50 text-white p-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Welcome to MingleSphere</h2>
          <p className="text-xl text-center animate-fade-in">Connect with like-minded individuals and create unforgettable experiences.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg animate-fade-in-up">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for MingleSphere</h2>
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Username"
                  {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm Password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                {...formik.getFieldProps('role')}
              >
                <option value="attendee">Attendee</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
              {formik.touched.role && formik.errors.role ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-transform transform hover:scale-105"
              >
                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                <span>Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-5 right-5">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {toastType === 'success' ? (
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
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

export default Signup;
