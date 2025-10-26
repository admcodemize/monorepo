import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { GlobaleTypographyTitleDescriptionProps } from "@/types/GlobalTypography";

import TextBase from "@/components/typography/Text";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type ListContentTitleDescriptionProps = GlobaleTypographyTitleDescriptionProps & {
  i18nTranslation?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.2
 * @version 0.0.1
 * @param {ListContentTitleDescriptionProps} param0
 * @param {string} param0.title - The title of the list item
 * @param {string} param0.description - The description of the list item
 * @param {boolean} param0.i18nTranslation - Should the title and description be translated through i18next
 * @component */
const ListContentTitleDescription = ({
  title,
  description,
  i18nTranslation = false
}: ListContentTitleDescriptionProps) => {  
  const { info } = useThemeColors();
  return (
    <>
      {title && <TextBase
        text={title}
        i18nTranslation={i18nTranslation} />}
      {description && <TextBase 
        type="label"
        text={description}
        i18nTranslation={i18nTranslation}
        style={{ color: info }} />}
    </>
  )
}

export default ListContentTitleDescription;