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
import MatchEditForm from "~/components/MatchEditForm";

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
      const score1String = formData.get("score1") as string;
      const score2String = formData.get("score2") as string;

      // Convert empty strings to null, otherwise parse as integer
      const score1Value =
        score1String.trim() === "" ? null : parseInt(score1String, 10);
      const score2Value =
        score2String.trim() === "" ? null : parseInt(score2String, 10);

      // Additional check: if parseInt resulted in NaN (e.g., non-numeric input), treat as null
      const finalScore1 = isNaN(score1Value as number) ? null : score1Value;
      const finalScore2 = isNaN(score2Value as number) ? null : score2Value;

      const { error } = await supabase
        .from("matches")
        .update({
          score1: finalScore1,
          score2: finalScore2,
        })
        .eq("id", matchId);

      if (error) {
        console.error("Error updating score:", error);
        return json({ _action: action, error: error.message });
      }
      // Return success, potentially with the updated scores if needed on client
      return json({
        _action: action,
        updatedMatchId: matchId,
        score1: finalScore1,
        score2: finalScore2,
      });
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
      const score1String = formData.get("score1") as string;
      const score2String = formData.get("score2") as string;

      // Convert empty strings to null, otherwise parse as integer for scores
      const score1Value =
        score1String?.trim() === "" ? null : parseInt(score1String, 10);
      const score2Value =
        score2String?.trim() === "" ? null : parseInt(score2String, 10);

      // Additional check: if parseInt resulted in NaN (e.g., non-numeric input), treat as null
      const finalScore1 = isNaN(score1Value as number) ? null : score1Value;
      const finalScore2 = isNaN(score2Value as number) ? null : score2Value;

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
          score1: finalScore1,
          score2: finalScore2,
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

// Helper function to format date as dd.mm.yyyy
const formatDateDDMMYYYY = (dateString: string | Date): string => {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "Error";
  }
};

export default function AdminTournament() {
  const { tournament, categories, matches } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher<FetcherData>();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingMatchDetails, setEditingMatchDetails] = useState<Match | null>(
    null
  );
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

  // Handle fetcher data changes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const action = fetcher.data._action;
      const error = fetcher.data.error;
      let notificationType: "success" | "error" = error ? "error" : "success";
      let notificationMessage = "";

      switch (action) {
        case "addCategory":
          notificationMessage = error
            ? `Error adding category: ${error}`
            : "Category added successfully!";
          if (!error) setShowAddCategory(false);
          break;
        case "addMatch":
          notificationMessage = error
            ? `Error adding match: ${error}`
            : "Match added successfully!";
          if (!error) setShowAddMatch(false);
          break;
        case "updateScore":
          notificationMessage = error
            ? `Error updating score: ${error}`
            : "Score updated successfully!";
          break;
        case "updateTournament":
          notificationMessage = error
            ? `Error updating tournament: ${error}`
            : "Tournament updated successfully!";
          if (!error) setEditingTournament(false);
          break;
        case "updateTournamentStatus":
          notificationMessage = error
            ? `Error updating status: ${error}`
            : "Tournament status updated successfully!";
          break;
        case "updateCategory":
          notificationMessage = error
            ? `Error updating category: ${error}`
            : "Category updated successfully!";
          if (!error) setEditingCategory(null);
          break;
        case "updateMatch":
          notificationMessage = error
            ? `Error updating match: ${error}`
            : "Match updated successfully!";
          // Close the edit panel on success
          if (!error) setEditingMatchDetails(null);
          break;
        case "deleteCategory":
          notificationMessage = error
            ? `Error deleting category: ${error}`
            : "Category deleted successfully!";
          setDeleteCategoryDialog({
            isOpen: false,
            categoryId: null,
            categoryName: "",
          });
          break;
        case "deleteMatch":
          notificationMessage = error
            ? `Error deleting match: ${error}`
            : "Match deleted successfully!";
          setDeleteMatchDialog({ isOpen: false, matchId: null, matchName: "" });
          break;
        default:
          // Only show notification if there's a message to show
          if (error) {
            notificationMessage = `An unexpected error occurred: ${error}`;
            notificationType = "error";
          } else if (action) {
            // Generic success for unhandled actions? Maybe avoid.
            // notificationMessage = "Action completed.";
            // notificationType = "success";
          } else {
            return; // No action, no notification
          }
      }

      if (notificationMessage) {
        setNotification({
          message: notificationMessage,
          type: notificationType,
        });
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

  const handleScoreSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

  // Handler for opening the Edit Match side panel
  const handleEditMatchClick = (match: Match) => {
    setEditingMatchDetails(match);
  };

  // Handler for edit match completion
  const handleMatchEditComplete = (data: any) => {
    if (data.error) {
      setNotification({
        message: `Error updating match: ${data.error}`,
        type: "error"
      });
    } else {
      setNotification({
        message: "Match updated successfully!",
        type: "success"
      });
      setEditingMatchDetails(null);
    }
  };

  const isLoading = fetcher.state === "submitting";

  return (
    <div className="relative p-4 md:p-8">
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
            <Link
              to={`/admin/matches-by-location/${tournament.id}`}
              className="btn btn-primary"
            >
              Matches by Location
            </Link>
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

      {/* Edit Match Component */}
      {editingMatchDetails && (
        <MatchEditForm
          match={editingMatchDetails}
          categories={categories}
          onClose={() => setEditingMatchDetails(null)}
          afterSubmit={handleMatchEditComplete}
        />
      )}

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
            <div
              key={category.id}
              className="category-section border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="category-header bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
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
                    <h3 className="text-xl font-semibold text-blue-900 m-0">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-icon p-1 text-gray-600 hover:text-blue-700"
                        onClick={() => setEditingCategory(category.id)}
                        title="Edit Category"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                        className="btn-icon p-1 text-gray-600 hover:text-red-700"
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                        title="Delete Category"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                        className="btn-icon p-1 text-gray-600 hover:text-indigo-700"
                        title="Preview Category"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                          Date/Time/Loc
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Team 1
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Team 2
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score & Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matchesByCategory[category.id].map((match) => (
                        <tr
                          key={match.id}
                          className="hover:bg-gray-50 align-middle"
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                            <div>{formatDateDDMMYYYY(match.date)}</div>
                            <div className="text-xs text-gray-500">
                              {match.time
                                ? match.time.substring(0, 5)
                                : "--:--"}
                              {match.location && ` @ ${match.location}`}
                              {!match.location && ` @ TBD`}
                            </div>
                            {match.is_playoff && (
                              <div className="text-xs text-indigo-600 font-medium mt-1">
                                {match.group_name || "Playoff"}
                              </div>
                            )}
                          </td>

                          <td className="px-3 py-2 whitespace-normal text-sm font-medium text-gray-900">
                            {match.team1}
                          </td>

                          <td className="px-3 py-2 whitespace-normal text-sm font-medium text-gray-900">
                            {match.team2}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center gap-3">
                              <Form
                                method="post"
                                onSubmit={handleScoreSubmit}
                                className="flex items-center gap-1"
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
                                <input
                                  type="number"
                                  name="score1"
                                  defaultValue={match.score1 ?? ""}
                                  min="0"
                                  className="border rounded px-2 py-1 w-12 text-sm text-center bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  disabled={isLoading}
                                  aria-label="Team 1 Score"
                                  placeholder="S1"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                  type="number"
                                  name="score2"
                                  defaultValue={match.score2 ?? ""}
                                  min="0"
                                  className="border rounded px-2 py-1 w-12 text-sm text-center bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  disabled={isLoading}
                                  aria-label="Team 2 Score"
                                  placeholder="S2"
                                />
                                <button
                                  type="submit"
                                  className="btn-icon p-1 text-gray-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isLoading}
                                  title="Update Score"
                                >
                                  {fetcher.formData?.get("matchId") ===
                                    String(match.id) &&
                                    fetcher.formData?.get("_action") ===
                                      "updateScore" ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
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
                              </Form>

                              {/* Quick Score Update Link */}
                              <Link
                                to={`/match-score/${match.id}?contentOnly=true`}
                                className="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 rounded"
                                title="Quick Score Interface"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </Link>

                              <button
                                onClick={() => handleEditMatchClick(match)}
                                className="btn-icon p-1 text-gray-600 hover:text-blue-700"
                                title="Edit Match"
                                disabled={isLoading}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                                type="button"
                                className="btn-icon p-1 text-gray-600 hover:text-red-700 disabled:opacity-50"
                                onClick={() =>
                                  handleDeleteMatch(
                                    match.id,
                                    match.team1,
                                    match.team2
                                  )
                                }
                                disabled={isLoading}
                                title="Delete Match"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 p-4">
                  No matches scheduled for this category.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
          disabled={isLoading}
        >
          View Public Page
        </button>
        <button
          type="button"
          className="btn btn-neutral"
          onClick={() => navigate("/admin/dashboard")}
          disabled={isLoading}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
