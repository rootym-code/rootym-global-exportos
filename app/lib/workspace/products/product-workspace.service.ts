/**
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace adapter for the shared Product
 *          domain service. Resolves the authenticated Website
 *          context and delegates all Product operations to the
 *          existing Website-scoped Product service.
 * ============================================================
 */

import {
    createProduct,
    deleteProduct,
    getProductById,
    getProductBySku,
    getProductBySlug,
    listProductCategories,
    listProducts,
    updateProduct,
    type ProductFilters,
  } from "@/lib/services/product.service";
  
  import type {
    CreateProductInput,
    UpdateProductInput,
  } from "@/lib/validations/product";
  
  import {
    requireWorkspaceWebsite,
  } from "../website/website-context.service";
  
  /**
   * ============================================================
   * LIST PRODUCTS
   * ============================================================
   *
   * Website ownership is derived from the authenticated customer
   * workspace. The caller cannot provide an arbitrary websiteId.
   */
  export async function listWorkspaceProducts(
    filters: ProductFilters = {},
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return listProducts(website.id, filters);
  }
  
  /**
   * ============================================================
   * GET PRODUCT
   * ============================================================
   */
  export async function getWorkspaceProductById(productId: string) {
    const { website } = await requireWorkspaceWebsite();
  
    return getProductById(website.id, productId);
  }
  
  /**
   * ============================================================
   * GET PRODUCT BY SKU
   * ============================================================
   */
  export async function getWorkspaceProductBySku(sku: string) {
    const { website } = await requireWorkspaceWebsite();
  
    return getProductBySku(website.id, sku);
  }
  
  /**
   * ============================================================
   * GET PRODUCT BY SLUG
   * ============================================================
   */
  export async function getWorkspaceProductBySlug(slug: string) {
    const { website } = await requireWorkspaceWebsite();
  
    return getProductBySlug(website.id, slug);
  }
  
  /**
   * ============================================================
   * CREATE PRODUCT
   * ============================================================
   */
  export async function createWorkspaceProduct(
    input: CreateProductInput,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return createProduct(website.id, input);
  }
  
  /**
   * ============================================================
   * UPDATE PRODUCT
   * ============================================================
   */
  export async function updateWorkspaceProduct(
    productId: string,
    input: UpdateProductInput,
  ) {
    const { website } = await requireWorkspaceWebsite();
  
    return updateProduct(website.id, productId, input);
  }
  
  /**
   * ============================================================
   * DELETE PRODUCT
   * ============================================================
   */
  export async function deleteWorkspaceProduct(productId: string) {
    const { website } = await requireWorkspaceWebsite();
  
    return deleteProduct(website.id, productId);
  }
  
  /**
   * ============================================================
   * LIST PRODUCT CATEGORIES
   * ============================================================
   */
  export async function listWorkspaceProductCategories() {
    const { website } = await requireWorkspaceWebsite();
  
    return listProductCategories(website.id);
  }