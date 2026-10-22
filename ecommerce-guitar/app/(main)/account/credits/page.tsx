import AccountPlaceholderPage from "../_components/AccountPlaceholderPage";
import { requireAuthSession } from "@/utils/require-auth";

export default async function CreditsPage() {
  await requireAuthSession();
  return <AccountPlaceholderPage title="Store credits" active="Store credits" />;
}

