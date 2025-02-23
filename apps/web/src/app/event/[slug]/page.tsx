/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Wrapper } from '@/components/Wrapper';
import { getEventBySlug } from '@/lib/event';
import { IEventSlug } from '@/type/event';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MdOutlineCategory } from 'react-icons/md';
import { IoTimeOutline } from 'react-icons/io5';
import { CiCalendar } from 'react-icons/ci';
import { IoLocationOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export default function EventDetail({ params }: { params: { slug: string } }) {
  const router = useRouter();
  
  // Handle description html string
  function createMarkup(c: string) {
    return { __html: c };
  }

  // State for event
  const [data, setData] = useState<IEventSlug | null>(null);

  //   Handling fetching event
  const getData = async () => {
    try {
      console.log('Page event detail, getting event');
      console.log('params=', params.slug);

      const { event } = await getEventBySlug(params.slug);

      setData(event);
      console.log('Page event detail, getting event success');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
    }
  }, []);

  const handleOrderClick = () => {
    router.push(`/order?slug=${params.slug}`);
  };

  return (
    <Wrapper additional="flex-col ">
      {data && (
        <>
          <div className={`w-full h-90 flex`}>
            <div className="basis-3/5">
              <Image
                src={`${data.image}`}
                alt={data.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full basis-"
              />
            </div>
            <div className="basis-2/5 flex flex-col gap-5 p-5">
              <h1>{data.name}</h1>
              <h1 className="flex gap-4">
                <CiCalendar />{' '}
                {format(parseISO(data.startDate), 'dd MMMM yyyy')} -{' '}
                {format(parseISO(data.endDate), 'dd MMMM yyyy')}
              </h1>
              <h1 className="flex gap-4">
                <IoTimeOutline /> {format(parseISO(data.startDate), 'HH:mm')} -{' '}
                {format(parseISO(data.endDate), 'HH:mm')}
              </h1>
              <h1 className="flex gap-4">
                <MdOutlineCategory /> {data.category.name}
              </h1>
              {data.location.name.charAt(0) == 'A' && (
                <h1 className="flex gap-4">
                  <IoLocationOutline />
                  Conventional Hall {data.location.name}
                </h1>
              )}
              {data.location.name.charAt(0) == 'B' && (
                <h1 className="flex gap-4">
                  <IoLocationOutline />
                  Conference Hall {data.location.name}
                </h1>
              )}
              {data.location.name.charAt(0) == 'M' && (
                <h1 className="flex gap-4">
                  <IoLocationOutline />
                  Meeting Room {data.location.name}
                </h1>
              )}
            </div>
          </div>

          <div className="w-full h-fit p-5 flex">
            <div className="basis-3/5 p-5">
              <p
                className="text-lg text-justify tracking-wide"
                dangerouslySetInnerHTML={createMarkup(data.desc)}
              ></p>
            </div>
            <div className="basis-2/5 flex flex-col justify-center items-center border-y-4 rounded-xl border-[#bd9b78]">
              <button
                className="btn btn-success btn-md md:btn-lg text-xl md:text-2xl"
                onClick={handleOrderClick}
              >
                Order Ticket
              </button>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}
