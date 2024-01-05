import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const openai = new OpenAI();

export default async function Gpt(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { prompt, artists, accessToken },
  } = req;

  try {
    if (!prompt) {
      res.status(400).json({ message: "You have not provided the prompt!" });
      return;
    }

    if (!accessToken) {
      res
        .status(403)
        .json({ message: "You have not provided the access token!" });
      return;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate a playlist with 30 song with the next prompt: "${prompt}", with the next artists: ${artists.join(
            ",",
          )}. Please give the song name and the main artist. *IMPORTANT* Don't repeat songs, for example there's a song called Eazt, I don't want repeat it twice plz. Omit any additional information and provide only the recommended playlist. Take care with the artist and perform a deep search. Exclude numbers and characters. For each song, use a new line. If there is any song or name with ñ for example: (Enseñame a olvidar, change it for Ensename a olvidar (ñ -> n)), please omit them. Ommit this in any artist or song: (á, é, í, ó, ú). If there is a song like (My song (any words)) plz ommit the parentheses like (My song), I just need the song name nothing else. If you don't found more songs, please put other artists songs but that artist are similar with the artist with I asked, for example you don't found more songs about "Drake" you can to put songs by "The Weeknd" because these artist are listen both in many occations `,
        },
      ],
      model: "gpt-4-1106-preview",
      temperature: 0,
    });

    const result = completion.choices[0]?.message.content;

    if (!result) {
      throw new Error("Result is undefined or null");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const trackAndArtist = result.split("\n");

    const songs = await Promise.all(
      trackAndArtist.map(async (song) => {
        const [track = "", artist = ""] = song.split(" - ");

        // Replace regular spaces with %2520
        const formattedTrack = encodeURIComponent(track).replace(
          /%20/g,
          "%2520",
        );

        // Replace regular spaces with %2520
        const formattedArtist = encodeURIComponent(artist).replace(
          /%20/g,
          "%2520",
        );

        // Spotify API request
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=remaster%2520track%3A${formattedTrack}%2520artist%3A${formattedArtist}&type=track&market=ES&limit=1`,
            { headers },
          );

          return response.data;
        } catch (error) {
          console.error(
            `Error fetching Spotify data for ${formattedTrack} - ${formattedArtist}`,
            error,
          );
          return {
            track: formattedTrack,
            artist: formattedArtist,
            data: null,
          };
        }
      }),
    );

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
