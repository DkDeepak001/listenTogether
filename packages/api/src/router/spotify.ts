import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type User } from "./types";

export const spotifyRouter = createTRPCRouter({
  getUser: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + ctx.accessToken,
        },
      });
      const data = res.json().then((data): Promise<User> => {
        console.log(data, "data from spotify route r");
        return data;
      });
      return data;
    } catch (error) {
      console.log("error", error);
    }
  }),
});
