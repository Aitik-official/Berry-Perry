/**
 * Progressive Parallel Batch Fetching Engine
 * Executes paginated requests in concurrent batches of 2 without blocking UI interactions.
 */

export interface BatchFetchOptions<T> {
  baseUrl: string;
  limit?: number;
  maxBatches?: number;
  onBatchReceived?: (batchItems: T[], currentTotal: number) => void;
  transformResponse?: (data: any) => { items: T[]; hasMore: boolean; total?: number };
}

export async function progressiveBatchFetch<T>({
  baseUrl,
  limit = 20,
  maxBatches = 5,
  onBatchReceived,
  transformResponse = (d) => ({
    items: d.items || d.data || [],
    hasMore: Boolean(d.hasMore),
    total: d.total,
  }),
}: BatchFetchOptions<T>): Promise<T[]> {
  const allResults: T[] = [];
  let currentPage = 1;
  let keepGoing = true;

  for (let batch = 0; batch < maxBatches && keepGoing; batch++) {
    const pageA = currentPage;
    const pageB = currentPage + 1;
    currentPage += 2;

    const separator = baseUrl.includes("?") ? "&" : "?";
    const urlA = `${baseUrl}${separator}page=${pageA}&limit=${limit}`;
    const urlB = `${baseUrl}${separator}page=${pageB}&limit=${limit}`;

    try {
      const [resA, resB] = await Promise.all([
        fetch(urlA).catch(() => null),
        fetch(urlB).catch(() => null),
      ]);

      const dataA = resA && resA.ok ? await resA.json().catch(() => null) : null;
      if (dataA) {
        const parsedA = transformResponse(dataA);
        allResults.push(...parsedA.items);
        onBatchReceived?.(parsedA.items, allResults.length);
        if (!parsedA.hasMore || parsedA.items.length < limit) {
          keepGoing = false;
          break;
        }
      } else {
        keepGoing = false;
        break;
      }

      const dataB = resB && resB.ok ? await resB.json().catch(() => null) : null;
      if (dataB) {
        const parsedB = transformResponse(dataB);
        allResults.push(...parsedB.items);
        onBatchReceived?.(parsedB.items, allResults.length);
        if (!parsedB.hasMore || parsedB.items.length < limit) {
          keepGoing = false;
          break;
        }
      } else {
        keepGoing = false;
        break;
      }
    } catch (err) {
      console.warn("[progressiveBatchFetch] Batch error:", err);
      break;
    }
  }

  return allResults;
}

