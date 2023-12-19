import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useArtists } from "@/store/artistsStore";
import { useOpenComponents } from "@/store/openComponentsStore";
import Image from "next/image";

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
  const [responseGpt, setResponseGpt] = useState<Data[]>([]);

  const { data: session, status } = useSession();
  const { artistsSelected } = useArtists();
  const { setOpenArtists } = useOpenComponents();

  const formik = useFormik({
    initialValues: {
      emotion: "",
    },
    onSubmit: async (values) => {
      const body = {
        emotion: values.emotion,
        artists: artistsSelected,
        accessToken: session?.accessToken,
      };
      const response = await axios.post("/api/gpt", body);
      setResponseGpt(response.data);
    },
  });

  const formatDuration = (durationMs: number) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className=" flex h-[700px] w-full flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={() => {
              setOpenArtists(true);
            }}
            className="flex items-center justify-center gap-1 rounded-xl bg-[#FF0000] p-4 font-bold"
          >
            Open artists
          </button>

          <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
            <label
              htmlFor="emotion"
              className="text-[12px] font-semibold text-white"
            >
              Emotion
            </label>
            <input
              className="rounded-md bg-transparent p-2 ring-1 ring-gray-700"
              placeholder=""
              type="text"
              name="emotion"
              onChange={formik.handleChange}
            />
            <button
              type="submit"
              className="rounded-lg bg-[#FF0000] px-5 py-2 text-[14px] font-medium"
            >
              Give me
            </button>
          </form>
        </div>
        <div className=" flex w-96 flex-col gap-2 p-4 backdrop-blur-[3px]">
          {responseGpt &&
            responseGpt.map((data) => (
              <div className="flex w-full gap-2 ">
                {data.tracks.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex w-full cursor-pointer items-center justify-between gap-2  rounded-md p-1 px-3 py-2 hover:bg-[#181818]"
                  >
                    <div className="flex gap-3 items-center">
                    <p className="font-medium text-xs text-gray-400">{index}</p>
                      {item.album.images[0] && (
                        <Image
                          className="rounded-md"
                          src={item.album.images[0].url}
                          width={40}
                          height={40}
                          alt="Song image"
                        />
                      )}
                      <div className="flex flex-col">
                        <p className="text-xs font-medium text-white">
                          {item.name}
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          {item.artists[0]?.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-normal text-gray-300">
                      {formatDuration(item.duration_ms)}
                    </p>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
