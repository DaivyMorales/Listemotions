import { type AppType } from "next/dist/shared/lib/utils";
import { Kanit } from 'next/font/google'
import { SessionProvider, useSession } from "next-auth/react"
import { type Session } from "next-auth";


// // const inter = Work_Sans({ subsets: ['latin'] })
const inter = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <main className={inter.className}>
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
      </main>
    </SessionProvider>
  );
};

export default MyApp;
