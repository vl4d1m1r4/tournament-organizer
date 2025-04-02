import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching tournaments:", error);
    return json(
      { tournaments: [] },
      { status: 500, headers: response.headers }
    );
  }

  return json({ tournaments }, { headers: response.headers });
};

export default function TournamentsList() {
  const { tournaments } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Basketball Tournaments</h1>

      {tournaments.length === 0 ? (
        <p>No tournaments available at the moment.</p>
      ) : (
        <div className="tournaments-list">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <h2>{tournament.name}</h2>
              <p>Status: {tournament.status}</p>
              <p>
                Dates: {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                {new Date(tournament.end_date).toLocaleDateString()}
              </p>
              <a
                href={`/tournaments/${tournament.id}`}
                className="btn btn-primary"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
