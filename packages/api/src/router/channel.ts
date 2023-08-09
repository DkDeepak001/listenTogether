import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Track } from "./types";
import { pusherServer } from "./utils";

export const channelRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        message: z.string(),
        event: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await pusherServer.trigger(
        `public-${input.channelId}`,
        input.event,
        input.message,
      );
      return await ctx.prisma.chatMessage.create({
        data: {
          message: input.message,
          chatChannel: {
            connect: {
              id: input.channelId,
            },
          },
          sender: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });
    }),
  allMessages: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.chatChannel.findUnique({
        where: {
          id: input.channelId,
        },
        select: {
          id: true,
          createdAt: true,
          chatMessage: {
            select: {
              id: true,
              message: true,
              sender: {
                select: {
                  id: true,
                  display_name: true,
                },
              },
            },
          },
        },
      });
    }),
  sendListening: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        isListening: z.boolean(),
        currentSound: z.any(),
        currentTrack: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await pusherServer.trigger(`public-${input.channelId}`, "listening", {
        isListening: input.isListening,
        currentTrack: input.currentTrack ?? null,
        currentSound: input.currentSound ?? null,
      });
      return true;
    }),

  getCurrentListening: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await pusherServer.trigger(
        `public-${input.channelId}`,
        "getListening",
        {},
      );
    }),
});
