import AccountPlaceholderPage from "../_components/AccountPlaceholderPage";
import { requireAuthSession } from "@/utils/require-auth";

export default async function AddressPage() {
  await requireAuthSession();
  return <AccountPlaceholderPage title="Address" active="Address" />;
}

