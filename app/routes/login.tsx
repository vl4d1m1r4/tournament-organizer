import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, redirect to admin dashboard
  if (user) {
    return redirect("/admin/dashboard");
  }

  return json({ error: null }, { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return json({ error: error.message }, { headers: response.headers });
  }

  return redirect("/admin/dashboard", { headers: response.headers });
};

export default function Login() {
  const { error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errorMessage = actionData?.error || error;

  return (
    <div>
      <h1>Admin Login</h1>

      <Form method="post">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </Form>
    </div>
  );
}
