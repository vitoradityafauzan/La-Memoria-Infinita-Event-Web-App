import Image from 'next/image';
import { LandingWrap } from '../LandingWrap';

const advantageList = [
    {
        size: "220.000 sqm",
        title: "Site Footprint",
        image: "ad01.png"
    },
    {
        size: "12.000 sqm",
        title: "2 Grand Exhibition Halls",
        image: "ad02.png"
    },
    {
        size: "8.000 sqm",
        title: "2 Grand Convention Halls",
        image: "ad03.png"
    },
    {
        size: "6.000 sqm",
        title: "4 Meeting Rooms In Various Sizes",
        image: "ad04.png"
    },
    {
        size: "35.000 sqm",
        title: "Outdoor Space",
        image: "ad05.png"
    },
    
    {
        size: "12.000 sqm",
        title: "Pre-function Lobby Area",
        image: "ad06.png"
    }
]

export default function Advantage() {
  return (
    <LandingWrap additional="md:flex-row gap-5 md:gap-0 w-full">
      <div className="md:basis-2/6 w-full p-3 content-center">
        <h1 className='text-center text-xl md:text-2xl'>The Most Spacious Exhibition and Convention Center in Indonesia</h1>
      </div>
      <div className="md:basis-4/6 relative flex overflow-x-scroll space-x-4 pb-4 px-2">
            {advantageList.map((al: any) => (
                <div className='flex-shrink-0 w-fit h-full bg-white p-4' key={al.title}>
                    <Image src={`/image/advantage/${al.image}`} alt='rere' width={0} height={0} sizes='100vw' className='w-40 h-36' />
                    <h1>{al.size}</h1>
                    <h2>{al.title}</h2>
                </div>
            ))}
      </div>
    </LandingWrap>
  );
}
