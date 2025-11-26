import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

import { useDropdownContextStore } from "@/context/DropdownContext";

import DropdownOverlayStyle from "@/styles/components/container/DropdownOverlay";
import { useToastStore } from "@/context/ToastContext";
import ToastRoot from "./ToastRoot";
import React from "react";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.14
 * @version 0.0.1
 * @type */
type ToastOverlayProps = {};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a positioned dropdown based on parent component
 * @since 0.0.14
 * @version 0.0.1
 * @component */
const ToastOverlay = ({ 

}: ToastOverlayProps) => {
  /** @see {@link context/ToastContext} */
  const { isOpen, data, children, close } = useToastStore((state) => state);

  /** @description If the dropdown is not open or the children or position is not set, do not render anything */
  if (!isOpen || !data || !children) return null;

  return (
    <ToastRoot />
  )
};

export default ToastOverlay;