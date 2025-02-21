import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, onChangeText, ...props }) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <TextInput
      className="bg-[#ffd700] border-2 border-[#a45a45] py-2 px-4 rounded-none w-60 text-center"
      placeholder={placeholder}
      placeholderTextColor="#000000"
      value={inputValue}
      onChangeText={setInputValue}
      {...props}
    />
  );
};

export default CustomInput;