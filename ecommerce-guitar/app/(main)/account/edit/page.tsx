import { SERVER_API } from "@/utils/env";
import { requireAccessToken } from "@/utils/require-auth";
import { redirect } from "next/navigation";
import EditProfileForm from "../_components/EditProfileForm";

type Profile = { name: string; email: string; phone?: string; address?: string };

export default async function AccountEditPage() {
  const accessToken = await requireAccessToken();
  const res = await fetch(`${SERVER_API}/profile`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    redirect("/auth/login");
  }

  const json = (await res.json()) as { data: Profile };
  const profile = json.data;

  return <EditProfileForm profile={profile} />;
}
