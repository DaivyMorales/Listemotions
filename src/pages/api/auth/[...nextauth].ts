import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { env } from "@/env";

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string
      name: string,
      email: string,
      image: string
    }
  }
}

async function refreshAccessToken(token: any) {
  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", token.refreshToken)
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
    },
    body: params
  })
  const data = await response.json()
  return {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? token.refreshToken,
    accessTokenExpires: Date.now() + data.expires_in * 1000
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email%20playlist-modify-public%20playlist-modify-private%20user-follow-read",

    }),

  ],

  callbacks: {
    async jwt({ token, account }: { token: any, account: any }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
        return token
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires * 1000) {
        return token
      }

      // access token has expired
      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any, token: any }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub
      return session;
    }
  },

  pages: {
    signIn: "/"
  }

}

export default NextAuth(authOptions)