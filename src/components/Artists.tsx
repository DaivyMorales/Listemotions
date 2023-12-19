import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useOpenComponents } from "@/store/openComponentsStore";
import { useArtists } from "@/store/artistsStore";
import { HiX } from "react-icons/hi";
import Image from "next/image";
import { HiSearch } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";

interface ArtistImage {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  id: string;
  genres: string[];
  name: string;
  uri: string;
  images: ArtistImage[];
}

interface Data {
  artistId: string;
  artist: Artist;
}

export default function Artists() {
  const [myFavoriteArtists, setMyFavoriteArtists] = useState([]);
  const [myArtists, setMyArtists] = useState<string[]>([]);
  const [onHover, setOnHover] = useState(false);
  const [idArtistHover, setIdArtistHover] = useState("");
  const [tooltipIdArtist, setTooltipIdArtist] = useState("");

  const [clickArtist, setClickArtist] = useState<Data[]>([]);
  console.log("clickArtist", clickArtist);

  const { data: session } = useSession();
  const { openArtists, setOpenArtists } = useOpenComponents();
  const { setArtistsSelected, artistsSelected } = useArtists();

  const bringArtists = async () => {
    const headers = {
      Authorization: `Bearer ${session?.accessToken}`,
    };

    const response = await axios.get(
      "https://api.spotify.com/v1/me/following?type=artist",
      { headers },
    );
    setMyFavoriteArtists(response.data.artists.items);
  };

  useEffect(() => {
    if (openArtists && session) {
      bringArtists();
    }
  }, [openArtists]);

  useEffect(() => {
    setArtistsSelected(myArtists);
  }, [myArtists]);

  const handleMouseEnter = (id: string) => {
    setTooltipIdArtist(id);
  };

  const handleMouseLeave = () => {
    setTooltipIdArtist("");
  };

  return (
    <div className="absolute z-50 flex h-[1000px] w-full flex-col items-start justify-start gap-3 bg-black">
      <div className="relative mt-10 flex w-full  flex-col items-center justify-center gap-4">
        <div className="l absolute -top-[200px] h-[200px] w-full bg-[#FF0000] blur-[90px] "></div>
        <div className="z-10 w-[700px] ">
          <h1>Who artist do you want to include?</h1>
        </div>
        {clickArtist.length > 0 && (
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-sm font-semibold">
              Artists selected
            </label>
            <div className=" -gap-2 flex  w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 backdrop-blur-[3px]">
              {clickArtist &&
                clickArtist.map((item) => (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.artist.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative cursor-pointer hover:brightness-125"
                    key={item.artistId}
                  >
                    {tooltipIdArtist === item.artist.id && (
                      <div className=" absolute -left-1 -top-7 text-center z-10 flex w-auto justify-center rounded-lg   py-1 px-2 bg-black shadow-sm ring-1 ring-gray-700 transition-opacity duration-300">
                        <p className="text-xs font-medium "> {item.artist.name}</p>
                      </div>
                    )}
                    {item.artist.images[2] && (
                      <img
                        src={item.artist.images[2].url}
                        className="h-[40px] w-[40px] rounded-full"
                        alt="Artist image"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="flex w-[700px] w-[700px] items-center justify-start gap-2 rounded-lg bg-transparent p-2 px-3 shadow-lg shadow-black ring-1 ring-red-500">
          <HiSearch />
          <input
            type="text"
            className="w-full bg-transparent font-semibold"
            placeholder="Search any artist"
          />
        </div>

        <div className="z-50 grid w-[700px] grid-cols-3 gap-3">
          {myFavoriteArtists.map((artist: Artist) => (
            <div
              key={artist.id}
              onMouseEnter={() => {
                setOnHover(true);
                setIdArtistHover(artist.id);
              }}
              onMouseLeave={() => {
                setOnHover(false);
                setIdArtistHover("0");
              }}
              className={` ${
                onHover && idArtistHover === artist.id && "ring-white "
              } ${
                clickArtist.some((data) => data.artistId === artist.id) &&
                "ring-white"
              } flex h-[60px] cursor-pointer items-center justify-start gap-2 rounded-lg p-3 ring-2 ring-gray-800`}
              onClick={() => {
                setMyArtists([...myArtists, artist.name]);

                if (!clickArtist.some((data) => data.artistId === artist.id)) {
                  setClickArtist([
                    ...clickArtist,
                    {
                      artistId: artist.id,
                      artist,
                    },
                  ]);
                }
              }}
            >
              {clickArtist.some((data) => data.artistId === artist.id) ? (
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
                  <HiCheck color="black" />
                </div>
              ) : (
                artist.images[2] && (
                  <img
                    src={artist.images[2].url}
                    alt="Artist image"
                    className="h-[30px] w-[30px] rounded-full"
                  />
                )
              )}

              {/* {artist.images[2] && (
                <Image
                  src={artist.images[2].url}
                  width={30}
                  height={40}
                  className="rounded-full "
                  alt="Artist image"
                />
              )} */}
              <div className="flex flex-col items-start justify-start gap-1">
                <h2
                  className={`${
                    onHover && idArtistHover === artist.id
                      ? "text-white "
                      : " text-gray-700"
                  } ${
                    clickArtist.some((data) => data.artistId === artist.id) &&
                    "text-white"
                  } text-sm font-semibold`}
                >
                  {artist.name}
                </h2>
                {/* <p clas sName="text-xs ring-1 rounded-full ring-green-400 px-1 font-semibold text-gray-600">{artist.genres[1]}</p> */}
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={() => {
            setOpenArtists(false);
          }}
        >
          <HiX />
        </div>
      </div>
    </div>
  );
}
