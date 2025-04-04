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

export default function HomePage() {
  const { tournaments } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Basketball Tournaments</h1>

      {tournaments.length === 0 ? (
        <p>No tournaments available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="tournament-card border rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {tournament.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Status:{" "}
                  <span className="font-medium">{tournament.status}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Dates: {new Date(tournament.start_date).toLocaleDateString()}{" "}
                  - {new Date(tournament.end_date).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`/tournaments/${tournament.id}`}
                className="btn btn-primary mt-4 inline-block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 self-start"
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
