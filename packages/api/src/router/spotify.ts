import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type TopArtistsData, type TrackData, type User } from "./types";

export const spotifyRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        })
          .then((res) => res.json())
          .then((data): Promise<User> => {
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
        type: z.enum(["artists", "tracks"]),
        accessToken: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await fetch(
        `https://api.spotify.com/v1/me/top/${input.type}?limit=10&offset=1`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        },
      )
        .then((res) => res.json())
        .then((data): Promise<TrackData | TopArtistsData> => {
          if (input.type === "artist") {
            return data as Promise<TopArtistsData>;
          } else {
            return data as Promise<TrackData>;
          }
        })
        .catch((err) => {
          console.log(err, "err from spotify route r");
        });
    }),
});
