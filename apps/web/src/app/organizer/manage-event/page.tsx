'use client';

import FormCreateEvent from '@/components/Events/FormCreateEvent.tsx/page';
import SetVoucher from '@/components/Events/SetVoucher/page';
// import { Setting } from '@/components/Profile/Setting';
import { Wrapper } from '@/components/Wrapper';
import { useContextGlobal } from '@/context/Context';
import { useEffect, useState } from 'react';

export default function CreateEvent() {
  const [visible, setVisible] = useState('B');

  const { categories, locations, fetchCategoriesLocations } =
    useContextGlobal();

  useEffect(() => {
    if (
      (categories === null ||
        categories == undefined ||
        categories.length < 1) &&
      (locations === null || locations == undefined || locations.length < 1)
    ) {
      fetchCategoriesLocations();
    }
  }, [categories, locations, fetchCategoriesLocations]);

  const renderVisible = () => {
    switch (visible) {
      // case 'A':
      //   return <Setting />;
      case 'B':
        return <FormCreateEvent />;
      case 'C':
        return <SetVoucher />;
      default:
        return <h1>Not Detected</h1>;
    }
  };

  return (
    <Wrapper additional="justify-between">
      <div className="w-fit pr-4 drawer lg:drawer-open  border-r-4">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-outline drawer-button lg:hidden"
          >
            Other Setting
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full lg:bg-slate-50 w-60 md:w-64">
            {/* Sidebar content here */}
            {/* <li>
              <a onClick={() => setVisible('A')}>Profile Info</a>
            </li> */}
            <li>
              <a onClick={() => setVisible('B')}>Create Event</a>
            </li>
            <li>
              <a onClick={() => setVisible('C')}>Add Event Voucher</a>
            </li>
          </ul>
        </div>
      </div>
      {renderVisible()}
    </Wrapper>
  );
}
