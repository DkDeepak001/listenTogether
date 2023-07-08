import { z } from "zod";

import { type User } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type TokenResponse } from "./types";

const redirect_url = "https://listen-together-nextjs.vercel.app/api/spotify";

export const userRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET,
            ).toString("base64"),
        },
        body: `grant_type=authorization_code&code=${
          input.code
        }&redirect_uri=${encodeURIComponent(redirect_url)}`,
      })
        .then((response) => response.json())
        .then((data): Promise<TokenResponse> => {
          return data as Promise<TokenResponse>;
        })
        .catch((error) => {
          console.log(error, "error from getAccessToken");
          throw error;
        });
    }),

  getRefreshToken: publicProcedure
    .input(
      z.object({
        refresh_token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET,
            ).toString("base64"),
        },
        body: `grant_type=refresh_token&refresh_token=${input.refresh_token}`,
      })
        .then((response) => response.json())
        .then((data): Promise<TokenResponse> => {
          return data as Promise<TokenResponse>;
        })
        .catch((error) => {
          throw error;
        });
    }),

  create: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        })
          .then((res) => res.json())
          .then(async (data: User): Promise<User> => {
            return await ctx.prisma.user.create({
              data: {
                country: data.country,
                display_name: data.display_name.toLowerCase(),
                email: data.email,
                refreshToken: input.refreshToken,
                href: data.href,
                images: "",
                product: data.product,
                type: data.type,
                uri: data.uri,
                spotifyId: data.id,
              },
            });
          });
      } catch (error) {
        console.log("error", error);
      }
    }),
  notification: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.requestLog.findMany({
      where: {
        requestTo: {
          id: ctx.userId,
        },
      },
      select: {
        id: true,
        status: true,
        requestFrom: {
          select: {
            display_name: true,
            images: true,
            spotifyId: true,
            id: true,
          },
        },
      },
    });
  }),
});
