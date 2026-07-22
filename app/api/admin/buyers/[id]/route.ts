/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : Buyer Intelligence Dashboard
 *
 * Module          : Buyer Detail API
 *
 * Description
 * ------------------------------------------------------------
 * Provides complete buyer profile information.
 *
 * Includes:
 * • Buyer details
 * • Inquiry history
 * • Product interests
 * • Sales information
 *
 * No database migration required.
 *
 * ============================================================
 */


import {
  NextRequest,
  NextResponse,
} from "next/server";


import prisma from "@/lib/prisma";


import {
  authenticateAdmin,
} from "@/lib/auth";




export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {


  try {


    const auth =
      await authenticateAdmin(
        request
      );



    if (!auth.authenticated) {


      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        }
      );


    }




    const {
      id,
    } = await context.params;




    const buyerInquiry =
      await prisma.inquiry.findUnique({

        where: {
          id,
        },

      });





    if (!buyerInquiry) {


      return NextResponse.json(
        {
          success: false,
          message: "Buyer not found.",
        },
        {
          status: 404,
        }
      );


    }





    const inquiries =
      await prisma.inquiry.findMany({

        where: {

          OR: [

            {
              companyName:
                buyerInquiry.companyName,
            },


            {
              email:
                buyerInquiry.email,
            },


            {
              phone:
                buyerInquiry.phone,
            },

          ],

        },


        orderBy: {

          createdAt:
            "desc",

        },

      });







    const products =
      Array.from(

        new Set(

          inquiries.map(
            inquiry =>
              inquiry.product
          )

        )

      );






    const inquiryHistory =
      inquiries.map(

        inquiry => ({

          id:
            inquiry.id,


          inquiryNumber:
            inquiry.inquiryNumber,


          product:
            inquiry.product,


          quantity:
            inquiry.quantity,


          unit:
            inquiry.unit,


          country:
            inquiry.country,


          status:
            inquiry.status,


          priority:
            inquiry.priority,


          salesStage:
            inquiry.salesStage,


          source:
            inquiry.source,


          createdAt:
            inquiry.createdAt,

        })

      );






    return NextResponse.json({

      success: true,


      buyer: {


        companyName:
          buyerInquiry.companyName,


        contactPerson:
          buyerInquiry.contactPerson,


        email:
          buyerInquiry.email,


        phone:
          buyerInquiry.phone,


        country:
          buyerInquiry.country,


        products,


        totalInquiries:
          inquiries.length,


        latestInquiry:
          inquiryHistory[0] ?? null,


        inquiryHistory,


      },


    });




  } catch (error) {


    console.error(
      "Buyer Detail API Error:",
      error
    );



    return NextResponse.json(

      {
        success: false,
        message:
          "Internal Server Error",
      },

      {
        status: 500,
      }

    );


  }


}