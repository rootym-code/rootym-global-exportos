import prisma from "@/lib/prisma";

import {
  ActivityActorType,
  ActivityEntityType,
  FollowUpResult,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import activityService from "@/lib/services/activity/activity.service";

import {
  FOLLOW_UP_OUTCOME_RULES,
} from "./outcome.rules";

import type {
  FollowUp,
} from "@/lib/generated/prisma";


interface ProcessOutcomeInput {
  followUp: FollowUp;
  result: FollowUpResult;
}


export class FollowUpOutcomeEngine {

  async process(
    input: ProcessOutcomeInput,
  ) {

    const {
      followUp,
      result,
    } = input;


    const rule =
      FOLLOW_UP_OUTCOME_RULES[result];


    if (!rule) {
      return null;
    }


    if (!rule.createNextFollowUp) {
      return {
        created: false,
        reason: rule.reason,
      };
    }


    const scheduledAt =
      new Date();

    scheduledAt.setDate(
      scheduledAt.getDate() +
      (rule.delayDays ?? 3),
    );


    const nextFollowUp =
      await prisma.followUp.create({
        data: {

          inquiryId:
            followUp.inquiryId,


          parentFollowUpId:
            followUp.id,


          title:
            rule.nextTitle ??
            "Next follow-up",


          description:
            rule.reason,


          actionType:
            rule.nextActionType ??
            followUp.actionType,


          category:
            rule.nextCategory ??
            followUp.category,


          priority:
            rule.nextPriority ??
            followUp.priority,


          status:
            FollowUpStatus.PENDING,


          scheduledAt,


          sequence:
            followUp.sequence + 1,


          assignedToId:
            followUp.assignedToId,

        },
      });


    await activityService.create({
      entityType:
        ActivityEntityType.INQUIRY,

      entityId:
        followUp.inquiryId,

      action:
        "NEXT_FOLLOWUP_CREATED",

      title:
        "Next follow-up created",

      description:
        `${nextFollowUp.title} scheduled.`,

      metadata: {
        parentFollowUpId:
          followUp.id,

        nextFollowUpId:
          nextFollowUp.id,

        result,

        scheduledAt:
          nextFollowUp.scheduledAt,
      },

      actorType:
        ActivityActorType.SYSTEM,
    });


    return {
      created: true,

      followUp:
        nextFollowUp,

      reason:
        rule.reason,
    };
  }
}


const followUpOutcomeEngine =
  new FollowUpOutcomeEngine();


export default followUpOutcomeEngine;