import React from "react";
import { useGlobalIds } from "@/store/globalIdsStore";
import Image from "next/image";
import { IoMdMusicalNotes } from "react-icons/io";
import { useOpenComponents } from "@/store/openComponentsStore";
import { FaSpotify } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Playlist() {
  const { responseGpt, setResponseGpt } = useGlobalIds();

  const formatDuration = (durationMs: number) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const { setOpenNamingPlaylist } = useOpenComponents();

  const { data: session } = useSession();
  console.log(session?.accessToken);

  return (
    <>
      {responseGpt.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 pb-5 ">
          <div className="z-10 flex flex-col gap-4 ">
            {/* <div className="z-50 flex w-[677px] items-center  justify-start gap-5 ">
              <div
                onClick={() => {
                  setOpenNamingPlaylist(true);
                }}
                className="flex h-[167px] w-[167px] cursor-pointer items-center justify-center rounded-[12px] bg-[#282828] shadow-2xl"
              >
                <IoMdMusicalNotes size={70} color="#4B4B4B" />
              </div>
              <div className="flex flex-col gap-1">
                <h2
                  onClick={() => {
                    setOpenNamingPlaylist(true);
                  }}
                  className="cursor-pointer text-[70px] font-black"
                >
                  My playlist
                </h2>
                <p
                  onClick={() => {
                    setOpenNamingPlaylist(true);
                  }}
                  className="font-regular cursor-pointer text-[13px]"
                >
                  This playlist was done with Listemotions
                </p>
              </div>
            </div> */}

            <div className=" w-[700px] overflow-x-auto bg-white p-5 ">
              <table className="p w-[638px] w-full rounded-lg text-left  text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="hidden bg-gray-50 text-xs uppercase text-gray-700  dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="">#</th>

                    <th className="">Image</th>

                    <th className="">Title</th>

                    <th className="">Album</th>

                    <th className="">Duration</th>
                  </tr>
                </thead>
                {responseGpt &&
                  responseGpt.map((data, index) => (
                    <tbody className="w-full" key={data.tracks.href}>
                      {data.tracks.items.map((item) => (
                        <tr
                          key={item.id}
                          className="w-full rounded-lg  bg-white hover:bg-gray-200 "
                        >
                          <th className=" p-5 text-xs font-medium text-black">
                            {index + 1}
                          </th>
                          <td className="">
                            {item.album.images[0] && (
                              <Image
                                className="rounded-md"
                                src={item.album.images[0].url}
                                width={49}
                                height={49}
                                alt="Song image"
                                priority={true}
                              />
                            )}
                          </td>
                          <td className="-gap-3 font-regular flex flex-col items-start  justify-center p-3 text-[10px] text-black">
                            <p className=" text-[14px] font-medium text-black">
                              {item.name}
                            </p>
                            <p className="text-[12px] font-semibold text-gray-600">
                              {item.artists[0]?.name}
                            </p>
                          </td>
                          <td className=" p-5">
                            <p className="font-regular text-[12px] text-black">
                              {item.album.name}
                            </p>
                          </td>
                          <td className=" font-regular p-5 text-[12px] text-black">
                            {formatDuration(item.duration_ms)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
              </table>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.4 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setOpenNamingPlaylist(true);
            }}
            className="button-export-spotify flex items-center justify-center gap-2 shadow-lg"
          >
            Listen in Spotify <FaSpotify size={17} />
          </motion.button>
        </div>
      )}
    </>
  );
}
