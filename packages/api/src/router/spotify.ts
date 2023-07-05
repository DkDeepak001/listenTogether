import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  type PlaylistResponse,
  type TopArtistsResponse,
  type TrackResponse,
} from "./types";

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
  topTracks: protectedProcedure.query(async ({ ctx }) => {
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
      .then((data): Promise<TrackResponse> => {
        return data as Promise<TrackResponse>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),
  topArtists: protectedProcedure.query(async ({ ctx }) => {
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
      .then((data): Promise<TopArtistsResponse> => {
        return data as Promise<TopArtistsResponse>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),

  getUserPlaylists: protectedProcedure.query(async ({ ctx }) => {
    return await fetch(
      `https://api.spotify.com/v1/users/${ctx.session.user.spotifyId}/playlists`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      },
    )
      .then((res) => res.json())
      .then((data): Promise<PlaylistResponse> => {
        return data as Promise<PlaylistResponse>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),
});
