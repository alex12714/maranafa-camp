"use client"

/**
 * One attempt in progress (/portal/learning/{attemptId}).
 *
 * A thin route: the id in the URL is the whole client-side state, and
 * `AssessmentRunner` reads everything else from the server. That is what makes
 * this link work when it is pasted into another device — there is nothing in
 * this browser the next one would be missing.
 *
 * `useParams` rather than the page's `params` prop, because the runner is a
 * client component all the way down (it submits answers and holds pending
 * state), so there is nothing for a server component to do here.
 */

import { useParams } from "next/navigation"

import { AssessmentRunner } from "@/components/learning/assessment-runner"

export default function PortalLearningAttemptPage() {
  const params = useParams<{ attemptId: string }>()
  const attemptId = Array.isArray(params.attemptId)
    ? params.attemptId[0]
    : params.attemptId

  if (!attemptId) return null

  return <AssessmentRunner attemptId={attemptId} />
}
