/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : Buyer Intelligence Layer
 *
 * Module          : Buyer Profile Service
 *
 * Description
 * ------------------------------------------------------------
 * Builds buyer profile information from existing inquiries.
 *
 * Responsibilities:
 * • Aggregate buyer inquiry history
 * • Identify buyer details
 * • Prepare dashboard-ready buyer data
 *
 * No database persistence.
 * Uses existing Inquiry data.
 *
 * ============================================================
 */


import prisma from "@/lib/prisma";



export interface BuyerInquiryHistory {


    inquiryNumber: string;
  
  
    product: string;
  
  
    quantity?: string;
  
  
    country: string;
  
  
    status: string;
  
  
    salesStage: string;
  
  
    createdAt: Date;
  
  
  }



export interface BuyerProfile {


  companyName: string;


  contactPerson?: string;


  email?: string;


  phone?: string;


  country?: string;


  totalInquiries: number;


  productsRequested: string[];


  inquiryHistory: BuyerInquiryHistory[];


}




export class BuyerProfileService {


  /**
   * Get buyer profile using company name
   */
  async getBuyerByCompany(
    companyName: string
  ): Promise<BuyerProfile | null> {


    const inquiries =
      await prisma.inquiry.findMany({

        where: {

          companyName: {

            equals:
              companyName,

            mode:
              "insensitive",

          },

        },


        orderBy: {

          createdAt:
            "desc",

        },

      });



    if (
      inquiries.length === 0
    ) {

      return null;

    }




    const latestInquiry =
      inquiries[0];



    const products =
      Array.from(

        new Set(

          inquiries

            .map(
              inquiry =>
                inquiry.product
            )

            .filter(
              Boolean
            )

        )

      );




    return {


      companyName:
        latestInquiry.companyName,


      contactPerson:
        latestInquiry.contactPerson
        ?? undefined,


      email:
        latestInquiry.email
        ?? undefined,


      phone:
        latestInquiry.phone
        ?? undefined,


      country:
        latestInquiry.country
        ?? undefined,



      totalInquiries:
        inquiries.length,



      productsRequested:
        products,



      inquiryHistory:

        inquiries.map(
          inquiry => ({

            inquiryNumber:
              inquiry.inquiryNumber,


            product:
              inquiry.product,


              quantity:
              inquiry.quantity ?? "",


            country:
              inquiry.country
              ?? "",


            status:
              inquiry.status,


            salesStage:
              inquiry.salesStage,


            createdAt:
              inquiry.createdAt,

          })

        ),

    };


  }





  /**
   * Search buyer using email
   */
  async getBuyerByEmail(
    email: string
  ): Promise<BuyerProfile | null> {


    const inquiry =
      await prisma.inquiry.findFirst({

        where: {

          email: {

            equals:
              email,

            mode:
              "insensitive",

          },

        },

      });



    if (!inquiry) {

      return null;

    }



    return this.getBuyerByCompany(
      inquiry.companyName
    );


  }


}