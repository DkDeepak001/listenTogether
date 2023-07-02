import { z } from "zod";

import { type User } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { type AccessTokenInfo, type TokenData } from "./types";

const redirect_url = "https://listen-together-nextjs.vercel.app/api/spotify";

export const userRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("getAccessToken called", input.code);

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
        .then((data): Promise<AccessTokenInfo> => {
          console.log(data, "data from getAccessToken");
          return data as Promise<AccessTokenInfo>;
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
      console.log("getRefreshToken called", input.refresh_token);

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
        .then((data): Promise<TokenData> => {
          console.log(data, "data from getRefreshToken");
          return data as Promise<TokenData>;
        })
        .catch((error) => {
          console.log(error, "error from getRefreshToken");
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
        console.log("create called accessToken", input.accessToken);
        console.log("create called refreshToken", input.refreshToken);
        return await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + input.accessToken,
          },
        })
          .then((res) => res.json())
          .then(async (data: User): Promise<User> => {
            console.log(data, "data________________");
            await ctx.prisma.user.create({
              data: {
                country: data.country,
                display_name: data.display_name,
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
            return data;
          });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
