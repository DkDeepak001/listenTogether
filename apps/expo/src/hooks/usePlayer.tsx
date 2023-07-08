import { useEffect } from "react";

import { type CurrentlyPlayingResponse } from "@acme/api/src/router/types";

import { api } from "~/utils/api";

const usePlayer = () => {
  const { data: player, refetch } = api.player.getPlayBackState.useQuery();

  useEffect(() => {
    if (!player || !player.item) return;

    setTimeout(() => {
      void refetch();
    }, Number(player.item?.duration_ms / 100));
  }, [player]);

  return { player } as {
    player: CurrentlyPlayingResponse;
  };
};

export default usePlayer;
