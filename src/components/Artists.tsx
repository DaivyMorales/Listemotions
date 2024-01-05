import { useEffect, useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useOpenComponents } from "@/store/openComponentsStore";
import { useArtists } from "@/store/artistsStore";
import { HiX } from "react-icons/hi";
import { HiOutlineX } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";

export interface ArtistImage {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  id: string;
  followers: {
    href: null;
    total: number;
  };
  genres: string[];
  name: string;
  uri: string;
  images: ArtistImage[];
}

export interface Data {
  artistId: string;
  artist: Artist;
}

export default function Artists() {
  const [myFavoriteArtists, setMyFavoriteArtists] = useState([]);
  const [myArtists, setMyArtists] = useState<string[]>([]);
  const [onHover, setOnHover] = useState(false);
  const [idArtistHover, setIdArtistHover] = useState("");
  const [tooltipIdArtist, setTooltipIdArtist] = useState("");
  const [inputArtistValue, setInputArtistValue] = useState("");
  const [inputSearchValue, setInputSearchValue] = useState("");

  // const [clickArtist, setClickArtist] = useState<Data[]>([]);

  const { data: session } = useSession();
  const { openArtists, setOpenArtists } = useOpenComponents();
  const { setArtistsSelected, artistsSelected, clickArtist, setClickArtist } =
    useArtists();
  // console.log(clickArtist);
  // console.log(inputSearchValue)

  const headers = {
    Authorization: `Bearer ${session?.accessToken}`,
  };

  const bringArtists = async () => {
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

  const handleChangeArtistInput = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setInputSearchValue(value);

    const formattedArtist = encodeURIComponent(value).replace(/%20/g, "%2520");
    setInputArtistValue(formattedArtist);

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=remaster%2520artist%3A${inputArtistValue}&type=artist&market=ES`,
        { headers },
      );

      setTimeout(() => {
        console.log(response);
        setMyFavoriteArtists(response.data.artists.items);
      }, 1000);
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  const handleClearInput = () => {
    setInputSearchValue("");
    setInputArtistValue("");
  };

  return (
    <div className="absolute z-50 flex h-[1000px] w-full flex-col items-start justify-start gap-3 bg-[#1f1f1f] ">
      <div className="relative mt-10 flex w-full  flex-col items-center justify-center gap-4">
        {/* <div className="l absolute -top-[200px] h-[200px] w-full bg-[#FF0000] blur-[90px] "></div> */}
        <div className="z-10 flex w-[1000px]  items-end justify-center gap-2">
          <h1 className="text-left text-4xl">
            Who artist do you want to include?
          </h1>
          {clickArtist.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className=" -gap-3 flex  w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-700/50 p-4 backdrop-blur-[3px]">
                {clickArtist &&
                  clickArtist.map((item) => (
                    <div
                      onMouseEnter={() => handleMouseEnter(item.artist.id)}
                      onMouseLeave={handleMouseLeave}
                      className="relative cursor-pointer hover:brightness-125"
                      key={item.artistId}
                    >
                      {tooltipIdArtist === item.artist.id && (
                        <div className="absolute -left-1 -top-7 z-10 inline-block w-fit rounded-lg bg-black px-2 py-1 text-center shadow-sm transition-opacity duration-300">
                          <p className="text-xs font-medium text-gray-300">
                            {item.artist.name}
                          </p>
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
        </div>

        {/* INPUT SEARCH */}
        <div className="flex w-[300px] items-center justify-start gap-2 rounded-lg bg-white p-2 px-3 shadow-lg shadow-black ">
          <HiSearch color="#ACACAC" />
          <input
            type="text"
            className="w-full bg-transparent text-[14px] font-medium"
            placeholder="Search any artist"
            onChange={handleChangeArtistInput}
            value={inputSearchValue}
          />
          {inputSearchValue.length > 1 && (
            <div onClick={handleClearInput}>
              <HiOutlineX color="black" size={19} />
            </div>
          )}
        </div>

        <div className="z-50 grid w-[700px] grid-cols-2 gap-3">
          {
            myFavoriteArtists.map((artist: Artist) => (
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
                  clickArtist.some((data) => data.artistId === artist.id)
                    ? "ring-white"
                    : "ring-[#1F1F1F]"
                } relative flex cursor-pointer  items-center justify-start gap-4 rounded-[12px] bg-[#1F1F1F]  py-[9px] pl-[22px] pr-[41px] shadow-lg ring-2`}
                onClick={() => {
                  setMyArtists([...myArtists, artist.name]);

                  if (
                    !clickArtist.some((data) => data.artistId === artist.id)
                  ) {
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
                  <div className="absolute -top-2 left-[332px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white ">
                    <HiCheck color="black" size={12} />
                  </div>
                ) : (
                  <></>
                )}
                {artist.images[2] && (
                  <img
                    src={artist.images[2].url}
                    alt="Artist image"
                    className="h-[115px] w-[115px] rounded-full"
                  />
                )}
                <div className="flex flex-col items-start justify-center gap-1">
                  <h2
                    className={`text-white ${
                      clickArtist.some((data) => data.artistId === artist.id) &&
                      "text-white"
                    } text-[23px] font-semibold`}
                  >
                    {artist.name}
                  </h2>
                  <p className="text-[10px] font-semibold text-[#A3A3A3]">
                    {artist.followers.total.toLocaleString()} followers
                  </p>
                  {artist.genres[1] && (
                    <p className="rounded-[12px] bg-[#404040] px-[6px] py-[4px] text-[10px] font-medium text-gray-100 ">
                      {artist.genres[1]}
                    </p>
                  )}
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
