import NotionMagicLinkEmail from "./emails/notion-magic-link"
import PlaidVerifyIdentityEmail from "./emails/plaid-verify-identity"
import StripeWelcomeEmail from "./emails/stripe-welcome"
import VercelInviteUserEmail from "./emails/vercel-invite-user"

const Mail = {
  notionMagicLink: NotionMagicLinkEmail,
  plaidVerifyIdentity: PlaidVerifyIdentityEmail,
  stripeWelcome: StripeWelcomeEmail,
  vercelInviteUser: VercelInviteUserEmail,
} as const

type Mail = (typeof Mail)[keyof typeof Mail]
export default Mail
