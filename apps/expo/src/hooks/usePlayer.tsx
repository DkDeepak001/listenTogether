import { useEffect, useState } from "react";

import { type CurrentlyPlayingResponse } from "@acme/api/src/router/types";

import { api } from "~/utils/api";

const usePlayer = () => {
  const { data: player, refetch } = api.player.getPlayBackState.useQuery();
  const [playPercent, setPlayPercent] = useState<number>(0);
  const [formattedEndduration, setFormattedEndDuration] = useState<string>("");
  const [formattedStartingTime, setFormattedStartingTime] =
    useState<string>("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (player?.currently_playing_type === "ad") {
      timeoutId = setInterval(() => {
        void refetch();
      }, 3000);
      return;
    }

    if (!player) return;

    const updateTimer = () => {
      setPlayPercent(
        Math.floor((player?.progress_ms / player?.item.duration_ms) * 100),
      );
      void refetch();
      updatedStartingTime();
    };

    updateTimer(); // Initial update
    updateFormatedDuration();

    timeoutId = setInterval(updateTimer, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [player]);

  const updatedStartingTime = () => {
    if (!player?.item) return;
    const minutes = Math.floor(player?.progress_ms / 60000);
    const seconds = ((player?.progress_ms % 60000) / 1000)
      .toFixed(0)
      .padStart(2, "0");
    setFormattedStartingTime(`${minutes}:${seconds}`);
  };

  const updateFormatedDuration = () => {
    if (!player?.item) return;
    const minutes = Math.floor(player?.item.duration_ms / 60000);
    const seconds = ((player?.item.duration_ms % 60000) / 1000)
      .toFixed(0)
      .padStart(2, "0");
    setFormattedEndDuration(`${minutes}:${seconds}`);
  };
  return {
    player,
    playPercent,
    formattedEndduration,
    formattedStartingTime,
  } as {
    player: CurrentlyPlayingResponse;
    playPercent: number;
    formattedEndduration: string;
    formattedStartingTime: string;
  };
};

export default usePlayer;
