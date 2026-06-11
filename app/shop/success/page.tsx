import { ShopReturnRedirect } from "@/components/shop-return-redirect"

/**
 * Safety net: same payment-success shim on the bare host (maranafa.camp),
 * in case SHOP_FRONTEND_BASE_URL ever points at the main domain.
 */
export default function ShopSuccessRedirectPage() {
  return <ShopReturnRedirect target="success" />
}
