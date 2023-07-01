import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type User } from "./types";

export const spotifyRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        accessToken: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        });
        const data = res.json().then((data): Promise<User> => {
          return data;
        });

        return data;
      } catch (error) {
        console.log("error", error);
      }
    }),
});
