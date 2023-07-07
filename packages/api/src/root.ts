import { friendsRouter } from "./router/friends";
import { spotifyRouter } from "./router/spotify";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  user: userRouter,
  friend: friendsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
