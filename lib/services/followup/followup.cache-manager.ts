import followUpCache from "./followup.cache";
import FollowUpCacheKeys from "./followup.keys";

export class FollowUpCacheManager {
  invalidateAll() {
    followUpCache.clear();
  }

  invalidateDashboard() {
    followUpCache.delete(
      FollowUpCacheKeys.dashboard(),
    );

    followUpCache.delete(
      FollowUpCacheKeys.stats(),
    );
  }

  invalidateInquiry(
    inquiryId: string,
  ) {
    followUpCache.delete(
      FollowUpCacheKeys.inquiry(inquiryId),
    );
  }

  invalidateFollowUp(id: string) {
    followUpCache.delete(
      FollowUpCacheKeys.followUp(id),
    );
  }

  invalidateAssigned(
    adminId: string,
  ) {
    followUpCache.delete(
      FollowUpCacheKeys.assigned(adminId),
    );
  }

  invalidateSearch(
    query: string,
  ) {
    followUpCache.delete(
      FollowUpCacheKeys.search(query),
    );
  }

  invalidateLists() {
    followUpCache.delete(
      FollowUpCacheKeys.pending(),
    );

    followUpCache.delete(
      FollowUpCacheKeys.today(),
    );

    followUpCache.delete(
      FollowUpCacheKeys.upcoming(),
    );

    followUpCache.delete(
      FollowUpCacheKeys.overdue(),
    );

    followUpCache.delete(
      FollowUpCacheKeys.archived(),
    );
  }
}

const followUpCacheManager =
  new FollowUpCacheManager();

export default followUpCacheManager;