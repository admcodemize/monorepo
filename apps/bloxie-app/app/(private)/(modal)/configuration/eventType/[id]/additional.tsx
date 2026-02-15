import TouchableHapticBufferTime, { BufferTimeType } from "@/components/button/eventType/TouchableHapticBufferTime";
import TouchableHapticConfirmationPage from "@/components/button/eventType/TouchableHapticConfirmationPage";
import TouchableHapticParticipantInformation from "@/components/button/eventType/TouchableHapticParticipantInformation";
import TouchableHapticExecuteWorkflow from "@/components/button/eventType/TouchableHapticExecuteWorkflow";
import TouchableHapticFrequency from "@/components/button/eventType/TouchableHapticFrequency";
import TouchableHapticLimits from "@/components/button/eventType/TouchableHapticLimits";
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
import TouchableHapticInviteGuests from "@/components/button/eventType/TouchableHapticInviteGuests";
import TouchableHapticParticipantQuestion from "@/components/button/eventType/TouchableHapticParticipantQuestion";

const ModalConfigurationEventTypeAdditional= () => {
  const { secondaryBgColor, infoColor } = useThemeColors();
  const refStart = React.useRef<View>(null);
  return (
<View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical,

     }}>
      <KeyboardAwareScrollView
        bottomOffset={50}

        showsVerticalScrollIndicator={false}
        style={[{ width: Dimensions.get('window').width - 28 }]}>

        <ListItemGroup title="Ausführung" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <TouchableHapticLimits
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}} />
              <TouchableHapticExecuteWorkflow />
            </View>
          </View>
        </View>  

        <ListItemGroup title="Formular" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <TouchableHapticParticipantInformation
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}} />
              <TouchableHapticInviteGuests />
            </View>
          </View>
        </View>  

        <ListItemGroup title="Pufferzeiten und Limits" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <TouchableHapticBufferTime
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onChangeValue={() => {}}
                type={BufferTimeType.BEFORE_EVENT}  
                showBackgroundColor={false}
                onPress={() => {}} />
              <TouchableHapticBufferTime
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onChangeValue={() => {}}
                type={BufferTimeType.AFTER_EVENT}
                onPress={() => {}} />
            </View>
          </View>
        </View>  

      </KeyboardAwareScrollView>
    </View>
  )
}

export default ModalConfigurationEventTypeAdditional;