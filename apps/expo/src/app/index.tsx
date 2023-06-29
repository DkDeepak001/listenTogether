import { View } from "react-native";
import { Image } from "expo-image";

import splashScreen from "../../assets/splashScreen.png";

const HomeScreen = () => {
  return (
    <View className="bg-brand-bg flex-1">
      <Image
        source={splashScreen}
        className="flex-1"
        contentFit="cover"
        contentPosition={"center"}
        alt="splash screen"
      />
    </View>
  );
};

export default HomeScreen;
