import { daysOfTheWeek, DATA_KEY, CONFIG_KEY } from './Constants'
import { type DayOfTheWeek, type SiteConfigMap, type Timer, type TimerBucket } from './Types'
import { getData, save } from './Storage'

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const toIsoDateOrNull = (value: unknown): string | null => {
    if (typeof value !== 'string' || !DATE_KEY_REGEX.test(value)) return null
    const d = new Date(`${value}T00:00:00`)
    return Number.isNaN(d.getTime()) ? null : value
}

// ---------------------------------------------------------------------------
// Timer shape normalisation
// ---------------------------------------------------------------------------

/**
 * Normalise a raw weekday entry into a canonical TimerBucket.
 * Handles both the old flat shape { date?, site: number } and
 * the new shape { date?, usage: { site: number } }.
 */
const extractBucket = (raw: Record<string, unknown>): TimerBucket => {
    // New shape: usage is an explicit sub-object
    if (isPlainObject(raw.usage)) {
        const usage: Record<string, number> = {}
        for (const [site, val] of Object.entries(raw.usage as Record<string, unknown>)) {
            if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
                usage[site] = val
            }
        }
        return { usage, date: toIsoDateOrNull(raw.date) ?? undefined }
    }

    // Old flat shape: site keys live alongside `date`
    const usage: Record<string, number> = {}
    let date: string | undefined
    for (const [key, val] of Object.entries(raw)) {
        if (key === 'date') {
            date = toIsoDateOrNull(val) ?? undefined
            continue
        }
        if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
            usage[key] = val
        }
    }
    return { usage, date }
}

/**
 * Normalise any raw timer payload — old date-keyed, old flat weekday-keyed,
 * or already canonical — into the current Timer shape.
 * Never throws; on any unexpected input returns an empty partial record.
 */
export const normalizeTimerData = (raw: unknown): Timer => {
    const result: Timer = {}
    if (!isPlainObject(raw)) return result

    // Track the most-recent date seen per weekday to resolve collisions
    // when both date-keyed and weekday-keyed entries exist for the same day.
    const bestDate: Partial<Record<DayOfTheWeek, string>> = {}

    const writeBucket = (day: DayOfTheWeek, bucket: TimerBucket): void => {
        const existing = bestDate[day]
        const incoming = bucket.date
        if (!existing || (incoming && incoming >= existing)) {
            result[day] = bucket
            if (incoming) bestDate[day] = incoming
        }
    }

    for (const [key, value] of Object.entries(raw)) {
        if (!isPlainObject(value)) continue

        if ((daysOfTheWeek as readonly string[]).includes(key)) {
            // Weekday-keyed entry (old flat or new shape)
            writeBucket(key as DayOfTheWeek, extractBucket(value))
            continue
        }

        const isoDate = toIsoDateOrNull(key)
        if (isoDate) {
            // Very old date-keyed entry — map to the corresponding weekday
            const d = new Date(`${isoDate}T00:00:00`)
            const weekday = daysOfTheWeek[d.getDay()]
            if (!weekday) continue
            const { usage } = extractBucket(value)
            writeBucket(weekday, { usage, date: isoDate })
        }
    }

    return result
}

// ---------------------------------------------------------------------------
// Cross-storage-area migration (old chrome.storage.local → new chrome.storage.sync)
// ---------------------------------------------------------------------------

/**
 * Read a single key from chrome.storage.local.
 * Returns null if the key is absent or the call fails.
 */
const getFromLocal = (key: string): Promise<unknown> => {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key] ?? null)
            })
        } catch {
            resolve(null)
        }
    })
}

/**
 * One-time migration from the old extension (v1–v5) which used
 * chrome.storage.local with a date-keyed timer format, to the current
 * chrome.storage.sync with a weekday-keyed TimerBucket format.
 *
 * Rules:
 * - Timer: read from local, normalize, write to sync — only when sync is empty.
 * - Sites config: read from local, write to sync — only when sync is empty.
 * - Password: intentionally skipped. Old version used bcrypt; new uses SHA-256.
 *   These hashes are incompatible so the user will simply have no password set
 *   after upgrading and can create a new one in Settings.
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
    const [syncTimer, syncSites] = await Promise.all([
        getData<unknown>(DATA_KEY),
        getData<SiteConfigMap>(CONFIG_KEY),
    ])

    const syncHasTimer = isPlainObject(syncTimer) && Object.keys(syncTimer).length > 0
    const syncHasSites = isPlainObject(syncSites) && Object.keys(syncSites).length > 0

    // Nothing to do if sync already has both datasets
    if (syncHasTimer && syncHasSites) return

    const [localTimer, localSites] = await Promise.all([
        syncHasTimer ? Promise.resolve(null) : getFromLocal(DATA_KEY),
        syncHasSites ? Promise.resolve(null) : getFromLocal(CONFIG_KEY),
    ])

    if (!syncHasTimer && isPlainObject(localTimer) && Object.keys(localTimer).length > 0) {
        const normalized = normalizeTimerData(localTimer)
        if (Object.keys(normalized).length > 0) {
            await save(DATA_KEY, normalized)
        }
    }

    if (!syncHasSites && isPlainObject(localSites) && Object.keys(localSites).length > 0) {
        await save(CONFIG_KEY, localSites as SiteConfigMap)
    }
}
