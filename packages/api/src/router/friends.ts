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
          followers: {
            select: {
              followingId: true,
            },
          },
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
          isFollowing: user.followers.some((follower) => {
            return follower.followingId === ctx.userId;
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
  acceptFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
          select: {
            id: true,
            following: {
              select: {
                followersId: true,
              },
            },
          },
        });
        const isFollowing = user?.following.some((following) => {
          return following.followersId === input.friendId;
        });

        return await ctx.prisma.$transaction([
          ctx.prisma.requestLog.updateMany({
            where: {
              requestFromId: input.friendId,
              requestToId: ctx.userId,
            },
            data: {
              status: isFollowing ? "following" : "not following",
            },
          }),
          ctx.prisma.friends.create({
            data: {
              followers: {
                connect: {
                  id: ctx.userId,
                },
              },
              following: {
                connect: {
                  id: input.friendId,
                },
              },
            },
          }),
        ]);
      } catch (e) {
        console.log(e);
      }
    }),
  rejectFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.requestLog.deleteMany({
          where: {
            requestFromId: input.friendId,
            requestToId: ctx.userId,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),
  following: protectedProcedure
    .input(
      z.object({
        q: z.string().toLowerCase().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
          select: {
            following: {
              where: {
                followers: {
                  display_name: {
                    contains: input.q ?? undefined,
                  },
                },
              },
              select: {
                followers: {
                  select: {
                    id: true,
                    display_name: true,
                    images: true,
                    href: true,
                    spotifyId: true,
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),
});
