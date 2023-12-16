import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Generate() {

    const [myArtists, setMyArtists] = useState([])

    const { data: session, status } = useSession();

    const addMyArtists = async () => {
        // console.log(session)
        const headers = {
            Authorization: `Bearer ${session.accessToken}`
        }

        const response = await axios.get('https://api.spotify.com/v1/me/following?type=artist', { headers });
        setMyArtists(response.data.artists.items);
        // console.log(myArtists)
    }

    useEffect(() => {
        if (session) {

            addMyArtists();
        }
    }, [session])

    return (
        <div className='h-full w-full flex justify-center items-center flex-col '>Generate
            <button onClick={() => { addMyArtists() }}>My artists</button>
            <div className='grid grid-cols-2 gap-3'>
                {
                    myArtists && myArtists.map((artist) => (
                        <div className='flex gap-3 bg-black p-4 rounded-xl text-white' key={artist.id}>
                            {/* {console.log(artist.images[0].url)} */}
                            <Image  src={artist.images[0].url} width={30} height={100} alt='Artist image' />
                            <p className='font-bold text-sm'>{artist.name}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
