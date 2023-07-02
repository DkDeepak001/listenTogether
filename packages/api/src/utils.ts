import { type AccessTokenInfo, type ErrorResponse } from "./router/types";

const redirect_url = "https://listen-together-nextjs.vercel.app/api/spotify";

export const getAccessToken = (code: string): Promise<AccessTokenInfo> => {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          (process.env.SPOTIFY_CLIENT_ID as string) +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
      redirect_url,
    )}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "data from getAccessToken");
      return data as AccessTokenInfo;
    });
};
