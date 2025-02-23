/* eslint-disable react-hooks/exhaustive-deps */
// components/SearchModal.tsx
'use client';

import { useContextGlobal } from '@/context/Context';
import { getEventList } from '@/lib/event';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

const SearchModal: React.FC = () => {
  // Setting for modal
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Global state setting
  const { categories, locations, fetchCategoriesLocations } =
    useContextGlobal();

  useEffect(() => {
    if (!categories && !locations) {
      fetchCategoriesLocations();

      console.log('Search component = ', categories);
    }
  }, [categories, locations, fetchCategoriesLocations]);

  // Search state and query handling
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search');
  const queryCategory = searchParams.get('category');
  const queryLocation = searchParams.get('location');

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [search, setSearch] = useState<string>(querySearch || '');
  const [category, setCategory] = useState<string>(queryCategory || '');
  const [location, setLocation] = useState<string>(queryLocation || '');

  // Set debounce value
  const [debouncedSearch] = useDebounce(search, 1000);
  const [debouncedCategory] = useDebounce(category, 1000);
  const [debouncedLocation] = useDebounce(location, 1000);

  const router = useRouter();

  // Track if user has interacted with the inputs
  const [isSearchTouched, setIsSearchTouched] = useState(false);
  const [isCategoryTouched, setIsCategoryTouched] = useState(false);
  const [isLocationTouched, setIsLocationTouched] = useState(false);

  //  Handle Inputs activity
  const handleSearchChange = () => {
    if (searchRef.current) {
      setSearch(searchRef.current.value);
      setIsSearchTouched(true); // Mark search as touched
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setIsCategoryTouched(true); // Mark category as touched
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
    setIsLocationTouched(true); // Mark location as touched
  };

  // Handle description html string
  function createMarkup(c: string) {
    return { __html: c };
}

  // Fetch event list and update the URL only if the inputs have been touched
  /*
  const getData = async () => {
    try {
      // Update the URL query with both search and category
      const query = `?search=${debouncedSearch}&category=${debouncedCategory}&location=${debouncedLocation}`
      // const query = `?search=${debouncedSearch}`
      router.push(query)

      const {events} = await getEventList(debouncedSearch, debouncedCategory, debouncedLocation);
      // const {events} = await getEventList(debouncedSearch)

      setData(events)

    } catch (err) {
      toast.error(`${err}`)
    }
  }
  */

  const getData = async () => {
    try {
      // Only push the query to the router if at least one input has been changed by the user
      if (isSearchTouched || isCategoryTouched || isLocationTouched) {
        const query = `?search=${debouncedSearch}&category=${debouncedCategory}&location=${debouncedLocation}`;
        router.push(query);
      }

      // Fetch events based on the search parameters
      const { events } = await getEventList(
        debouncedSearch,
        debouncedCategory,
        debouncedLocation,
      );
      setData(events);
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  // Trigger getData when debounced values change
  useEffect(
    () => {
      getData();
    },
    /*[debouncedSearch]*/ [
      debouncedSearch,
      debouncedCategory,
      debouncedLocation,
    ],
  );

  return (
    <>
      <button className="btn btn-ghost btn-circle" onClick={openModal}>
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {/* isOpen &&  */}
      {isOpen && (
        <>
          {!categories && !locations ? (
            <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="bg-white w-11/12 h-[80%] p-8 rounded shadow-lg relative overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-4 rou text-gray-600 hover:text-gray-900 text-lg"
                  aria-label="Close"
                >
                  &times;
                </button>

                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full mb-0"
                />
                <div className="w-full rounded-lg border-b-2 border-black mb-5"></div>

                <div className="flex flex-col h-full gap-6 mb-8">
                  <span className="loading loading-bars loading-lg"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="bg-white flex flex-col gap-4 w-11/12 h-[80%] p-8 rounded shadow-lg relative overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-4 rou text-gray-600 hover:text-gray-900 text-lg"
                  aria-label="Close"
                >
                  &times;
                </button>

                {/* <input
                  type="text"
                  placeholder="Type here"
                  className="input w-full mb-0 p-5"
                /> */}
                <input
                  type="search"
                  placeholder="Type here"
                  onChange={handleSearchChange}
                  ref={searchRef}
                  defaultValue={debouncedSearch}
                  className="input w-full mb-0 p-5"
                />
                <div className="w-full rounded-lg border-b-2 border-black mb-5"></div>

                <div className="w-fit h-fit mx-auto flex gap-5 p-4 border-4">
                  <div>
                    <select
                      className="select w-full max-w-xs border-2"
                      onChange={handleCategoryChange}
                      value={category}
                    >
                      <option value="">Select Category</option>
                      {categories!.map((cat: any) => (
                        <option key={cat.idCategory} value={cat.idCategory}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      onChange={handleLocationChange}
                      value={location}
                      className="select w-full max-w-xs border-2"
                    >
                      <option value="">Select Location</option>
                      {locations!.map((lot: any) => (
                        <option key={lot.idLocation} value={lot.idLocation}>
                          {lot.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col h-full gap-6 mb-8">
                  {/* <div className="border-b-2 border-black flex flex-col gap-2">
                    <h2 className="text-3xl">Modal Title</h2>
                    <p className="text-lg">This is a client-side modal.</p>
                    <h3 className="text-sm">01-01-1999</h3>
                  </div> */}
                  {data &&
                    data.map((d: any) => (
                      <div
                        key={d.idEvent}
                        className="border-b-2 border-black flex flex-col gap-2"
                      >
                        <h2 className="text-3xl">{d.name}</h2>
                        <p className="text-lg" dangerouslySetInnerHTML={createMarkup(d.desc)}></p>
                        <h3 className="text-sm">{d.startDate}</h3>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchModal;
