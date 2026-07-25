/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : CMS - WhatsApp Settings API
 * Sprint          : 11.2
 *
 * Description
 * ------------------------------------------------------------
 * Returns centralized WhatsApp configuration used by
 * Admin CMS and Meta Cloud API integration.
 * ============================================================
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import siteSettingService from "@/lib/services/cms/site-setting.service";
  
  /* ============================================================
     GET WhatsApp Settings
  ============================================================ */
  
  export async function GET() {
    try {
      const settings =
        await siteSettingService.getWhatsAppSettings();
  
      return NextResponse.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error(
        "WhatsApp Settings GET Error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to load WhatsApp settings.",
        },
        {
          status: 500,
        }
      );
    }
  }
  
  /* ============================================================
     UPDATE WhatsApp Settings
  ============================================================ */
  
  export async function PUT(
    request: NextRequest
  ) {
    try {
      const body = await request.json();
  
      const settings =
        await siteSettingService.saveWhatsAppSettings(
          body
        );
  
      return NextResponse.json({
        success: true,
        message:
          "WhatsApp settings updated successfully.",
        data: settings,
      });
    } catch (error) {
      console.error(
        "WhatsApp Settings PUT Error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update WhatsApp settings.",
        },
        {
          status: 500,
        }
      );
    }
  }