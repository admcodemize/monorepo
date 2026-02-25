import React from "react";
import { TextInput, View } from "react-native";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faGaugeSimpleMax } from "@fortawesome/pro-thin-svg-icons";
import { faTrash } from "@fortawesome/duotone-thin-svg-icons";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";

import { createUuidV4 } from "@/helpers/System";
import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { DROPDOWN_DURATION_ITEMS } from "@/constants/Models";
import { DurationEnum } from "@/components/button/eventType/TouchableHapticDuration";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import TextBase from "@/components/typography/Text";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import GlobalTypographyStyle from "@/styles/GlobalTypography";
import TouchableHaptic from "../TouchableHaptic";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.68
 * @version 0.0.1
 * @type */
export type TouchableHapticLimitsItemProps = {
  id: string;
  limit: number;
  timePeriod: string;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.2
 * @type */
export type TouchableHapticLimitsProps = {
  refContainer: React.RefObject<View|null>;
  selectedItem: ListItemDropdownProps;
  onChangeLimits: (limits: TouchableHapticLimitsItemProps[]) => void;
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.68
 * @version 0.0.2
 * @description Creates an empty limits item object
 * @function */
const createEmptyLimit = (): TouchableHapticLimitsItemProps => ({ id: createUuidV4(), limit: 12, timePeriod: DurationEnum.DAY });

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.58
 * @version 0.0.1
 * @param {TouchableHapticLimitsProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {Function} param0.onChangeLimits - Callback function when user changed the limits
 * @component */
const TouchableHapticLimits = ({
  refContainer,
  onChangeLimits,
}: TouchableHapticLimitsProps) => {
  const { infoColor, linkColor, labelColor } = useThemeColors();

  const [limits, setLimits] = React.useState<TouchableHapticLimitsItemProps[]>([createEmptyLimit()]);
  React.useEffect(() => onChangeLimits(limits), [limits]);

  /**
   * @description Used to insert a new link into the links array
   * @function */
  const onPressInsert = () => setLimits((prev) => [...prev, createEmptyLimit()]);

  /**
   * @description Used to remove a limit from the limits array
   * @function */
  const onPressRemove = (id: string) => () => setLimits((prev) => prev.filter((limit) => limit.id !== id));

  return (
    <View style={[GlobalWorkflowStyle.touchableParent, { gap: 6, height: "auto",
      paddingTop: 4,
      paddingHorizontal: 0
     }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, {
        paddingHorizontal: 10
      }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faGaugeSimpleMax as IconProp} 
          size={STYLES.sizeFaIcon} />
        <TextBase
          text={t("Limits")} 
          style={{ color: infoColor }} />
      </View>
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
        <TouchableHaptic onPress={onPressInsert}>
          <FontAwesomeIcon
            icon={faPlus as IconProp}
            size={STYLES.sizeFaIcon}
            color={linkColor} />
        </TouchableHaptic>
      </View>
    </View>
      <View style={{ paddingHorizontal: 10 }}>
        <TextBase
          text={t("Definiert wie viele Buchungen innerhalb eines Zeitrahmens erlaubt sind.")} 
          type="label"
          style={{ color: labelColor }} />   
      </View> 
      {limits.map((limit, index) => (
        <TouchableHapticLimitsItem 
          key={limit.id} 
          refContainer={refContainer} 
          limit={limit}
          index={index}
          onPressRemove={onPressRemove(limit.id)} />
      ))}
    </View>
  );
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.68
 * @version 0.0.2
 * @param {TouchableHapticLimitsItemProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {TouchableHapticLimitsItemProps} param0.limit - The limit object
 * @param {number} param0.index - The index of the limit
 * @param {Function} param0.onPressRemove - Callback function when user pressed the remove button
 * @component */
const TouchableHapticLimitsItem = ({
  refContainer,
  limit,
  index,
  onPressRemove
}: {
  refContainer: React.RefObject<View|null>;
  limit: TouchableHapticLimitsItemProps
  index: number
  onPressRemove: () => void
}) => {
  const refTimePeriod = React.useRef<View>(null);
  const { secondaryBgColor, tertiaryBgColor, infoColor, labelColor, errorColor } = useThemeColors();

  const [limitInternal, setLimitInternal] = React.useState<string>(limit.limit.toString());
  const [timePeriodInternal, setTimePeriodInternal] = React.useState<string>(limit.timePeriod);

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
        selectedItem={DROPDOWN_DURATION_ITEMS.find((item) => item.itemKey === timePeriodInternal) || DROPDOWN_DURATION_ITEMS[0]}
        onPressItem={(item) => {
          setTimePeriodInternal(item.itemKey as string);
          close();
        }} />
    );
  };

  /**
   * @description Used to change the time period value
   * -> Change the value on the parent component
   * @param {string} text - The new time period value
   * @function */
  const onChangeLimitValue = (text: string) => setLimitInternal(text);

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
    <View style={[GlobalContainerStyle.rowCenterBetween, GlobalWorkflowStyle.touchableParent, {
      backgroundColor: secondaryBgColor,
      padding: 0,
    }]}>
      <TextBase text={t("#{{index}} Limit", { index: index + 1 })} type="label" style={{ color: labelColor }} />
      <View style={[{ gap: 12 }, GlobalContainerStyle.rowCenterCenter]}>
      <TextInput
        value={limitInternal}
        onChangeText={onChangeLimitValue}
        keyboardType="number-pad"
        style={[GlobalTypographyStyle.inputText, {
          color: infoColor
        }]} />
      <TextBase text={"pro"} type="label" style={{ color: labelColor }} />
      <TouchableHapticDropdown
        ref={refTimePeriod}
        text={DROPDOWN_DURATION_ITEMS.find((item) => item.itemKey === timePeriodInternal)?.title || ""}
        backgroundColor={tertiaryBgColor}
        hasViewCustomStyle
        textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
        viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
        onPress={onPressDropdown}/>
      <TouchableHaptic onPress={onPressRemove}>
        <FontAwesomeIcon
          icon={faTrash as IconProp}
          size={STYLES.sizeFaIcon}
          color={errorColor} />
      </TouchableHaptic>
      </View>
    </View>
  );
}
export default TouchableHapticLimits;