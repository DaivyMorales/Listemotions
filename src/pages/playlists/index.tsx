import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { HiOutlineMenu } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import { useRouter } from 'next/router'
import { useOpenComponents } from '@/store/openComponentsStore';

interface ImagesArtist {
    url: string
}
interface Artist {
    id: string;
    images: ImagesArtist[];
    name: string;
}


export default function Generate() {

    
    
    
    const router = useRouter();
    
    const [myArtists, setMyArtists] = useState([])
    
    const { data: session, status } = useSession();
    // console.log(session?.accessToken)
    console.log(session?.accessToken);


    return (
        <div className='h-screen -mt-20 w-full flex justify-center items-center flex-col gap-2'>
            {/* <button onClick={() => { addMyArtists() }}>My artists</button> */}
            <HiOutlineMenu size={40} />
            <h2 className='font-bold text-xl'>Let's do it!</h2>
            <p className='font-normal text-xs text-gray-400 text-center'>Just smash the button below <br />
                to create your first playlist.</p>
            <button onClick={() => { router.push("/create") }} className='flex justify-center items-center p-4 rounded-xl bg-[#FF0000] gap-1 font-bold'><HiPlus size={20} /> Create playlist</button>



        </div>
    )
}
