import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, ...props }) => {
  return (
    <TouchableOpacity 
      className="bg-[#ffd700] border-2 border-[#a45a45] rounded-full py-2 px-4"
      {...props}
    >
      <Text className="text-lg text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;