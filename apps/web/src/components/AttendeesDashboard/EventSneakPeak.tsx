'use client';
import { getEventSneakPeak } from '@/lib/event';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CardEvent from '../Events/CardEvent';

export default function EventSneakPeak() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const events = await getEventSneakPeak();

        // console.log('event sneak component');

        // console.log(typeof events);

        setData(events);
      } catch (err) {
        console.log(err);
        
        toast.error('failed to load events');
      }
    };

    getData();
  }, []);

  useEffect(() => {
    // console.log('State Data Content\n', data);
}, [data]);  // This will log data after it has been updated

  function displaySkeleton() {
    let indents = [];
    for (let i = 0; i < 2; i++) {
      indents.push(<div className="skeleton h-20 w-10/12" key={i}></div>);
    }
    return indents;
  }

  return (
    <div id='sneakPeakRadial' className='gap-5 p-2'>
      <h1 className='ml-5 text-[#bd9b78] text-4xl font-bold'>Events</h1>
      
      <div className='flex flex-wrap flex-col justify-around gap-8 p-5 md:flex-row'> 
        {!data 
        ? displaySkeleton()
        : data.map((d: any) => (
            // <div
            //   className="h-[15rem] border-4 border-slate-400"
            //   key={d.idEvent}
            // >
            //   <h1>{d.name}</h1>
            //   <p>{d.desc}</p>
            //   <h2>{d.price}</h2>
            // </div>

            <CardEvent key={d.idEvent} loopKey={d.idEvent} name={d.name} slug={d.slug} desc={d.desc} image={d.image} startDate={d.startDate} endDate={d.endDate} />
          ))}
          
      </div>
      
    </div>

    // <div className="h-[15rem] border-4 border-slate-400">
    //     events
    // </div>
    // <div className="h-[15rem] border-4 border-slate-400">
    //     events
    // </div>
    // <div className="h-[15rem] border-4 border-slate-400">
    //     events
    // </div>
  );
}
