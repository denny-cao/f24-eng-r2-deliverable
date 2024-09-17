import { Separator } from "@/components/ui/separator";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import UserCard from "./user-card";

export default async function UsersList() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: user } = await supabase.from("profiles").select("*").order("id", { ascending: false });

  return (
    <>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">{user?.map((user) => <UserCard key={user.id} user={user} />)}</div>
    </>
  );
}
