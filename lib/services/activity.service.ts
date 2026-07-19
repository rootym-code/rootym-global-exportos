/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Platform Activity Engine
 * Feature      : Unified Activity Timeline
 * File         : lib/services/activity.service.ts
 * Version      : 2.0.0
 * Author       : ROOTYM Engineering
 *
 * ============================================================================
 * DESCRIPTION
 * ============================================================================
 *
 * The Activity Service is the central audit engine for the ROOTYM platform.
 *
 * Every business event occurring within the system is recorded through this
 * service, providing a complete chronological history of all business entities.
 *
 * Supported Entities
 * ------------------
 * • Inquiry
 * • Quote
 * • Order
 * • Shipment
 * • Product
 * • Customer
 * • Document
 *
 * Supported Actors
 * ----------------
 * • Admin
 * • Customer
 * • AI
 * • System
 *
 * Design Goals
 * ------------
 * ✔ Generic
 * ✔ Transaction Safe
 * ✔ Highly Reusable
 * ✔ AI Ready
 * ✔ Search Friendly
 * ✔ Timeline Friendly
 * ✔ Enterprise Audit Trail
 *
 * ============================================================================
 */

import { Prisma } from "@/lib/generated/prisma";

import { prisma } from "@/lib/prisma";

/* ============================================================================
* ACTIVITY ACTIONS
* ============================================================================
*
* Never use raw strings such as:
*
*      "QUOTE_CREATED"
*
* Always use:
*
*      ActivityAction.QUOTE_CREATED
*
* This prevents typos and provides autocomplete support.
* ============================================================================
*/

export const ActivityAction = {

  // Inquiry

  INQUIRY_CREATED: "INQUIRY_CREATED",

  INQUIRY_UPDATED: "INQUIRY_UPDATED",

  INQUIRY_STATUS_CHANGED:
      "INQUIRY_STATUS_CHANGED",

  INQUIRY_PRIORITY_CHANGED:
      "INQUIRY_PRIORITY_CHANGED",

  // Quote

  QUOTE_CREATED:
  "QUOTE_CREATED",

QUOTE_UPDATED:
  "QUOTE_UPDATED",

QUOTE_REVISED:
  "QUOTE_REVISED",

QUOTE_SENT:
  "QUOTE_SENT",

QUOTE_STATUS_CHANGED:
  "QUOTE_STATUS_CHANGED",

QUOTE_ACCEPTED:
  "QUOTE_ACCEPTED",

QUOTE_REJECTED:
  "QUOTE_REJECTED",

QUOTE_CANCELLED:
  "QUOTE_CANCELLED",

  // Order

  ORDER_CREATED:
      "ORDER_CREATED",

  ORDER_UPDATED:
      "ORDER_UPDATED",

  ORDER_CONFIRMED:
      "ORDER_CONFIRMED",

  ORDER_CANCELLED:
      "ORDER_CANCELLED",

  // Shipment

  SHIPMENT_CREATED:
      "SHIPMENT_CREATED",

  SHIPMENT_BOOKED:
      "SHIPMENT_BOOKED",

  SHIPMENT_DISPATCHED:
      "SHIPMENT_DISPATCHED",

  SHIPMENT_DELIVERED:
      "SHIPMENT_DELIVERED",

  // Product

  PRODUCT_CREATED:
      "PRODUCT_CREATED",

  PRODUCT_UPDATED:
      "PRODUCT_UPDATED",

  // Customer

  CUSTOMER_CREATED:
      "CUSTOMER_CREATED",

  CUSTOMER_UPDATED:
      "CUSTOMER_UPDATED",

} as const;

export type ActivityActionType =
  typeof ActivityAction[keyof typeof ActivityAction];

/* ============================================================================
* ACTOR TYPES
* ============================================================================
*
* Future-proof support for AI and customer initiated events.
* ============================================================================
*/

export enum ActivityActorType {

  ADMIN = "ADMIN",

  CUSTOMER = "CUSTOMER",

  SYSTEM = "SYSTEM",

  AI = "AI",

}

/* ============================================================================
* METADATA
* ============================================================================
*/

export interface ActivityMetadata
  extends Prisma.JsonObject {}

/* ============================================================================
* CREATE ACTIVITY
* ============================================================================
*/

export interface CreateActivityInput {

    entityType:
    | "INQUIRY"
    | "QUOTE"
    | "ORDER"
    | "SHIPMENT"
    | "PRODUCT"
    | "CUSTOMER"
    | "DOCUMENT";

  entityId: string;

  entityNumber?: string;

  action: ActivityActionType;

  title: string;

  description?: string;

  metadata?: ActivityMetadata;

  performedById?: string;

  actorType?: ActivityActorType;

}

/* ============================================================================
* BULK CREATE
* ============================================================================
*/

export interface CreateManyActivityInput {

  activities: CreateActivityInput[];

}

/* ============================================================================
* TIMELINE FILTER
* ============================================================================
*/

export interface ActivityTimelineFilter {

    entityType:
    | "INQUIRY"
    | "QUOTE"
    | "ORDER"
    | "SHIPMENT"
    | "PRODUCT"
    | "CUSTOMER"
    | "DOCUMENT";

  entityId: string;

  page?: number;

  pageSize?: number;

}

/* ============================================================================
* GLOBAL SEARCH
* ============================================================================
*/

export interface ActivitySearchFilter {

    entityType:
    | "INQUIRY"
    | "QUOTE"
    | "ORDER"
    | "SHIPMENT"
    | "PRODUCT"
    | "CUSTOMER"
    | "DOCUMENT";

  action?: ActivityActionType;

  actorType?: ActivityActorType;

  search?: string;

  page?: number;

  pageSize?: number;

}

/* ============================================================================
* SERVICE
* ============================================================================
*/

export class ActivityService {

  /**
   * Prisma transaction helper.
   */
  private static getClient(
      tx?: Prisma.TransactionClient
  ) {
      return tx ?? prisma;
  }
      /* ==========================================================================
     * CREATE
     * ==========================================================================
     *
     * Creates a single activity entry.
     * All business services should use this method instead of directly writing
     * to the Activity table.
     * ======================================================================== */

      static async create(
        input: CreateActivityInput,
        tx?: Prisma.TransactionClient
      ) {

        const db = ActivityService.getClient(tx);

        return db.activity.create({
            data: {
                entityType: input.entityType,
                entityId: input.entityId,
                entityNumber: input.entityNumber,
                action: input.action,
                title: input.title,
                description: input.description,
                metadata: input.metadata,
                actorType: input.actorType ?? ActivityActorType.ADMIN,
                performedById: input.performedById,
            },

        });

    }

    /* ==========================================================================
     * BULK CREATE
     * ======================================================================== */

    static async createMany(
        input: CreateManyActivityInput,
        tx?: Prisma.TransactionClient
    ): Promise<void> {

        if (input.activities.length === 0) {
            return;
        }

        const db = ActivityService.getClient(tx);

        await db.activity.createMany({

            data: input.activities.map(activity => ({

                entityType: activity.entityType,
                
                actorType: activity.actorType ?? ActivityActorType.ADMIN,

                entityId: activity.entityId,

                entityNumber: activity.entityNumber,

                action: activity.action,

                title: activity.title,

                description: activity.description,

                metadata: activity.metadata,

                performedById: activity.performedById,

            })),

        });

    }

    /* ==========================================================================
     * ENTITY TIMELINE
     * ======================================================================== */

    static async getTimeline(
        filter: ActivityTimelineFilter
    ) {

        const page =
            filter.page ?? 1;

        const pageSize =
            filter.pageSize ?? 25;

        const skip =
            (page - 1) * pageSize;

        const [items, total] =
            await prisma.$transaction([

                prisma.activity.findMany({

                    where: {

                        entityType: filter.entityType,

                        entityId: filter.entityId,

                    },

                    include: {

                        performedBy: {

                            select: {

                                id: true,

                                name: true,

                                email: true,

                            },

                        },

                    },

                    orderBy: {

                        createdAt: "desc",

                    },

                    skip,

                    take: pageSize,

                }),

                prisma.activity.count({

                    where: {

                        entityType: filter.entityType,

                        entityId: filter.entityId,

                    },

                }),

            ]);

        return {

            items,

            total,

            page,

            pageSize,

            totalPages: Math.ceil(total / pageSize),

        };

    }

    /* ==========================================================================
     * GLOBAL ACTIVITY FEED
     * ======================================================================== */

    static async getRecentActivities(
        limit = 20
    ) {

        return prisma.activity.findMany({

            include: {

                performedBy: {

                    select: {

                        id: true,

                        name: true,

                    },

                },

            },

            orderBy: {

                createdAt: "desc",

            },

            take: limit,

        });

    }

    /* ==========================================================================
     * SEARCH
     * ======================================================================== */

    static async search(
        filter: ActivitySearchFilter
    ) {

        const page =
            filter.page ?? 1;

        const pageSize =
            filter.pageSize ?? 25;

        const skip =
            (page - 1) * pageSize;

        const where: Prisma.ActivityWhereInput = {

            entityType: filter.entityType,

            action: filter.action,

            OR: filter.search
                ? [

                    {

                        title: {

                            contains: filter.search,

                            mode: "insensitive",

                        },

                    },

                    {

                        description: {

                            contains: filter.search,

                            mode: "insensitive",

                        },

                    },

                    {

                        entityNumber: {

                            contains: filter.search,

                            mode: "insensitive",

                        },

                    },

                ]
                : undefined,

        };

        const [items, total] =
            await prisma.$transaction([

                prisma.activity.findMany({

                    where,

                    include: {

                        performedBy: {

                            select: {

                                id: true,

                                name: true,

                            },

                        },

                    },

                    orderBy: {

                        createdAt: "desc",

                    },

                    skip,

                    take: pageSize,

                }),

                prisma.activity.count({

                    where,

                }),

            ]);

        return {

            items,

            total,

            page,

            pageSize,

            totalPages:
                Math.ceil(total / pageSize),

        };

    }

    /* ==========================================================================
     * STATISTICS
     * ======================================================================== */

    static async getStatistics() {

        const total =
            await prisma.activity.count();

        return {

            total,

        };

    }

    /* ==========================================================================
     * DELETE
     * ==========================================================================
     *
     * Intended for maintenance utilities only.
     * Activities should normally be immutable.
     * ======================================================================== */

    static async delete(
        id: string,
        tx?: Prisma.TransactionClient
    ) {

        const db =
            ActivityService.getClient(tx);

        return db.activity.delete({

            where: {

                id,

            },

        });

    }
}

/* ============================================================================
 * BUSINESS HELPERS
 * ============================================================================
 *
 * Business services should use these helpers instead of creating activity
 * records manually. This guarantees consistent titles, actions and metadata
 * across the platform.
 * ============================================================================
 */

export class ActivityLogger {

  /* ========================================================================
   * INQUIRY
   * ====================================================================== */

  static async logInquiryCreated(
      params: {
          inquiryId: string;
          inquiryNumber: string;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "INQUIRY",
              entityId: params.inquiryId,
              entityNumber: params.inquiryNumber,

              action: ActivityAction.INQUIRY_CREATED,

              title: "Inquiry Created",

              description:
                  "New customer inquiry received.",

              performedById: params.performedById,

              actorType: params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  static async logInquiryStatusChanged(
      params: {
          inquiryId: string;
          inquiryNumber: string;
          oldStatus: string;
          newStatus: string;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "INQUIRY",
              entityId: params.inquiryId,
              entityNumber: params.inquiryNumber,

              action: ActivityAction.INQUIRY_STATUS_CHANGED,

              title: "Inquiry Status Updated",

              description:
                  `${params.oldStatus} → ${params.newStatus}`,

              metadata: {
                  oldStatus: params.oldStatus,
                  newStatus: params.newStatus,
              },

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  /* ========================================================================
   * QUOTE
   * ====================================================================== */

  static async logQuoteCreated(
      params: {
          quoteId: string;
          quoteNumber: string;
          version: number;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "QUOTE",
              entityId: params.quoteId,
              entityNumber: params.quoteNumber,

              action: ActivityAction.QUOTE_CREATED,

              title: "Quote Created",

              description:
                  `Quote Version ${params.version} created.`,

              metadata: {
                  version: params.version,
              },

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  static async logQuoteRevised(
      params: {
          quoteId: string;
          quoteNumber: string;
          version: number;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "QUOTE",
              entityId: params.quoteId,
              entityNumber: params.quoteNumber,

              action: ActivityAction.QUOTE_REVISED,

              title: "Quote Revised",

              description:
                  `Revision ${params.version} created.`,

              metadata: {
                  version: params.version,
              },

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  static async logQuoteSent(
      params: {
          quoteId: string;
          quoteNumber: string;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "QUOTE",
              entityId: params.quoteId,
              entityNumber: params.quoteNumber,

              action: ActivityAction.QUOTE_SENT,

              title: "Quote Sent",

              description:
                  "Quotation emailed to customer.",

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  static async logQuoteAccepted(
      params: {
          quoteId: string;
          quoteNumber: string;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "QUOTE",
              entityId: params.quoteId,
              entityNumber: params.quoteNumber,

              action: ActivityAction.QUOTE_ACCEPTED,

              title: "Quote Accepted",

              description:
                  "Customer accepted the quotation.",

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  static async logQuoteRejected(
      params: {
          quoteId: string;
          quoteNumber: string;
          performedById?: string;
          actorType?: ActivityActorType;
      },
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(
          {
              entityType: "QUOTE",
              entityId: params.quoteId,
              entityNumber: params.quoteNumber,

              action: ActivityAction.QUOTE_REJECTED,

              title: "Quote Rejected",

              description:
                  "Customer rejected the quotation.",

              performedById: params.performedById,

              actorType:
                  params.actorType ??
                  ActivityActorType.ADMIN,
          },
          tx
      );
  }

  /* ========================================================================
   * ORDER
   * ====================================================================== */

  static async logOrderCreated(
      input: CreateActivityInput,
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(input, tx);
  }

  /* ========================================================================
   * SHIPMENT
   * ====================================================================== */

  static async logShipmentCreated(
      input: CreateActivityInput,
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(input, tx);
  }

  /* ========================================================================
   * GENERIC
   * ====================================================================== */

  static async logEvent(
      input: CreateActivityInput,
      tx?: Prisma.TransactionClient
  ) {
      return ActivityService.create(input, tx);
  }
}

/* ============================================================================
* EXPORTS
* ============================================================================
*/

export default ActivityService;

/* ============================================================================
* FUTURE ROADMAP
* ============================================================================
*
* Phase 2
* --------
* • Dashboard Activity Feed
* • Notification Integration
* • WebSocket Broadcasting
* • Email Activity
* • WhatsApp Activity
*
* Phase 3
* --------
* • AI Decision Timeline
* • Customer Portal Timeline
* • Shipment Tracking Timeline
* • Complete Audit Reporting
*
* This service is intended to remain the single source of truth for all
* platform activity and should be extended through helper methods rather
* than duplicating activity creation logic in business services.
* ============================================================================
*/