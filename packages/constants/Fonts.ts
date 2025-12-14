/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @type */
type FontProps = {
  label: string|number;
  text: string|number;
  subtitle: string|number; 
  title: string|number;
  header: string|number;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @constant */
export const SIZES = <FontProps>{
  label: 10,
  text: 11,
  subtitle: 12,
  title: 12,
  header: 12
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.1
 * @version 0.0.1
 * @constant */
export const FAMILIY = <FontProps>{
  label: "Inter_500Medium",
  text: "Inter_500Medium",
  subtitle: "Inter_600SemiBold",
  title: "Inter_800ExtraBold",
  header: "Inter_800ExtraBold"
}