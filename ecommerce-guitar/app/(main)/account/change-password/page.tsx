import { requireAuthSession } from "@/utils/require-auth";
import ChangePasswordForm from "../_components/ChangePasswordForm";

export default async function AccountChangePasswordPage() {
  await requireAuthSession();
  return <ChangePasswordForm />;
}
