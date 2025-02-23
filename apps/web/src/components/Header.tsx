/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

import SearchModal from './SearchModal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { deleteToken, getToken } from '@/lib/server';
import { Role } from '@/type/role';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '@/redux/slice/authorSlice';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import coin from '../assets/Coin.png';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { Wrapper } from './Wrapper';

const Header = () => {
  const [token, setToken] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user);

  const getData = async () => {
    const res = await getToken();
    setToken(res || '');
  };

  const checkRole = (userType: Role) => {
    return user?.userType === userType;
  };

  const onLogout = async () => {
    await deleteToken();
    dispatch(logoutAction());
    router.push('/');
    setToken('');
  };

  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  useEffect(() => {
    getData();

    if (!token && !user) onLogout();

    if (pathname.includes('/organizer')) {
      if (!checkRole(Role.Organizer)) {
        toast.error('You are not authorized to access this page !');
        router.push('/');
      }
    }
    console.log('user:', user);
  }, []);

  return (
    <Wrapper>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            {(token || user.id) && checkRole(Role.Organizer) ? (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border-2"
              >
                <li>
                  <Link href="/">Homepage</Link>
                </li>
                <li>
                  <Link href="/organizer/manage-event">Manage Events</Link>
                </li>
              </ul>
            ) : (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border-2"
              >
                <li>
                  <Link href="/">Homepage</Link>
                </li>
                <li>
                  <Link href="/event">Events</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-center border-2">
          <Link href="/" className="text-xl p-2 hover:bg-slate-200">
            La Memoria Infinita
          </Link>
        </div>
        <div className="navbar-end">
          <SearchModal />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {token || user.id ? (
                <div>
                  {checkRole(Role.Attendees) && (
                    <div className="dropdown dropdown-end text-black">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn bg-opacity-0 text-black bg-zinc-900 text-[15px]"
                      >
                        {user.firstName + ' ' + user.lastName}
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-44 p-2 shadow"
                      >
                        <li>
                          <Link href={'/account-settings/my-event'}>
                            My Event
                          </Link>
                        </li>
                        <li>
                          <Link href={'/dashboard'}>Dashbord</Link>
                        </li>
                        <li>
                          <Link href={'/account-settings'}>
                            Account Setting
                          </Link>
                        </li>
                        <li className="mt-4 flex justify-center items-center">
                          <div
                            onClick={onLogout}
                            className="bg-gray-600 hover:bg-gray-400"
                          >
                            LogOut
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}

                  {checkRole(Role.Organizer) && (
                    <div className="dropdown dropdown-end">
                      <div className="flex items-center gap-[30px]">
                        <h1 className="flex items-center gap-1 text-black font-bold text-[15px]">
                          <Image src={coin} alt="coin" width={30} />
                          {user.points}
                        </h1>
                        <div>
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn bg-opacity-0 text-black  bg-zinc-900  text-[15px] pb-16"
                          >
                            <div className="pt-2 flex flex-col justify-center items-center">
                              <FiUser />
                              <Link href="/profile">
                                {user.firstName + ' ' + user.lastName}
                              </Link>
                            </div>
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-black text-white bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-2"
                          >
                            <li>
                              <Link
                                href={'/my-ticket'}
                                className="hover:bg-gray-600"
                              >
                                My Ticket
                              </Link>
                            </li>
                            <li>
                              <Link
                                href={'/account-settings'}
                                className="hover:bg-gray-600"
                              >
                                Account Setting
                              </Link>
                            </li>
                            <li>
                              <div
                                onClick={onLogout}
                                className="hover:bg-gray-600"
                              >
                                LogOut
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <li>
                    <Link href="/login">LogIn</Link>
                  </li>
                  <li>
                    <Link href="/signUp">Sign Up</Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </Wrapper>
  );
};

export default Header;
