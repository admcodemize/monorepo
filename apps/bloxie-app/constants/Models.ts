import { ListItemDropdownProps } from "@/components/lists/item/ListItemDropdown";
import {
  faArrowProgress,
  faBarsProgress,
  faBoltSlash,
  faBookOpenCover,
  faBusinessTime,
  faCalendarDay,
  faCalendarDays,
  faCalendarDays as faCalendarDaysDuotone,
  faCalendar as faCalendarDuotone,
  faCalendarWeek,
  faCalendarWeek as faCalendarWeekDuotone,
  faDistributeSpacingVertical,
  faUsersBetweenLines,
  faTrowelBricks,
  faUserSecret,
  faFlaskGear,
  faCalendarCirclePlus,
  faHourglassStart,
  faHourglassEnd,
  faTrashCanSlash,
  faClockEightThirty,
  faEnvelope,
  faBellSlash,
  faStopwatch,
  faEnvelopeOpenText,
  faBells,
  faStopwatch20,
} from "@fortawesome/duotone-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faCalendarDay as faCalendarDaySolid,
  faCalendarDays as faCalendarDaysSolid,
  faCalendar as faCalendarSolid,
  faCalendarWeek as faCalendarWeekSolid,
  faDistributeSpacingVertical as faDistributeSpacingVerticalSolid,
  faItalic,
  faUnderline,
  faListOl,
  faListUl,
  faBlockQuote,
  faCode
} from "@fortawesome/pro-solid-svg-icons";

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type DropdownItemProps = {
  key: string|number;
  title: string;
  iconDuotone: IconProp;
  iconSolid: IconProp;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.1
 * @version 0.0.2
 * @type */
export type DashboardPeriodProps = DropdownItemProps & {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @type */
export type CalendarViewProps = DropdownItemProps & {}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @readonly
 * @since 0.0.7
 * @version 0.0.1
 * @type */
export type TrayActionItemProps = {
  key: string;
  route?: string;
  icon: IconProp;
  title: string;
  description: string;
  modal?: string;
  isComingSoon?: boolean;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @since 0.0.38
 * @version 0.0.1
 * @type */
export type EditorStyleItemProps = {
  key: string;
  icon: IconProp;
  state: string;
  functionAsString: string;
}

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside dashboard component 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @constant */
export const DROPDOWN_DASHBOARD_PERIOD: DashboardPeriodProps[] = [{
  key: "last30Days",
  title: "i18n.dropdown.dashboard.calendar.last30Days",
  iconDuotone: faCalendarWeekDuotone as IconProp,
  iconSolid: faCalendarWeekSolid as IconProp,
}, {
  key: "last90Days",
  title: "i18n.dropdown.dashboard.calendar.last90Days",
  iconDuotone: faCalendarDaysDuotone as IconProp,
  iconSolid: faCalendarDaysSolid as IconProp,
}, {
  key: "allTime",
  title: "i18n.dropdown.dashboard.calendar.allTime",
  iconDuotone: faCalendarDuotone as IconProp,
  iconSolid: faCalendarSolid as IconProp,
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside dashboard component 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @constant */
export const DROPDOWN_CALENDAR_VIEWS: CalendarViewProps[] = [{
  key: "day",
  title: "i18n.dropdown.calendar.views.day",
  iconDuotone: faCalendarDay as IconProp,
  iconSolid: faCalendarDaySolid as IconProp,
}, {
  key: "3days",
  title: "i18n.dropdown.calendar.views.3days",
  iconDuotone: faCalendarDays as IconProp,
  iconSolid: faCalendarDaysSolid as IconProp,
}, {
  key: "week",
  title: "i18n.dropdown.calendar.views.week",
  iconDuotone: faCalendarWeek as IconProp,
  iconSolid: faCalendarWeekSolid as IconProp,
}, {
  key: "agenda",
  title: "i18n.dropdown.calendar.views.agenda",
  iconDuotone: faDistributeSpacingVertical as IconProp,
  iconSolid: faDistributeSpacingVerticalSolid as IconProp,
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside tray action component 
 * @readonly
 * @since 0.0.2
 * @version 0.0.1
 * @constant */
export const TRAY_ACTION_ITEMS: TrayActionItemProps[] = [{
  key: "booking",
  route: "booking",
  icon: faCalendarDays as IconProp,
  title: "i18n.screens.trayAction.items.booking.title",
  description: "i18n.screens.trayAction.items.booking.description",
}, {
  key: "poll",
  route: "poll",
  icon: faBarsProgress as IconProp,
  title: "i18n.screens.trayAction.items.poll.title",
  description: "i18n.screens.trayAction.items.poll.description",
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside tray configuration component 
 * @readonly
 * @since 0.0.2
 * @version 0.0.2
 * @constant */
export const TRAY_CONFIGURATION_ITEMS: TrayActionItemProps[] = [{
  key: "bookingPage",
  icon: faBookOpenCover as IconProp,
  title: "i18n.screens.trayAction.items.bookingPage.title",
  description: "i18n.screens.trayAction.items.bookingPage.description",
}, {
  key: "availability",
  route: "availability",
  icon: faBusinessTime as IconProp,
  title: "i18n.screens.trayAction.items.availability.title",
  description: "i18n.screens.trayAction.items.availability.description",
}, {
  key: "type",
  route: "type",
  icon: faBoltSlash as IconProp,
  title: "i18n.screens.trayAction.items.type.title",
  description: "i18n.screens.trayAction.items.type.description",
}, {
  key: "integration",
  route: "integration",
  icon: faTrowelBricks as IconProp,
  title: "i18n.screens.trayAction.items.integration.title",
  description: "i18n.screens.trayAction.items.integration.description",
  modal: "i18n.screens.trayAction.items.integration.modal",
}, {
  key: "team",
  route: "team",
  icon: faUsersBetweenLines as IconProp,
  title: "i18n.screens.trayAction.items.team.title",
  description: "i18n.screens.trayAction.items.team.description",
  isComingSoon: true,
}, {
  key: "workflow",
  route: "workflow",
  icon: faArrowProgress as IconProp,
  title: "i18n.screens.trayAction.items.workflow.title",
  description: "i18n.screens.trayAction.items.workflow.description",
  modal: "i18n.screens.trayAction.items.workflow.modal",
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling generic data inside tray configuration component 
 * @readonly
 * @since 0.0.30
 * @version 0.0.1
 * @constant */
export const TRAY_ACCOUNT_ITEMS: TrayActionItemProps[] = [{
  key: "settings",
  icon: faFlaskGear as IconProp,
  title: "i18n.screens.trayAction.items.settings.title",
  description: "i18n.screens.trayAction.items.settings.description",
}, {
  key: "user",
  icon: faUserSecret as IconProp,
  title: "i18n.screens.trayAction.items.user.title",
  description: "i18n.screens.trayAction.items.user.description",
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling the editor style items 
 * @readonly
 * @since 0.0.38
 * @version 0.0.1
 * @constant */
export const EDITOR_STYLE_ITEMS: EditorStyleItemProps[] = [{
  key: "orderedList",
  icon: faListOl as IconProp,
  state: "isOrderedList",
  functionAsString: "toggleOrderedList",
}, {
  key: "unorderedList",
  icon: faListUl as IconProp,
  state: "isUnorderedList",
  functionAsString: "toggleUnorderedList",
}, {
  key: "bold",
  icon: faBold as IconProp,
  state: "isBold",
  functionAsString: "toggleBold",
}, {
  key: "italic",
  icon: faItalic as IconProp,
  state: "isItalic",
  functionAsString: "toggleItalic",
}, {
  key: "underline",
  icon: faUnderline as IconProp,
  state: "isUnderline",
  functionAsString: "toggleUnderline",
}, {
  key: "blockQuote",
  icon: faBlockQuote as IconProp,
  state: "isBlockQuote",
  functionAsString: "toggleBlockQuote",
}, {
  key: "codeBlock",
  icon: faCode as IconProp,
  state: "isCodeBlock",
  functionAsString: "toggleCodeBlock",
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling the workflow trigger items for the dropdown
 * @readonly
 * @since 0.0.43
 * @version 0.0.1
 * @constant */
export const WORKFLOW_TRIGGER_ITEMS: ListItemDropdownProps[] = [{
  itemKey: "newBooking",
  title: "Neue Terminbuchung",
  icon: faCalendarCirclePlus as IconProp,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  isSelected: true,
}, {
  itemKey: "beforeEventStart",
  title: "Vor Ereignisbeginn",
  icon: faHourglassStart as IconProp
}, {
  itemKey: "afterEventEnd",
  title: "Nach Ereignisende",
  icon: faHourglassEnd as IconProp
}, {
  itemKey: "afterEventCancellation",
  title: "Nach Ereignisstornierung",
  icon: faTrashCanSlash as IconProp
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling the workflow time period items for the dropdown
 * @readonly
 * @since 0.0.43
 * @version 0.0.1
 * @constant */
export const WORKFLOW_TIME_PERIOD_ITEMS: ListItemDropdownProps[] = [{
  itemKey: "week",
  title: "Wochen",
  icon: faCalendarWeek as IconProp
}, {
  itemKey: "day",
  title: "Tage",
  icon: faCalendarDay as IconProp
}, {
  itemKey: "hour",
  title: "Stunden",
  icon: faStopwatch as IconProp,
  isSelected: true,
}, {
  itemKey: "minute",
  title: "Minuten",
  icon: faStopwatch20 as IconProp
}];

/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Used for handling the workflow confirmation items for the dropdown
 * @readonly
 * @since 0.0.43
 * @version 0.0.1
 * @constant */
export const WORKFLOW_CONFIRMATION_ITEMS: ListItemDropdownProps[] = [{
  itemKey: "pushNotification",
  title: "Push-Benachrichtigung",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  icon: faBells as IconProp,
  isSelected: true,
}, {
  itemKey: "sendEmail",
  title: "E-Mail-Benachrichtigung",
  icon: faEnvelopeOpenText as IconProp
}, {
  itemKey: "none",
  title: "Keine Bestätigung",
  icon: faBellSlash as IconProp,
}];