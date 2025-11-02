import { StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1 */
const GlobalContainerStyle = StyleSheet.create({
  rowCenterCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenterStart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rowStartStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  rowStartCenter: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  rowCenterEnd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rowStartBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rowCenterBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  columnStartCenter: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  columnStartStart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  columnCenterCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  columnCenterStart: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  columnEndCenter: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  sizeGap: {
    gap: STYLES.sizeGap
  }
})

export default GlobalContainerStyle;