export type FollowUpCacheEvent =
  | "set"
  | "delete"
  | "clear"
  | "hit"
  | "miss";

export interface FollowUpCacheEventPayload {
  event: FollowUpCacheEvent;
  key?: string;
  timestamp: Date;
}

type EventListener = (
  payload: FollowUpCacheEventPayload,
) => void;

export class FollowUpCacheEventBus {
  private listeners = new Map<
    FollowUpCacheEvent,
    Set<EventListener>
  >();

  on(
    event: FollowUpCacheEvent,
    listener: EventListener,
  ) {
    const listeners =
      this.listeners.get(event) ??
      new Set<EventListener>();

    listeners.add(listener);

    this.listeners.set(
      event,
      listeners,
    );
  }

  off(
    event: FollowUpCacheEvent,
    listener: EventListener,
  ) {
    this.listeners
      .get(event)
      ?.delete(listener);
  }

  emit(
    event: FollowUpCacheEvent,
    key?: string,
  ) {
    const payload: FollowUpCacheEventPayload =
      {
        event,
        key,
        timestamp: new Date(),
      };

    this.listeners
      .get(event)
      ?.forEach((listener) =>
        listener(payload),
      );
  }

  removeAll() {
    this.listeners.clear();
  }
}

const followUpCacheEvents =
  new FollowUpCacheEventBus();

export default followUpCacheEvents;