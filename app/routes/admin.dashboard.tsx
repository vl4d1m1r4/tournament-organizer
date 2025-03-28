import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    return redirect("/login");
  }

  // Fetch tournaments
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching tournaments:", error);
    return json({ tournaments: [] }, { headers: response.headers });
  }

  return json({ tournaments }, { headers: response.headers });
};

export default function AdminDashboard() {
  const { tournaments } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="admin-actions">
        <Link to="/admin/tournaments/new" className="btn">
          Create New Tournament
        </Link>
      </div>

      <h2>Manage Tournaments</h2>

      {tournaments.length === 0 ? (
        <p>No tournaments available. Create your first tournament.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td>{tournament.name}</td>
                <td>{tournament.status}</td>
                <td>
                  {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                  {new Date(tournament.end_date).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    to={`/admin/tournaments/${tournament.id}`}
                    className="btn"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
