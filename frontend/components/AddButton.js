import React from "react";
import { Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export const AddButton = ({ color, size, onPress }) => {
  return (
    <Pressable>
      <AntDesign
        name="pluscircle"
        size={size}
        color={color}
        onPress={onPress}
      />
    </Pressable>
  );
};