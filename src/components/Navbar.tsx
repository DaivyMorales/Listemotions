import { useOpenComponents } from "@/store/openComponentsStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Artists from "./Artists";
import Playlist from "./Playlist";
import NamingPlaylist from "./NamingPlaylist";
import InputPrompt from "./InputPrompt";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa";

interface NavbarProps {
  children: React.ReactNode;
}
export default function Navbar({ children }: NavbarProps) {
  const { data: session } = useSession();
  const { openArtists, openPlaylist, openNamingPlaylist, openInputPrompt } =
    useOpenComponents();
  return (
    <div className="relative flex flex-col min-h-screen ">
      {openArtists && <Artists />}
      {openInputPrompt && <InputPrompt />}

      {openNamingPlaylist && <NamingPlaylist />}

      <header className="hidden flex h-20 items-center justify-between bg-white px-8 dark:bg-gray-800">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          {/* <MusicIcon className="h-6 w-6" /> */}
          <span className="">AI-Spotify</span>
        </Link>
        <nav className=" gap-4 md:flex">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            How it works
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Testimonials
          </Link>
        </nav>
        {/* <Button className="hidden md:flex">Create Your Playlist Now</Button> */}

        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FF0000] px-5 py-3 text-[14px] font-medium shadow-lg"
          // onClick={() => signIn("spotify", { callbackUrl: "/playlists" })}
        >
          Sign with Spotify <FaSpotify size={17} />
        </button>
      </header>
      {children}
    </div>
  );
}
