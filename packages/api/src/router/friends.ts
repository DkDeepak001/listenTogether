import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendsRouter = createTRPCRouter({
  searchFriend: protectedProcedure
    .input(
      z.object({
        username: z.string().toLowerCase(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findMany({
        where: {
          display_name: {
            contains: input.username,
          },
          id: {
            not: ctx.userId,
          },
        },
        select: {
          id: true,
          display_name: true,
          images: true,
          href: true,
          spotifyId: true,
        },
      });
      const hasRequest = await ctx.prisma.requestLog.findMany({
        where: {
          requestFromId: ctx.userId,
        },
        select: {
          requestToId: true,
        },
      });

      const result = user.map((user) => {
        return {
          ...user,
          isReqestSent: hasRequest.some((request) => {
            return request.requestToId === user.id;
          }),
        };
      });
      return result;
    }),

  addFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.requestLog.create({
          data: {
            status: "pending",
            requestFrom: {
              connect: {
                id: ctx.userId,
              },
            },
            requestTo: {
              connect: {
                id: input.friendId,
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),
  cancelFriendRequest: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.requestLog.deleteMany({
          where: {
            requestFromId: ctx.userId,
            requestToId: input.friendId,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),
});
