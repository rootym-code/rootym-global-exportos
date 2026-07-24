import type {
    FollowUpFindManyArgs,
    FollowUpFindUniqueArgs,
    FollowUpCountArgs,
  } from "./followup.repository.types";
  
  export class FollowUpRepositoryFactory {
    static createFindManyArgs(
      args: FollowUpFindManyArgs,
    ): FollowUpFindManyArgs {
      return {
        ...args,
      };
    }
  
    static createFindUniqueArgs(
      args: FollowUpFindUniqueArgs,
    ): FollowUpFindUniqueArgs {
      return {
        ...args,
      };
    }
  
    static createCountArgs(
      args: FollowUpCountArgs,
    ): FollowUpCountArgs {
      return {
        ...args,
      };
    }
  }
  
  export default FollowUpRepositoryFactory;