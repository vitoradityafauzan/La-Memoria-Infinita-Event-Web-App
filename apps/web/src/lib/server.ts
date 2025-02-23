'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Set Base Url Of API
const base_url =
  process.env.BASE_URL_API || 'http://localhost:8000/api/';

// Setting Cookies
const cookiesStore = cookies();

// START Cookies For Categories And Locations
export async function createCategoriesLocations() {
  console.log('Server TS, creating categories locations token');
  
  // Fetch Category and Location List
  const response = await fetch(`${base_url}event/category-location`);
  const data = await response.json();

  console.log('Server TS, creating categories locations token fetch categoris locations', data.category);

  const oneDay = 24 * 60 * 60 ;

  cookiesStore.set('categories', JSON.stringify(data.category), {
    maxAge: oneDay,
  });

  cookiesStore.set('locations', JSON.stringify(data.location), {
    maxAge: oneDay,
  });
  
  // const oneDay = 24 * 60 * 60 * 1000;

  // cookiesStore.set('categories', JSON.stringify(data.category), {
  //   expires: Date.now() + oneDay,
  // });

  // cookiesStore.set('locations', JSON.stringify(data.location), {
  //   expires: Date.now() + oneDay,
  // });
  

  console.log(cookies().has('categories') ? "Server TS, creating categories locations token success" : "Server TS, creating categories locations token Failed");
  
}

// START Cookies For Categories And Locations
export async function createCategoriesLocations2() {
  
  // Fetch Category and Location List
  const response = await fetch(`${base_url}event/category-location`);
  const data = await response.json();

  return data;
  
}

export async function getCategoriesLocationsHome() {
  console.log('Server Ts, getCategoriesLocationsHome');

  if (cookies().has('categories') && cookies().has('locations')) {
    console.log('Server Ts, getting cookie');
    console.log(cookies().get('categories'));    
    
    const dataCategory = await cookies().get('categories')?.value;
    const dataLocation = await cookies().get('locations')?.value;

    return { categoryList: dataCategory, locationList: dataLocation };

  } else {
    console.log('Server Ts, cookie not found/expire');
    cookiesStore.delete('categories');
    cookiesStore.delete('locations');
    return { categoryList: ['not-found'], locationList: ['not-found'] };

  }
}

export async function deleteCategoriesLocations() {
    cookiesStore.delete('categories');
    cookiesStore.delete('locations');
}

export async function createToken(token: string) {
    const oneDay = 24 * 60 * 60 * 1000
    cookies().set('token', token, { expires: Date.now() + oneDay })
}

export async function getToken() {
    return cookies().get('token')?.value
}

export async function deleteToken() {
    cookies().delete('token')
}

// // START Cookies For Categories And Locations
// export async function createCategoriesLocations() {
//   console.log('Server TS, creating categories locations token');
  
//   // Fetch Category and Location List
//   const response = await fetch(`${base_url}event/category-location`);
//   const data = await response.json();

//   console.log('Server TS, creating categories locations token fetch categoris locations', data.category);
  
//   const oneDay = 24 * 60 * 60 * 1000;

//   // const category = [{idCategory: 0, name: 'Category Select'}, ...data.category];

//   // const location = [{idLocation: 0, name: 'Location Select'}, ...data.location];

//   await cookiesStore.set('categories', data.category, {
//     expires: Date.now() + oneDay,
//   });

//   await cookiesStore.set('locations', data.location, {
//     expires: Date.now() + oneDay,
//   });

//   console.log(cookies().has('categories') ? "Server TS, creating categories locations token success" : "Server TS, creating categories locations token Failed");
  
// }