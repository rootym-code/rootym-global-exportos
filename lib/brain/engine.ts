/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/engine.ts
 *
 * Central Brain Execution Engine
 * ============================================================
 */

import type { BrainContext } from "./context";
import { brainRegistry } from "./registry";

export class Brain {
  /**
   * Execute a registered Brain action.
   */
  static async execute<TPayload, TResult>(
    action: string,
    payload: TPayload,
    context: BrainContext,
  ): Promise<TResult> {
    return brainRegistry.execute<TPayload, TResult>(
      action,
      payload,
      context,
    );
  }

  /**
   * Check whether a Brain action is registered.
   */
  static has(action: string): boolean {
    return brainRegistry.has(action);
  }

  /**
   * List all registered Brain actions.
   */
  static actions(): string[] {
    return brainRegistry.list();
  }
}

export default Brain;