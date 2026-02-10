import { Dimensions, StyleSheet } from "react-native";
import { STYLES } from "@codemize/constants/Styles";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

export const MAX_WIDTH = Dimensions.get('window').width - 28;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.3
 * @description Global styles for the workflow components
 * @component */
const GlobalWorkflowStyle = StyleSheet.create({
  touchableParent: {
    gap: 18,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  viewTag: {
    paddingVertical: 3
  },
  right: {
    ...GlobalContainerStyle.rowCenterCenter,
    width: 40,
    gap: 14
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 4
  },
  content: {
    flex: 1,
    paddingVertical: STYLES.paddingVertical,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: STYLES.sizeGap,
  },
  nodeContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    paddingTop: 6,
    gap: 4,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  nodeHeader: {
    paddingHorizontal: 4,
    gap: 10,
    height: 24,
  },
  input: {
    flex: 1,
    color: "#626D7B",
    fontSize: Number(SIZES.label),
    fontFamily: String(FAMILIY.subtitle),
    paddingVertical: 0,
    paddingHorizontal: 0,
  }
});

export default GlobalWorkflowStyle;

/**
 * container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: CONTENT_VERTICAL_GAP,
  },
  tagRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 4
  },
  nodeWrapper: {
    gap: 4,
    overflow: 'hidden',
  },
  node: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    paddingTop: 6,
    gap: 4,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  nodeHeaderRow: {
    paddingHorizontal: 4,
    gap: 10,
    height: 24,
  },
  workflowNameInput: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    color: "#626D7B",
    fontSize: Number(SIZES.label),
    fontFamily: String(FAMILIY.subtitle),
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  nodeHeaderActions: {
    gap: 14,
    marginLeft: 12,
  },
  connectionLayer: {
    zIndex: -1,
  },
 */