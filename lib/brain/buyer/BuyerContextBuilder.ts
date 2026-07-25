import prisma from "@/lib/prisma";

import {
  FollowUpStatus,
} from "@/lib/generated/prisma";

import type {
  BuyerContext,
} from "./context";


export interface BuildBuyerContextInput {
  inquiryId: string;
}


export class BuyerContextBuilder {


  async build(
    input: BuildBuyerContextInput,
  ): Promise<BuyerContext> {


    const inquiry =
      await prisma.inquiry.findUnique({
        where: {
          id: input.inquiryId,
        },

        include: {
          followUps: true,
        },
      });



    if (!inquiry) {

      throw new Error(
        "Inquiry not found.",
      );

    }



    const activities =
      await prisma.activity.findMany({
        where: {
          entityType: "FOLLOWUP",
          entityId: {
            in: inquiry.followUps.map(
              (item) => item.id,
            ),
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      });



    const completedFollowUps =
      inquiry.followUps.filter(
        (item) =>
          item.status ===
          FollowUpStatus.COMPLETED,
      ).length;



    const pendingFollowUps =
      inquiry.followUps.filter(
        (item) =>
          item.status ===
          FollowUpStatus.PENDING,
      ).length;



    return {

      buyer: {

        companyName:
          inquiry.companyName,

        contactPerson:
          inquiry.contactPerson,

        country:
          inquiry.country,

        phone:
          inquiry.phone,

        email:
          inquiry.email,

      },



      requirement: {

        product:
          inquiry.product,

        quantity:
          inquiry.quantity,

        unit:
          inquiry.unit,

        message:
          inquiry.message,

      },



      engagement: {

        totalFollowUps:
          inquiry.followUps.length,

        completedFollowUps,

        pendingFollowUps,


        firstContactAt:
          inquiry.createdAt,


        lastActivityAt:
          activities.length > 0
            ? activities[
                activities.length - 1
              ].createdAt
            : null,

      },



      history: {

        notes:
          activities
            .filter(
              (item) =>
                Boolean(
                  item.description,
                ),
            )
            .map(
              (item) =>
                item.description!,
            ),
      
      
        outcomes:
          inquiry.followUps
            .filter(
              (item) =>
                item.result !== null,
            )
            .map(
              (item) =>
                item.result!,
            ),
      
      
        activities:
          activities.map(
            (item) => ({
              id: item.id,
      
              action:
                item.action,
      
              title:
                item.title,
      
              description:
                item.description,
      
              actorType:
                item.actorType,
      
              createdAt:
                item.createdAt,
            }),
          ),
      
      },

    };

  }

}



const buyerContextBuilder =
  new BuyerContextBuilder();


export default buyerContextBuilder;