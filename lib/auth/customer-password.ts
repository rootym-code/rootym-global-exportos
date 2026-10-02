/**
 * ============================================================
 * ROOTYM Customer Password Authentication
 * ============================================================
 * Purpose:
 * Provides customer password credential operations.
 *
 * Responsibilities:
 * - Create a secure password hash.
 * - Verify a customer password against its stored hash.
 *
 * This service intentionally does NOT:
 * - create Users
 * - create Tenants
 * - create Memberships
 * - create Websites
 * - issue customer JWTs
 * - modify Google OAuth
 *
 * Workspace provisioning and session creation remain separate
 * concerns and will reuse the existing customer architecture.
 * ============================================================
 */

import {
    hashPassword,
    verifyPassword,
  } from "@/lib/auth/password";
  
  /**
   * Create a secure hash for a customer's password.
   *
   * The plaintext password is never returned or stored by this
   * function.
   */
  export async function createCustomerPasswordHash(
    password: string
  ): Promise<string> {
    return hashPassword(password);
  }
  
  /**
   * Verify a customer's plaintext password against the stored hash.
   *
   * Returns true only when the supplied password matches the
   * stored password hash.
   */
  export async function verifyCustomerPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return verifyPassword(password, passwordHash);
  }