import { ShopReturnRedirect } from "@/components/shop-return-redirect"

/**
 * Safety net: same payment-cancel shim on the bare host (maranafa.camp),
 * in case SHOP_FRONTEND_BASE_URL ever points at the main domain.
 */
export default function ShopCancelRedirectPage() {
  return <ShopReturnRedirect target="cancel" />
}
