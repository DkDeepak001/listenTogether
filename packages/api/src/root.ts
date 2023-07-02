import { spotifyRouter } from "./router/spotify";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
