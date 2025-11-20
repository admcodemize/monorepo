import { Id } from "../../_generated/dataModel";
import { query } from "../../_generated/server";
import { v } from "convex/values";

import { ConvexEventsAPIProps } from "../../../Types";

/**
 * @private
 * @description Used to check if the event is private and the user is a member
 * -> Duplicate of the function in @/helpers/Events.ts because it is used in the query
 * @since 0.0.8
 * @version 0.0.1
 * @param {ConvexEventsAPIProps} event - The event to check
 * @param {Id<"users">} userId - The user id to check
 * @function */
const isPrivateMemberEvent = (
  event: ConvexEventsAPIProps, 
  userId: Id<"users">|undefined
): boolean => (event.isPrivate && event.userId !== userId && !event.participants?.includes(userId as Id<"users">)) || false;

/**
 * @public
 * @since 0.0.9
 * @version 0.0.26
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
        ...event,
        title: isPrivateMemberEvent(event, _id) ? "i18n.calendar.privateTitleForMembers" : event.title,
        descr: isPrivateMemberEvent(event, _id) ? "i18n.calendar.privateDescriptionForMembers" : event.descr,
        location: isPrivateMemberEvent(event, _id) ? String() : event.location
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
export const getById = query({
  args: {
    _id: v.optional(v.id("events"))
  },
  handler: async (ctx, { _id }): Promise<ConvexEventsAPIProps|null> => {
    if (!_id) return null;
    return await ctx.db.get(_id);
  }
});