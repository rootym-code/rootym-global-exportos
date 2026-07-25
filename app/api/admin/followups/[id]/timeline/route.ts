import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";

import {
  ActivityActorType,
  ActivityEntityType,
} from "@/lib/generated/prisma";

import activityService from "@/lib/services/activity/activity.service";

import prisma from "@/lib/prisma";


interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


interface CreateTimelineActivityBody {
  action: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}


export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth =
      await authenticateAdmin(request);


    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }


    const {
      id,
    } = await context.params;


    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "FollowUp id is required.",
        },
        {
          status: 400,
        },
      );
    }


    const activities =
      await activityService.getTimeline(
        ActivityEntityType.FOLLOWUP,
        id,
      );


    return NextResponse.json(
      {
        success: true,
        activities,
      },
      {
        status: 200,
      },
    );


  } catch (error) {

    console.error(
      "GET /api/admin/followups/[id]/timeline error:",
      error,
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}



export async function POST(
  request: NextRequest,
  context: RouteContext,
) {

  try {

    const auth =
      await authenticateAdmin(request);


    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }


    const {
      id,
    } = await context.params;


    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "FollowUp id is required.",
        },
        {
          status: 400,
        },
      );
    }


    const followUp =
      await prisma.followUp.findUnique({
        where: {
          id,
        },
      });


    if (!followUp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "FollowUp not found.",
        },
        {
          status: 404,
        },
      );
    }


    const body =
      await request.json() as CreateTimelineActivityBody;


    if (
      !body.action ||
      !body.title
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Action and title are required.",
        },
        {
          status: 400,
        },
      );

    }


    const activity =
      await activityService.create({

        entityType:
          ActivityEntityType.FOLLOWUP,


        entityId:
          followUp.id,


        action:
          body.action,


        title:
          body.title,


        description:
          body.description,


        metadata: {
          followUpId:
            followUp.id,

          ...(body.metadata ?? {}),
        },


        actorType:
          ActivityActorType.ADMIN,


          performedById:
          auth.admin?.adminId,

      });



    return NextResponse.json(
      {
        success: true,
        activity,
      },
      {
        status: 201,
      },
    );


  } catch (error) {

    console.error(
      "POST /api/admin/followups/[id]/timeline error:",
      error,
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      },
    );

  }

}