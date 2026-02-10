import TouchableHapticConfirmationPage from "@/components/button/eventType/TouchableHapticConfirmationPage";
import TouchableHapticFrequency from "@/components/button/eventType/TouchableHapticFrequency";
import TouchableHapticLink from "@/components/button/eventType/TouchableHapticLink";
import TouchableHapticShowBookingPage from "@/components/button/eventType/TouchableHapticShowBookingPage";
import TouchableHapticShowBookingPageLinks from "@/components/button/eventType/TouchableHapticShowBookingPageLinks";
import TouchableHapticShowConfirmationPage from "@/components/button/eventType/TouchableHapticShowConfirmationPage";
import ListItemGroup from "@/components/container/ListItemGroup";
import InputInvitationSlug from "@/components/input/eventType/InputInvitationSlug";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import Editor from "@/components/typography/Editor";
import TextBase from "@/components/typography/Text";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";
import GlobalViewStyle from "@/styles/GlobalView";
import { STYLES } from "@codemize/constants/Styles";
import { t } from "i18next";
import React from "react";
import { Dimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const ModalConfigurationEventTypeBookingPage= () => {
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