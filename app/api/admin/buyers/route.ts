/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : Buyer Intelligence Dashboard
 *
 * Module          : Admin Buyer API
 *
 * Description
 * ------------------------------------------------------------
 * Provides buyer list data from existing inquiries.
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
    request: NextRequest
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
  
  
  
      const inquiries =
        await prisma.inquiry.findMany({
  
          orderBy: {
  
            createdAt:
              "desc",
  
          },
  
        });
  
  
  
      const buyerMap =
        new Map();
  
  
  
      inquiries.forEach(
        (inquiry) => {
  
  
          const key =
            inquiry.companyName
              .toLowerCase();
  
  
  
          if (!buyerMap.has(key)) {
  
  
            buyerMap.set(
              key,
              {
  
                companyName:
                  inquiry.companyName,
  
  
                contactPerson:
                  inquiry.contactPerson,
  
  
                email:
                  inquiry.email,
  
  
                phone:
                  inquiry.phone,
  
  
                country:
                  inquiry.country,
  
  
                totalInquiries:
                  1,
  
  
                products:
                  [
                    inquiry.product
                  ],
  
  
                latestInquiry:
                  inquiry.createdAt,
  
  
                latestInquiryNumber:
                  inquiry.inquiryNumber,
  
              }
            );
  
  
          } else {
  
  
            const buyer =
              buyerMap.get(key);
  
  
  
            buyer.totalInquiries += 1;
  
  
  
            if (
              !buyer.products.includes(
                inquiry.product
              )
            ) {
  
              buyer.products.push(
                inquiry.product
              );
  
            }
  
          }
  
  
        }
      );
  
  
  
      const buyers =
        Array.from(
          buyerMap.values()
        );
  
  
  
      return NextResponse.json(
        {
          success: true,
          buyers,
        }
      );
  
  
    } catch (error) {
  
  
      console.error(
        "Buyer API Error:",
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