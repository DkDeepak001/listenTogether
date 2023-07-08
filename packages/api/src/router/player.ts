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
});
