import AccountPlaceholderPage from "../_components/AccountPlaceholderPage";
import { requireAuthSession } from "@/utils/require-auth";

export default async function ReturnsPage() {
  await requireAuthSession();
  return <AccountPlaceholderPage title="Returns" active="Returns" />;
}

