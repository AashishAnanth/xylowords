import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, value, onChangeText, ...props }) => {
  return (
    <TextInput
      className="bg-[#ffd700] border-2 border-[#a45a45] py-2 px-4 rounded-none w-60 text-center"
      placeholder={placeholder}
      placeholderTextColor="#000000"
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

export default CustomInput;