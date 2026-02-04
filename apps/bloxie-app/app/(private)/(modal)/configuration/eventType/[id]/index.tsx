import TouchableHapticTimePeriod from "@/components/button/workflow/TouchableHapticTimePeriod";
import TouchableHapticTrigger from "@/components/button/workflow/TouchableHapticTrigger";
import ListItemGroup from "@/components/container/ListItemGroup";
import InputTypeName from "@/components/input/eventType/InputTypeName";
import TextBase from "@/components/typography/Text";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalViewStyle from "@/styles/GlobalView";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import { STYLES } from "@codemize/constants/Styles";
import React from "react";
import { Dimensions, View } from "react-native";

const ModalConfigurationEventTypeGeneral= () => {
  const refStart = React.useRef<View>(null);

  return (
    <View style={{ paddingHorizontal: STYLES.paddingHorizontal, paddingVertical: STYLES.paddingVertical }}>
      <View style={[{ width: Dimensions.get('window').width - 28 }]}>
        
        <ListItemGroup title="Ereignis-Informationen" style={{ paddingVertical: STYLES.paddingVertical }} />
        <View style={[GlobalViewStyle.actionContainer]}>
          <View 
            ref={refStart}
            style={[GlobalViewStyle.actionContainerItem]}>
            <View style={{ gap: 4, alignSelf: 'stretch' }}>  
              <InputTypeName />
              <TouchableHapticTimePeriod
                refContainer={refStart}
                workflow={undefined}
                onPress={() => {}}
                onChangeValue={() => {}} />
            </View>
          </View>
        </View>

      </View>
    </View>
  )
}

export default ModalConfigurationEventTypeGeneral;