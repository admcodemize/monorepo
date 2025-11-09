/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
type LevelProps = {
  level1: number;
  level2: number;
  level3: number;
}

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
type StylesProps = {
  sizeTouchable: number;
  sizeFaIcon: number;
  sizeGap: number;
  layoutTabHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  marginHorizontal: number;
  layoutFooterHeight: number;
  calendarHourHeight: number;
  calendarHourWidth: number;
  calendarHourBorderHeight: number;
  calendarHeaderHeight: number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @constant */
export const LEVEL = <LevelProps>{
  level1: 10,
  level2: 5,
  level3: 1
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @constant */
export const STYLES = <StylesProps>{
  sizeTouchable: 28,
  sizeFaIcon: 14,
  sizeGap: 8,
  layoutTabHeight: 50,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginHorizontal: 20,
  layoutFooterHeight: 50,
  calendarHourHeight: 60,
  calendarHourWidth: 45,
  calendarHourBorderHeight: 1,
  calendarHeaderHeight: 50
}