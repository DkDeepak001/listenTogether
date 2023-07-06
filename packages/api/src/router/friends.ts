import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendsRouter = createTRPCRouter({
  searchFriend: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          display_name: {
            contains: input.username,
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
    }),
});
