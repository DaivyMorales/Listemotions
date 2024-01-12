import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import "next-auth";
import { FaSpotify } from "react-icons/fa";
import { HiLightBulb, HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Listemotions</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative flex min-h-screen  w-full flex-col items-center justify-center">
        <div className="absolute -top-[700px] left-[160px] z-10 h-[1000px] w-[1000px] rounded-full bg-[#FF0000] p-4 opacity-20 blur-[90px]"></div>
        <div className="z-50 flex w-[900px] flex-col items-center justify-center gap-6">
          <h2 className="text-4xl font-bold text-[#FF0000]">Listemotions</h2>
          <div className=" flex flex-col items-center justify-center gap-2">
            {" "}
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 2, y: 0 }}
              transition={{ duration: 1 }}
              className="font-bold"
            >
              Perfect Playlists, Elevate Your Listening Experience
            </motion.h1>
            <p className="flex items-center gap-1 font-medium text-gray-300">
              <span>Make playlists for</span>
              <FaSpotify color="white" />
              <span className="font-bold text-white">Spotify</span>{" "}
              <span>powered by</span>
              <span className="flex items-center text-white">
                {" "}
                <HiSparkles />
                <span className="font-bold"> AI</span>
              </span>
            </p>
          </div>

          {status === "unauthenticated" ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF0000] px-5 py-3 text-[14px] font-medium shadow-lg"
              // onClick={() => signIn("spotify", { callbackUrl: "/playlists" })}
            >
              Log in with Spotify <FaSpotify size={17} />
            </motion.button>
          ) : (
            <div>
              <button onClick={() => signOut()}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
