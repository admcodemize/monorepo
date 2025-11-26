import { ConvexCalendarAPIProps, ConvexCalendarQueryAPIProps, ConvexEventsAPIProps, ConvexLinkedAPIProps, IntegrationAPICalendarAccessRoleEnum } from '../../../Types';
import { Id } from '../../_generated/dataModel';
import { internalQuery, query } from '../../_generated/server';
import { v } from 'convex/values';

/**
 * @public
 * @since 0.0.13
 * @version 0.0.2
 * @description Returns all the integrations for the currently signed in user
 * @param {Object} param0
 * @param {string} param0.userId - User identification (Clerk)
 * @function */
export const get = query({
  args: { userId: v.id('users') },
  handler: async ({ db }, { userId }): Promise<ConvexCalendarQueryAPIProps[]> => {
    const calendars: ConvexCalendarQueryAPIProps[] = [];

    /** @description 1. Get all the linked accounts for the currently signed in user */
    const linkedAccounts: ConvexLinkedAPIProps[] = await db.query('linked')
      .withIndex('byUserId', (q) => q.eq('userId', userId))
      .collect();

    /** @description 2. Get all the calendars for all the linked accounts */
    await Promise.all(linkedAccounts.map(async (linkedAccount): Promise<void> => {
      let calendarQuery: ConvexCalendarQueryAPIProps = {
        _id: linkedAccount._id,
        _creationTime: linkedAccount._creationTime,
        email: linkedAccount.email,
        provider: linkedAccount.provider,
        providerId: linkedAccount.providerId,
        hasMailPermission: linkedAccount.hasMailPermission,
        calendars: []
      } as ConvexCalendarQueryAPIProps;

      await Promise.all(linkedAccount.calendarsId.map(async (calendarId: Id<"calendar">): Promise<void> => {
        const calendar = await db.query('calendar')
          .filter((q) => q.eq(q.field('_id'), calendarId))
          .unique() as ConvexCalendarAPIProps;
        if (!calendar) return;

        calendarQuery.calendars.push({
          _id: calendar._id,
          _creationTime: calendar._creationTime,
          accessRole: calendar.accessRole as IntegrationAPICalendarAccessRoleEnum,
          backgroundColor: calendar.backgroundColor,
          description: calendar.description,
          foregroundColor: calendar.foregroundColor,
          primary: calendar.primary,
          eventsCount: calendar.eventsCount
        });
      }));

      calendars.push(calendarQuery);
    }));

    return calendars;
  }
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.1
 * @description Returns the linked account by id
 * @param {Object} param0
 * @param {string} param0._id - Linked account id
 * @function */
export const linkedById = internalQuery({
  args: { _id: v.id('linked') },
  handler: async ({ db }, { _id }) => db
    .query('linked')
    .withIndex('by_id', (q) => q.eq('_id', _id))
    .unique()
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Returns the linked account by provider id
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @param {string} param0.provider - Oauth provider which has been used for the authentication flow
 * @param {string} param0.providerId - Provider identification
 * @param {string} param0.email - Email-address by oauth provider or email authentication
 * @function */
export const linkedByProviderId = internalQuery({
  args: {
    userId: v.id('users'),
    provider: v.string(),
    providerId: v.string()
  },
  handler: async ({ db }, args) => db
    .query('linked')
    .withIndex('byUserId', (q) => q.eq('userId', args.userId))
    .filter((q) =>
      q.and(
        q.eq(q.field('provider'), args.provider),
        q.eq(q.field('providerId'), args.providerId)
      )
    )
    .unique()
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.1
 * @description Returns all linked accounts by user identification for selecting the calendar events
 * @param {Object} param0
 * @param {string} param0.userId - User identification
 * @function */
export const linkedByUser = internalQuery({
  args: { userId: v.id('users') },
  handler: async ({ db }, { userId }) => db
    .query('linked')
    .withIndex('byUserId', (q) => q.eq('userId', userId))
    .collect()
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.1
 * @description Returns the calendar by id
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The convex calendar id to get
 * @function */
export const calendarById = internalQuery({
  args: { _id: v.id('calendar') },
  handler: async ({ db }, { _id }) => _id && await db.get(_id) as ConvexCalendarAPIProps
})