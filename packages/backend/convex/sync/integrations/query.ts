import { convexError } from '../../../Fetch';
import { ConvexActionServerityEnum, ConvexCalendarAPIProps, ConvexCalendarQueryAPIProps, ConvexLinkedAPIProps } from '../../../Types';
import { Id } from '../../_generated/dataModel';
import { internalQuery, query } from '../../_generated/server';
import { ConvexError, v } from 'convex/values';

/**
 * @public
 * @since 0.0.13
 * @version 0.0.4
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
        ...linkedAccount,
        calendars: []
      } as ConvexCalendarQueryAPIProps;

      await Promise.all(linkedAccount.calendarId.map(async (calendarId: Id<"calendar">): Promise<void> => {
        const calendar = await db.query('calendar')
          .filter((q) => q.eq(q.field('_id'), calendarId))
          .unique() as ConvexCalendarAPIProps;
        if (!calendar) return;
        calendarQuery.calendars.push({ ...calendar });
      }));

      calendars.push(calendarQuery);
    }));

    return calendars;
  }
});

/**
 * @public
 * @since 0.0.34
 * @version 0.0.1
 * @description Returns all the linked accounts for the currently signed in user with mail permission
 * @param {Object} param0
 * @param {string} param0.userId - User identification (Clerk)
 * @function */
export const linkedWithMailPermission = query({
  args: { userId: v.id('users') },
  handler: async ({ db }, { userId }): Promise<ConvexLinkedAPIProps[]> => await db
    .query('linked')
    .withIndex('byUserId', (q) => q.eq('userId', userId))
    .filter((q) => q.eq(q.field('hasMailPermission'), true))
    .collect()
});

/**
 * @public
 * @since 0.0.21
 * @version 0.0.1
 * @description Returns the calendars information for a given array of calendar ids which are linked to a linked account and a specific user
 * @param {Object} param0
 * @param {Id<"calendar">[]} param0.calendarId - Array of calendar ids
 * @function */
export const calendarsByIds = internalQuery({
  args: { calendarId: v.array(v.id('calendar')) },
  handler: async ({ db }, { calendarId }): Promise<ConvexCalendarAPIProps[]> => 
    await Promise.all(calendarId.map(
      async (calendarId: Id<"calendar">): Promise<ConvexCalendarAPIProps> => 
        await db.get(calendarId) as ConvexCalendarAPIProps))
});

/**
 * @public
 * @since 0.0.10
 * @version 0.0.2
 * @description Returns the linked account by id
 * @param {Object} param0
 * @param {string} param0._id - Linked account id
 * @function */
export const linkedById = internalQuery({
  args: { _id: v.id('linked') },
  handler: async ({ db }, { _id }): Promise<ConvexLinkedAPIProps|null> => await db
    .query('linked')
    .withIndex('by_id', (q) => q.eq('_id', _id))
    .unique()
});

/**
 * @public
 * @since 0.0.38
 * @version 0.0.1
 * @description Returns all the linked accounts for the currently signed in user
 * @param {Object} param0
 * @param {string} param0.userId - User identification (Clerk)
 * @function */
export const linkedByUserId = internalQuery({
  args: { userId: v.id('users') },
  handler: async ({ db }, { userId }): Promise<ConvexLinkedAPIProps[]> => await db
    .query('linked')
    .withIndex('byUserId', (q) => q.eq('userId', userId))
    .collect()
});

/**
 * @public
 * @since 0.0.9
 * @version 0.0.3
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
  handler: async ({ db }, args): Promise<ConvexLinkedAPIProps|null> => {
    try {
      return await db
      .query('linked')
      .withIndex('byUserId', (q) => q.eq('userId', args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('provider'), args.provider),
          q.eq(q.field('providerId'), args.providerId)
        )
      ).unique()
    } catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.integrations.query.linkedByProviderId.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_IQBP_C_E01",
        _id: args.providerId,
      }));
    }
  }
});

/**
 * @public
 * @since 0.0.28
 * @version 0.0.1
 * @description Returns the linked account by calendar id
 * @param {Object} param0
 * @param {Id<"users">} param0.userId - Internal convex user id
 * @param {Id<"calendar">} param0.calendarId - Internal convex calendar id
 * @function */
export const linkedByCalendarId = internalQuery({
  args: { 
    userId: v.id('users'),
    calendarId: v.id('calendar')
  },
  handler: async ({ db }, { userId, calendarId }): Promise<ConvexLinkedAPIProps|null> => {
    try {
      const linkedAccounts = await db
        .query("linked")
        .withIndex("byUserId", (q) => q.eq("userId", userId))
        .collect();
      return linkedAccounts.find((linkedAccount) => linkedAccount.calendarId.includes(calendarId));
    } catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.integrations.query.linkedByCalendarId.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_IQBC_C_E01",
        _id: calendarId as Id<"calendar">,
      }));
    }
  }
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
  handler: async ({ db }, { userId }): Promise<ConvexLinkedAPIProps[]|null> => 
    await db
    .query('linked')
    .withIndex('byUserId', (q) => q.eq('userId', userId))
    .collect()
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.3
 * @description Returns the calendar by id
 * @param {Object} param0
 * @param {Id<"calendar">} param0._id - The convex calendar id to get
 * @function */
export const calendarById = internalQuery({
  args: { _id: v.id('calendar') },
  handler: async ({ db }, { _id }): Promise<ConvexCalendarAPIProps> => {
    try { return await db.get(_id) as ConvexCalendarAPIProps; } 
    catch (err) {
      throw new ConvexError(convexError({
        code: 404,
        info: "i18n.convex.sync.integrations.query.calendarById.notFound",
        severity: ConvexActionServerityEnum.ERROR,
        name: "BLOXIE_IQCB_C_E01",
        _id: _id as Id<"calendar">,
      }));
    }
  }
});

/**
 * @public
 * @since 0.0.21
 * @version 0.0.1
 * @description Returns the calendar by external id => Example: "4c641189a6c3af7d4633b0b5efbfcd806f71b6daf10475c4fe351373a575e53e@group.calendar.google.com"
 * @param {Object} param0
 * @param {string} param0.externalId - External calendar id
 * @function */
export const calendarByExternalId = internalQuery({
  args: { externalId: v.string() },
  handler: async ({ db }, { externalId }): Promise<ConvexCalendarAPIProps|null> => 
    await db.query('calendar')
      .filter((q) => q.eq(q.field('externalId'), externalId))
      .unique() as ConvexCalendarAPIProps|null
});