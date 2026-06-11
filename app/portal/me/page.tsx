"use client"

/**
 * Portal profile page (/portal/me).
 *
 * Shows the authenticated person's self-profile aggregated by the backend:
 * arrival check-in, housing placement, prayer group (with the group's color
 * and the leader's tap-to-call phone), today's schedule from GET /me/now, and
 * the person's helper roles. All data is fetched client-side on mount via
 * `apiFetch`, which redirects to /portal/login on a 401.
 */

import { useCallback, useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock,
  HandHeart,
  Home,
  Loader2,
  LogOut,
  Phone,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TranslatedText } from "@/components/translated-text"
import { apiFetch, logout } from "@/lib/portal-api"

// ---------------------------------------------------------------------------
// API types (mirror app/schemas/me.py in the maranafa-api repo)
// ---------------------------------------------------------------------------

interface Ref {
  id: string
  name: string | null
}

interface RoleRef extends Ref {
  description: string | null
}

interface PrayerGroupLeader {
  name: string | null
  phone: string | null
}

interface MePrayerGroup extends Ref {
  /** '#RRGGBB' hex string, validated at the API edge. */
  color: string | null
  leader: PrayerGroupLeader | null
}

/** GET /me/profile and the PATCH /me/arrived response. */
interface MeProfile {
  id: string
  name: string | null
  arrived: boolean | null
  cabin: Ref | null
  group: Ref | null
  prayer_group: MePrayerGroup | null
  seminars: Ref[]
  roles: RoleRef[]
}

interface ScheduleItemRef {
  id: string
  time: string | null
  title: string | null
  sort: number | null
}

/**
 * GET /me/now. The backend returns EITHER a single inferred
 * `current_schedule_item` (the latest visible item whose leading HH:MM start
 * is <= server time) OR — when no item can be inferred — the full visible
 * `schedule` as a fallback. Never both. (`game_sessions` also comes back but
 * is not part of this page.)
 */
interface MeNow {
  current_schedule_item: ScheduleItemRef | null
  schedule: ScheduleItemRef[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

/** The group color when it is a safe '#RRGGBB' hex, else null. */
function safeHexColor(color: string | null | undefined): string | null {
  return color && HEX_COLOR_RE.test(color) ? color : null
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, "")}`
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PortalMePage() {
  const [profile, setProfile] = useState<MeProfile | null>(null)
  const [now, setNow] = useState<MeNow | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [arrivedSaving, setArrivedSaving] = useState(false)
  const [arrivedError, setArrivedError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      // The profile is essential; the "now" view is best-effort — when it
      // fails the schedule card is simply hidden.
      const [profileRes, nowRes] = await Promise.all([
        apiFetch("/me/profile"),
        apiFetch("/me/now").catch(() => null),
      ])
      if (!profileRes.ok) throw new Error(`HTTP ${profileRes.status}`)
      setProfile((await profileRes.json()) as MeProfile)
      setNow(nowRes?.ok ? ((await nowRes.json()) as MeNow) : null)
    } catch {
      // A 401 already triggered the apiFetch redirect to /portal/login; this
      // state only matters for other failures (network, 404 for parents, 5xx).
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function markArrived() {
    if (arrivedSaving) return
    setArrivedSaving(true)
    setArrivedError(false)
    try {
      const res = await apiFetch("/me/arrived", {
        method: "PATCH",
        body: JSON.stringify({ arrived: true }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // The PATCH returns the updated aggregated profile — only flip the
      // visible state on a confirmed 2xx.
      setProfile((await res.json()) as MeProfile)
    } catch {
      setArrivedError(true)
    } finally {
      setArrivedSaving(false)
    }
  }

  // --- Loading ----------------------------------------------------------- //
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">
            <TranslatedText text="Загрузка…" />
          </span>
        </div>
      </div>
    )
  }

  // --- Error ------------------------------------------------------------- //
  if (loadError || profile === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <p role="alert" className="text-sm font-medium text-red-600">
            <TranslatedText text="Не удалось загрузить данные. Попробуйте ещё раз." />
          </p>
          <Button className="w-full" onClick={() => void load()}>
            <TranslatedText text="Повторить" />
          </Button>
          <Button variant="ghost" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <TranslatedText text="Выйти" />
          </Button>
        </div>
      </div>
    )
  }

  const groupColor = safeHexColor(profile.prayer_group?.color)
  const leader = profile.prayer_group?.leader ?? null
  const hasPlacement = profile.cabin !== null || profile.group !== null
  const currentItem = now?.current_schedule_item ?? null
  const scheduleList = now?.schedule ?? []
  const hasSchedule = currentItem !== null || scheduleList.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto w-full max-w-md space-y-4 px-4 py-6">
        {/* Greeting + logout */}
        <header className="flex items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-xl font-extrabold tracking-tight text-gray-900">
            <TranslatedText text="Привет" />
            {profile.name ? `, ${profile.name}!` : "!"}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-gray-500"
            onClick={logout}
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            <TranslatedText text="Выйти" />
          </Button>
        </header>

        {/* Arrival check-in */}
        {profile.arrived ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-green-700">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <span className="text-base font-semibold">
              <TranslatedText text="Вы отметились" />
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              type="button"
              className="h-14 w-full bg-green-600 text-lg font-bold hover:bg-green-700"
              disabled={arrivedSaving}
              onClick={() => void markArrived()}
            >
              {arrivedSaving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <TranslatedText text="Я приехал" />
            </Button>
            {arrivedError && (
              <p role="alert" className="text-sm font-medium text-red-600">
                <TranslatedText text="Не удалось отметиться. Попробуйте ещё раз." />
              </p>
            )}
          </div>
        )}

        {/* Placement (cabin + group) */}
        {hasPlacement && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                <TranslatedText text="Размещение" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.cabin && (
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      <TranslatedText text="Домик" />
                    </p>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {profile.cabin.name}
                    </p>
                  </div>
                </div>
              )}
              {profile.group && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      <TranslatedText text="Группа" />
                    </p>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {profile.group.name}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prayer group, tinted with the group's color */}
        {profile.prayer_group && (
          <Card
            style={
              groupColor
                ? {
                    // 6-digit hex from the API + alpha suffix for the tint.
                    backgroundColor: `${groupColor}14`,
                    borderColor: `${groupColor}66`,
                  }
                : undefined
            }
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                {groupColor && (
                  <span
                    aria-hidden
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: groupColor }}
                  />
                )}
                <TranslatedText text="Молитвенная группа" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.prayer_group.name && (
                <p className="text-sm font-medium text-gray-900">
                  {profile.prayer_group.name}
                </p>
              )}
              {leader && (leader.name || leader.phone) && (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      <TranslatedText text="Лидер" />
                    </p>
                    {leader.name && (
                      <p className="truncate text-sm font-medium text-gray-900">
                        {leader.name}
                      </p>
                    )}
                  </div>
                  {leader.phone && (
                    <a
                      href={telHref(leader.phone)}
                      className="flex shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      <Phone
                        className="h-4 w-4"
                        style={groupColor ? { color: groupColor } : undefined}
                      />
                      {leader.phone}
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Today's schedule. /me/now returns either the single inferred
            current item (shown highlighted) or the full visible schedule. */}
        {hasSchedule && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                <TranslatedText text="Расписание на сегодня" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentItem !== null ? (
                  <ScheduleRow item={currentItem} current />
                ) : (
                  scheduleList.map((item) => (
                    <ScheduleRow key={item.id} item={item} />
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Helper roles */}
        {profile.roles.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <HandHeart className="h-5 w-5 shrink-0 text-gray-400" />
                <TranslatedText text="Чем вы помогаете" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {profile.roles.map((role) => (
                  <li key={role.id}>
                    <p className="text-sm font-medium text-gray-900">
                      {role.name}
                    </p>
                    {role.description && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {role.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Schedule row
// ---------------------------------------------------------------------------

function ScheduleRow({
  item,
  current = false,
}: {
  item: ScheduleItemRef
  current?: boolean
}) {
  return (
    <li
      className={
        current
          ? "flex items-center gap-3 rounded-md border border-green-300 bg-green-50 px-3 py-2.5"
          : "flex items-center gap-3 rounded-md px-3 py-2"
      }
    >
      <Clock
        className={`h-4 w-4 shrink-0 ${current ? "text-green-600" : "text-gray-400"}`}
      />
      {item.time && (
        <span
          className={`shrink-0 text-sm tabular-nums ${
            current ? "font-semibold text-green-700" : "text-gray-500"
          }`}
        >
          {item.time}
        </span>
      )}
      <span
        className={`min-w-0 flex-1 text-sm ${
          current ? "font-semibold text-gray-900" : "text-gray-700"
        }`}
      >
        {item.title}
      </span>
      {current && (
        <span className="shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          <TranslatedText text="Сейчас" />
        </span>
      )}
    </li>
  )
}
