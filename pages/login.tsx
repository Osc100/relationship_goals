import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Database } from "../types/database";
export default function Login() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const { data, error } = await supabase.from("todos").select("*");
    });
  });

  if (session !== null) {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
      />
    </div>
  );
}
