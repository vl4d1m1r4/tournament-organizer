import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useFetcher,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import Notification from "~/components/Notification";
import ConfirmDialog from "~/components/ConfirmDialog";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // Get tournaments
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tournaments:", error);
    return json({ tournaments: [] }, { headers: response.headers });
  }

  return json({ tournaments }, { headers: response.headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  switch (action) {
    case "deleteTournament": {
      const tournamentId = formData.get("tournamentId") as string;

      // First delete all matches
      const { error: matchesError } = await supabase
        .from("matches")
        .delete()
        .eq("tournament_id", tournamentId);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        return json({ _action: action, error: matchesError.message });
      }

      // Then delete all categories
      const { error: categoriesError } = await supabase
        .from("categories")
        .delete()
        .eq("tournament_id", tournamentId);

      if (categoriesError) {
        console.error("Error deleting categories:", categoriesError);
        return json({ _action: action, error: categoriesError.message });
      }

      // Finally delete the tournament
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", tournamentId);

      if (error) {
        console.error("Error deleting tournament:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }
  }

  return json({ _action: action });
};

interface Tournament {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface FetcherData {
  _action?: string;
  error?: string;
}

export default function AdminDashboard() {
  const { tournaments } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<FetcherData>();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Delete tournament confirmation state
  const [deleteTournamentDialog, setDeleteTournamentDialog] = useState<{
    isOpen: boolean;
    tournamentId: number | null;
    tournamentName: string;
  }>({
    isOpen: false,
    tournamentId: null,
    tournamentName: "",
  });

  // Handle fetcher data changes to show notifications
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const action = fetcher.data._action;

      if (action === "deleteTournament") {
        setNotification({
          message: "Tournament deleted successfully!",
          type: "success",
        });
        setDeleteTournamentDialog({
          isOpen: false,
          tournamentId: null,
          tournamentName: "",
        });
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleDeleteTournament = (
    tournamentId: number,
    tournamentName: string
  ) => {
    setDeleteTournamentDialog({
      isOpen: true,
      tournamentId,
      tournamentName,
    });
  };

  const confirmDeleteTournament = () => {
    if (deleteTournamentDialog.tournamentId) {
      const formData = new FormData();
      formData.append("_action", "deleteTournament");
      formData.append(
        "tournamentId",
        deleteTournamentDialog.tournamentId.toString()
      );
      fetcher.submit(formData, { method: "post" });
    }
  };

  const isLoading = fetcher.state === "submitting";

  return (
    <div className="relative">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Delete Tournament Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTournamentDialog.isOpen}
        title="Delete Tournament"
        message={`Are you sure you want to delete the tournament "${deleteTournamentDialog.tournamentName}"? This will also delete all categories and matches in this tournament.`}
        onConfirm={confirmDeleteTournament}
        onCancel={() =>
          setDeleteTournamentDialog({
            isOpen: false,
            tournamentId: null,
            tournamentName: "",
          })
        }
        isLoading={isLoading}
      />

      <div className="section">
        <div className="flex justify-between items-center mb-6">
          <h1>Tournament Dashboard</h1>
          <Link to="/admin/tournaments/new" className="btn btn-primary">
            Create New Tournament
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <p>No tournaments found. Create a new tournament to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    <td>
                      <span
                        className={`status-badge ${
                          tournament.status === "active"
                            ? "status-active"
                            : tournament.status === "completed"
                            ? "status-completed"
                            : "status-upcoming"
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </td>
                    <td>
                      {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/tournaments/${tournament.id}`}
                          className="btn btn-secondary"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/tournaments/${tournament.id}`}
                          className="btn btn-neutral"
                        >
                          View
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteTournament(
                              tournament.id,
                              tournament.name
                            )
                          }
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
