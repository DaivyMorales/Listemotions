import { useEffect, useState } from "react";
import { IoMdMusicalNotes } from "react-icons/io";
import { useOpenComponents } from "@/store/openComponentsStore";
import { FaSpotify } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useGlobalIds } from "@/store/globalIdsStore";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { HiOutlineCheck } from "react-icons/hi";

export default function NamingPlaylist() {
  const { data: session } = useSession();
  const router = useRouter();

  const [responsePlaylistSpotify, setResponsePlaylistSpotify] = useState(0);

  const { setOpenNamingPlaylist, setOpenPlaylist } = useOpenComponents();
  const { playlistId, setPlaylistId, responseGpt } = useGlobalIds();

  const playlistsArray = responseGpt.flatMap((response) =>
    response.tracks.items.map((item) => item.uri),
  );

  const formattedPlaylistsArray = playlistsArray.map((uri) =>
    encodeURIComponent(uri),
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const headers = {
    Authorization: `Bearer ${session?.accessToken}`,
  };

  const formik = useFormik({
    initialValues: {
      name: "My Playlist",
      description: "This playlist was done with Listemotions",
      public: false,
    },
    onSubmit: async (values) => {
      if (session) {
        try {
          const responsePlaylist = await axios.post(
            `https://api.spotify.com/v1/users/${session.user.id}/playlists`,
            values,
            {
              headers,
            },
          );
          console.log("responsePlaylist", responsePlaylist.status);
          setPlaylistId(responsePlaylist.data.id);

          // if (responsePlaylist.status === 201) {
          //   setOpenNamingPlaylist(false);
          //   setOpenPlaylist(false);
          //   router.push("/playlists");
          // }
        } catch (error) {
          console.log(error);
        }
      }
    },
  });

  const addTracksToPlaylist = async () => {
    const data = {
      uris: playlistsArray,
      position: 0,
    };

    const response2 = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${formattedPlaylistsArray.join(
        ",",
      )}`,
      data,
      {
        headers,
      },
    );

    console.log(response2.status);
    setResponsePlaylistSpotify(response2.status);
  };

  useEffect(() => {
    if (playlistId) {
      addTracksToPlaylist();
    }
  }, [playlistId]);

  return (
    <div
      className="absolute z-50 flex h-screen w-full items-center justify-center backdrop-brightness-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpenNamingPlaylist(false);
        }
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-end justify-center gap-4 rounded-lg bg-[#282828] p-5"
      >
        <div className="w-full">
          <h3 className="text-2xl font-bold">Edit playlist</h3>
        </div>
        <div className="flex gap-6">
          <div className="flex h-[167px] w-[167px] cursor-pointer items-center justify-center rounded-[12px] bg-[#282828] shadow-2xl">
            <IoMdMusicalNotes size={70} color="#4B4B4B" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-md bg-[#3E3E3E] p-2 shadow-md">
              <input
                className="w-[250px] text-white "
                placeholder="Describe how to want you playlist"
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </div>

            <textarea
              name="description"
              cols={10}
              rows={5}
              className="rounded-md bg-[#3E3E3E] p-2 shadow-md"
              placeholder="Add an optional description"
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.4 }}
          whileHover={{ scale: 1.1 }}
          type="submit"
          className="button-export-spotify flex items-center justify-center gap-2 shadow-lg"
        >
          {responsePlaylistSpotify === 201 ? <HiOutlineCheck /> : "Create"}
        </motion.button>
      </form>
    </div>
  );
}
