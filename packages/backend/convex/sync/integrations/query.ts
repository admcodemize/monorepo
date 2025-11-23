import { ConvexCalendarAPIProps } from '../../../Types';
import { internalQuery } from '../../_generated/server';
import { v } from 'convex/values';

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
  handler: async ({ db }, { _id }) => await db.get(_id) as ConvexCalendarAPIProps
})