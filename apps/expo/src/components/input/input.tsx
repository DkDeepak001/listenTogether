import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

const InputBox = ({
  inputClassName,
  ...props
}: TextInputProps & {
  inputClassName?: string;
}) => {
  return (
    <TextInput
      className={` w-3/4 rounded-xl bg-slate-800 px-5 py-2 font-semibold text-white ${inputClassName}`}
      placeholder=""
      placeholderTextColor="white"
      {...props}
    />
  );
};

export default InputBox;
