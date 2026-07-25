/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - Company Settings API
 * Sprint          : CMS 1 - Company Settings
 *
 * Description
 * ------------------------------------------------------------
 * Returns centralized company configuration used by
 * Admin CMS and the public website.
 * ============================================================
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import siteSettingService from "@/lib/services/cms/site-setting.service";

export async function GET() {
  try {
    const settings =
      await siteSettingService.getCompanySettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Company Settings GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load company settings.",
      },
      {
        status: 500,
      }
    );
  }
}
export async function PUT(
    request: NextRequest
  ) {
    try {
      const body = await request.json();
  
      const settings =
        await siteSettingService.saveCompanySettings(
          body
        );
  
      return NextResponse.json({
        success: true,
        message:
          "Company settings updated successfully.",
        data: settings,
      });
    } catch (error) {
      console.error(
        "Company Settings PUT Error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update company settings.",
        },
        {
          status: 500,
        }
      );
    }
  }