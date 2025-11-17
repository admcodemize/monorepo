import { StyleSheet } from "react-native"

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.7
 * @version 0.0.1 */
const ListItemEventStyle = StyleSheet.create({
  view: {
    position: 'absolute',
    overflow: "hidden", 
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    flexShrink: 1,
    flexWrap: "wrap",
    paddingLeft: 6, 
    paddingVertical: 2, 
    paddingRight: 3, 
    justifyContent: "flex-start", 
    alignItems: "flex-start" 
  },
})

export default ListItemEventStyle;