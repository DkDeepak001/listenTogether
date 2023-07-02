import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type User } from "./types";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + ctx.accessToken,
          },
        });
        const data = res.json().then((data): Promise<User> => {
            await ctx.prisma.user.create({
                data: {
                    
        });
        return data;
      } catch (error) {
        console.log("error", error);
      }
    }),
});
