'use client';
import { createContext, useState, useContext, ReactNode } from 'react';
import {
  createCategoriesLocations,
  createCategoriesLocations2,
  deleteCategoriesLocations,
  getCategoriesLocationsHome,
  getToken,
} from '@/lib/server';
import { DecodedToken, IUserSimple } from '@/type/user';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { cookies } from 'next/headers';

// Define the structure for our context value
interface ContextGlobalType {
  categories: any | null;
  locations: any | null;
  fetchCategoriesLocations: () => Promise<void>;
  userData: IUserSimple | null;
  fetchUser: () => Promise<void>;
}

// interface IData {
//   categoryList: any | null;
//   locationList: any | null;
//   userData: IUserSimple | null;
// }

// Create the context with a default value
const ContextGlobal = createContext<ContextGlobalType | undefined>(undefined);

// Set Base Url Of API
const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api/';

// Provider component to wrap around the application
export const ContextGlobalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [categories, setCategories] = useState<any | null>(null);
  const [locations, setLocations] = useState<any | null>(null);
  const [userData, setUserData] = useState<IUserSimple | null>(null);

  const fetchCategoriesLocations = async () => {
    const data = await createCategoriesLocations2();
    console.log('data result, ', data);

    setCategories(data.category);
    setLocations(data.location);
  };

  // const fetchCategoriesLocations = async () => {
  //   if (cookies().has('categories') && cookies().has('locations')) {
  //     const dataCategory: any = cookies().get('categories')?.value;
  //     const dataLocation: any = cookies().get('locations')?.value;

  //     setCategories(dataCategory);
  //     setLocations(dataLocation);
  //   } else {
  //     setCategories(['token expired/undefined'])
  //     setLocations(['token expired/undefined'])
  //   }
  // };

  // const fetchCategoriesLocations = async () => {
  //   if (cookies().has('categories') && cookies().has('locations')) {
  //     const dataCategory: any = cookies().get('categories')?.value;
  //     const dataLocation: any = cookies().get('locations')?.value;

  //     setCategories(dataCategory);
  //     setLocations(dataLocation);
  //   } else {
  //     const response = await fetch(`${base_url}event/category-location`);
  //     const data = await response.json();
  //     const oneDay = 24 * 60 * 60 * 1000;

  //     cookies().set('categories', data.category, {
  //       expires: Date.now() + oneDay,
  //     });

  //     cookies().set('locations', data.location, {
  //       expires: Date.now() + oneDay,
  //     });

  //     setCategories(data.category);
  //     setLocations(data.location);
  //   }
  // };

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');

      // Decode the token to get user info
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.id;

      if (!userId) throw new Error('User ID not found in token');

      const response = await fetch(`${base_url}user/${userId}`, {
        // Adjusted URL to use user ID
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data: any = await response.json();

      if (response.ok) {
        setUserData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          email: data.user.email,
          id: data.user.idUser,
        });
      } else {
        toast.error(data.msg || 'Failed to fetch user data.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching user data.');
    }
  };

  return (
    <ContextGlobal.Provider
      value={{
        categories,
        locations,
        fetchCategoriesLocations,
        userData,
        fetchUser,
      }}
    >
      {children}
    </ContextGlobal.Provider>
  );
};

// Custom hook to use the ContextGlobal
export const useContextGlobal = () => {
  const context = useContext(ContextGlobal);
  if (!context) {
    throw new Error(
      'useContextGlobal must be used within a ContextGlobalProvider',
    );
  }
  return context;
};
