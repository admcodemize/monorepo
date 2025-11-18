import Animated, { FadeOut } from "react-native-reanimated";

import ViewBase from "@/components/container/View";
import ImagePlaceholder from "@/components/container/ImagePlaceholder";

import GlobalContainerStyle from "@/styles/GlobalContainer";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns an activity indicator/loading screen
 * @since 0.0.8
 * @version 0.0.1 */
const LoadingScreen = () => {
  return (
    <ViewBase style={GlobalContainerStyle.columnCenterCenter}>
      <Animated.View
        exiting={FadeOut.duration(300)}>
          <ImagePlaceholder
            title="Loading..."
            descr="Please wait while we load the data for your app..."
            styleTitle={{ fontSize: 12,  }}
            styleDescr={{ fontSize: 12 }} />
      </Animated.View>
    </ViewBase>
  )
}

export default LoadingScreen;