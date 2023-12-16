import { type AppType } from "next/dist/shared/lib/utils";
import { Inter } from 'next/font/google'
import { SessionProvider, useSession } from "next-auth/react"
import { type Session } from "next-auth";


const inter = Inter({ subsets: ['latin'] })

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default MyApp;
