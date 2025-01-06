import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MemberInfoForm from "./MemberInfoForm";
import UserOrders from "./UserOrders";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your profile page",
};

const ProfilePage = async () => {
  const member = await getLoggedInMember(await getWixServerClient());

  if (!member) notFound();

  return (
    <main className="container space-y-10 py-10">
      <h1 className="text-center text-3xl font-bold md:text-4xl">
        Your profile
      </h1>
      <MemberInfoForm member={member} />
      <UserOrders />
    </main>
  );
};

export default ProfilePage;
