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
                return <Setting />
            case 'B':
                return <History />
            default:
                return <h1>Not Detected</h1>;
        }
    }

  return (
    <Wrapper>
      <div className="w-fit pr-4 drawer lg:drawer-open  border-2">
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
              <a onClick={() => setVisible('A')}>Profile Info</a>
            </li>
            <li>
              <a onClick={() => setVisible('B')}>History</a>
            </li>
          </ul>
        </div>
      </div>
      {renderVisible()}
    </Wrapper>
  );
};

export default Profile;
