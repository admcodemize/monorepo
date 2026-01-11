import React from "react";
import { GestureResponderEvent, Image, View } from "react-native";
import { t } from "i18next";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEnvelopeOpenText, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { FAMILIY, SIZES } from "@codemize/constants/Fonts";
import { STYLES } from "@codemize/constants/Styles";
import { ConvexLinkedAPIProps } from "@codemize/backend/Types";

import { useDropdown } from "@/hooks/button/useDropdown";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useLinkedMailAccount } from "@/hooks/auth/useLinkedMailAccount";
import { useUserContextStore } from "@/context/UserContext";
import { getImageAssetByProvider } from "@/helpers/Events";
import { ProviderEnum } from "@/constants/Provider";

import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import ListDropdown from "@/components/lists/ListDropdown";
import TouchableHapticDropdown from "@/components/button/TouchableHapticDropdown";
import TouchableHapticIcon from "@/components/button/TouchableHaptichIcon";
import Divider from "@/components/container/Divider";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import ActionTemplateStyle from "@/styles/screens/private/tray/modal/workflow/ActionTemplate";

export const DEFAULT_MAIL_ACCOUNT = "no-reply@bloxie.ch";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.43
 * @version 0.0.1
 * @type */
export type TouchableHapticMailAccountsProps = {
  refContainer: React.RefObject<View|null>;
  onPress: (item: ListItemDropdownProps) => void;
  onPressClose: (e: GestureResponderEvent) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns a touchable (opacity) button with included haptic gesture -> Only for platform iOs/android
 * @since 0.0.43
 * @version 0.0.3
 * @param {TouchableHapticMailAccountsProps} param0 
 * @param {React.RefObject<View|null>} param0.refContainer - Reference to the container view which is used for the dropdown positioning
 * @param {Function} param0.onPress - Callback function when user pressed the button
 * @param {Function} param0.onPressClose - Callback function when user pressed the close button
 * @component */
const TouchableHapticMailAccounts = ({
  refContainer,
  onPress,
  onPressClose,
}: TouchableHapticMailAccountsProps) => {
  const refMailAccount = React.useRef<View>(null);
  const { infoColor, primaryIconColor } = useThemeColors();

  const setSettingsProperty = useUserContextStore((state) => state.setSettingsProperty);

  /** 
   * @description Reads all the linked mail accounts for the currently signed in user which are loaded during the initial app load
   * @see {@link context/UserContext} */
  const linkedMailAccounts = useUserContextStore((state) => state.linkedMailAccounts);
  const { linkedMailAccount } = useLinkedMailAccount({});

  const selectedMailAccount: ConvexLinkedAPIProps|undefined = React.useMemo(() => linkedMailAccount(), [linkedMailAccount]);

  const items: ListItemDropdownProps[] = React.useMemo(() => {
    return [{
      itemKey: DEFAULT_MAIL_ACCOUNT,
      title: DEFAULT_MAIL_ACCOUNT,
      description: t("i18n.screens.workflow.builder.mailAccounts.descriptionNoReply"),
      icon: faEnvelopeOpenText as IconProp,
      isSelected: !selectedMailAccount
    }, ...linkedMailAccounts?.map((mailAccount) => ({
      itemKey: mailAccount.email,
      title: mailAccount.email,
      description: `Provider: ${mailAccount.provider}`,
      image: getImageAssetByProvider(mailAccount.provider as ProviderEnum),
      isSelected: selectedMailAccount?._id === mailAccount._id,
    })) ?? []];
  }, [selectedMailAccount, linkedMailAccounts]);

  const [selected, setSelected] = React.useState<ListItemDropdownProps>(items.find((item) => item.isSelected) as ListItemDropdownProps);

  /**
   * @description Get the dropdown functions for displaying the available triggers.
   * @see {@link hooks/button/useDropdown} */
  const { state: { open, close }, open: _open } = useDropdown();

  /**
   * @description Handles the press event of the dropdown item
   * -> Updates the default mail account of the user's settings in the database and also the context store which handles the default mail account during the session
   * @param {ListItemDropdownProps} item - The item to press
   * @function */
  const onPressItem = (item: ListItemDropdownProps) => {
    setSelected(item);
    onPress(item);
    setSettingsProperty("defaultMailAccount", item.itemKey);
    close();
  }

  /**
   * @description Returns the children (dropdown items as a scrollable list)for the dropdown component
   * @function */
  const children = () => {
    return (
      <ListDropdown
        title={t("i18n.screens.workflow.builder.mailAccounts.title")} 
        items={items}
        selectedItem={selected}
        onPressItem={onPressItem} />
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
      {linkedMailAccount() && selected.image && <Image
        source={getImageAssetByProvider(linkedMailAccount()?.provider as ProviderEnum)} 
        resizeMode="cover"
        style={ActionTemplateStyle.image} />}
      {selected.icon && !selected.image && <FontAwesomeIcon 
        icon={selected.icon as IconProp} 
        size={STYLES.sizeFaIcon} 
        color={primaryIconColor} />}
      <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 8 }]}>
        <TouchableHapticDropdown
          ref={refMailAccount}
          text={selected.title}
          disabled={linkedMailAccounts.length === 0}
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
          onPress={onPressClose}/>
      </View>
    </View>
  );
};

export default TouchableHapticMailAccounts;