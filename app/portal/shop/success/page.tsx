import { ShopReturnRedirect } from "@/components/shop-return-redirect"

/**
 * Landing path of the payment providers' hardcoded success URL
 * (conference.maranafa.camp/shop/success -> middleware -> /portal/shop/success).
 * Forwards to /portal/services/success keeping ?order=.
 */
export default function ShopSuccessRedirectPage() {
  return <ShopReturnRedirect target="success" />
}
