import AccountPlaceholderPage from "../_components/AccountPlaceholderPage";
import { requireAuthSession } from "@/utils/require-auth";

export default async function NotificationPage() {
  await requireAuthSession();
  return <AccountPlaceholderPage title="Notification" active="Notification" />;
}

