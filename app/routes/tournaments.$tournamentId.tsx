import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const tournamentId = params.tournamentId;
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

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
    .eq("tournament_id", tournamentId)
    .order("name", { ascending: true });

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

export default function TournamentDetails() {
  const { tournament, categories, matches } = useLoaderData<typeof loader>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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

  // Filter categories based on selection
  const filteredCategories =
    selectedCategoryId === null
      ? categories
      : categories.filter((category) => category.id === selectedCategoryId);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
      <p className="mb-1">
        Status: <span className="font-semibold">{tournament.status}</span>
      </p>
      <p className="mb-6">
        Dates: {formatDateDDMMYYYY(tournament.start_date)} -{" "}
        {formatDateDDMMYYYY(tournament.end_date)}
      </p>

      {categories.length === 0 ? (
        <p>No categories defined for this tournament.</p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Filter by Category:</h2>
            <div className="flex flex-wrap gap-2">
              {/* "All Categories" Button */}
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCategoryId === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Categories
              </button>
              {/* Category Filter Buttons */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedCategoryId === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Render filtered categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">{category.name}</h3>

                {/* Matches Table */}
                <h4 className="text-lg font-semibold mb-2">Matches</h4>
                {matchesByCategory[category.id]?.length > 0 ? (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team 1
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score 1
                          </th>
                          <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>{" "}
                          {/* vs */}
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score 2
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team 2
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {matchesByCategory[category.id].map((match) => (
                          <tr key={match.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                {formatDateDDMMYYYY(match.date)}{" "}
                                {match.time && ` ${match.time.substring(0, 5)}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {match.location || "TBD"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {match.team1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center">
                              {match.score1 ?? "-"}
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-400 text-center">
                              vs
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center">
                              {match.score2 ?? "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {match.team2}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6">
                    No matches scheduled for this category yet.
                  </p>
                )}

                {/* Standings table */}
                {generateStandingsTable(matchesByCategory[category.id] || [])}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function generateGroupStandings(matches: Match[]) {
  // Extract all unique teams participating in *group* matches
  const allTeams = new Set<string>();
  matches
    .filter((match) => !match.is_playoff) // Consider only group matches for initial team list
    .forEach((match) => {
      // Add team1 if it's a valid team name (not a placeholder)
      if (
        match.team1 &&
        !match.team1.match(/^(?:[1-4](?:st|nd|rd|th)|Winner|Loser)\b/i)
      ) {
        allTeams.add(match.team1);
      }
      // Add team2 if it's a valid team name (not a placeholder)
      if (
        match.team2 &&
        !match.team2.match(/^(?:[1-4](?:st|nd|rd|th)|Winner|Loser)\b/i)
      ) {
        allTeams.add(match.team2);
      }
    });

  // Initialize standings for all identified teams with 0 values
  const teams = new Map<
    string,
    {
      played: number;
      wins: number;
      losses: number;
      points: number;
      pointsScored: number;
      pointsConceded: number;
    }
  >();
  allTeams.forEach((team) => {
    teams.set(team, {
      played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pointsScored: 0,
      pointsConceded: 0,
    });
  });

  // Only consider completed non-playoff matches for calculation
  const completedGroupMatches = matches.filter(
    (match) =>
      !match.is_playoff && match.score1 !== null && match.score2 !== null
  );

  // Calculate standings based on completed matches
  completedGroupMatches.forEach((match) => {
    const score1 = match.score1 as number;
    const score2 = match.score2 as number;

    // Get potentially initialized stats
    const team1Stats = teams.get(match.team1);
    const team2Stats = teams.get(match.team2);

    // Update team1 stats if team exists in the map
    if (team1Stats) {
      team1Stats.played++;
      team1Stats.pointsScored += score1;
      team1Stats.pointsConceded += score2;
      if (score1 > score2) {
        // Win = 2 points
        team1Stats.wins++;
        team1Stats.points += 2;
      } else {
        // Loss = 1 point
        team1Stats.losses++;
        team1Stats.points += 1;
      }
    }

    // Update team2 stats if team exists in the map
    if (team2Stats) {
      team2Stats.played++;
      team2Stats.pointsScored += score2;
      team2Stats.pointsConceded += score1;
      if (score2 > score1) {
        // Win = 2 points
        team2Stats.wins++;
        team2Stats.points += 2;
      } else {
        // Loss = 1 point
        team2Stats.losses++;
        team2Stats.points += 1;
      }
    }
  });

  // Convert the final map to array and sort
  return Array.from(teams.entries())
    .map(([team, stats]) => ({
      team,
      ...stats,
      pointDiff: stats.pointsScored - stats.pointsConceded,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // If points are equal, sort by point differential
      if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
      // If point differential is also equal, sort by points scored
      if (b.pointsScored !== a.pointsScored)
        return b.pointsScored - a.pointsScored;
      // Finally, sort alphabetically by team name as a tie-breaker
      return a.team.localeCompare(b.team);
    });
}

function generateStandingsTable(categoryMatches: Match[]) {
  // Separate group and playoff matches for this category
  const groupMatches = categoryMatches.filter((match) => !match.is_playoff);
  const playoffMatches = categoryMatches.filter((match) => match.is_playoff);

  // Get unique group names within this category
  const groupNames = Array.from(
    new Set(groupMatches.map((match) => match.group_name).filter(Boolean))
  ).sort(); // Sort group names alphabetically

  const hasPlayoffMatches = playoffMatches.length > 0;

  // Render standings if there are defined groups, even if no matches are played yet.
  // Render playoffs separately if they exist.
  if (groupNames.length === 0 && !hasPlayoffMatches) {
    return (
      <p className="text-gray-500">
        No groups or playoff matches scheduled for this category yet.
      </p>
    );
  }

  return (
    <>
      {groupNames.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Group Standings</h4>
          {groupNames.map((groupName) => (
            <div key={groupName} className="group-standings mb-4 last:mb-0">
              <h5 className="text-md font-semibold mb-1">Group {groupName}</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        L
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pts
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PF
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PA
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diff
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generateGroupStandings(
                      groupMatches.filter(
                        (match) => match.group_name === groupName
                      )
                    ).map((standing, index) => (
                      <tr
                        key={standing.team}
                        className={index < 2 ? "bg-green-50" : ""} // Highlight top 2 potentially
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-medium">
                          {standing.team}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.played}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.wins}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.losses}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-bold">
                          {standing.points}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.pointsScored}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.pointsConceded}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {standing.pointDiff > 0
                            ? `+${standing.pointDiff}`
                            : standing.pointDiff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasPlayoffMatches && (
        <div className="playoff-section">
          <h4 className="text-lg font-semibold mb-2">Playoff Matches</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {playoffMatches
              // Sort playoffs if needed (e.g., by date or type)
              .sort(
                (a, b) =>
                  a.date.localeCompare(b.date) ||
                  (a.time || "").localeCompare(b.time || "")
              )
              .map((match) => (
                <div
                  key={match.id}
                  className="playoff-match border rounded p-3 bg-gray-50"
                >
                  <h5 className="text-md font-semibold mb-1">
                    {match.group_name || "Playoff"}
                  </h5>
                  <div className="teams text-sm mb-1">
                    <span className="team font-medium">{match.team1}</span>
                    <span className="vs text-gray-500 mx-1">vs</span>
                    <span className="team font-medium">{match.team2}</span>
                  </div>
                  <div className="match-details text-xs text-gray-600 mb-1">
                    <span>{formatDateDDMMYYYY(match.date)}</span>
                    {match.time && (
                      <span className="time mx-1">
                        {match.time.substring(0, 5)}
                      </span>
                    )}
                    {match.location && (
                      <span className="location">@ {match.location}</span>
                    )}
                  </div>
                  <div className="score text-sm font-bold">
                    {match.score1 !== null && match.score2 !== null
                      ? `${match.score1} - ${match.score2}`
                      : "Pending"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
