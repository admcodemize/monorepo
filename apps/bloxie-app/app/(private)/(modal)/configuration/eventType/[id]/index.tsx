import TouchableHapticAvailability from "@/components/button/eventType/TouchableHapticAvailability";
import TouchableHapticColor from "@/components/button/eventType/TouchableHapticColor";
import TouchableHapticDuration from "@/components/button/eventType/TouchableHapticDuration";
import TouchableHapticFutureBooking from "@/components/button/eventType/TouchableHapticFutureBooking";
import TouchableHapticLocation from "@/components/button/eventType/TouchableHapticLocation";
import TouchableHapticMinTimeBeforeEvent from "@/components/button/eventType/TouchableHapticMinTimeBeforeEvent";
import TouchableHapticShowBookingPage from "@/components/button/eventType/TouchableHapticShowBookingPage";
import TouchableHapticShowRemainingSeats from "@/components/button/eventType/TouchableHapticShowRemainingSeats";
import TouchableHapticTimePeriod from "@/components/button/TouchableHapticTimePeriod";
import TouchableHapticTrigger from "@/components/button/workflow/TouchableHapticTrigger";
import ListItemGroup from "@/components/container/ListItemGroup";
import InputInvitationLimit from "@/components/input/eventType/InputInvitationLimit";
import InputTypeName from "@/components/input/eventType/InputTypeName";
import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import { DROPDOWN_DURATION_ITEMS, DROPDOWN_TIME_PERIOD_ITEMS } from "@/constants/Models";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalViewStyle from "@/styles/GlobalView";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { STYLES } from "@codemize/constants/Styles";
import React from "react";
import { Dimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const ModalConfigurationEventTypeGeneral= () => {
  const refStart = React.useRef<View>(null);

  return (
    <View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical,
      //backgroundColor: "#fff"
     }}>
      <KeyboardAwareScrollView
        bottomOffset={50}

        showsVerticalScrollIndicator={false}
        style={[{ width: Dimensions.get('window').width - 28 }]}>

        <ListItemGroup title="Ereignis-Informationen" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            ref={refStart}
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <InputTypeName />
              <TouchableHapticShowBookingPage />
              <TouchableHapticDuration
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}}
                onChangeValue={() => {}} />
              <TouchableHapticLocation
                onPress={() => {}} />
              <TouchableHapticColor
                onPress={() => {}} 
                onChangeValue={() => {}} />
            </View>
          </View>
        </View>

        <ListItemGroup title="Einschränkungen" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            ref={refStart}
            style={[GlobalViewStyle.actionContainerItem]}>
              <InputInvitationLimit />
              <TouchableHapticShowRemainingSeats />
          </View>
        </View>

        <ListItemGroup title="Buchungszeitraum" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            ref={refStart}
            style={[GlobalViewStyle.actionContainerItem]}>
              <TouchableHapticMinTimeBeforeEvent
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}}
                onChangeValue={() => {}} />
              <TouchableHapticFutureBooking
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}}
                onChangeValue={() => {}} />
              <TouchableHapticAvailability
                refContainer={refStart}
                selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.isSelected) as ListItemDropdownProps}
                onPress={() => {}} />
          </View>
        </View>


      </KeyboardAwareScrollView>
    </View>
  )
}

export default ModalConfigurationEventTypeGeneral;