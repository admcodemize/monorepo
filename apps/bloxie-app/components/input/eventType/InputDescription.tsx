import React from "react";
import { View } from "react-native";
import { EnrichedTextInputInstance } from "react-native-enriched";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFileLines } from "@fortawesome/pro-thin-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { shadeColor } from "@codemize/helpers/Colors";
import { EDITOR_STYLE_ITEMS } from "@/constants/Models";
import { SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import Divider from "@/components/container/Divider";
import Editor, { createInitialStyleState, EditorStyleState } from "@/components/typography/Editor";
import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.65
 * @version 0.0.1
 * @type */
export type InputDescriptionProps = {
  value: string;
  onChangeValue: (value: string) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.65
 * @version 0.0.1
 * @description Returns a input text component for the description of the event type
 * @param {InputDescriptionProps} param0 
 * @component */
const InputDescription = ({ 
  value, 
  onChangeValue 
}: InputDescriptionProps) => {
  const refBody = React.useRef<EnrichedTextInputInstance|null>(null);
  const { secondaryBgColor, infoColor, primaryBgColor } = useThemeColors();

  /** @description Handles the style state of the editor content and the highlighting of the styling buttons */
  const [styleState, setStyleState] = React.useState<EditorStyleState>(createInitialStyleState());

  /** @description Used to handle the html change of the editor and write the current description back */
  const onChangeHtml = (html: string) => {
    onChangeValue(html);
  };

  /** @description Used to handle the style state change of the editor */
  const onStyleStateChange = (styleState: EditorStyleState) => {
    setStyleState(styleState);
  };

  return (
    <View style={[GlobalWorkflowStyle.touchableParent, { 
      height: 150,
      gap: 10,
      paddingVertical: 6,
      backgroundColor: secondaryBgColor,
    }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon
          icon={faFileLines as IconProp} 
          size={STYLES.sizeFaIcon} 
          color={infoColor} />
        <TextBase
          text={t("i18n.convex.runtime.templateVariables.eventDescription")}
          style={{ color: infoColor }} />
      </View>
      <Editor
        ref={refBody}
        defaultValue={value}
        padding={0}
        primaryTextColor={"#000"}
        fontSize={Number(SIZES.label)}
        placeholder={"Erfassen von zusätzlichen Informationen, welche für die Buchung relevant sind."}
        onChangeHtml={onChangeHtml}
        onStyleStateChange={onStyleStateChange} />
      <Divider />
      <View style={[GlobalContainerStyle.rowCenterStart, { 
        gap: 12, 
        paddingVertical: 4 
      }]}>
        {EDITOR_STYLE_ITEMS.map((item, idx) => {
          const isActive = styleState[item.state as keyof typeof styleState];
          const toggleFn = refBody.current?.[item.functionAsString as keyof EnrichedTextInputInstance] as (() => void)|undefined;
          return (
            <TouchableHapticIcon
              key={item.key}
              icon={item.icon as IconProp}
              iconSize={14}
              iconColor={isActive ? primaryBgColor : shadeColor(infoColor, 0.3)}
              hasViewCustomStyle={true}
              viewCustomStyle={{ 
                backgroundColor: isActive 
                  ? idx % 2 == 0 ? shadeColor(infoColor, 0.5) : infoColor
                  : "transparent", 
                paddingHorizontal: 6, 
                borderRadius: 6
              }}
              onPress={() => { toggleFn?.() }} />
          );
        })}
      </View>
    </View>
  );
};

export default InputDescription;