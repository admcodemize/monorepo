import { EDITOR_STYLE_ITEMS } from "@/constants/Models";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { ConvexRuntimeAPITemplateVariableProps } from "@codemize/backend/Types";
import { SIZES } from "@codemize/constants/Fonts";
import React, { RefObject } from "react";
import { DimensionValue, NativeSyntheticEvent } from "react-native";
import { EnrichedTextInput, EnrichedTextInputInstance, OnChangeSelectionEvent, OnChangeStateEvent } from "react-native-enriched";

type EditorHtmlStyleProps = {
  colorMention: string;
  colorCodeBlock: string;
  colorBlockQuote: string;
  colorLink: string;
  colorDefault: string;
  backgroundColor: string;
}

export type EditorStyleState = Record<typeof EDITOR_STYLE_ITEMS[number]["state"], boolean>;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @type */
export type EditorProps = {
  placeholder?: string;
  defaultValue?: string;
  mentionIndicators?: string[];
  maxHeight?: DimensionValue;
  primaryTextColor?: string;
  fontSize?: number;
  padding?: number;
  showBorderBottom?: boolean;
  onIsFocused?: (isFocused: boolean) => void;
  onStyleStateChange?: (styleState: EditorStyleState) => void;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used to create the initial style state
 * @since 0.0.38
 * @version 0.0.1
 * @function */
export const createInitialStyleState = (): EditorStyleState =>
  EDITOR_STYLE_ITEMS.reduce((acc, item) => {
    acc[item.state] = false;
    return acc;
  }, {} as EditorStyleState);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @description Used to create the mention markup for the given indiciator
 * -> # => variables / @ => mentions
 * @param {string} name - The name of the variable
 * @param {string} indicator - The indicator of the mention -> # => variables / @ => mentions -> default is #
 * @function */
export const createMentionMarkup = (
  name: string,
  indicator: string = "#"
) => `<mention indicator="${indicator}" text="${name}" type="variable">${name}</mention>\u200B`;

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @description Used to normalize the html string -> remove extra spaces between tags
 * @param {string} value - The value to normalize
 * @function */
export const normalizeHtml = (value: string) => value.trim().replace(/>\s+</g, "><");

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @description Used to hydrate the template with the given template variables
 * @param {string} html - The html string to hydrate
 * @param {ConvexRuntimeAPITemplateVariableProps[]} templateVariables - The template variables to hydrate the template with
 * @function */
export const hydrateTemplate = (
  html: string,
  templateVariables: ConvexRuntimeAPITemplateVariableProps[]
) =>
  templateVariables.map((variable) => variable.pattern).reduce(
    (acc, variable) => acc.replaceAll(
      `{{${variable}}}`,
      createMentionMarkup(variable)), html);

/**
 * @public
 * Converts enriched HTML back into the template placeholder format.
 * @since 0.0.39
 * @version 0.0.1
 * @description Replaces mention tags (inserted inside the editor) with the original {{variable}} pattern.
 * @param {string} html - The html string to dehydrate
 * @function */
export const dehydrateTemplate = (html: string) =>
  normalizeHtml(html)
    .replace(/\u200B/g, '')
    .replace(/<mention[^>]*text="([^"]+)"[^>]*>.*?<\/mention>/g, (_, pattern) => `{{${pattern}}}`);

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.39
 * @version 0.0.1
 * @description Used to insert the variable into the editor
 * @param {RefObject<EnrichedTextInputInstance>} ref - The reference to the editor
 * @param {string} variable - The variable to insert
 * @param {string} indicator - The indicator of the mention -> # => variables / @ => mentions -> default is #
 * @function */
export const insertPatternValue = (
  ref: RefObject<EnrichedTextInputInstance|null>, 
  variable: string,
  indicator: string = "#",
  type: "variable" | "mention" = "variable"
) => {
  if (!ref.current) return;
  ref.current?.focus();
  ref.current?.startMention(indicator);
  ref.current?.setMention(indicator, variable, { type });
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @param {EditorProps} param0
 * @param {string} param0.placeholder - The placeholder of the editor
 * @param {string} param0.defaultValue - The default value of the editor -> html or plain text
 * @param {string[]} param0.mentionIndicators - The indicators of the mentions -> @ => mentions and # => variables
 * @param {DimensionValue} param0.maxHeight - The maximum height of the editor
 * @param {string} param0.textColor - The text color of the editor -> default is infoColor
 * @param {number} param0.fontSize - The font size of the editor -> default is text size
 * @param {number} param0.padding - The padding of the editor -> default is 4
 * @param {boolean} param0.showBorderBottom - Whether to show the border bottom of the editor -> default is false
 * @param {function} param0.onIsFocused - The callback function when the editor is focused -> default is no callback
 * @param {function} param0.onStyleStateChange - The callback function when the style state changes -> default is no callback
 * @component */
const Editor = React.forwardRef<EnrichedTextInputInstance, EditorProps>(({ 
  placeholder,
  defaultValue,
  mentionIndicators = ["#", "@"],
  maxHeight = "100%",
  primaryTextColor,
  fontSize = Number(SIZES.text),
  padding = 4,
  showBorderBottom = false,
  onIsFocused = () => {},
  onStyleStateChange = () => {}
}, ref) => {
  const { infoColor, textColor, primaryTemplateBgColor, primaryBorderColor } = useThemeColors();
  const refSelection = React.useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const [styleState, setStyleState] = React.useState(createInitialStyleState());

  /** @description Used to trigger the onStyleStateChange callback when the style state changes */
  React.useEffect(() => {
    onStyleStateChange(styleState);
  }, [styleState, onStyleStateChange]);

  /** @description Used to handle the selection change of the content inside the editor */
  const onChangeSelectionInternal = React.useCallback(
  (event: NativeSyntheticEvent<OnChangeSelectionEvent>) => {
    refSelection.current = {
      start: event.nativeEvent.start,
      end: event.nativeEvent.end,
    };
  }, [refSelection]);

  /** 
   * @description Used to handle the state change of the content inside the editor
   * -> Changes the highlighting of the styling buttons which are declared outside the editor */
  const onChangeState = React.useCallback((event: NativeSyntheticEvent<OnChangeStateEvent>) => {
    const { isBold, isItalic, isUnderline, isOrderedList, isUnorderedList, isBlockQuote, isCodeBlock } = event.nativeEvent ?? {};
    setStyleState((prev) => ({
      ...prev,
      isBold: isBold ?? prev.isBold,
      isItalic: isItalic ?? prev.isItalic,
      isUnderline: isUnderline ?? prev.isUnderline,
      isOrderedList: isOrderedList ?? prev.isOrderedList,
      isUnorderedList: isUnorderedList ?? prev.isUnorderedList,
      isBlockQuote: isBlockQuote ?? prev.isBlockQuote,
      isCodeBlock: isCodeBlock ?? prev.isCodeBlock,
    }));
  }, [setStyleState]);

  return (
    <EnrichedTextInput
      ref={ref as RefObject<EnrichedTextInputInstance>}
      placeholder={placeholder}
      defaultValue={defaultValue}
      placeholderTextColor={infoColor}
      selectionColor={"#000"}
      autoFocus={false}
      autoCapitalize="none"
      mentionIndicators={mentionIndicators}
      onFocus={() => onIsFocused(true)}
      onBlur={() => onIsFocused(false)}
      editable={true}
      onChangeSelection={onChangeSelectionInternal}
      onChangeState={onChangeState}
      htmlStyle={generateEditorHtmlStyle({
        colorMention: textColor,
        colorCodeBlock: infoColor,
        colorBlockQuote: infoColor,
        colorLink: infoColor,
        colorDefault: infoColor,
        backgroundColor: primaryTemplateBgColor,
      })}
      style={{
        flex: 1,
        fontSize,
        padding,
        color: primaryTextColor || infoColor,
        maxHeight: maxHeight,
        borderBottomWidth: showBorderBottom ? 1 : 0,
        borderBottomColor: primaryBorderColor,
      }} />
  );
});

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @param {EditorHtmlStyleProps} param0
 * @param {string} param0.colorMention - The color of the mention
 * @param {string} param0.colorCodeBlock - The color of the code block
 * @param {string} param0.colorBlockQuote - The color of the block quote
 * @param {string} param0.colorLink - The color of the link
 * @param {string} param0.colorDefault - The color of the default text
 * @param {string} param0.backgroundColor - The background color of the html style "codeblock" and "mention"
 * @function */
export const generateEditorHtmlStyle = ({
  colorMention,
  colorCodeBlock,
  colorBlockQuote,
  colorLink,
  colorDefault,
  backgroundColor
}: EditorHtmlStyleProps) => ({
  mention: {
    "#": {
      color: colorMention,
      textDecorationLine: "none" as const,
      backgroundColor,
    },
  },
  codeblock: {
    color: colorCodeBlock,
    borderRadius: 0,
    backgroundColor,
  },
  blockquote: {
    gapWidth: 6,
    color: colorBlockQuote,
  },
  h2: {
    fontSize: 11,
  },
  h3: {
    fontSize: 10,
  },
  a: {
    color: colorLink,
    textDecorationLine: "underline" as const,
  },
  ol: {
    gapWidth: 10,
    marginLeft: 10,
    markerFontWeight: "bold" as const,
    markerColor: colorDefault,
  },
  ul: {
    bulletSize: 4,
    marginLeft: 10,
    gapWidth: 10,
    bulletColor: colorDefault,
  }
})

export default Editor;