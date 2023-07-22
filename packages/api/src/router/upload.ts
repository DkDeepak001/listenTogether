import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const uploadRouter = createTRPCRouter({
  uploadSong: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("uploadSong", input);
      return;
    }),
});
