import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @type */
export type CalendarWeekDayCircleProps = {
  color: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.5
 * @version 0.0.1
 * @param {CalendarWeekDayCircleProps} param0 - The props for the CalendarWeekDayCircle component
 * @param {string} param0.color - The color of the circle
 * @component */
const CalendarWeekDayCircle = ({
  color,
}: CalendarWeekDayCircleProps) => {
  return (
    <FontAwesomeIcon 
      icon={faCircle as IconProp} 
      size={5} 
      color={color} />
  )
}

export default React.memo(CalendarWeekDayCircle);