/* eslint-disable react/jsx-no-undef */
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

interface IEvent {
  name: string;
  slug: string;
  desc: string;
  image?: string;
  startDate?: string | null;
  endDate?: string | null;
  loopKey: number;
}

const CardEvent: React.FC<IEvent> = ({
  name,
  slug,
  desc,
  image,
  startDate,
  endDate,
  loopKey,
}) => {
  // Set format for displaying event date
  const fromIsoStart = parseISO(`${startDate}`);
  const newStart = format(fromIsoStart, 'dd MMMM yyyy');

  const fromIsoEnd = parseISO(`${endDate}`);
  const newEnd = format(fromIsoEnd, 'dd MMMM yyyy');

  // Handle description html string
  function createMarkup(c: string) {
    return { __html: c };
  }

  return (
    <div
      className="card bg-base-100 w-full md:w-80 lg:w-96 lg:h-[35rem] shadow-xl border-2"
      key={loopKey}
    >
      <figure>
        {/* <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        /> */}
        {/* <img
          src={image}
          alt={name}
        /> */}
        <Image
          src={`${image}`}
          alt={name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-64"
          priority={true}
        />
        
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <h3>{newStart} - {newEnd}</h3>
        <p className="text-lg h-32 text-ellipsis overflow-hidden ..." dangerouslySetInnerHTML={createMarkup(desc)}></p>
        <div className="card-actions justify-end">
          <Link href={`/event/${slug}`}>
            <button className="btn btn-primary">Check Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardEvent;
