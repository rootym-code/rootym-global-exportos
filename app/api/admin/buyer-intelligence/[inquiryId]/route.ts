import {
  NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";

import {
  authenticateAdmin,
} from "@/lib/auth";

import buyerIntelligenceEngine from "@/lib/brain/buyer";

import type {
  BuyerIntelligenceApiResponse,
} from "@/lib/brain/buyer/api.types";


interface RouteContext {

  params: Promise<{
    inquiryId: string;
  }>;

}



export async function GET(
  request: NextRequest,
  context: RouteContext,
) {

  let inquiryId: string | undefined;


  try {


    const auth =
      await authenticateAdmin(request);



    if (
      !auth.authenticated ||
      !auth.admin
    ) {

      const response:
        BuyerIntelligenceApiResponse =
      {
        success: false,
        message: auth.error,
      };


      return NextResponse.json(
        response,
        {
          status: auth.status,
        },
      );

    }



    inquiryId =
      (await context.params).inquiryId;



    if (!inquiryId) {

      const response:
        BuyerIntelligenceApiResponse =
      {
        success: false,

        message:
          "Inquiry id is required.",
      };


      return NextResponse.json(
        response,
        {
          status: 400,
        },
      );

    }



    const inquiry =
      await prisma.inquiry.findUnique({
        where: {
          id: inquiryId,
        },

        select: {
          id: true,
        },
      });



    if (!inquiry) {

      const response:
        BuyerIntelligenceApiResponse =
      {
        success: false,

        message:
          "Inquiry not found.",
      };


      return NextResponse.json(
        response,
        {
          status: 404,
        },
      );

    }



    const intelligence =
      await buyerIntelligenceEngine.analyze(
        inquiryId,
      );



    const response:
      BuyerIntelligenceApiResponse =
    {
      success: true,

      intelligence,

    };



    return NextResponse.json(
      response,
      {
        status: 200,
      },
    );



  } catch (error) {


    console.error(
      {
        inquiryId,
        error,
      },
      "Buyer Intelligence API failed",
    );



    const response:
      BuyerIntelligenceApiResponse =
    {
      success: false,

      message:
        "Internal Server Error",

    };



    return NextResponse.json(
      response,
      {
        status: 500,
      },
    );

  }

}