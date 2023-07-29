import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pusherServer } from "./utils";

export const channelRouter = createTRPCRouter({
  trigger: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        message: z.string(),
        event: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("trigger", input);
      return await pusherServer.trigger(
        input.channelId,
        input.event,
        input.message,
      );
    }),
});
