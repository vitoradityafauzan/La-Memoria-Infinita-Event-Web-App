'use client'
import MyEventList from '@/components/Events/MyEventList/page';
import Review from '@/components/Events/Review/page';
import { Wrapper } from '@/components/Wrapper';
import { useContextGlobal } from '@/context/Context';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const MyEvent: React.FC = () => {
    const [visible, setVisible] = useState('B');

    const renderVisible = () => {
        switch (visible) {
          case 'A':
            return <MyEventList />
          case 'B':
            return <Review />;
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
            <li>
              <a onClick={() => setVisible('A')}>My Events</a>
            </li>
            <li>
              <a onClick={() => setVisible('B')}>Review an Event</a>
            </li>
          </ul>
        </div>
      </div>
      {renderVisible()}
    </Wrapper>
    )
}

export default MyEvent