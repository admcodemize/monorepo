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
  const { data, children } = useToastStore((state) => state);
  const hasChildren = typeof children === "function" || Boolean(children);

  /** @description If there is no content to show, do not render anything */
  if (!data && !hasChildren) return null;
  console.log("data", data);

  return (
    <ToastRoot />
  )
};

export default ToastOverlay;