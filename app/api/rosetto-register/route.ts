// Retired: registrations are embedded OnFire forms now (lib/onfire-forms.ts).
// This route used to write to AirTable; it now answers 410 Gone.
import { registrationGone } from "@/lib/registration-gone"

export const POST = registrationGone("rosetto-register")
