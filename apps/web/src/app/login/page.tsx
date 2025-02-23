'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import toast
import { loginUser } from '@/lib/user'; // Import loginUser function
import { createToken } from '@/lib/server';
import { create } from 'cypress/types/lodash';
import { useAppDispatch } from '@/redux/hooks';
import { loginAction } from '@/redux/slice/authorSlice';

const LoginID: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      setIsValid(false);
      return;
    }

    // Prepare data
    const loginData = {
      email,
      password,
    };
    try {
      const { result, ok } = await loginUser({
        email,
        password,
      });
      console.log(result, ok);
      if (ok) {
        toast.success('Login successful!');
        dispatch(loginAction(result.user));
        createToken(result.token);
        router.push('/');
      } else {
        toast.error(result?.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="relative h-screen flex justify-center ">
      <div className="relative flex justify-center pt-10 lg:pt-9">
        <div className="container">
          <div className="w-full px-4 lg:m-5 lg:mb-10 lg:mt-12">
            <div className="w-full ">
              <h4 className="font-semibold bg-gradient-to-br text-black text-2xl md:font-bold lg:text-2xl">
                Log in using your account
              </h4>
            </div>
          </div>

          <div className="m-6">
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-600 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-Dark-blue focus:border-Dark-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!isValid && !email && (
                  <p className="text-red-500 text-sm">Email is required</p>
                )}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Your password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-600 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-Dark-blue focus:border-Dark-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!isValid && !password && (
                  <p className="text-red-500 text-sm">Password is required</p>
                )}
              </div>
              <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-600 rounded bg-gray-600 focus:ring-3 focus:ring-Dark-blue dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-black dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <button
                onClick={handleSubmit}
                type="button"
                className="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Log In
              </button>
            </form>
          </div>

          <div className="mx-auto flex justify-center ">
            <h5 className="font-normal bg-gradient-to-br mt-6 text-gray-600 text-sm lg:text-sm">
              Don&apos;t have an account ?{' '}
              <Link href={'/signUp'}>
                <span className="text-black font-bold hover:underline hover:text-blue-600">
                  Register Here
                </span>
              </Link>
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginID;
