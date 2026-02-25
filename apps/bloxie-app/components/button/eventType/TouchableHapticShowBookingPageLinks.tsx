import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash } from "@fortawesome/duotone-thin-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { createUuidV4 } from "@/helpers/System";
import { STYLES } from "@codemize/constants/Styles";

import TextBase from "@/components/typography/Text";

import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalWorkflowStyle from "@/styles/GlobalWorkflow";
import TouchableHapticSwitch from "../TouchableHapticSwitch";
import TouchableHaptic from "../TouchableHaptic";
import TouchableHapticLink from "./TouchableHapticLink";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.68
 * @version 0.0.1
 * @type */
export type TouchableHapticShowBookingPageLinkProps = {
  id: string;
  link: string;
  name: string;
};

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.68
 * @version 0.0.1
 * @description Creates an empty link object
 * @function */
const createEmptyLink = (): TouchableHapticShowBookingPageLinkProps => ({ id: createUuidV4(), link: "", name: "" });

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.58
 * @version 0.0.1
 * @type */
export type TouchableHapticShowBookingPageLinksProps = {
  onChangeState: (state: boolean) => void;
  onChangeLinks: (links: TouchableHapticShowBookingPageLinkProps[]) => void;
};

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Returns 
 * @since 0.0.58
 * @version 0.0.2
 * @param {TouchableHapticShowBookingPageLinksProps} param0 
 * @param {Function} param0.onChangeState - Callback function when user changed the state of the show booking page links
 * @param {Function} param0.onChangeLinks - Callback function when user changed the links
 * @component */
const TouchableHapticShowBookingPageLinks = ({
  onChangeState,
  onChangeLinks,
}: TouchableHapticShowBookingPageLinksProps) => {
  const { infoColor, linkColor } = useThemeColors();

  const [links, setLinks] = React.useState<TouchableHapticShowBookingPageLinkProps[]>([createEmptyLink()]);
  const [showBookingPageLinks, setShowBookingPageLinks] = React.useState<boolean>(true);
  React.useEffect(() => onChangeState(showBookingPageLinks), [showBookingPageLinks]);
  React.useEffect(() => onChangeLinks(links), [links]);

  /**
   * @description Used to insert a new link into the links array
   * @function */
  const onPressInsert = () => setLinks((prev) => [...prev, createEmptyLink()]);

  /**
   * @description Used to remove a link from the links array
   * @function */
  const onPressRemove = 
  (id: string) => 
  (e: GestureResponderEvent) => setLinks((prev) => prev.filter((link) => link.id !== id));

  return (
    <View style={[GlobalWorkflowStyle.touchableParent, { 
      gap: 6, 
      paddingHorizontal: 0,
      height: "auto",
    }]}>
      <View style={[GlobalContainerStyle.rowCenterBetween, { height: 32, paddingHorizontal: 12 }]}>
        <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
          <FontAwesomeIcon 
            icon={faEyeSlash as IconProp} 
            size={STYLES.sizeFaIcon} />
          <TextBase
            text={"Anzeige der Links auf der Buchungsseite"} 
            style={{ color: infoColor }} />
        </View>
        <View style={[GlobalContainerStyle.rowCenterCenter, { gap: 12 }]}>
          <TouchableHapticSwitch
            state={showBookingPageLinks}
            onStateChange={setShowBookingPageLinks} />
          <TouchableHaptic onPress={onPressInsert}>
            <FontAwesomeIcon
              icon={faPlus as IconProp}
              size={STYLES.sizeFaIcon}
              color={linkColor} />
          </TouchableHaptic>
        </View>
      </View>
      {links.map((link) => (
        <TouchableHapticLink
          key={link.id}
          link={link.link}
          name={link.name}
          onPressRemove={onPressRemove(link.id)} />
      ))}
    </View>
  );
};

export default TouchableHapticShowBookingPageLinks;