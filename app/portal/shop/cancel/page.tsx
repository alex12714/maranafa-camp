import { ShopReturnRedirect } from "@/components/shop-return-redirect"

/**
 * Landing path of the payment providers' hardcoded cancel URL
 * (conference.maranafa.camp/shop/cancel -> middleware -> /portal/shop/cancel).
 * Forwards to /portal/services/cancel keeping ?order=.
 */
export default function ShopCancelRedirectPage() {
  return <ShopReturnRedirect target="cancel" />
}
