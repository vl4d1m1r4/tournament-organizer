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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const tournamentId = params.tournamentId;
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // Get tournament details
  const { data: tournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single();

  if (tournamentError) {
    throw new Response("Tournament not found", { status: 404 });
  }

  // Get categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return json(
      { tournament, categories: [], matches: [] },
      { headers: response.headers }
    );
  }

  // Get matches
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return json(
      { tournament, categories, matches: [] },
      { headers: response.headers }
    );
  }

  return json(
    { tournament, categories, matches },
    { headers: response.headers }
  );
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const tournamentId = params.tournamentId;
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
    case "addCategory": {
      const categoryName = formData.get("categoryName") as string;

      const { error } = await supabase
        .from("categories")
        .insert([{ tournament_id: tournamentId, name: categoryName }]);

      if (error) {
        console.error("Error adding category:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "addMatch": {
      const categoryId = formData.get("categoryId") as string;
      const isPlayoff = formData.get("isPlayoff") === "true";
      const groupName = formData.get("groupName") as string;
      const team1 = formData.get("team1") as string;
      const team2 = formData.get("team2") as string;
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;
      const location = formData.get("location") as string;

      const { error } = await supabase.from("matches").insert([
        {
          tournament_id: tournamentId,
          category_id: categoryId,
          is_playoff: isPlayoff,
          group_name: groupName,
          team1,
          team2,
          date,
          time: time || null,
          location,
        },
      ]);

      if (error) {
        console.error("Error adding match:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "updateScore": {
      const matchId = formData.get("matchId") as string;
      const score1 = formData.get("score1") as string;
      const score2 = formData.get("score2") as string;

      const { error } = await supabase
        .from("matches")
        .update({
          score1: parseInt(score1, 10),
          score2: parseInt(score2, 10),
        })
        .eq("id", matchId);

      if (error) {
        console.error("Error updating score:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "updateTournament": {
      const name = formData.get("name") as string;
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;

      const { error } = await supabase
        .from("tournaments")
        .update({
          name,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", tournamentId);

      if (error) {
        console.error("Error updating tournament:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "updateTournamentStatus": {
      const status = formData.get("status") as string;

      const { error } = await supabase
        .from("tournaments")
        .update({ status })
        .eq("id", tournamentId);

      if (error) {
        console.error("Error updating tournament status:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "updateCategory": {
      const categoryId = formData.get("categoryId") as string;
      const categoryName = formData.get("categoryName") as string;

      const { error } = await supabase
        .from("categories")
        .update({ name: categoryName })
        .eq("id", categoryId);

      if (error) {
        console.error("Error updating category:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "updateMatch": {
      const matchId = formData.get("matchId") as string;
      const isPlayoff = formData.get("isPlayoff") === "true";
      const groupName = formData.get("groupName") as string;
      const team1 = formData.get("team1") as string;
      const team2 = formData.get("team2") as string;
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;
      const location = formData.get("location") as string;

      const { error } = await supabase
        .from("matches")
        .update({
          is_playoff: isPlayoff,
          group_name: groupName,
          team1,
          team2,
          date,
          time: time || null,
          location,
        })
        .eq("id", matchId);

      if (error) {
        console.error("Error updating match:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "deleteCategory": {
      const categoryId = formData.get("categoryId") as string;

      // First delete all matches in this category
      const { error: matchesError } = await supabase
        .from("matches")
        .delete()
        .eq("category_id", categoryId);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        return json({ _action: action, error: matchesError.message });
      }

      // Then delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Error deleting category:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }

    case "deleteMatch": {
      const matchId = formData.get("matchId") as string;

      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", matchId);

      if (error) {
        console.error("Error deleting match:", error);
        return json({ _action: action, error: error.message });
      }
      return json({ _action: action });
    }
  }

  return json({ _action: action });
};

interface Category {
  id: number;
  tournament_id: number;
  name: string;
}

interface Match {
  id: number;
  tournament_id: number;
  category_id: number;
  group_name: string | null;
  is_playoff: boolean;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  date: string;
  time: string | null;
  location: string | null;
}

interface FetcherData {
  _action?: string;
  error?: string;
}

// Component for Playoff Match Item
const PlayoffMatchItem: React.FC<{
  match: Match;
  label: string;
}> = ({ match, label }) => {
  // Determine text size based on label
  const labelStyles =
    label === "FINAL" ? "text-sm font-semibold p-1" : "text-xs p-1"; // Smaller text for 3rd place, etc.
  const teamBoxStyles =
    label === "FINAL"
      ? "p-3 text-lg" // Larger text/padding for Final
      : "p-2 text-base"; // Slightly smaller padding/text for others

  return (
    <div className="flex flex-col items-center mb-4">
      {/* Orange Box for Teams */}
      <div
        className={`bg-[#F97316] text-white rounded-t text-center shadow-md w-40 ${teamBoxStyles}`}
      >
        {/* Display team names or placeholders */}
        <div className="font-semibold">{match.team1 || "TBD"}</div>
        <div className="text-xs my-1">vs</div>
        <div className="font-semibold">{match.team2 || "TBD"}</div>
      </div>
      {/* Blue Box for Label (e.g., FINAL) */}
      <div
        className={`bg-[#1D4ED8] text-white rounded-b text-center shadow-md w-40 ${labelStyles}`}
      >
        {label}
      </div>
    </div>
  );
};

export default function AdminTournament() {
  const { tournament, categories, matches } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<FetcherData>();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  const [editingTournament, setEditingTournament] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Delete confirmation states
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<{
    isOpen: boolean;
    categoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  const [deleteMatchDialog, setDeleteMatchDialog] = useState<{
    isOpen: boolean;
    matchId: number | null;
    matchName: string;
  }>({
    isOpen: false,
    matchId: null,
    matchName: "",
  });

  // Group matches by category
  const matchesByCategory = categories.reduce(
    (acc: Record<number, Match[]>, category) => {
      acc[category.id] = matches.filter(
        (match) => match.category_id === category.id
      );
      return acc;
    },
    {}
  );

  // Handle fetcher data changes to show notifications
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const action = fetcher.data._action;

      if (action === "addCategory") {
        setNotification({
          message: "Category added successfully!",
          type: "success",
        });
        setShowAddCategory(false);
      } else if (action === "addMatch") {
        setNotification({
          message: "Match added successfully!",
          type: "success",
        });
        setShowAddMatch(false);
      } else if (action === "updateTournament") {
        setNotification({
          message: "Tournament updated successfully!",
          type: "success",
        });
        setEditingTournament(false);
      } else if (action === "updateTournamentStatus") {
        setNotification({
          message: "Tournament status updated successfully!",
          type: "success",
        });
      } else if (action === "updateCategory") {
        setNotification({
          message: "Category updated successfully!",
          type: "success",
        });
        setEditingCategory(null);
      } else if (action === "updateMatch") {
        setNotification({
          message: "Match updated successfully!",
          type: "success",
        });
        setEditingMatch(null);
      } else if (action === "updateScore") {
        setNotification({
          message: "Score updated successfully!",
          type: "success",
        });
      } else if (action === "deleteCategory") {
        setNotification({
          message: "Category deleted successfully!",
          type: "success",
        });
        setDeleteCategoryDialog({
          isOpen: false,
          categoryId: null,
          categoryName: "",
        });
      } else if (action === "deleteMatch") {
        setNotification({
          message: "Match deleted successfully!",
          type: "success",
        });
        setDeleteMatchDialog({ isOpen: false, matchId: null, matchName: "" });
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleTournamentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCategorySubmit = (
    event: React.FormEvent<HTMLFormElement>,
    categoryId: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleMatchSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    matchId: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleScoreSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    matchId: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleAddCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleAddMatch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleStatusSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    setDeleteCategoryDialog({
      isOpen: true,
      categoryId,
      categoryName,
    });
  };

  const confirmDeleteCategory = () => {
    if (deleteCategoryDialog.categoryId) {
      const formData = new FormData();
      formData.append("_action", "deleteCategory");
      formData.append("categoryId", deleteCategoryDialog.categoryId.toString());
      fetcher.submit(formData, { method: "post" });
    }
  };

  const handleDeleteMatch = (matchId: number, team1: string, team2: string) => {
    setDeleteMatchDialog({
      isOpen: true,
      matchId,
      matchName: `${team1} vs ${team2}`,
    });
  };

  const confirmDeleteMatch = () => {
    if (deleteMatchDialog.matchId) {
      const formData = new FormData();
      formData.append("_action", "deleteMatch");
      formData.append("matchId", deleteMatchDialog.matchId.toString());
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

      {/* Delete Category Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteCategoryDialog.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteCategoryDialog.categoryName}"? This will also delete all matches in this category.`}
        onConfirm={confirmDeleteCategory}
        onCancel={() =>
          setDeleteCategoryDialog({
            isOpen: false,
            categoryId: null,
            categoryName: "",
          })
        }
        isLoading={isLoading}
      />

      {/* Delete Match Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteMatchDialog.isOpen}
        title="Delete Match"
        message={`Are you sure you want to delete the match "${deleteMatchDialog.matchName}"?`}
        onConfirm={confirmDeleteMatch}
        onCancel={() =>
          setDeleteMatchDialog({ isOpen: false, matchId: null, matchName: "" })
        }
        isLoading={isLoading}
      />

      <div className="section">
        <div className="flex justify-between items-center mb-6">
          <h1>
            {editingTournament ? (
              <form
                onSubmit={handleTournamentSubmit}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="_action" value="updateTournament" />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="name"
                    defaultValue={tournament.name}
                    className="text-4xl font-sans-semibold text-blue-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="btn-icon"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="lg" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => setEditingTournament(false)}
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm text-blue-grey-700 mb-1"
                    >
                      Start Date:
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      defaultValue={tournament.start_date}
                      className="text-lg font-sans-medium text-blue-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm text-blue-grey-700 mb-1"
                    >
                      End Date:
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      defaultValue={tournament.end_date}
                      className="text-lg font-sans-medium text-blue-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <>
                {tournament.name}
                <button
                  className="btn-icon ml-2"
                  onClick={() => setEditingTournament(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </>
            )}
          </h1>
          <div className="flex gap-4">
            <button
              className="btn btn-neutral"
              onClick={() => setShowAddCategory(!showAddCategory)}
              disabled={isLoading}
            >
              {showAddCategory ? "Cancel" : "Add Category"}
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => {
                setShowAddMatch(!showAddMatch);
                if (!showAddMatch && categories.length > 0) {
                  setSelectedCategory((categories[0] as Category).id);
                }
              }}
              disabled={isLoading}
            >
              {showAddMatch ? "Cancel" : "Add Match"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3>Status</h3>
            <p className="text-lg mb-4">{tournament.status}</p>
            <form onSubmit={handleStatusSubmit}>
              <input
                type="hidden"
                name="_action"
                value="updateTournamentStatus"
              />
              <div className="form-group">
                <label htmlFor="status">Update Status:</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={tournament.status}
                  disabled={isLoading}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Updating...</span>
                  </div>
                ) : (
                  "Update Status"
                )}
              </button>
            </form>
          </div>
          <div>
            <h3>Dates</h3>
            <p className="text-lg">
              {new Date(tournament.start_date).toLocaleDateString()} -{" "}
              {new Date(tournament.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Side Panels */}
      {showAddCategory && (
        <>
          <div className="overlay" onClick={() => setShowAddCategory(false)} />
          <div className="side-panel">
            <div className="flex justify-between items-center mb-6">
              <h2>Add New Category</h2>
              <button
                className="btn-icon"
                onClick={() => setShowAddCategory(false)}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <input type="hidden" name="_action" value="addCategory" />
              <div className="form-group">
                <label htmlFor="categoryName">Category Name:</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Adding...</span>
                  </div>
                ) : (
                  "Add Category"
                )}
              </button>
            </form>
          </div>
        </>
      )}

      {showAddMatch && (
        <>
          <div className="overlay" onClick={() => setShowAddMatch(false)} />
          <div className="side-panel">
            <div className="flex justify-between items-center mb-6">
              <h2>Add New Match</h2>
              <button
                className="btn-icon"
                onClick={() => setShowAddMatch(false)}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddMatch}>
              <input type="hidden" name="_action" value="addMatch" />
              <div className="form-group">
                <label htmlFor="categoryId">Category:</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(parseInt(e.target.value, 10))
                  }
                  required
                  disabled={isLoading}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="isPlayoff">Match Type:</label>
                <select id="isPlayoff" name="isPlayoff" disabled={isLoading}>
                  <option value="false">Group Match</option>
                  <option value="true">Playoff Match</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="groupName">Group Name:</label>
                <input
                  type="text"
                  id="groupName"
                  name="groupName"
                  placeholder="e.g., Group A"
                  disabled={isLoading}
                />
                <small>Leave empty for playoff matches</small>
              </div>

              <div className="form-group">
                <label htmlFor="team1">Team 1:</label>
                <input
                  type="text"
                  id="team1"
                  name="team1"
                  required
                  disabled={isLoading}
                />
                <small>
                  For playoffs, can be "1st Group A" if team not determined yet
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="team2">Team 2:</label>
                <input
                  type="text"
                  id="team2"
                  name="team2"
                  required
                  disabled={isLoading}
                />
                <small>
                  For playoffs, can be "2nd Group B" if team not determined yet
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input type="time" id="time" name="time" disabled={isLoading} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter match location"
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Adding...</span>
                  </div>
                ) : (
                  "Add Match"
                )}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Categories and Matches */}
      {categories.length === 0 ? (
        <div className="section">
          <p>
            No categories defined for this tournament. Add a category to get
            started.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                {editingCategory === category.id ? (
                  <form
                    onSubmit={(e) => handleCategorySubmit(e, category.id)}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="hidden"
                      name="_action"
                      value="updateCategory"
                    />
                    <input
                      type="hidden"
                      name="categoryId"
                      value={category.id}
                    />
                    <input
                      type="text"
                      name="categoryName"
                      defaultValue={category.name}
                      className="text-2xl font-sans-semibold text-blue-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="btn-icon"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="lg" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setEditingCategory(null)}
                      disabled={isLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <>
                    <h3>{category.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-icon"
                        onClick={() => setEditingCategory(category.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        className="btn-icon text-red-600"
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <Link
                        to={`/category-overview/${category.id}`}
                        className="btn-icon text-blue-600"
                        title="Preview Category"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {matchesByCategory[category.id]?.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Date & Time</th>
                      <th>Teams</th>
                      <th>Score</th>
                      <th colSpan={2} className="text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchesByCategory[category.id].map((match) => (
                      <tr key={match.id}>
                        {editingMatch === match.id ? (
                          <td colSpan={4}>
                            <form
                              onSubmit={(e) => handleMatchSubmit(e, match.id)}
                            >
                              <input
                                type="hidden"
                                name="_action"
                                value="updateMatch"
                              />
                              <input
                                type="hidden"
                                name="matchId"
                                value={match.id}
                              />
                              <div className="form-group">
                                <label htmlFor={`location-${match.id}`}>
                                  Location:
                                </label>
                                <input
                                  type="text"
                                  id={`location-${match.id}`}
                                  name="location"
                                  defaultValue={match.location || ""}
                                  placeholder="Enter new location"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="isPlayoff">Match Type:</label>
                                <select
                                  id="isPlayoff"
                                  name="isPlayoff"
                                  defaultChecked={match.is_playoff}
                                >
                                  <option value="false">Group Match</option>
                                  <option value="true">Playoff Match</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label htmlFor="groupName">Group Name:</label>
                                <input
                                  type="text"
                                  id="groupName"
                                  name="groupName"
                                  defaultValue={match.group_name || ""}
                                  placeholder="e.g., Group A"
                                />
                                <small>Leave empty for playoff matches</small>
                              </div>
                              <div className="form-group">
                                <label htmlFor={`team1-${match.id}`}>
                                  Team 1:
                                </label>
                                <input
                                  type="text"
                                  id={`team1-${match.id}`}
                                  name="team1"
                                  defaultValue={match.team1}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor={`team2-${match.id}`}>
                                  Team 2:
                                </label>
                                <input
                                  type="text"
                                  id={`team2-${match.id}`}
                                  name="team2"
                                  defaultValue={match.team2}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor={`date-${match.id}`}>
                                  Date:
                                </label>
                                <input
                                  type="date"
                                  id={`date-${match.id}`}
                                  name="date"
                                  defaultValue={match.date}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor={`time-${match.id}`}>
                                  Time:
                                </label>
                                <input
                                  type="time"
                                  id={`time-${match.id}`}
                                  name="time"
                                  defaultValue={match.time || ""}
                                />
                              </div>
                              <div className="form-actions">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <LoadingSpinner size="md" />
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setEditingMatch(null)}
                                  disabled={isLoading}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </td>
                        ) : (
                          <>
                            <td>{match.location || "Not specified"}</td>
                            <td>
                              {new Date(match.date).toLocaleDateString()}
                              {match.time && ` ${match.time}`}
                            </td>
                            <td>
                              {match.team1} vs {match.team2}
                            </td>
                            <td>
                              {match.score1 !== null && match.score2 !== null
                                ? `${match.score1} - ${match.score2}`
                                : "Not played yet"}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <form
                                  onSubmit={(e) =>
                                    handleScoreSubmit(e, match.id)
                                  }
                                >
                                  <input
                                    type="hidden"
                                    name="_action"
                                    value="updateScore"
                                  />
                                  <input
                                    type="hidden"
                                    name="matchId"
                                    value={match.id}
                                  />
                                  <div
                                    style={{ display: "flex", gap: "0.5rem" }}
                                  >
                                    <input
                                      type="number"
                                      name="score1"
                                      defaultValue={match.score1 || ""}
                                      min="0"
                                      className="border rounded px-2 py-1 w-16 text-right bg-white shadow-sm"
                                      disabled={isLoading}
                                    />
                                    <span>-</span>
                                    <input
                                      type="number"
                                      name="score2"
                                      defaultValue={match.score2 || ""}
                                      min="0"
                                      className="border rounded px-2 py-1 w-16 text-right bg-white shadow-sm"
                                      disabled={isLoading}
                                    />
                                    <button
                                      type="submit"
                                      className="btn btn-neutral"
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <LoadingSpinner size="md" />
                                      ) : (
                                        "Update Score"
                                      )}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => setEditingMatch(match.id)}
                                  disabled={isLoading}
                                >
                                  Edit Match
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleDeleteMatch(
                                      match.id,
                                      match.team1,
                                      match.team2
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No matches scheduled for this category.</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="form-actions" style={{ marginTop: "2rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
          disabled={isLoading}
        >
          View Public Page
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/dashboard")}
          disabled={isLoading}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
