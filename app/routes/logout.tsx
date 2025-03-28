import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  await supabase.auth.signOut();

  return redirect("/", { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  await supabase.auth.signOut();

  return redirect("/", { headers: response.headers });
};

export default function Logout() {
  return <p>Logging out...</p>;
}
