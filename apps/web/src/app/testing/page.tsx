'use client';

import { History } from '@/components/Profile/History';
import { Setting } from '@/components/Profile/Setting';
import { Wrapper } from '@/components/Wrapper';
import { useState } from 'react';

const Profile: React.FC = () => {
  const [visible, setVisible] = useState('A');

  const renderVisible = () => {
    switch (visible) {
      case 'A':
        return <Setting />;
      case 'B':
        return <History />;
      default:
        return <h1>Not Detected</h1>;
    }
  };

  return (
    <Wrapper>
      <div className="lg:basis-[20%] pr-4 drawer lg:drawer-open  border-2">
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
          <ul className="menu bg-base-200 text-base-content min-h-full lg:bg-slate-50 w-60 md:w-80">
            {/* Sidebar content here */}
            <li>
              <div
                tabIndex={0}
                className="collapse collapse-arrow border-base-300 bg-base-200 border"
              >
                <div className="collapse-title text-xl font-medium">
                  Focus me to see content
                </div>
                <div className="collapse-content">
                  <p>
                    tabindex={0} attribute is necessary to make the div
                    focusable
                  </p>
                </div>
              </div>
            </li>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1 w-full">
                User Management
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow absolute"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
      {renderVisible()}
    </Wrapper>
  );
};

export default Profile;
