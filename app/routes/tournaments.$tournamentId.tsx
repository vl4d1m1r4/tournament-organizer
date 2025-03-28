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
    .order("date", { ascending: true });

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

function generateStandingsTable(matches: Match[]) {
  // Only consider matches with scores
  const completedMatches = matches.filter(
    (match) => match.score1 !== null && match.score2 !== null
  );

  if (completedMatches.length === 0) {
    return <p>No completed matches yet.</p>;
  }

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

    // Initialize teams if not present
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

    const team1Stats = teams.get(match.team1)!;
    const team2Stats = teams.get(match.team2)!;

    // Update matches played
    team1Stats.played++;
    team2Stats.played++;

    // Update points scored/conceded
    team1Stats.pointsScored += score1;
    team1Stats.pointsConceded += score2;
    team2Stats.pointsScored += score2;
    team2Stats.pointsConceded += score1;

    // Update wins/losses and points
    if (score1 > score2) {
      team1Stats.wins++;
      team1Stats.points += 2;
      team2Stats.losses++;
      team2Stats.points += 1;
    } else {
      team2Stats.wins++;
      team2Stats.points += 2;
      team1Stats.losses++;
      team1Stats.points += 1;
    }
  });

  // Convert to array and sort
  const standingsArray = Array.from(teams.entries()).map(([team, stats]) => ({
    team,
    ...stats,
    pointDiff: stats.pointsScored - stats.pointsConceded,
  }));

  standingsArray.sort((a, b) => {
    // First sort by points (descending)
    if (b.points !== a.points) return b.points - a.points;
    // Then by point differential (descending)
    return b.pointDiff - a.pointDiff;
  });

  return (
    <table>
      <thead>
        <tr>
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
        {standingsArray.map((standing) => (
          <tr key={standing.team}>
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
  );
}
