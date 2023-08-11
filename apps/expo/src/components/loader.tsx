import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  style?: Object;
  type?: "Full" | "Half";
}

const Loader: React.FC<LoaderProps> = ({ style, type }) => {
  if (type === "Half") {
    console.log("Half");
    return (
      <View className=" p-30 mt-5 flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4a95f7" />
      </View>
    );
  }

  return (
    <View className=" p-30 flex flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color="#4a95f7" />
    </View>
  );
};

export default Loader;
