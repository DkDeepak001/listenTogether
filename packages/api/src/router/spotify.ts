import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const spotifyRouter = createTRPCRouter({
  getPlaylist: publicProcedure
    .input(
      z.object({
        accessToken: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      return await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + input.accessToken,
        },
      });
    }),
});
