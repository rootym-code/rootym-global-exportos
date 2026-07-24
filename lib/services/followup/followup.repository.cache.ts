import followUpCache from "./followup.cache";

import FollowUpCacheKeys from "./followup.keys";

export class FollowUpRepositoryCache {
  get<T>(
    key: string,
  ): T | null {
    return followUpCache.get<T>(
      key,
    );
  }

  set<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ) {
    followUpCache.set(
      key,
      value,
      ttlSeconds,
    );
  }

  delete(
    key: string,
  ) {
    followUpCache.delete(
      key,
    );
  }

  clearFollowUp(
    id: string,
  ) {
    this.delete(
      FollowUpCacheKeys.followUp(id),
    );
  }

  clearInquiry(
    inquiryId: string,
  ) {
    this.delete(
      FollowUpCacheKeys.inquiry(
        inquiryId,
      ),
    );
  }

  clearLists() {
    this.delete(
      FollowUpCacheKeys.pending(),
    );

    this.delete(
      FollowUpCacheKeys.today(),
    );

    this.delete(
      FollowUpCacheKeys.upcoming(),
    );

    this.delete(
      FollowUpCacheKeys.overdue(),
    );
  }
}

const followUpRepositoryCache =
  new FollowUpRepositoryCache();

export default followUpRepositoryCache;