import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type User } from "./types";

export const spotifyRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log("getUser called", input.accessToken);
        return await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        })
          .then((res) => res.json())
          .then((data): Promise<User> => {
            console.log(data, "data from spotify route r");
            return data as Promise<User>;
          });
      } catch (error) {
        console.log("error", error);
        throw new Error("error in getUser");
      }
    }),
  top: publicProcedure
    .input(
      z.object({
        type: z.enum(["artist", "tracks"]),
        accessToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("top called", input.type, input.accessToken);

      return await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=1&offset=1",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from spotify route r");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from spotify route r");
        });
    }),
});
