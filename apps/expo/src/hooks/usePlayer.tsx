import { useEffect, useState } from "react";

import { type CurrentlyPlayingResponse } from "@acme/api/src/router/types";

import { api } from "~/utils/api";

const usePlayer = () => {
  const { data: player, refetch } = api.player.getPlayBackState.useQuery();
  const [playPercent, setPlayPercent] = useState<number>(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (player?.currently_playing_type === "ad") {
      timeoutId = setTimeout(() => {
        void refetch();
      }, 3000);
    }
    if (!player || !player.item) return;

    timeoutId = setTimeout(() => {
      setPlayPercent(
        Math.floor((player?.progress_ms / player?.item?.duration_ms) * 100),
      );
      void refetch();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [player]);

  console.log(playPercent, "playPercent=====================");

  return { player, playPercent } as {
    player: CurrentlyPlayingResponse;
    playPercent: number;
  };
};

export default usePlayer;
