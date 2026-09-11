/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace adapter for the shared Product
 *          Pricing domain service. Resolves the authenticated
 *          Website context and delegates all pricing operations
 *          to the existing Website-scoped pricing service.
 * ============================================================
 */

import {
    createProductPricing,
    deleteProductPricing,
    getActiveProductPrice,
    getProductPricingById,
    listProductPricing,
    updateProductPricing,
  } from "@/lib/services/product-pricing.service";
  
  import type {
    CreateProductPricingInput,
    UpdateProductPricingInput,
  } from "@/lib/validations/product-pricing";
  
  import {
    requireWorkspaceWebsite,
  } from "../website/website-context.service";
  
  /**
   * ============================================================
   * LIST PRODUCT PRICING
   * ============================================================
   */
  export async function listWorkspaceProductPricing(
    productId: string,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return listProductPricing(website.id, productId);
  }
  
  /**
   * ============================================================
   * GET PRODUCT PRICING
   * ============================================================
   */
  export async function getWorkspaceProductPricingById(
    pricingId: string,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return getProductPricingById(website.id, pricingId);
  }
  
  /**
   * ============================================================
   * GET ACTIVE PRODUCT PRICE
   * ============================================================
   */
  export async function getWorkspaceActiveProductPrice(
    productId: string,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return getActiveProductPrice(website.id, productId);
  }
  
  /**
   * ============================================================
   * CREATE PRODUCT PRICING
   * ============================================================
   */
  export async function createWorkspaceProductPricing(
    input: CreateProductPricingInput,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return createProductPricing(website.id, input);
  }
  
  /**
   * ============================================================
   * UPDATE PRODUCT PRICING
   * ============================================================
   */
  export async function updateWorkspaceProductPricing(
    pricingId: string,
    input: UpdateProductPricingInput,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return updateProductPricing(website.id, pricingId, input);
  }
  
  /**
   * ============================================================
   * DELETE PRODUCT PRICING
   * ============================================================
   */
  export async function deleteWorkspaceProductPricing(
    pricingId: string,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return deleteProductPricing(website.id, pricingId);
  }