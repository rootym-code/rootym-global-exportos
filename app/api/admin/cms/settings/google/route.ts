/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - Google Settings API
 * Sprint          : 10.4.1
 *
 * Description
 * ------------------------------------------------------------
 * Returns centralized Google Integration configuration used by
 * Admin CMS and the public website.
 * ============================================================
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import siteSettingService from "@/lib/services/cms/site-setting.service";
  
  /* ============================================================
     GET Google Settings
  ============================================================ */
  
  export async function GET() {
    try {
      const settings =
        await siteSettingService.getGoogleSettings();
  
      return NextResponse.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error(
        "Google Settings GET Error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to load Google settings.",
        },
        {
          status: 500,
        }
      );
    }
  }
  
  /* ============================================================
     UPDATE Google Settings
  ============================================================ */
  
  export async function PUT(
    request: NextRequest
  ) {
    try {
      const body = await request.json();
  
      const settings =
        await siteSettingService.saveGoogleSettings(
          body
        );
  
      return NextResponse.json({
        success: true,
        message:
          "Google settings updated successfully.",
        data: settings,
      });
    } catch (error) {
      console.error(
        "Google Settings PUT Error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update Google settings.",
        },
        {
          status: 500,
        }
      );
    }
  }