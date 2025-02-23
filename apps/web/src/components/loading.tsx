import React from 'react';

const loading = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>
        <span className="mt-1 loading loading-spinner loading-lg"></span>
      </div>

      <span className="self-center text-[#c66646] text-2xl font-semibold whitespace-nowrap dark:text-white">
        Loading
      </span>
    </div>
  );
};

export default loading;
