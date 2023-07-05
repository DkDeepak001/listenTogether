import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type TopArtistsData, type TrackData } from "./types";

export const spotifyRouter = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    try {
      return ctx.prisma.user.findUnique({
        where: {
          id: ctx.userId,
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Error("error in getUser");
    }
  }),
  topTracks: protectedProcedure.query(async ({ ctx, input }) => {
    return await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=10&offset=1`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      },
    )
      .then((res) => res.json())
      .then((data): Promise<TrackData> => {
        return data as Promise<TrackData>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),
  topArtists: protectedProcedure.query(async ({ ctx, input }) => {
    return await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=10&offset=1`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      },
    )
      .then((res) => res.json())
      .then((data): Promise<TopArtistsData> => {
        return data as Promise<TopArtistsData>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),
});
