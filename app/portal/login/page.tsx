"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TranslatedText } from "@/components/translated-text"
import { useLanguage } from "@/contexts/language-context"
import {
  login,
  LoginError,
  type AuthRole,
  type LoginCandidate,
} from "@/lib/portal-api"

// Russian source keys (see contexts/language-context.tsx)
const ROLE_LABELS: Record<AuthRole, string> = {
  staff: "Сотрудник",
  participant: "Участник",
  parent: "Родитель",
}

type ErrorKind = "invalid" | "network" | null

export default function PortalLoginPage() {
  const router = useRouter()
  const { translations = {} } = useLanguage()

  const [identifier, setIdentifier] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorKind>(null)
  // Non-null after the API asks the user to pick one of several profiles
  const [candidates, setCandidates] = useState<LoginCandidate[] | null>(null)

  const t = (text: string) => translations[text] || text

  async function attemptLogin(personId?: string) {
    setLoading(true)
    setError(null)
    try {
      const result = await login(identifier.trim(), personId)
      if (result.kind === "select") {
        setCandidates(result.candidates)
      } else {
        router.push("/portal/me")
      }
    } catch (err) {
      setError(err instanceof LoginError ? "invalid" : "network")
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!identifier.trim() || loading) return
    void attemptLogin()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            <TranslatedText text="Маранафа" />
          </h1>
          <h2 className="mt-2 text-lg font-semibold text-gray-700">
            <TranslatedText text="Вход в портал" />
          </h2>
          {candidates === null && (
            <p className="mt-2 text-sm text-gray-500">
              <TranslatedText text="Введите телефон или email, указанные при регистрации" />
            </p>
          )}
        </div>

        {candidates === null ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="identifier"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                <TranslatedText text="Телефон или email" />
              </label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+371 20000000"
                disabled={loading}
              />
            </div>

            {error !== null && (
              <p role="alert" className="text-sm font-medium text-red-600">
                <TranslatedText
                  text={
                    error === "invalid"
                      ? "Неверный телефон или email"
                      : "Ошибка сети. Попробуйте ещё раз."
                  }
                />
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !identifier.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <TranslatedText text="Войти" />
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              <TranslatedText text="На этот контакт зарегистрировано несколько участников. Выберите свой профиль." />
            </p>

            {error !== null && (
              <p
                role="alert"
                className="text-center text-sm font-medium text-red-600"
              >
                <TranslatedText
                  text={
                    error === "invalid"
                      ? "Неверный телефон или email"
                      : "Ошибка сети. Попробуйте ещё раз."
                  }
                />
              </p>
            )}

            <ul className="space-y-2">
              {candidates.map((candidate) => (
                <li key={candidate.id}>
                  <button
                    type="button"
                    onClick={() => void attemptLogin(candidate.id)}
                    disabled={loading}
                    className="flex w-full items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {candidate.name || t(ROLE_LABELS[candidate.role])}
                      </span>
                      <span className="block text-xs text-gray-500">
                        <TranslatedText text={ROLE_LABELS[candidate.role]} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setCandidates(null)
                setError(null)
              }}
            >
              <TranslatedText text="Назад" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
