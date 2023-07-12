import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type CurrentlyPlayingResponse } from "./types";

export const playerRouter = createTRPCRouter({
  getPlayBackState: protectedProcedure.query(async ({ ctx }) => {
    return await fetch(`https://api.spotify.com/v1/me/player`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + ctx.accessToken,
      },
    })
      .then((res) => res.json())
      .then((data): Promise<CurrentlyPlayingResponse> => {
        return data as Promise<CurrentlyPlayingResponse>;
      })
      .catch((err) => {
        console.log(err, "err from player router");
      });
  }),
  pauseSong: protectedProcedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
        body: JSON.stringify({
          device_id: input.device_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from pause router");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from player router");
        });
    }),

  nextSong: protectedProcedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await fetch(`https://api.spotify.com/v1/me/player/next`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
        body: JSON.stringify({
          device_id: input.device_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from next router");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from player router");
        });
    }),
  prevSong: protectedProcedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await fetch(`https://api.spotify.com/v1/me/player/previous`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
        body: JSON.stringify({
          device_id: input.device_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from prev router");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from player router");
        });
    }),
  playSong: protectedProcedure
    .input(
      z.object({
        device_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
        body: JSON.stringify({
          device_id: input.device_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from pause router");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from player router");
        });
    }),
  seekSong: protectedProcedure
    .input(
      z.object({
        device_id: z.string(),
        position_ms: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await fetch(`https://api.spotify.com/v1/me/player/seek`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
        body: JSON.stringify({
          device_id: input.device_id,
          position_ms: input.position_ms,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "data from seek router");
          return data;
        })
        .catch((err) => {
          console.log(err, "err from player router");
        });
    }),
});
