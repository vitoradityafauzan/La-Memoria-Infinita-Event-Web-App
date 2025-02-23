'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import { regUser } from '@/lib/user'; // Import the regUser function
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [referralError, setReferralError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation
    if (
      !email ||
      !password ||
      !repeatPassword ||
      !firstName ||
      !lastName ||
      !phone ||
      !userType ||
      password !== repeatPassword
    ) {
      setIsValid(false);
      return;
    }

    // Prepare data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      userType,
      referralCode: userType === 'Experience' ? referralCode : undefined,
    };

    // Send data to backend
    try {
      const { result, ok } = await regUser(userData);
      if (ok) {
        const referralOwner = result?.referralOwnerName
          ? `Referral Code Owner: ${result.referralOwnerName.toUpperCase()}`
          : '';

        toast.success(
          <div>
            Registration successful!
            <br />
            <span className="font-bold">{referralOwner}</span>
          </div>,
        );
        router.push('/login');
      } else {
        // Check if the response is JSON
        try {
          const errorMsg = result?.msg || 'Registration failed';
          if (errorMsg.includes('Referral code is invalid')) {
            setReferralError('Invalid referral code');
            toast.error('Invalid referral code');
          } else {
            toast.error(errorMsg);
          }
        } catch {
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="relative pb-2 h-screen">
      <div className="relative flex justify-center h-full lg:pt-9">
        <div className="container">
          <div className="w-full px-4 lg:m-5 lg:mb-10 lg:mt-12">
            <div className="max-w-full mx-auto text-center mb-3 lg:pr-9 w-full lg:w-1/2">
              <h4 className="font-semibold bg-gradient-to-br mt-10 text-black text-lg md:text-xl mb-8 md:font-bold lg:text-2xl">
                Welcome. Create your account! <br />
                <span className="text-xs md:text-sm lg:text-base font-normal">
                  Register your email and let&apos;s get started.
                </span>
              </h4>
            </div>
          </div>
          <div className="m-8">
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="floating_email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email
                </label>
              </div>

              {/* Password Fields */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="password"
                  name="floating_password"
                  id="floating_password"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="floating_password"
                  className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="password"
                  name="repeat_password"
                  id="floating_repeat_password"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                  placeholder=" "
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <label
                  htmlFor="floating_repeat_password"
                  className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confirm password
                </label>
                {!isValid && password !== repeatPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}
              </div>

              {/* First Name and Last Name Fields */}
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_first_name"
                    id="floating_first_name"
                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                    placeholder=" "
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label
                    htmlFor="floating_first_name"
                    className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                    placeholder=" "
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label
                    htmlFor="floating_last_name"
                    className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last name
                  </label>
                </div>
              </div>

              {/* Phone Fields */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="tel"
                  pattern="[0-9]{10,13}"
                  name="floating_phone"
                  id="floating_phone"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                  placeholder=" "
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label
                  htmlFor="floating_phone"
                  className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone number
                </label>
              </div>

              {/* User Type and Referral Code Fields */}
              <div className="relative z-0 w-full mb-5 group">
                <select
                  id="floating_user_type"
                  name="floating_user_type"
                  className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="" disabled>
                    Select user type
                  </option>
                  <option value="Attendees">Attendees</option>
                  <option value="Organizer">Organizer</option>
                </select>
                <label
                  htmlFor="floating_user_type"
                  className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  User Type
                </label>
              </div>

              {userType === 'Experience' && (
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="floating_referral_code"
                    id="floating_referral_code"
                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-Dark-blue peer"
                    placeholder=" "
                    value={referralCode.toUpperCase()}
                    onChange={(e) =>
                      setReferralCode(e.target.value.toUpperCase())
                    }
                  />
                  <label
                    htmlFor="floating_referral_code"
                    className="peer-focus:font-medium absolute text-sm text-slate-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Referral Code (Optional)
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-2.5 text-white bg-black hover:bg-gray-600 rounded-lg"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
