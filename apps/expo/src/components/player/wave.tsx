import React from "react";
import { StyleSheet, View } from "react-native";

const STICK_WIDTH = 2;
const STICK_MARGIN = 1;
const STICK_FULL_WIDTH = STICK_WIDTH + STICK_MARGIN;
export default function Wave(props) {
  return (
    <View
      style={[styles.container, props.reversed && styles.containerReversed]}
    >
      {props.waveForms.map((value, index) => (
        <View key={index} style={[styles.stick, { height: `${value}%` }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
  },
  containerReversed: {
    alignItems: "flex-start",
    opacity: 0.3,
  },
  stick: {
    backgroundColor: "white",
    width: STICK_WIDTH,
    marginRight: STICK_MARGIN,
  },
});
