/**
 * Turn an authoring-API refusal into a sentence the author can act on.
 *
 * The four statuses mean genuinely different things and must not collapse into
 * "что-то пошло не так": a 403 is the capability gate, a 404 means somebody
 * else deleted the draft, and a 409 is the immutability guarantee doing its job
 * — the author's next move is to clone, not to retry.
 *
 * A 409's own message is passed through untranslated on purpose. It is the only
 * text in this file that names the actual state the server found ("... is
 * published and immutable; clone it to a new draft"), and a generic translated
 * stand-in would drop the one fact worth reading.
 */

import { LearningAdminError } from "@/lib/portal-learning-admin"

export function describeAdminError(
  error: unknown,
  t: (s: string) => string,
): string {
  if (!(error instanceof LearningAdminError)) {
    return t("Не удалось сохранить изменения. Попробуйте ещё раз.")
  }
  switch (error.status) {
    case 403:
      return t("Редактирование обучения доступно только директорам")
    case 404:
      return t("Эта версия больше не существует.")
    case 409:
      return error.message
    case 422:
      return t("Публикация невозможна — смотрите список ниже.")
    default:
      return t("Не удалось сохранить изменения. Попробуйте ещё раз.")
  }
}
