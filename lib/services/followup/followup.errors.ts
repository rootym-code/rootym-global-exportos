export class FollowUpError extends Error {
    constructor(message: string) {
      super(message);
  
      this.name = "FollowUpError";
    }
  }
  
  export class FollowUpNotFoundError extends FollowUpError {
    constructor() {
      super("Follow-up not found.");
  
      this.name = "FollowUpNotFoundError";
    }
  }
  
  export class InquiryNotFoundError extends FollowUpError {
    constructor() {
      super("Inquiry not found.");
  
      this.name = "InquiryNotFoundError";
    }
  }
  
  export class FollowUpAlreadyCompletedError extends FollowUpError {
    constructor() {
      super("Follow-up has already been completed.");
  
      this.name = "FollowUpAlreadyCompletedError";
    }
  }
  
  export class FollowUpAlreadyCancelledError extends FollowUpError {
    constructor() {
      super("Follow-up has already been cancelled.");
  
      this.name = "FollowUpAlreadyCancelledError";
    }
  }
  
  export class FollowUpAlreadyAssignedError extends FollowUpError {
    constructor() {
      super("Follow-up is already assigned to this administrator.");
  
      this.name = "FollowUpAlreadyAssignedError";
    }
  }
  
  export class AssignedAdminNotFoundError extends FollowUpError {
    constructor() {
      super("Assigned administrator not found.");
  
      this.name = "AssignedAdminNotFoundError";
    }
  }
  
  export class InvalidFollowUpStatusError extends FollowUpError {
    constructor() {
      super("Invalid follow-up status.");
  
      this.name = "InvalidFollowUpStatusError";
    }
  }
  
  export class InvalidFollowUpScheduleError extends FollowUpError {
    constructor() {
      super("Invalid follow-up schedule.");
  
      this.name = "InvalidFollowUpScheduleError";
    }
  }