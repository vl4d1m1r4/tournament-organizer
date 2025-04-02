import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

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
      }
      break;
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
      }
      break;
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
      }
      break;
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
      }
      break;
    }

    case "updateTournamentStatus": {
      const status = formData.get("status") as string;

      const { error } = await supabase
        .from("tournaments")
        .update({ status })
        .eq("id", tournamentId);

      if (error) {
        console.error("Error updating tournament status:", error);
      }
      break;
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
      }
      break;
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
      }
      break;
    }
  }

  return null;
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

export default function AdminTournament() {
  const { tournament, categories, matches } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingMatch, setEditingMatch] = useState<number | null>(null);

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

  return (
    <div>
      <h1>Manage Tournament: {tournament.name}</h1>

      <div className="tournament-details">
        <h2>Tournament Details</h2>
        <Form method="post">
          <input type="hidden" name="_action" value="updateTournament" />
          <div className="form-group">
            <label htmlFor="name">Tournament Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={tournament.name}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              defaultValue={tournament.start_date}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              defaultValue={tournament.end_date}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Tournament
          </button>
        </Form>
      </div>

      <div className="tournament-details">
        <p>Status: {tournament.status}</p>
        <p>
          Dates: {new Date(tournament.start_date).toLocaleDateString()} -{" "}
          {new Date(tournament.end_date).toLocaleDateString()}
        </p>

        <Form method="post">
          <input type="hidden" name="_action" value="updateTournamentStatus" />
          <div className="form-group">
            <label htmlFor="status">Update Status:</label>
            <select id="status" name="status" defaultValue={tournament.status}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Update Status
          </button>
        </Form>
      </div>

      <h2>Categories</h2>
      <button
        className="btn btn-neutral"
        onClick={() => setShowAddCategory(!showAddCategory)}
      >
        {showAddCategory ? "Cancel" : "Add Category"}
      </button>

      {showAddCategory && (
        <Form method="post">
          <input type="hidden" name="_action" value="addCategory" />
          <div className="form-group">
            <label htmlFor="categoryName">Category Name:</label>
            <input type="text" id="categoryName" name="categoryName" required />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Category
          </button>
        </Form>
      )}

      {categories.length === 0 ? (
        <p>
          No categories defined for this tournament. Add a category to get
          started.
        </p>
      ) : (
        <>
          <h2>Matches</h2>
          <button
            className="btn btn-neutral"
            onClick={() => {
              setShowAddMatch(!showAddMatch);
              if (!showAddMatch && categories.length > 0) {
                setSelectedCategory((categories[0] as Category).id);
              }
            }}
          >
            {showAddMatch ? "Cancel" : "Add Match"}
          </button>

          {showAddMatch && (
            <Form method="post">
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
                <select id="isPlayoff" name="isPlayoff">
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
                />
                <small>Leave empty for playoff matches</small>
              </div>

              <div className="form-group">
                <label htmlFor="team1">Team 1:</label>
                <input type="text" id="team1" name="team1" required />
                <small>
                  For playoffs, can be "1st Group A" if team not determined yet
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="team2">Team 2:</label>
                <input type="text" id="team2" name="team2" required />
                <small>
                  For playoffs, can be "2nd Group B" if team not determined yet
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" required />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time:</label>
                <input type="time" id="time" name="time" />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter match location"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Match
              </button>
            </Form>
          )}

          {categories.map((category) => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                {editingCategory === category.id ? (
                  <Form method="post">
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
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        name="categoryName"
                        defaultValue={category.name}
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <h3>{category.name}</h3>
                    <button
                      className="btn btn-neutral"
                      onClick={() => setEditingCategory(category.id)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <h3>{category.name}</h3>

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
                            <Form method="post">
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
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => setEditingMatch(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </Form>
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
                                <Form method="post">
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
                                      style={{
                                        width: "60px",
                                        textAlign: "right",
                                      }}
                                    />
                                    <span>-</span>
                                    <input
                                      type="number"
                                      name="score2"
                                      defaultValue={match.score2 || ""}
                                      min="0"
                                      style={{
                                        width: "60px",
                                        textAlign: "right",
                                      }}
                                    />
                                    <button
                                      type="submit"
                                      className="btn btn-neutral"
                                    >
                                      Update Score
                                    </button>
                                  </div>
                                </Form>
                              </div>
                            </td>
                            <td>
                              <button
                                className="btn btn-secondary"
                                onClick={() => setEditingMatch(match.id)}
                              >
                                Edit Match
                              </button>
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
        </>
      )}

      <div className="form-actions" style={{ marginTop: "2rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
        >
          View Public Page
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
