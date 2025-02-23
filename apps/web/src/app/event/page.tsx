'use client'
import CardEvent from '@/components/Events/CardEvent';
import { Wrapper } from '@/components/Wrapper';
import { useContextGlobal } from '@/context/Context';
import { getEventList } from '@/lib/event';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Event() {
   // Global state setting
  // const { categories, locations, fetchCategoriesLocations } = useContextGlobal();

  // useEffect(() => {
  //   if (!categories && !locations) {
  //     fetchCategoriesLocations();

  //     console.log('Search component = ', categories);
  //   }
  // }, [categories, locations, fetchCategoriesLocations])

  const [data, setData] = useState<any[] | null>(null);

  const getData = async () => {
    try {
      // Fetch events 
      const { events } = await getEventList(
        "",
        "",
        "",
      );
      setData(events);
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  useEffect(() => {
    getData();

  }, [])

  return (
    <Wrapper additional='flex-col p-3 md:p-10 border-0 justify-center'>
      <h1 className='text-3xl'>Our Events</h1>
      <div className="flex flex-wrap gap-8 justify-around">
        {data && (
          <>
            {data.map((d: any) => (
              <CardEvent key={d.idEvent} loopKey={d.idEvent} name={d.name} slug={d.slug} desc={d.desc} image={d.image} startDate={d.startDate} endDate={d.endDate} />
            ))}
          </>
        )}
      </div>
    </Wrapper>
  );
}
