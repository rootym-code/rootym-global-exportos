import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export class FollowUpIterator
    implements Iterable<FollowUpEntity>
  {
    constructor(
      private readonly followUps: readonly FollowUpEntity[],
    ) {}
  
    *[Symbol.iterator](): Iterator<FollowUpEntity> {
      for (const followUp of this.followUps) {
        yield followUp;
      }
    }
  
    entries(): IterableIterator<
      [number, FollowUpEntity]
    > {
      return this.followUps.entries();
    }
  
    keys(): IterableIterator<number> {
      return this.followUps.keys();
    }
  
    values(): IterableIterator<FollowUpEntity> {
      return this.followUps.values();
    }
  
    reverse(): IterableIterator<FollowUpEntity> {
      return [...this.followUps]
        .reverse()
        .values();
    }
  
    take(
      count: number,
    ): FollowUpEntity[] {
      return this.followUps.slice(
        0,
        count,
      );
    }
  
    skip(
      count: number,
    ): FollowUpEntity[] {
      return this.followUps.slice(
        count,
      );
    }
  
    chunk(
      size: number,
    ): FollowUpEntity[][] {
      const chunks: FollowUpEntity[][] =
        [];
  
      for (
        let index = 0;
        index < this.followUps.length;
        index += size
      ) {
        chunks.push(
          this.followUps.slice(
            index,
            index + size,
          ),
        );
      }
  
      return chunks;
    }
  
    forEach(
      callback: (
        followUp: FollowUpEntity,
        index: number,
      ) => void,
    ): void {
      this.followUps.forEach(
        callback,
      );
    }
  }