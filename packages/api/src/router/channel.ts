import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pusherServer } from "./utils";

export const channelRouter = createTRPCRouter({
  trigger: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await pusherServer.trigger(input.channelId, "connected", input.message);
      return;
    }),
});
