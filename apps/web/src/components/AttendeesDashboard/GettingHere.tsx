import Image from "next/image";
import { LandingWrap } from "../LandingWrap";

const transportations = [
    {
        name: 'By Car',
        image: 'car.png'
    },
    {
        name: 'By Train',
        image: 'train.png'
    },
    {
        name: 'By Bus',
        image: 'bus.png'
    }
]

export function GettingHere() {

    return (
        <LandingWrap additional="gap-9 p-2 mb-16">
            <h1 className="ml-5 text-4xl text-[#bd9b78] font-bold">Getting Here</h1>
            <div className="flex flex-wrap w-full gap-9 justify-center md:justify-around">
                {transportations.map((t) => (
                    <div className="flex flex-col items-center gap-5 text-xl font-medium text-[#bd9b78] p-4 shadow-xl rounded-xl" key={t.name}>
                        <Image 
                            src={`/image/transportation/${t.image}`}
                            alt='car'
                            width={0} 
                            height={0} 
                            sizes='100vw' 
                            className='w-32 h-26'
                        />
                        <h1>{t.name}</h1>
                    </div>
                ))}
                
            </div>
      </LandingWrap>
    )
}