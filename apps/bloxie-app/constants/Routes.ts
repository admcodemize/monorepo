import {
  faCalendar as faCalendarDuotone,
  faUsersBetweenLines as faUsersBetweenLinesDuotone,
  faObjectsColumn as faObjectsColumnDuotone
} from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendar as faCalendarSolid,
  faUsersBetweenLines as faUsersBetweenLinesSolid,
  faObjectsColumn as faObjectsColumnSolid
} from "@fortawesome/pro-thin-svg-icons";

/**
 * @private
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.1
 * @version 0.0.3
 * @type */
export type RoutesFooterHeader = {
  name: string;
  title: string;
  iconDuotone: IconProp;
  iconSolid: IconProp;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside custom top tab bar component 
 * -> Property "name" is equal to the stack screen name -> ../app/private/tabs/_layout.tsx
 * @readonly
 * @since 0.0.1
 * @version 0.0.3
 * @constant */
export const ROUTES_FOOTER_HEADER: RoutesFooterHeader[] = [{
  name: "index",
  title: "i18n.routes.index",
  iconDuotone: faObjectsColumnDuotone as IconProp,
  iconSolid: faObjectsColumnSolid as IconProp,
}, {
  name: "calendar",
  title: "i18n.routes.calendar",
  iconDuotone: faCalendarDuotone as IconProp,
  iconSolid: faCalendarSolid as IconProp,
}, {
  name: "team",
  title: "i18n.routes.team",
  iconDuotone: faUsersBetweenLinesDuotone as IconProp,
  iconSolid: faUsersBetweenLinesSolid as IconProp,
}];