import { useEffect, useState } from "react";

import { type CurrentlyPlayingResponse } from "@acme/api/src/router/types";

import { api } from "~/utils/api";
import { useRefreshOnFocus } from "~/app/_layout";
import useAudio from "./useAudio";
import useAuthToken from "./useAuthToken";

const usePlayer = () => {
  // const { data: player, refetch } = api.player.getPlayBackState.useQuery();
  // const { authToken, updateToken } = useAuthToken();
  // useRefreshOnFocus(updateToken);

  const { currentTrack, isPlaying } = useAudio();
  const [playPercent, setPlayPercent] = useState<number>(0);
  const [formattedEndduration, setFormattedEndDuration] = useState<string>("");
  const [formattedStartingTime, setFormattedStartingTime] =
    useState<string>("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // if (player?.currently_playing_type === "ad") {
    //   return;
    // }

    // if (!player) return;

    const updateTimer = () => {
      // setPlayPercent(
      //   Math.floor((currentTrack?.progress_ms / currentTrack?.item?.duration_ms) * 100),
      // );
      // void refetch();
      // updatedStartingTime();
    };

    updateTimer(); // Initial update
    // updateFormatedDuration();

    // timeoutId = setInterval(updateTimer, 1000);

    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, [currentTrack]);

  // if (authToken?.error) {
  //   if (authToken?.error?.status === 401) updateToken();
  // }
  // const updatedStartingTime = () => {
  //   const minutes = Math.floor(currentTrack?.duration_ms ?? 0 / 60000);
  //   const seconds = ((player?.progress_ms % 60000) / 1000)
  //     .toFixed(0)
  //     .padStart(2, "0");
  //   setFormattedStartingTime(`${minutes}:${seconds}`);
  // };

  // const updateFormatedDuration = () => {
  //   if (!player?.item) return;
  //   const minutes = Math.floor(player?.item.duration_ms / 60000);
  //   const seconds = ((player?.item.duration_ms % 60000) / 1000)
  //     .toFixed(0)
  //     .padStart(2, "0");
  //   setFormattedEndDuration(`${minutes}:${seconds}`);
  // };
  return {
    // player,
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
