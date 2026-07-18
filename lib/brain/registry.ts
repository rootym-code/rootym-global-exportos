/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/registry.ts
 *
 * Brain Handler Registry
 * ============================================================
 */

import CreateInquiryHandler from "./inquiry/CreateInquiryHandler";

export interface BrainHandler<
  TPayload = unknown,
  TResult = unknown,
> {
  readonly action: string;

  execute(
    payload: TPayload,
    context: unknown,
  ): Promise<TResult>;
}

export class BrainRegistry {
  private readonly handlers = new Map<
    string,
    BrainHandler<any, any>
  >();

  register<TPayload, TResult>(
    action: string,
    handler: BrainHandler<TPayload, TResult>,
  ): void {
    if (this.handlers.has(action)) {
      throw new Error(
        `Brain handler already registered: ${action}`,
      );
    }

    this.handlers.set(action, handler);
  }

  get<TPayload, TResult>(
    action: string,
  ): BrainHandler<TPayload, TResult> {
    const handler = this.handlers.get(action);

    if (!handler) {
      throw new Error(
        `No brain handler registered for action: ${action}`,
      );
    }

    return handler as BrainHandler<TPayload, TResult>;
  }

  async execute<TPayload, TResult>(
    action: string,
    payload: TPayload,
    context: unknown,
  ): Promise<TResult> {
    const handler = this.get<TPayload, TResult>(
      action,
    );

    return handler.execute(payload, context);
  }

  has(action: string): boolean {
    return this.handlers.has(action);
  }

  list(): string[] {
    return [...this.handlers.keys()];
  }
}

export const brainRegistry = new BrainRegistry();

/* -------------------------------------------------------------------------- */
/*                         Handler Registration                               */
/* -------------------------------------------------------------------------- */

brainRegistry.register(
  "CREATE_INQUIRY",
  new CreateInquiryHandler(),
);

export default brainRegistry;