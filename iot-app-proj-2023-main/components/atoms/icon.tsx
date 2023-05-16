import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import Colors from "../../constants/colors";

export function FontAwesomeIcon(
  props: React.ComponentProps<typeof FontAwesome>,
) {
  const color = Colors.text;
  return <FontAwesome color={color} {...props} />;
}
