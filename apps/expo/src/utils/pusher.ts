import { Pusher } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

pusher.init({
  apiKey: "dd1093eea2ad5e19bb9f",
  cluster: "ap2",
});

pusher.connect();
// const pusherClient = await pusher.connect().then((client): Pusher => client);

export default pusher;
