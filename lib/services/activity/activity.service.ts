import prisma from "@/lib/prisma";

import {
  ActivityActorType,
  ActivityEntityType,
  Prisma,
} from "@/lib/generated/prisma";


export interface CreateActivityInput {
  entityType: ActivityEntityType;

  entityId: string;

  entityNumber?: string;

  action: string;

  title: string;

  description?: string;

  metadata?: Prisma.InputJsonValue;

  actorType?: ActivityActorType;

  performedById?: string;
}


export interface CreateFollowUpActivityInput {

  followUpId: string;

  inquiryId: string;

  action: string;

  title: string;

  description?: string;

  metadata?: Prisma.InputJsonValue;

  actorType?: ActivityActorType;

  performedById?: string;

}


export class ActivityService {


  async create(
    input: CreateActivityInput,
  ) {

    return await prisma.activity.create({
      data: {

        entityType:
          input.entityType,


        entityId:
          input.entityId,


        entityNumber:
          input.entityNumber,


        action:
          input.action,


        title:
          input.title,


        description:
          input.description,


        metadata:
          input.metadata,


        actorType:
          input.actorType ??
          ActivityActorType.SYSTEM,


        performedById:
          input.performedById,

      },
    });

  }



  async createFollowUpActivity(
    input: CreateFollowUpActivityInput,
  ) {

    return await this.create({
      
      entityType:
        ActivityEntityType.FOLLOWUP,


      entityId:
        input.followUpId,


      action:
        input.action,


      title:
        input.title,


      description:
        input.description,


        metadata:
        typeof input.metadata === "object" &&
        input.metadata !== null &&
        !Array.isArray(input.metadata)
          ? {
              inquiryId: input.inquiryId,
              ...input.metadata,
            }
          : {
              inquiryId: input.inquiryId,
              value: input.metadata,
            },


      actorType:
        input.actorType ??
        ActivityActorType.SYSTEM,


      performedById:
        input.performedById,

    });

  }



  async getTimeline(
    entityType: ActivityEntityType,
    entityId: string,
  ) {

    return await prisma.activity.findMany({
      where: {
        entityType,
        entityId,
      },

      orderBy: {
        createdAt: "desc",
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
    });

  }



  async getFollowUpTimeline(
    followUpId: string,
  ) {

    return await this.getTimeline(
      ActivityEntityType.FOLLOWUP,
      followUpId,
    );

  }

}


const activityService =
  new ActivityService();


export default activityService;