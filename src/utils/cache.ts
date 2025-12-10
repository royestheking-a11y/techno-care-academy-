// Cache utility for instant data loading
// Uses both memory cache (for session) and localStorage (for persistence)

const CACHE_PREFIX = 'tca_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-memory cache for instant access during session
const memoryCache: Map<string, { data: any; timestamp: number }> = new Map();

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

// Get from cache (memory first, then localStorage)
export function getFromCache<T>(key: string): T | null {
    // Check memory cache first (fastest)
    const memEntry = memoryCache.get(key);
    if (memEntry && Date.now() - memEntry.timestamp < CACHE_DURATION) {
        return memEntry.data as T;
    }

    // Check localStorage cache
    try {
        const stored = localStorage.getItem(CACHE_PREFIX + key);
        if (stored) {
            const entry: CacheEntry<T> = JSON.parse(stored);
            if (Date.now() - entry.timestamp < CACHE_DURATION) {
                // Also populate memory cache
                memoryCache.set(key, entry);
                return entry.data;
            }
        }
    } catch (e) {
        // Ignore localStorage errors
    }

    return null;
}

// Save to cache (both memory and localStorage)
export function saveToCache<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
    };

    // Save to memory cache
    memoryCache.set(key, entry);

    // Save to localStorage
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
        // Ignore localStorage errors (quota exceeded, etc)
    }
}

// Clear specific cache entry
export function clearCache(key: string): void {
    memoryCache.delete(key);
    try {
        localStorage.removeItem(CACHE_PREFIX + key);
    } catch (e) {
        // Ignore
    }
}

// Clear all cache entries
export function clearAllCache(): void {
    memoryCache.clear();
    try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
        // Ignore
    }
}

// Wrapper for API calls with caching
// Returns cached data instantly, or empty result while fetching
export async function cachedFetch<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    options?: { forceRefresh?: boolean; defaultValue?: T }
): Promise<T> {
    // Try to get from cache first
    const cached = getFromCache<T>(cacheKey);

    if (cached !== null && !options?.forceRefresh) {
        // Return cached data immediately, refresh in background
        fetcher().then(freshData => {
            saveToCache(cacheKey, freshData);
        }).catch(() => { });
        return cached;
    }

    // No cache - fetch fresh data (blocking only for first load)
    try {
        const data = await fetcher();
        saveToCache(cacheKey, data);
        return data;
    } catch (error) {
        // On error, return default value if provided
        if (options?.defaultValue !== undefined) {
            return options.defaultValue;
        }
        throw error;
    }
}

// Cache keys
export const CACHE_KEYS = {
    SLIDES: 'slides',
    TEACHERS: 'teachers',
    COURSES: 'courses',
    BOOKS: 'books',
    NOTES: 'notes',
    INSTITUTES: 'institutes',
    LIVE_CLASSES: 'liveClasses',
    SCHEDULES: 'schedules',
    STUDENTS: 'students',
    REVIEWS: 'reviews',
};
