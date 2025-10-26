import React from "react";
import { TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTelescope, faXmark } from "@fortawesome/duotone-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { STYLES } from "@codemize/constants/Styles";
import { useDebounce } from "@codemize/hooks/useDebounce";

import { useThemeColors } from "@/hooks/theme/useThemeColor";

import Divider from "@/components/container/Divider";
import TouchableHaptic from "@/components/button/TouchableHaptic";
import TextBase from "@/components/typography/Text";

import SearchFieldStyle from "@/styles/components/container/SearchField";
import GlobalContainerStyle from "@/styles/GlobalContainer";
import GlobalTypographyStyle from "@/styles/GlobalTypography";


/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
type SearchFieldProps = {
  value?: string;
  placeholder?: string;
  stickyPlayholder?: string;
  onLiveChange?: (value: string) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {SearchFieldProps} param0
 * @param {string} param0.value - The initial search value
 * @param {string} param0.placeholder - The placeholder text
 * @param {Function} param0.onChange - The function to call when the search value changes
 * @component */
const SearchField = ({
  value = "",
  placeholder = "i18n.searchField.placeholder",
  stickyPlayholder = "Zeitzone",
  onLiveChange = () => {}
}: SearchFieldProps) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  /** @description Handles the initial search value which can be passed as a prop */
  const [searchValue, setSearchValue] = React.useState(value);

  /** @description Handles the debounced search value */
  const debouncedSearchValue = useDebounce(searchValue, 500);
  
  React.useEffect(() => {
    if (debouncedSearchValue) onLiveChange(debouncedSearchValue);
  }, [debouncedSearchValue]);

  /**
   * @description Handles the on press event for clearing the search value
   * @function */
  const onPressClear = React.useCallback(() => setSearchValue(""), []);

  return (
    <View style={[GlobalContainerStyle.rowCenterBetween, SearchFieldStyle.view, { 
      borderColor: colors.primaryBorderColor, 
      backgroundColor: colors.secondaryBgColor
    }]}>
      <View style={[GlobalContainerStyle.rowCenterStart, { gap: STYLES.sizeGap }]}>
        <FontAwesomeIcon 
          icon={faTelescope as IconProp} 
          size={STYLES.sizeFaIcon} 
          color={colors.primaryIconColor} />
        <Divider vertical />
        {stickyPlayholder && (
          <TextBase 
            text={stickyPlayholder}
            i18nTranslation={true}
            style={[GlobalTypographyStyle.labelText, { color: colors.infoColor }]} /> )}
        <TextInput 
          placeholder={t(placeholder)} 
          placeholderTextColor={colors.infoColor}
          value={searchValue}
          autoFocus={true}
          onChangeText={setSearchValue}
          style={[GlobalTypographyStyle.standardText, { 
            flex: 1,
            color: colors.textColor
          }]}  />
        <Divider vertical />
        <TouchableHaptic
          onPress={onPressClear}>
            <FontAwesomeIcon 
              icon={faXmark as IconProp} 
              size={STYLES.sizeFaIcon} 
              color={colors.primaryIconColor} />
        </TouchableHaptic>
      </View>
    </View>
  );
};

export default SearchField;