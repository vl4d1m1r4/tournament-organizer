import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { useState } from "react";
import { createSupabaseServerClient } from "./utils/supabase.server";
import styles from "./styles/global.css?url";

export const links = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return json({ env, user }, { headers: response.headers });
};

export default function App() {
  const { env, user } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  const location = useLocation();
  const isCategoryOverview = location.pathname.startsWith(
    "/category-overview/"
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {!isCategoryOverview && (
          <header>
            <nav>
              <a href="/">Basketball Tournament</a>
              <div>
                <a href="/tournaments">Tournaments</a>
                {user ? (
                  <a href="/admin/dashboard">Admin Dashboard</a>
                ) : (
                  <a href="/login">Admin Login</a>
                )}
              </div>
            </nav>
          </header>
        )}
        <main>
          <Outlet context={{ supabase, user }} />
        </main>
        {!isCategoryOverview && (
          <footer>
            <p>© {new Date().getFullYear()} Basketball Tournament App</p>
          </footer>
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
