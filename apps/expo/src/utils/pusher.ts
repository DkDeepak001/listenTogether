import { Pusher } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

async function PusherInit() {
  await pusher.init({
    apiKey: "dd1093eea2ad5e19bb9f",
    cluster: "ap2",
  });
  await pusher.connect();
}

void PusherInit();

export default pusher;
