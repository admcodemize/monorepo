import React from "react";
import { Image, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import { useLinkedMailAccounts } from "@/hooks/auth/useLinkedMailAccount";
import { faEnvelope, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { STYLES } from "@codemize/constants/Styles";
import ActionTemplateStyle from "@/styles/screens/private/tray/modal/workflow/ActionTemplate";
import TouchableHapticIcon from "../TouchableHaptichIcon";
import { getImageAssetByProvider } from "@/helpers/Events";
import { ProviderEnum } from "@/constants/Provider";
import Divider from "@/components/container/Divider";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.1
 * @type */
export type TouchableHapticMailAccountsProps = {
  refContainer: React.RefObject<View|null>;
  onPress: (item: ListItemDropdownProps) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.43
 * @version 0.0.1
 * @param {TouchableHapticMailAccountsProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @component */
const TouchableHapticMailAccounts = ({
  refContainer,
  onPress,
}: TouchableHapticMailAccountsProps) => {
  const refMailAccount = React.useRef<View>(null);
  const { infoColor } = useThemeColors();

  /** 
   * @description Returns the linked mail account for the currently signed in user 
   * @see {@link hooks/auth/useLinkedAccount} */
  const { linkedMailAccounts, linkedMailAccount } = useLinkedMailAccounts();
  const items = React.useMemo(() => linkedMailAccounts?.map((mailAccount) => ({
    itemKey: mailAccount._id as string,
    title: mailAccount.email,
    description: mailAccount.provider,
    //icon: mailAccount.provider as IconProp,
    isSelected: linkedMailAccount()?._id === mailAccount._id
  })) || [{ itemKey: "default", title: "notifications@bloxie.ch", icon: faEnvelope as IconProp, isSelected: true }], [linkedMailAccounts, linkedMailAccount]);

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(items.find((item) => item.isSelected) as ListItemDropdownProps);

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
        title={t("i18n.screens.workflow.builder.mailAccounts")} 
        items={items}
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
      refTouchable: refMailAccount,
      relativeToRef: refContainer,
      paddingHorizontal: 12 - 2, 
      hostId: "tray",
      open,
      children: children(),
    });
  }

  return (
    <View style={[GlobalContainerStyle.rowCenterEnd, { gap: 4 }]}>
      {linkedMailAccount() && <Image
        source={getImageAssetByProvider(linkedMailAccount()?.provider as ProviderEnum)} 
        resizeMode="cover"
        style={ActionTemplateStyle.image} />}
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHapticDropdown
          ref={refMailAccount}
          text={selected.title}
          disabled={!linkedMailAccount()}
          hasViewCustomStyle
          textCustomStyle={{ fontSize: Number(SIZES.label), fontFamily: String(FAMILIY.subtitle) }}
          viewCustomStyle={{ ...GlobalContainerStyle.rowCenterCenter, gap: 4 }}
          onPress={onPressDropdown}/>
        <Divider vertical />
        <TouchableHapticIcon
          icon={faXmark as IconProp}
          iconSize={STYLES.sizeFaIcon}
          hasViewCustomStyle={true}
          iconColor={infoColor}
          onPress={() => {}}/>
      </View>
    </View>
  );
};

export default TouchableHapticMailAccounts;