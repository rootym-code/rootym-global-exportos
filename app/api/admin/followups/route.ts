import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import followUpService from "@/lib/services/followup/followup.service";

export async function GET(request: NextRequest) {
  try {
    const followUps = await followUpService.getPending();

    return ApiResponse.success({
      data: followUps,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (
        !body.inquiryId ||
        !body.title ||
        !body.actionType ||
        !body.category ||
        !body.scheduledAt
      ) {
        return ApiResponse.error({
          message: "Missing required fields.",
          status: 400,
        });
      }

    const followUp = await followUpService.create({
      inquiryId: body.inquiryId,
      title: body.title,
      description: body.description,
      actionType: body.actionType,
      category: body.category,
      scheduledAt: new Date(body.scheduledAt),
    });
    
    return ApiResponse.success({
      data: followUp,
    });
  } catch (error) {
    return handleApiError(error);
  }
}