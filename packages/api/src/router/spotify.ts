import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  type Album,
  type AlbumResponse,
  type Artist,
  type Playlist,
  type PlaylistResponse,
  type TopArtistsResponse,
  type Track,
  type TrackResponse,
} from "./types";

export const spotifyRouter = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    try {
      return ctx.prisma.user.findUnique({
        where: {
          id: ctx.userId,
        },
        select: {
          id: true,
          display_name: true,
          images: true,
          spotifyId: true,
          refreshToken: true,
          product: true,
          following: {
            select: {
              followersId: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("error", error);
      throw new Error("error in getUser");
    }
  }),
  topTracks: protectedProcedure.query(async ({ ctx }) => {
    return await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=50`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + ctx.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data): Promise<TrackResponse> => {
        return data as Promise<TrackResponse>;
      })
      .catch((err) => {
        console.log(err, "err from spotify router");
      });
  }),
  topArtists: protectedProcedure.query(async ({ ctx }) => {
    return await fetch(`https://api.spotify.com/v1/me/top/artists`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + ctx.accessToken,
      },
    })
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

  search: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await fetch(
        `https://api.spotify.com/v1/search/?q=${input.q}&type=album,playlist,track,artist&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + ctx.accessToken,
          },
        },
      )
        .then((res) => res.json())
        .then(
          (
            data,
          ): Promise<{
            artists: TopArtistsResponse;
            tracks: TrackResponse;
            playlists: PlaylistResponse;
            albums: AlbumResponse;
          }> => {
            return data as Promise<{
              artists: TopArtistsResponse;
              tracks: TrackResponse;
              playlists: PlaylistResponse;
              albums: AlbumResponse;
            }>;
          },
        )
        .catch((err) => {
          console.log(err, "err from spotify router");
        });
    }),

  artist: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const artist = await fetch(
        `https://api.spotify.com/v1/artists/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + ctx.accessToken,
          },
        },
      )
        .then((res) => res.json())
        .then((data): Promise<Artist> => {
          return data as Promise<Artist>;
        })
        .catch((err) => {
          console.log(err, "err from spotify router");
        });
      const topTracks = await fetch(
        `https://api.spotify.com/v1/artists/${input.id}/top-tracks?market=ES`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + ctx.accessToken,
          },
        },
      )
        .then((res) => res.json())
        .then((data): Promise<{ tracks: Track[] }> => {
          return data as Promise<{ tracks: Track[] }>;
        })
        .catch((err) => {
          console.log(err, "err from spotify router");
        });
      return { artist, topTracks };
    }),
  playlist: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await fetch(`https://api.spotify.com/v1/playlists/${input.id}`, {
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      })
        .then((res) => res.json())
        .then((data): Promise<Playlist> => {
          return data as Promise<Playlist>;
        })

        .catch((err) => {
          console.log(err, "err from spotify router");
        });
    }),
  album: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await fetch(`https://api.spotify.com/v1/albums/${input.id}`, {
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      })
        .then((res) => res.json())
        .then((data): Promise<Album> => {
          return data as Promise<Album>;
        })
        .catch((err) => {
          console.log(err, "err from spotify router");
        });
    }),
});
