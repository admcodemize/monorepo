import { internalMutation, internalQuery, query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexEventsAPIProps } from "../../../Types";

/**
 * @public
 * @since 0.0.9
 * @version 0.0.2
 * @description Returns all the events for currently signed in user and their subscriptions */
export const get = query({
  args: {
    _id: v.id("users"),
    members: v.optional(v.array(v.id("users")))
  },
  handler: async (ctx, { _id, members }): Promise<ConvexEventsAPIProps[]> => {
    /**
     * @description Get all the events for the currently signed in user and their subscriptions inclusive participants
     * @see {@link convex/sync/events/query/get} */
    const events = await Promise.all([
      /** @description 1. Get events owned by the current user */
      ctx.db.query("events")
        .withIndex("byUserId", (q) => q.eq("userId", _id))
        .collect(),
      
      /** @description 2. Get events owned by members (if any) */
      ...(members && members.length > 0 ? 
        members.map(memberId => 
          ctx.db.query("events")
            .withIndex("byUserId", (q) => q.eq("userId", memberId))
            .collect()
        ) : []
      ),

      /** @description 3. Get events where current user is a participant */
      /*ctx.db.query("events")
        .filter((q) => q.and(
          q.neq(q.field("participants"), undefined),
          q.neq(q.field("participants"), null)
        ))
        .collect()
        .then(events => events.filter(event => 
          event.participants?.includes(_id) && event.userId !== _id
        ))*/
    ]);

    /** @description Flatten all event sets and remove duplicates */
    return events
      .flat()
      .filter((event, index, self) => index === self.findIndex(e => e._id === event._id))
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
      /** 
       * @description Add private title and description for events created by members 
       * -> This is used to translate the title and description for events created by members 
       * -> The location will be hidden for private events by members */
      .map(event => ({
        ...event as ConvexEventsAPIProps,
        /*title: isPrivateMemberEvent(event, _id) ? "i18n.calendar.privateTitleForMembers" : event.title,
        descr: isPrivateMemberEvent(event, _id) ? "i18n.calendar.privateDescriptionForMembers" : event.descr,
        location: isPrivateMemberEvent(event, _id) ? String() : event.location*/
      }));
  }
});

/**
 * @public
 * @since 0.0.8
 * @version 0.0.1
 * @description Returns the event with the given id 
 * @param {Id<"events">} _id - The event id to get
 * @function */
export const byId = query({
  args: { _id: v.id("events") },
  handler: async (ctx, { _id }): Promise<ConvexEventsAPIProps|null> => await ctx.db.get(_id) as ConvexEventsAPIProps
});

/**
 * @public
 * @since 0.0.11
 * @version 0.0.2
 * @description Returns the event with the given external event id based on the integrated external id
 * @param {Id<"users">} userId - The user id to get the event for
 * @param {string} externalEventId - The external event id to get => Example: "19847123541235412354123541235"
 * @function */
export const byExternalEventId = internalQuery({
  args: { 
    userId: v.id("users"),
    externalEventId: v.string() 
  }, 
  handler: async (ctx, { userId, externalEventId }): Promise<ConvexEventsAPIProps|null> => await ctx.db
    .query("events")
    .withIndex("byExternalEventId", (q) => q.eq("externalEventId", externalEventId))
    .filter((q) => q.eq(q.field("userId"), userId))
    .unique() as ConvexEventsAPIProps
})

/**
 * @public
 * @since 0.0.14
 * @version 0.0.2
 * @description Returns all the events for the given provider id
 * -> Used for deleting all the events for a given provider id
 * @param {Id<"users">} userId - The user id to get the events for
 * @param {string} externalCalendarId - The external calendar id to get => Example: "4c641189a6c3af7d4633b0b5efbfcd806f71b6daf10475c4fe351373a575e53e@group.calendar.google.com"
 * @function */
export const byExternalCalendarId = internalQuery({
  args: { 
    userId: v.id("users"),
    externalCalendarId: v.string()
  }, 
  handler: async (ctx, { userId, externalCalendarId }): Promise<ConvexEventsAPIProps[]> => await ctx.db
    .query("events")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalCalendarId))
    .filter((q) => q.eq(q.field("userId"), userId))
    .collect() as ConvexEventsAPIProps[]
})