import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const lang = vi.hoisted(() => ({ current: "ru" }))

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({
    language: lang.current,
    translations: lang.current === "en" ? { "Регистрация скоро откроется": "Registration opens soon" } : {},
  }),
}))

import OnFireForm from "@/components/onfire-form"

describe("<OnFireForm>", () => {
  it("embeds a configured form with embed=1 and the site language", () => {
    lang.current = "lv"
    const { container } = render(<OnFireForm form="friends-nov-2026" title="📝 Регистрация" height={700} />)
    const iframe = container.querySelector("iframe")
    expect(iframe).not.toBeNull()
    const src = new URL(iframe!.getAttribute("src")!)
    expect(src.origin + src.pathname).toBe("https://forms.onfire.so/maranafa-friends-acw")
    expect(src.searchParams.get("embed")).toBe("1")
    expect(src.searchParams.get("lang")).toBe("lv")
    expect(iframe!.getAttribute("title")).toBe("📝 Регистрация")
    expect(iframe!.getAttribute("height")).toBe("700")

    const link = screen.getByRole("link", { name: /Открыть форму в новом окне/ })
    expect(link.getAttribute("href")).toBe("https://forms.onfire.so/maranafa-friends-acw?lang=lv")
    expect(link.getAttribute("target")).toBe("_blank")
    expect(screen.queryByTestId("onfire-form-fallback")).toBeNull()
  })

  it("shows 'registration opens soon' with a contact link when the form is not configured", () => {
    lang.current = "ru"
    const { container } = render(<OnFireForm form="camp" title="Регистрация" />)
    expect(container.querySelector("iframe")).toBeNull()
    expect(screen.getByTestId("onfire-form-fallback")).toBeTruthy()
    expect(screen.getByText("Регистрация скоро откроется")).toBeTruthy()
    expect(screen.getByRole("link", { name: /welcome@maranafa\.camp/ }).getAttribute("href")).toBe(
      "mailto:welcome@maranafa.camp"
    )
  })

  it("uses the given contact e-mail and translates the fallback", () => {
    lang.current = "en"
    render(<OnFireForm form="rosetto" title="Регистрация" contactEmail="rosetto@maranafa.camp" />)
    expect(screen.getByText("Registration opens soon")).toBeTruthy()
    expect(screen.getByRole("link", { name: /rosetto@maranafa\.camp/ }).getAttribute("href")).toBe(
      "mailto:rosetto@maranafa.camp"
    )
  })
})
