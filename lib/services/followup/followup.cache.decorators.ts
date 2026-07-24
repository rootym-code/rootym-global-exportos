import followUpCache from "./followup.cache";

export async function withFollowUpCache<T>(
  key: string,
  loader: () => Promise<T>,
  ttlSeconds = 300,
): Promise<T> {
  const cached =
    followUpCache.get<T>(key);

  if (cached !== null) {
    return cached;
  }

  const value = await loader();

  followUpCache.set(
    key,
    value,
    ttlSeconds,
  );

  return value;
}

export async function refreshFollowUpCache<T>(
  key: string,
  loader: () => Promise<T>,
  ttlSeconds = 300,
): Promise<T> {
  const value = await loader();

  followUpCache.set(
    key,
    value,
    ttlSeconds,
  );

  return value;
}

export function removeFollowUpCache(
  key: string,
) {
  followUpCache.delete(key);
}

export function clearFollowUpCache() {
  followUpCache.clear();
}