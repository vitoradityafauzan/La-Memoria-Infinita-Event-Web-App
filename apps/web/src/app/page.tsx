/* eslint-disable @next/next/no-async-client-component */
'use client';
import Advantage from '@/components/AttendeesDashboard/Advantage';
import EventSneakPeak from '@/components/AttendeesDashboard/EventSneakPeak';
import { GettingHere } from '@/components/AttendeesDashboard/GettingHere';
import HeroBanner from '@/components/AttendeesDashboard/HeroBanner';
import { LandingWrap } from '@/components/LandingWrap';
import { Wrapper } from '@/components/Wrapper';
import { useContextGlobal } from '@/context/Context';
import { useEffect } from 'react';

const Home: React.FC = () => {
  // const { categories, locations, fetchCategoriesLocations } =
  //   useContextGlobal();

  // useEffect(() => {
  //   if (!categories && !locations) {
  //     console.log("Home, global state not there");

  //     fetchCategoriesLocations();
  //   }
  // }, [categories, locations, fetchCategoriesLocations]);

  // useEffect(() => {
  //   console.log('Home component, checking categories\n', categories);
    
  // }, [categories])

  return (
    <Wrapper additional="flex-col gap-32">
      {/* Hero Section */}
      <HeroBanner />
      
      {/* App advantages */}
      <Advantage />
      {/* Current Events */}
      <LandingWrap>
        <EventSneakPeak />
        {/* <div className="h-[15rem] border-4 border-slate-400">events</div>
        <div className="h-[15rem] border-4 border-slate-400">events</div>
        <div className="h-[15rem] border-4 border-slate-400">events</div> */}
      </LandingWrap>
      {/* Getting Here */}
      <GettingHere />
      {/* <LandingWrap additional="gap-9">
        <h1>Getting Here</h1>
        <div className="flex w-full border-2 gap-9 justify-center">
          <div className="border-4">transportaion</div>
          <div className="border-4">transportaion</div>
          <div className="border-4">transportaion</div>
        </div>
      </LandingWrap> */}
    </Wrapper>
  );
};

export default Home;
