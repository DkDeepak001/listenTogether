import { TRPCError } from "@trpc/server";
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
        const data = res.json().then(async (data: User): Promise<User> => {
          await ctx.prisma.user.create({
            data: {
              country: data.country,
              display_name: data.display_name,
              email: data.email,
              code: ctx.code,
              refreshToken: ctx.refreshToken,
              href: data.href,
              images: data.images[0] ? data.images[0].url : "",
              product: data.product,
              type: data.type,
              uri: data.uri,
              spotifyId: data.id,
            },
          });
          return data;
        });
        return data;
      } catch (error) {
        console.log("error", error);
      }
    }),
});
