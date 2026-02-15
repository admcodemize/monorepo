import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHaptic from "../TouchableHaptic";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faCalendarUsers, faEnvelope, faGaugeSimpleMax, faListTimeline, faSquarePollHorizontal } from "@fortawesome/pro-thin-svg-icons";
import TouchableHapticLink from "./TouchableHapticLink";
import TouchableHapticSwitch from "../TouchableHapticSwitch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticParticipantQuestionProps = {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticLimitsProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {ListItemDropdownProps} param0.selectedItem - The selected item object
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticParticipantQuestion = ({
  refContainer,
  selectedItem,
  onPress,
}: TouchableHapticParticipantQuestionProps) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, infoColor, linkColor, labelColor } = useThemeColors();

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(selectedItem);

  React.useEffect(() => {
    /** @description Set the selected time period/value based on the workflow start time period if it is defined */
    if (selectedItem) setSelected(selectedItem);
  }, [selectedItem]);

  /**
   * @description Get the dropdown functions for displaying the available triggers.
   * @see {@link hooks/button/useDropdown} */
   const { state: { open, close }, open: _open } = useDropdown();

  /**
   * @description Returns the children (dropdown items as a scrollable list)for the dropdown component
   * @function */
  const children = () => {
    return (
      <ListDropdown
        title={t("Limits")} 
        items={DROPDOWN_DURATION_ITEMS}
        width={140}
        selectedItem={selected}
        onPressItem={(item) => {
          setSelected(item);
          onPress(item);
          close();
        }} />
    );
  }

  /**
   * @description Used to open the dropdown component
   * @function */
  const onPressDropdown = () => {
    /** 
     * @description Open the dropdown component based on a calculated measurement template
     * @see {@link components/button/TouchableDropdown} */
    _open({
      refTouchable: refTimePeriod,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      open,
      children: children(),
    });
  }
  return (
    <View style={[GlobalWorkflowStyle.touchableParent, { gap: 6, height: "auto",
      //backgroundColor: secondaryBgColor,
      paddingTop: 4,
      paddingHorizontal: 0
     }]}>
      <View
        style={[GlobalContainerStyle.rowCenterBetween, {
          paddingHorizontal: 10
          //backgroundColor: secondaryBgColor,
        }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faSquarePollHorizontal as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("Fragen an den Teilnehmer")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TouchableHaptic>
          <FontAwesomeIcon
            icon={faPlus as IconProp}
            size={STYLES.sizeFaIcon}
            color={linkColor} />
        </TouchableHaptic>
      </View>
    </View>
      <View style={{ paddingHorizontal: 10 }}>
        <TextBase
          text={t("Relevante Fragen für den weiterführenden Dialog mit dem Teilnehmer.")} 
          type="label"
          style={{ color: labelColor }} />   
      </View> 
      <TouchableHapticParticipantQuestionItem refContainer={refContainer} selectedItem={selectedItem} type="email" isRequired={true} />
      {/*<TouchableHapticParticipantInformationItem refContainer={refContainer} selectedItem={selectedItem} type="name" />
      <TouchableHapticParticipantInformationItem refContainer={refContainer} selectedItem={selectedItem} type="phone" />*/}
    </View>
  );
};

const TouchableHapticParticipantQuestionItem = ({
  refContainer,
  selectedItem,
  type,
  isRequired,
}: {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  type: "email" | "name" | "phone";
  isRequired?: boolean;
}) => {
  const { secondaryBgColor, infoColor, labelColor } = useThemeColors();

  const [timePeriodValue, setTimePeriodValue] = React.useState<string>("30");

  /**
   * @description Used to change the time period value
   * -> Change the value on the parent component
   * @param {string} text - The new time period value
   * @function */
  const onChangeTimePeriodValue = (text: string) => {
    setTimePeriodValue(text);
    //onChangeValue(text);
  };

  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
      backgroundColor: secondaryBgColor,
      padding: 0,
    }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
      <FontAwesomeIcon 
        icon={faEnvelope as IconProp} 
        size={STYLES.sizeFaIcon} />
      <TextBase text={type === "email" ? t("E-Mail Adresse") : type === "name" ? t("Name/Vorname") : t("Telefonnummer")} type="label" style={{ color: infoColor }} />
      {isRequired && <TextBase text={t("(Pflicht-Eingabe)")} type="label" style={{ color: labelColor }} />}
      </View>
      <View style={[{ gap: 12 }, GlobalContainerStyle.rowCenterCenter]}>
        {!isRequired && <TouchableHapticSwitch
          state={true}
          onStateChange={() => {}} />}
      </View>
    </View>
  );
}
export default TouchableHapticParticipantQuestion;