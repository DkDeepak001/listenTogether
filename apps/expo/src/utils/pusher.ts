import { Pusher } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

await pusher.init({
  apiKey: process.env.PUSHER_API_KEY!,
  cluster: process.env.PUSHER_CLUSTER!,
});

const pusherClient = await pusher.connect().then((client): Pusher => client);

export default pusherClient;
