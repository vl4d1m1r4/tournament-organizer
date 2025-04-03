import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

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
      <h1>{tournament.name}</h1>
      <p>Status: {tournament.status}</p>
      <p>
        Dates: {new Date(tournament.start_date).toLocaleDateString()} -{" "}
        {new Date(tournament.end_date).toLocaleDateString()}
      </p>

      {categories.length === 0 ? (
        <p>No categories defined for this tournament.</p>
      ) : (
        <>
          <h2>Categories</h2>
          {categories.map((category) => (
            <div key={category.id}>
              <h3>{category.name}</h3>

              {matchesByCategory[category.id]?.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Teams</th>
                      <th>Location</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchesByCategory[category.id].map((match) => (
                      <tr key={match.id}>
                        <td>
                          {new Date(match.date).toLocaleDateString()}{" "}
                          {match.time && ` ${match.time}`}
                        </td>
                        <td>
                          {match.team1} vs {match.team2}
                        </td>
                        <td>{match.location || "Not specified"}</td>
                        <td>
                          {match.score1 !== null && match.score2 !== null
                            ? `${match.score1} - ${match.score2}`
                            : "Not played yet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No matches scheduled for this category.</p>
              )}

              {/* Standings table */}
              <h4>Standings</h4>
              {generateStandingsTable(matchesByCategory[category.id] || [])}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function generateGroupStandings(matches: Match[]) {
  // Only consider matches with scores
  const completedMatches = matches.filter(
    (match) => match.score1 !== null && match.score2 !== null
  );

  if (completedMatches.length === 0) {
    return [];
  }

  // Calculate standings
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

  completedMatches.forEach((match) => {
    const score1 = match.score1 as number;
    const score2 = match.score2 as number;

    // Initialize team stats if not already present
    if (!teams.has(match.team1)) {
      teams.set(match.team1, {
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
        pointsScored: 0,
        pointsConceded: 0,
      });
    }
    if (!teams.has(match.team2)) {
      teams.set(match.team2, {
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
        pointsScored: 0,
        pointsConceded: 0,
      });
    }

    // Update team1 stats
    const team1Stats = teams.get(match.team1)!;
    team1Stats.played++;
    team1Stats.pointsScored += score1;
    team1Stats.pointsConceded += score2;
    if (score1 > score2) {
      team1Stats.wins++;
      team1Stats.points += 2;
    } else {
      team1Stats.losses++;
      team1Stats.points += 1;
    }

    // Update team2 stats
    const team2Stats = teams.get(match.team2)!;
    team2Stats.played++;
    team2Stats.pointsScored += score2;
    team2Stats.pointsConceded += score1;
    if (score2 > score1) {
      team2Stats.wins++;
      team2Stats.points += 2;
    } else {
      team2Stats.losses++;
      team2Stats.points += 1;
    }
  });

  // Convert to array and sort by points (descending), then point differential
  return Array.from(teams.entries())
    .map(([team, stats]) => ({
      team,
      ...stats,
      pointDiff: stats.pointsScored - stats.pointsConceded,
    }))
    .sort((a, b) => {
      // Sort by points first
      if (b.points !== a.points) return b.points - a.points;
      // Then by point differential
      return b.pointDiff - a.pointDiff;
    });
}

function generateStandingsTable(matches: Match[]) {
  // Group matches by group name
  const groupMatches = matches.filter((match) => !match.is_playoff);
  const groupNames = Array.from(
    new Set(groupMatches.map((match) => match.group_name).filter(Boolean))
  );

  // Get playoff matches
  const playoffMatches = matches.filter((match) => match.is_playoff);

  // For each group, display standings

  return (
    <>
      {groupNames.map((groupName) => (
        <div key={groupName} className="group-standings">
          <h3>Group {groupName}</h3>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Played</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Points</th>
                <th>Points Scored</th>
                <th>Points Conceded</th>
                <th>Point Diff</th>
              </tr>
            </thead>
            <tbody>
              {generateGroupStandings(
                matches.filter((match) => match.group_name === groupName)
              ).map((standing, index) => (
                <tr
                  key={standing.team}
                  className={index < 2 ? "qualifying" : ""}
                >
                  <td>{index + 1}</td>
                  <td>{standing.team}</td>
                  <td>{standing.played}</td>
                  <td>{standing.wins}</td>
                  <td>{standing.losses}</td>
                  <td>
                    <strong>{standing.points}</strong>
                  </td>
                  <td>{standing.pointsScored}</td>
                  <td>{standing.pointsConceded}</td>
                  <td>{standing.pointDiff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {playoffMatches.length > 0 && (
        <div className="playoff-section">
          <h2>Playoff Matches</h2>
          <div className="playoff-matches">
            {playoffMatches.map((match) => (
              <div key={match.id} className="playoff-match">
                <h4>{match.group_name}</h4>
                <div className="teams">
                  <span className="team">{match.team1}</span>
                  <span className="vs">vs</span>
                  <span className="team">{match.team2}</span>
                </div>
                <div className="match-details">
                  <div className="date">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                  {match.time && <span className="time">{match.time}</span>}
                  {match.location && (
                    <span className="location">@ {match.location}</span>
                  )}
                </div>
                <div className="score">
                  {match.score1 !== null && match.score2 !== null
                    ? `${match.score1} - ${match.score2}`
                    : "Not played yet"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
