/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the admin API for managing billing-provider
 *          availability by development, staging and production
 *          environment.
 * ============================================================
 */

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { BillingEnvironment } from "@/lib/generated/prisma";

import {
  getBillingProviderRegistry,
} from "@/app/lib/billing/providers";

/**
 * ============================================================
 * Supported environment validation
 * ============================================================
 */

function isBillingEnvironment(
  value: string,
): value is BillingEnvironment {
  return (
    value === BillingEnvironment.DEVELOPMENT ||
    value === BillingEnvironment.STAGING ||
    value === BillingEnvironment.PRODUCTION
  );
}

/**
 * ============================================================
 * Provider registry validation
 * ============================================================
 */

function getRegisteredProviderNames() {
  return new Set(
    getBillingProviderRegistry().map(
      (provider) => provider.name,
    ),
  );
}

/**
 * ============================================================
 * GET
 * ============================================================
 * Returns the complete provider configuration for the
 * requested billing environment.
 * ============================================================
 */

export async function GET(
  request: Request,
) {
  try {
    const url = new URL(request.url);

    const environmentParam =
      url.searchParams.get("environment") ??
      BillingEnvironment.DEVELOPMENT;

    if (
      !isBillingEnvironment(
        environmentParam,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid billing environment is required.",
        },
        {
          status: 400,
        },
      );
    }

    const registry =
      getBillingProviderRegistry();

    const configurations =
      await prisma.billingProviderConfig.findMany(
        {
          where: {
            environment:
              environmentParam,
          },
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              provider: "asc",
            },
          ],
        },
      );

    const configurationMap =
      new Map(
        configurations.map(
          (configuration) => [
            configuration.provider,
            configuration,
          ],
        ),
      );

    const providers = registry.map(
      (provider) => {
        const configuration =
          configurationMap.get(
            provider.name,
          );

        return {
          name: provider.name,

          displayName:
            configuration?.displayName?.trim() ||
            provider.displayName,

          enabled:
            configuration?.enabled ?? false,

          sortOrder:
            configuration?.sortOrder ?? 0,

          configured:
            Boolean(configuration),

          supportsPlanChange:
            typeof provider.createPlanChangePayment ===
            "function",
        };
      },
    );

    return NextResponse.json({
      success: true,
      data: {
        environment:
          environmentParam,
        providers,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/billing/providers",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load billing-provider configuration.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * ============================================================
 * PUT
 * ============================================================
 * Creates or updates provider configuration for one
 * environment/provider combination.
 * ============================================================
 */

export async function PUT(
  request: Request,
) {
  try {
    let body: {
      environment?: string;
      providers?: Array<{
        provider?: string;
        enabled?: boolean;
        displayName?: string;
        sortOrder?: number;
      }>;
    };

    try {
      body =
        (await request.json()) as typeof body;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid JSON request body is required.",
        },
        {
          status: 400,
        },
      );
    }

    const environment =
      body.environment;

    if (
      !environment ||
      !isBillingEnvironment(
        environment,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid billing environment is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Array.isArray(
        body.providers,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Provider configuration must be an array.",
        },
        {
          status: 400,
        },
      );
    }

    const registeredProviders =
      getRegisteredProviderNames();

    const submittedProviders =
      new Set<string>();

    for (
      const provider of body.providers
    ) {
      const providerName =
        provider.provider?.trim();

      if (!providerName) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Provider name is required.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !registeredProviders.has(
          providerName as never,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Unsupported billing provider "${providerName}".`,
          },
          {
            status: 400,
          },
        );
      }

      if (
        submittedProviders.has(
          providerName,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Duplicate provider "${providerName}" was submitted.`,
          },
          {
            status: 400,
          },
        );
      }

      submittedProviders.add(
        providerName,
      );

      if (
        provider.enabled !== undefined &&
        typeof provider.enabled !==
          "boolean"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid enabled value for "${providerName}".`,
          },
          {
            status: 400,
          },
        );
      }

      if (
        provider.sortOrder !== undefined &&
        (!Number.isInteger(
          provider.sortOrder,
        ) ||
          provider.sortOrder < 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid sort order for "${providerName}".`,
          },
          {
            status: 400,
          },
        );
      }
    }

    await prisma.$transaction(
      body.providers.map(
        (provider) => {
          const providerName =
            provider.provider!.trim();

          return prisma.billingProviderConfig.upsert(
            {
              where: {
                environment_provider: {
                  environment,
                  provider:
                    providerName,
                },
              },

              create: {
                environment,
                provider:
                  providerName,
                enabled:
                  provider.enabled ?? false,
                displayName:
                  provider.displayName?.trim() ||
                  null,
                sortOrder:
                  provider.sortOrder ?? 0,
              },

              update: {
                enabled:
                  provider.enabled ?? false,
                displayName:
                  provider.displayName?.trim() ||
                  null,
                sortOrder:
                  provider.sortOrder ?? 0,
              },
            },
          );
        },
      ),
    );

    const configurations =
      await prisma.billingProviderConfig.findMany(
        {
          where: {
            environment,
          },
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              provider: "asc",
            },
          ],
        },
      );

    return NextResponse.json({
      success: true,
      message:
        "Billing-provider configuration saved successfully.",
      data: {
        environment,
        configurations,
      },
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/billing/providers",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to save billing-provider configuration.",
      },
      {
        status: 500,
      },
    );
  }
}