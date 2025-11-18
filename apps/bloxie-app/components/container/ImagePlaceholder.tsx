import React, { PropsWithChildren }  from "react";
import { ImageSourcePropType, StyleProp, TextStyle, ViewProps, ViewStyle, Image, View } from "react-native";
//import { ImageAssets } from "@/assets/images";

import { useThemeColor } from "@/hooks/theme/useThemeColor";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import ImagePlaceholderStyle from "@/styles/components/container/ImagePlaceholder";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.8
 * @version 0.0.1
 * @type */
export type ImagePlaceholderProps = ViewProps & PropsWithChildren & {
  title?: string;
  descr?: string;
  width?: number;
  height?: number;
  imageSrc?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
  styleDescr?: StyleProp<TextStyle>;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description 
 * @since 0.0.8
 * @version 0.0.1
 * @param {ImagePlaceholderProps} param0
 * @param {string} param0.title - Title of the image placeholder
 * @param {string} param0.descr - Description of the image placeholder
 * @param {number} param0.width - Width of the image placeholder
 * @param {number} param0.height - Height of the image placeholder
 * @param {ImageSourcePropType} param0.imageSrc - Custom source of the image placeholder
 * @param {StyleProp<ViewStyle>} param0.style - Custom styling
 * @param {StyleProp<TextStyle>} param0.styleTitle - Custom styling for the title
 * @param {StyleProp<TextStyle>} param0.styleDescr - Custom styling for the description
 * @function */
const ImagePlaceholder = ({
  title,
  descr,
  width = 125,
  height = 125,
  imageSrc,
  style,
  styleTitle,
  styleDescr,
  children
}: ImagePlaceholderProps) => {
  const info = useThemeColor("info");

  return (
    <View style={[GlobalContainerStyle.columnCenterCenter, ImagePlaceholderStyle.container, style]}>
      <View style={[GlobalContainerStyle.columnCenterCenter, { gap: 6 }]}>
        {title && <TextBase 
          type="text" 
          text={title}
          style={styleTitle} />}
        {descr && <TextBase 
          type="text" 
          text={descr}
          style={[{ color: info, textAlign: "center" }, styleDescr]} />}
      </View>
      {children && children}
      {/*<Image 
        source={imageSrc ?? ImageAssets.search} 
        style={{ width, height }} />*/}
    </View>
  )
}

export default React.memo(ImagePlaceholder);