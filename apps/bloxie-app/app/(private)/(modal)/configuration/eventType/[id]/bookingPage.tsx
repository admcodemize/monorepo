import TouchableHapticConfirmationPage from "@/components/button/eventType/TouchableHapticConfirmationPage";
import TouchableHapticFrequency from "@/components/button/eventType/TouchableHapticFrequency";
import TouchableHapticLink from "@/components/button/eventType/TouchableHapticLink";
import TouchableHapticShowBookingPage from "@/components/button/eventType/TouchableHapticShowBookingPage";
import TouchableHapticShowBookingPageLinks from "@/components/button/eventType/TouchableHapticShowBookingPageLinks";
import TouchableHapticShowConfirmationPage from "@/components/button/eventType/TouchableHapticShowConfirmationPage";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import Divider from "@/components/container/Divider";
import ListItemGroup from "@/components/container/ListItemGroup";
import InputInvitationSlug from "@/components/input/eventType/InputInvitationSlug";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import Editor from "@/components/typography/Editor";
import TextBase from "@/components/typography/Text";
import { DROPDOWN_DURATION_ITEMS, EDITOR_STYLE_ITEMS } from "@/constants/Models";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalViewStyle from "@/styles/GlobalView";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFileLines } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { t } from "i18next";
import React from "react";
import { Dimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const ModalConfigurationEventTypeBookingPage= () => {
  const { secondaryBgColor, infoColor } = useThemeColors();
  const refStart = React.useRef<View>(null);
  return (
<View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical,

     }}>
      <KeyboardAwareScrollView
        bottomOffset={50}

        showsVerticalScrollIndicator={false}
        style={[{ width: Dimensions.get('window').width - 28 }]}>

        <ListItemGroup title="Allgemeine Einstellungen" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <InputInvitationSlug />
              <TouchableHapticFrequency
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}}
                onChangeValue={() => {}} />

              <View style={[GlobalWorkflowStyle.touchableParent, { height: "auto",
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
                minHeight={80}
                padding={0}
                primaryTextColor={"#000"}
                fontSize={Number(SIZES.label)}
                placeholder={"Erfassen von zusätzlichen Informationen, welche für die Buchung relevant sind."}
                onIsFocused={() => {}}
                onStyleStateChange={() => {}} />
                <Divider />
              <View style={[GlobalContainerStyle.rowCenterStart, { gap: 12, paddingVertical: 4 }]}>
                {EDITOR_STYLE_ITEMS.map((item, idx) => {
                  //const isActive = styleState[item.state as keyof typeof styleState];
                  //const toggleFn = refBody.current?.[item.functionAsString as keyof EnrichedTextInputInstance] as (() => void)|undefined;
                  return (
                    <TouchableHapticIcon
                      key={item.key}
                      icon={item.icon as IconProp}
                      iconSize={14}
                      //iconColor={isActive ? "#fff" : shadeColor(infoColor, 0.3)}
                      hasViewCustomStyle={true}
                      viewCustomStyle={{ 
                        /*backgroundColor: isActive 
                          ? idx % 2 == 0 ? shadeColor(infoColor, 0.5) : infoColor
                          : "transparent", 
                        padding: 6, 
                        borderRadius: 6 */
                      }}
                      onPress={() => {}} />
                  );
                })}

              </View>


              </View>

            </View>
          </View>
        </View>  

        <ListItemGroup title="Buchung" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <TouchableHapticShowConfirmationPage />
              <TouchableHapticConfirmationPage
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}} />
            </View>
          </View>
        </View>  

        <ListItemGroup title="Links" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <TouchableHapticShowBookingPageLinks />
              <TouchableHapticLink
                onPress={() => {}} />
              <TouchableHapticLink
                onPress={() => {}} />
            </View>
          </View>
        </View>  

      </KeyboardAwareScrollView>
    </View>
  )
}

export default ModalConfigurationEventTypeBookingPage;