import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useArtists } from "@/store/artistsStore";
import { useOpenComponents } from "@/store/openComponentsStore";
import { useGlobalIds } from "@/store/globalIdsStore";
import { motion } from "framer-motion";
import Playlist from "@/components/Playlist";
import { HiLightningBolt } from "react-icons/hi";

interface Images {
  height: number;
  url: string;
  width: number;
}

interface Artists {
  id: string;
  name: string;
}

interface Album {
  images: Images[];
}

interface Items {
  album: Album;
  name: string;
  artists: Artists[];
  id: string;
  duration_ms: number;
}

interface Tracks {
  href: string;
  items: Items[];
  limit: number;
  next: string;
}

interface Data {
  tracks: Tracks;
}

export default function Create() {
  const [tooltipIdArtist, setTooltipIdArtist] = useState("");

  const { data: session, status } = useSession();
  const { artistsSelected } = useArtists();
  const { setOpenArtists, setOpenPlaylist, openPlaylist, setOpenInputPrompt } =
    useOpenComponents();
  const { clickArtist } = useArtists();
  const { responseGpt, setResponseGpt } = useGlobalIds();
  console.log(responseGpt);

  const handleMouseEnter = (id: string) => {
    setTooltipIdArtist(id);
  };

  const handleMouseLeave = () => {
    setTooltipIdArtist("");
  };

  const formik = useFormik({
    initialValues: {
      prompt: "",
    },
    onSubmit: async (values) => {
      setOpenPlaylist(true);
      const body = {
        prompt: values.prompt,
        artists: artistsSelected,
        accessToken: session?.accessToken,
      };
      const response = await axios.post("/api/gpt", body);
      setResponseGpt(response.data);
    },
  });

  return (
    <div className="relative z-10 flex h-screen w-full w-screen flex-col items-center justify-center gap-4">
      {/* <img
        src="/box.png"
        alt="box"
        className="absolute h-[484px] w-[707px] opacity-100"
      /> */}
      {/* <div className="abso  lute z-10 h-[310px] w-[509px] rounded-[509px] bg-[#3FFC6A] blur-[200px]"></div> */}

      {/* ARTIST IMAGES */}
      <div className="z-50 flex h-[200px] w-full flex-col items-center  justify-center gap-[19px]">
        {/* {clickArtist.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className=" -gap-3 flex  w-64 items-center justify-center rounded-lg p-4">
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
                        className="h-[115px] w-[115px] rounded-full"
                        alt="Artist image"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )} */}

        {/* <button
          onClick={() => {
            setOpenArtists(true);
          }}
          className="z-50 h-[115px] w-[115px] flex items-center justify-center gap-1 rounded-full bg-gray-400 p-4 font-bold"
        >
         <HiOutlinePlus size={40}/>
        </button> */}
        {/* <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=" text-center"
        >
          Describe us how do you want <br /> your playlist
        </motion.h1> */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 2 }}
          className=" text-[15px] font-semibold text-gray-400"
        >
          We will create the best playlist according to your prompt!
        </motion.p> */}
        <h3 className="text-2xl font-semibold text-green-300">
          Create playlist
        </h3>

        <h2 className="text-center text-5xl font-bold">
          It's time to create <br />
          your playlist with AI
        </h2>

        <button
          onClick={() => {
            setOpenInputPrompt(true);
          }}
          className="flex items-center justify-center gap-1 rounded-lg p-1 px-2 font-semibold text-gray-400 ring-1 ring-gray-200 "
        >
          Describe <HiLightningBolt />{" "}
        </button>

        {/* INPUT GENERATE */}
        {/* <form className=" flex  gap-3" onSubmit={formik.handleSubmit}>
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex w-[400px] justify-between rounded-[6px] rounded-md bg-white px-[11px] py-[8px] "
          >
            <div className="flex items-center justify-center gap-[12px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.36228 0.570129C4.66209 -0.190048 5.73793 -0.19004 6.03774 0.570137L6.96681 2.92586C7.05833 3.15795 7.24209 3.34166 7.47417 3.43319L9.82985 4.36228C10.5901 4.66209 10.5901 5.73793 9.82985 6.03774L7.47417 6.96681C7.24209 7.05833 7.05833 7.24209 6.96681 7.47417L6.03774 9.82985C5.73793 10.5901 4.66209 10.5901 4.36228 9.82985L3.43319 7.47417C3.34166 7.24209 3.15795 7.05833 2.92586 6.96681L0.570129 6.03774C-0.190048 5.73793 -0.19004 4.66209 0.570137 4.36228L2.92586 3.43319C3.15795 3.34166 3.34166 3.15795 3.43319 2.92586L4.36228 0.570129Z"
                  fill="#808080"
                />
                <path
                  d="M11.9399 9.11326C12.1047 8.69558 12.6959 8.69558 12.8607 9.11326L13.5812 10.9402C13.6315 11.0678 13.7324 11.1688 13.86 11.2191L15.687 11.9396C16.1047 12.1044 16.1047 12.6956 15.687 12.8604L13.86 13.5809C13.7324 13.6312 13.6315 13.7321 13.5812 13.8597L12.8607 15.6867C12.6959 16.1044 12.1047 16.1044 11.9399 15.6867L11.2194 13.8597C11.1691 13.7321 11.0681 13.6312 10.9405 13.5809L9.11355 12.8604C8.69587 12.6956 8.69587 12.1044 9.11355 11.9396L10.9405 11.2191C11.0681 11.1688 11.1691 11.0678 11.2194 10.9402L11.9399 9.11326Z"
                  fill="#808080"
                />
              </svg>
              <input
                className="w-[390px]"
                placeholder="Describe us how to want your playlist"
                type="text"
                name="prompt"
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: [null, 1, 1.1] }}
            transition={{ duration: 0.2 }}
            type="submit"
            className="button-generate-ai"
          >
            Generate with AI
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M10.149 10.8386L8.67363 13.9386C8.64572 13.9972 8.60396 14.0482 8.55196 14.087C8.49996 14.1259 8.43928 14.1515 8.37516 14.1617C8.31104 14.1719 8.24541 14.1663 8.18393 14.1454C8.12245 14.1246 8.06698 14.089 8.0223 14.0419L5.66096 11.5493C5.59771 11.4826 5.51343 11.4398 5.4223 11.4279L2.0183 10.9826C1.95391 10.9742 1.89254 10.9503 1.83947 10.9129C1.7864 10.8755 1.74323 10.8257 1.7137 10.7679C1.68417 10.7101 1.66915 10.6459 1.66995 10.581C1.67075 10.5161 1.68734 10.4524 1.71829 10.3953L3.35963 7.37928C3.40349 7.2987 3.41832 7.20549 3.40163 7.11528L2.77296 3.73994C2.76102 3.67605 2.76483 3.61022 2.78406 3.54813C2.80329 3.48605 2.83736 3.42959 2.88331 3.38363C2.92927 3.33767 2.98574 3.3036 3.04782 3.28438C3.10991 3.26515 3.17574 3.26134 3.23963 3.27328L6.6143 3.90194C6.70472 3.91879 6.79819 3.90396 6.87896 3.85994L9.89429 2.21994C9.9513 2.18887 10.015 2.17213 10.0799 2.17119C10.1448 2.17024 10.209 2.18511 10.2669 2.21451C10.3248 2.24391 10.3747 2.28696 10.4122 2.33995C10.4497 2.39293 10.4738 2.45425 10.4823 2.51861L10.9276 5.92328C10.9396 6.01417 10.9824 6.09819 11.049 6.16128L13.5416 8.52261C13.5887 8.56729 13.6242 8.62277 13.6451 8.68424C13.666 8.74572 13.6716 8.81135 13.6614 8.87547C13.6512 8.93959 13.6256 9.00027 13.5867 9.05227C13.5479 9.10427 13.4969 9.14603 13.4383 9.17394L10.3383 10.6493C10.2553 10.6888 10.1884 10.7556 10.149 10.8386ZM10.6803 12.1233L11.623 11.1806L14.4516 14.0086L13.5083 14.9519L10.6803 12.1233Z"
                fill="#F7F3DC"
              />
            </svg>
          </motion.button>
        </form> */}
      </div>
      {openPlaylist && <Playlist />}
    </div>
  );
}
