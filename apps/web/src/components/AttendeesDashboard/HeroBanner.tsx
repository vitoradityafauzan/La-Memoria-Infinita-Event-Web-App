import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="h-[32rem] w-full text-center bg-[url('/image/HeroBack3.jpg')] bg-cover bg-center bg-no-repeat flex flex-col md:flex-row p-4 md:p-0 justify-around md:justify-center">
      <div className="md:basis-1/2 content-center text-white text-4xl font-medium">
        <h1>Your Perfect</h1>
        <h1 className="text-[#bd9b78] font-bold mt-4">Event Destination</h1>
      </div>
      <div className="md:basis-1/2 content-center">
        <div className="flex flex-col md:w-4/6 mx-auto p-5 gap-5 justify-center items-center bg-slate-50/70">
          <p className="text-slate-700 font-medium">
            Unlock the full potential and possibilities, be it an exhibiton or a
            convention, corporate meeting or high profile themed function.
          </p>
          <Link href={'/event'} className="border-4 border-slate-700 p-4 w-3/6 hover:bg-[#c0ab95] hover:border-0">
            {' '}
            Plan An Event
          </Link>
        </div>
      </div>
    </div>
  );
}
