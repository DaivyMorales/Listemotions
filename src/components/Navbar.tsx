import { useOpenComponents } from '@/store/openComponentsStore';
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Artists from './Artists';

interface NavbarProps {
    children: React.ReactNode
}
export default function Navbar({ children }: NavbarProps) {

    const { data: session } = useSession();
    const { openArtists } = useOpenComponents();
    return (
        <div className="relative w-full h-full flex flex-col">
            {
                openArtists && (<Artists />)
            }
            <div className=" sticky top-0 z-10  p-2 flex justify-center">
                {/* <div className=" rounded-lg flex gap-2 justify-center px-10 py-2 ring-1 ring-gray-800 backdrop-blur-lg"> */}
                <ul className='shadow-inner shadow-gray-900 rounded-lg flex gap-2 justify-center items-center px-10 py-2 ring-1 ring-gray-800 backdrop-blur-lg'>
                    <li>About</li>
                    <li>Changelog</li>

                    <li><button className='text-sm font-medium bg-[#FF0000] p-2 rounded-lg'>Join waitlist</button></li>
                    <li className='text-gray-800'>|</li>
                    {
                        session && (
                            <li>
                                <Image
                                    className='rounded-full p-1 bg-slate-900'
                                    src={session?.user.image}
                                    width={35}
                                    height={35}
                                    alt='User image'
                                />
                            </li>
                        )
                    }

                </ul>
                {/* </div> */}
            </div>
            {children}
        </div>
    )
}
