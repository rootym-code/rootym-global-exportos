import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export class FollowUpCollection {
    constructor(
      private readonly followUps: FollowUpEntity[],
    ) {}
  
    all(): FollowUpEntity[] {
      return [...this.followUps];
    }
  
    first():
      | FollowUpEntity
      | undefined {
      return this.followUps[0];
    }
  
    last():
      | FollowUpEntity
      | undefined {
      return this.followUps[
        this.followUps.length - 1
      ];
    }
  
    count(): number {
      return this.followUps.length;
    }
  
    isEmpty(): boolean {
      return (
        this.followUps.length === 0
      );
    }
  
    map<T>(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => T,
    ): T[] {
      return this.followUps.map(
        callback,
      );
    }
  
    filter(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => boolean,
    ): FollowUpCollection {
      return new FollowUpCollection(
        this.followUps.filter(
          callback,
        ),
      );
    }
  
    find(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => boolean,
    ):
      | FollowUpEntity
      | undefined {
      return this.followUps.find(
        callback,
      );
    }
  
    some(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => boolean,
    ): boolean {
      return this.followUps.some(
        callback,
      );
    }
  
    every(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => boolean,
    ): boolean {
      return this.followUps.every(
        callback,
      );
    }
  
    sort(
      comparator: (
        a: FollowUpEntity,
        b: FollowUpEntity,
      ) => number,
    ): FollowUpCollection {
      return new FollowUpCollection(
        [...this.followUps].sort(
          comparator,
        ),
      );
    }
  
    toArray(): FollowUpEntity[] {
      return [...this.followUps];
    }
  }