import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useLocation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { createBrowserClient } from "@supabase/ssr";
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
  const [searchParams] = useSearchParams();

  const isCategoryOverview = location.pathname.startsWith(
    "/category-overview/"
  );

  const isContentOnly = searchParams.get("contentOnly") === "true";

  const isMinimalLayout = isContentOnly || isCategoryOverview;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {!isMinimalLayout && (
          <header>
            <nav className="flex justify-between items-center p-4 shadow-md text-blue-100">
              <a href="/" className="text-lg font-semibold">
                Basketball Tournament
              </a>
              <div className="flex gap-4">
                {user ? (
                  <>
                    <a href="/admin/dashboard" className="hover:text-blue-30">
                      Admin Dashboard
                    </a>
                    <a href="/logout" className="hover:text-blue-300">
                      Logout
                    </a>
                  </>
                ) : (
                  <a href="/login" className="hover:text-blue-300">
                    Admin Login
                  </a>
                )}
              </div>
            </nav>
          </header>
        )}
        {isMinimalLayout ? (
          <Outlet context={{ supabase, user }} />
        ) : (
          <main>
            <Outlet context={{ supabase, user }} />
          </main>
        )}
        {!isMinimalLayout && (
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

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";
  let description =
    "We're sorry, something went wrong. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || message;
    description = error.data?.message || error.data || description;
  } else if (error instanceof Error) {
    message = error.message;
    description =
      process.env.NODE_ENV === "development"
        ? error.stack || description
        : description;
  }

  console.error("Root Error Boundary caught error:", error);

  return (
    <html lang="en">
      <head>
        <title>Error: {status}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md border border-gray-200">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">
            An unexpected error occurred
          </h1>
          <p className="text-sm text-gray-600">Message: {message}</p>
          <p className="text-sm text-gray-600">Status: {status}</p>
          <p className="text-sm mb-6 text-gray-700">{description}</p>
          <Link
            to="/"
            reloadDocument
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Go back home
          </Link>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
