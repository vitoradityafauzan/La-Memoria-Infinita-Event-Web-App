/* eslint-disable react/jsx-no-undef */
'use client';
import { Wrapper } from '@/components/Wrapper';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEventByUser, getMyEvent } from '@/lib/event';
import { useContextGlobal } from '@/context/Context';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

const MyEventList: React.FC = () => {
  // Global state setting
  const { userData, fetchUser } = useContextGlobal();
  // State for event data
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    if (!userData) {
      fetchUser();
    } else {
      // Fetch events by user when userData is available
      const fetchEvents = async () => {
        try {

          const fetchedEvents = await getMyEvent();
          console.log(fetchedEvents);
          
          setEvents(fetchedEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    }
  }, [userData, fetchUser]);

  // Handle description html string
  function createMarkup(c: string) {
    return { __html: c };
  }

  return (
    <div className="grow">
        <h1>asa</h1>
      {userData ? (
        <div className='flex gap-5 justify-around'>
          {events?.map((e) => (
            <div
            className="card bg-base-100 w-full md:w-80 lg:w-96 lg:h-[35rem] shadow-xl border-2"
            key={e.idEvent}
          >
            <figure>
            <Image
                src={`${e.image}`}
                alt={e.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-64"
                priority={true}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{e.name}</h2>
              <h3>
              {format(parseISO(e.startDate), 'dd MMMM yyyy')} - {format(parseISO(e.endDate), 'dd MMMM yyyy')}
              </h3>
              <p
                className="text-lg h-32 text-ellipsis overflow-hidden ..."
                dangerouslySetInnerHTML={createMarkup(e.desc)}
              ></p>
              {/* <div className="card-actions justify-end">
                <Link href={`/event/${e.slug}`}>
                  <button className="btn btn-primary">Check Now</button>
                </Link>
              </div> */}
            </div>
          </div>
          ))}
       </div>
      ) : (
        <div>
            no event
        </div>
      )}
    </div>
  );
}

export default MyEventList