import { friendsRouter } from "./router/friends";
import { playerRouter } from "./router/player";
import { spotifyRouter } from "./router/spotify";
import { uploadRouter } from "./router/upload";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  user: userRouter,
  friend: friendsRouter,
  player: playerRouter,
  upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
