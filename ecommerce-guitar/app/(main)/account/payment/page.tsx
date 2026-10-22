import AccountPlaceholderPage from "../_components/AccountPlaceholderPage";
import { requireAuthSession } from "@/utils/require-auth";

export default async function PaymentPage() {
  await requireAuthSession();
  return <AccountPlaceholderPage title="Add Credit/Debit Card" active="Add Credit/Debit Card" />;
}

