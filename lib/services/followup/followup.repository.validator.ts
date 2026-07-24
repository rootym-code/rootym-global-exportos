import type {
    FollowUpCreateInput,
    FollowUpUpdateInput,
  } from "./followup.repository.types";
  
  export function validateFollowUpCreateInput(
    input: FollowUpCreateInput,
  ): FollowUpCreateInput {
    if (!input.title?.trim()) {
      throw new Error(
        "Follow-up title is required",
      );
    }
  
    if (!input.inquiry) {
      throw new Error(
        "Follow-up inquiry is required",
      );
    }
  
    if (!input.scheduledAt) {
      throw new Error(
        "Follow-up scheduled date is required",
      );
    }
  
    return input;
  }
  
  export function validateFollowUpUpdateInput(
    input: FollowUpUpdateInput,
  ): FollowUpUpdateInput {
    if (
      input.title &&
      typeof input.title === "string" &&
      !input.title.trim()
    ) {
      throw new Error(
        "Follow-up title cannot be empty",
      );
    }
  
    return input;
  }
  
  export function hasUpdateFields(
    input: FollowUpUpdateInput,
  ): boolean {
    return Object.keys(input).length > 0;
  }