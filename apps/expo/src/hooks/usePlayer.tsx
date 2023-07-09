import { useEffect } from "react";

import { type CurrentlyPlayingResponse } from "@acme/api/src/router/types";

import { api } from "~/utils/api";

const usePlayer = () => {
  const { data: player, refetch } = api.player.getPlayBackState.useQuery();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (player?.currently_playing_type === "ad") {
      timeoutId = setTimeout(() => {
        void refetch();
      }, 3000);
    }
    if (!player || !player.item) return;

    timeoutId = setTimeout(() => {
      void refetch();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [player]);

  return { player } as {
    player: CurrentlyPlayingResponse;
  };
};

export default usePlayer;
