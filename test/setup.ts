import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => cleanup())

// jsdom has no IntersectionObserver; motion's whileInView needs one.
if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  Object.assign(window, { IntersectionObserver: IO })
  Object.assign(globalThis, { IntersectionObserver: IO })
}
