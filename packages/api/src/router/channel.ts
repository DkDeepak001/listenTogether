import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
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
      await pusherServer.trigger(input.channelId, input.event, input.message);
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
});
