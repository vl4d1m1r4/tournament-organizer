import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

// Define the structure of a match based on DB schema
// Note: Adjusted based on admin page schema
interface Match {
  id: number;
  category_id: number;
  group_name: string | null; // Matches the DB schema
  is_playoff: boolean; // Matches the DB schema
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM or null
  location: string | null;
}

interface Category {
  id: number;
  tournament_id: number;
  name: string;
}

interface Tournament {
  id: number;
  name: string;
  // Add other tournament fields if needed
}

// Type for matches grouped by date
type MatchesByDate = Record<string, Match[]>;

// Fetch real data in the loader
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const categoryId = params.categoryId;
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  if (!categoryId) {
    throw new Response("Category ID missing", { status: 400 });
  }

  // Fetch Category details
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, tournament_id")
    .eq("id", categoryId)
    .single();

  if (categoryError || !category) {
    console.error("Error fetching category:", categoryError);
    throw new Response("Category Not Found", { status: 404 });
  }

  // Fetch Tournament details using category's tournament_id
  const { data: tournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id, name") // Select only needed fields
    .eq("id", category.tournament_id)
    .single();

  if (tournamentError || !tournament) {
    console.error("Error fetching tournament for category:", tournamentError);
    // Decide on error handling, maybe show page without tournament name or throw 500
    throw new Response("Could not load tournament data", { status: 500 });
  }

  // Fetch matches for this category
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("category_id", categoryId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    // Return category/tournament info even if matches fail?
    return json(
      { category, tournament, matches: [] },
      { headers: response.headers }
    );
  }

  return json(
    { category, tournament, matches: matches || [] },
    { headers: response.headers }
  );
};

// Helper function to format date like "10 MAY"
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle invalid date string
      return "INVALID DATE";
    }
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    return `${day} ${month}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "ERR DATE";
  }
};

// Helper to format time, handling null
const formatTime = (timeString: string | null): string => {
  if (!timeString) return "--:--"; // Or some placeholder
  // Assuming timeString is 'HH:MM:SS' or 'HH:MM'
  const parts = timeString.split(":");
  return `${parts[0]}:${parts[1]}`;
};

// --- Components ---

// Component for a single match item in the list
const MatchItem: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className="flex items-center mb-2 items-stretch w-64">
      {" "}
      {/* Fixed width */}
      {/* Date/Time Box */}
      <div className="flex flex-col bg-[#F97316] text-white p-2 text-center w-16 content-center flex-shrink-0">
        <div className="text-xs font-semibold">{formatDate(match.date)}</div>
        <div className="text-xs">{formatTime(match.time)}</div>
      </div>
      {/* Teams Box */}
      <div className="bg-[#1E3A8A] text-white p-2 flex-grow text-sm overflow-hidden">
        <div className="truncate" title={match.team1}>
          {match.team1}
        </div>
        <div className="truncate" title={match.team2}>
          {match.team2}
        </div>
      </div>
    </div>
  );
};

// Component for the Group Table (Teams List) - Smaller size
const GroupTable: React.FC<{
  group: string;
  teams: string[];
  location: string | null;
}> = ({ group, teams, location }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-row items-start">
        <div className="font-bold text-base mb-1 flex items-center justify-center">
          {/* Smaller circle */}
          <span className="text-white bg-blue-800/80 h-5 w-5 flex items-center justify-center mt-1 p-4">
            {group}
          </span>
        </div>
        {/* Reduced padding and font size */}
        <div className="bg-[#374151] text-white p-2 w-full">
          {/* Smaller font size and truncate */}
          <ul>
            {teams.map((team) => (
              // Added truncate and title for long names
              <li key={team} className="truncate" title={team}>
                {team}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {location && (
        /* Reduced padding and font size, added truncate */
        <div
          className="bg-[#F97316] text-white text-center p-1 truncate w-32 mx-auto"
          title={location}
        >
          {location}
        </div>
      )}
    </div>
  );
};

// Component for Playoff Match Item - Horizontal Teams (Corrected Syntax)
const PlayoffMatchItem: React.FC<{ match: Match }> = ({ match }) => {
  const label = match.group_name || "PLAYOFF";
  const isFinal = label.toUpperCase() === "FINAL";

  // Adjust styles for horizontal layout
  const labelStyles = isFinal
    ? "text-sm font-semibold py-1 px-2" // Slightly more padding for final label
    : "text-xs py-0.5 px-2";
  const teamBoxStyles = isFinal
    ? "p-2 text-base" // Reduced padding for final teams
    : "p-1.5 text-sm"; // Reduced padding for other teams

  return (
    // Adjusted width constraints, ensures centering
    <div className="flex flex-col items-center mb-4 w-auto min-w-[180px] max-w-[240px]">
      {/* Orange Box - Horizontal Teams */}
      <div
        className={`bg-[#F97316] text-white rounded-t text-center shadow-md w-full ${teamBoxStyles}`}
      >
        {/* Flex row for horizontal layout, center items, add gap */}
        <div className="flex items-center justify-center gap-2 font-semibold whitespace-nowrap overflow-hidden">
          {/* Use flex-1 to allow truncation, text-right/left for alignment */}
          <span
            className="truncate flex-1 text-right"
            title={match.team1 || "TBD"}
          >
            {match.team1 || "TBD"}
          </span>
          <span className="text-xs font-normal opacity-80 flex-shrink-0">
            vs
          </span>
          <span
            className="truncate flex-1 text-left"
            title={match.team2 || "TBD"}
          >
            {match.team2 || "TBD"}
          </span>
        </div>
      </div>
      {/* Blue Box for Label - Full width */}
      <div
        className={`bg-[#1D4ED8] text-white rounded-b text-center shadow-md w-full ${labelStyles}`}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
};

// Group Matches Column`
const GroupMatchesColumn: React.FC<{ matchesByDate: MatchesByDate }> = ({
  matchesByDate,
}) => {
  const sortedDates = Object.keys(matchesByDate).sort((a, b) =>
    a.localeCompare(b)
  );

  if (sortedDates.length === 0) {
    return null; // Or some placeholder if needed
  }

  return (
    <div className="mt-4 flex flex-row gap-4 overflow-x-auto pb-2">
      {sortedDates.map((date) => {
        const dailyMatches = matchesByDate[date];
        return (
          <div key={date} className="flex flex-col flex-shrink-0">
            {/* Column for each day */}
            <div className="text-center font-semibold text-white bg-blue-800/80 rounded py-1 mb-2 text-xs">
              {formatDate(date)} {/* Date Header */}
            </div>
            <div className="space-y-2">
              {dailyMatches.map((match: Match) => (
                <MatchItem key={match.id} match={match} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Page Component ---

export default function CategoryOverview() {
  const { category, tournament, matches } = useLoaderData<typeof loader>();

  // --- Data Processing ---

  const groupNames = Array.from(
    new Set(
      matches
        .filter((match: Match) => !match.is_playoff && match.group_name)
        .map((match: Match) => match.group_name!)
    )
  ).sort();

  // Find the earliest date among all group matches to determine team list display date
  const allGroupMatchDates = Array.from(
    new Set(
      matches
        .filter((match: Match) => !match.is_playoff && match.date)
        .map((match: Match) => match.date)
    )
  ).sort();

  const displayDate =
    allGroupMatchDates.length > 0 ? allGroupMatchDates[0] : null;

  const getUniqueTeams = (groupFilter: string): string[] => {
    const teams = new Set<string>();
    if (!displayDate) return []; // Use the determined displayDate
    matches
      .filter(
        (match: Match) =>
          // match.date === displayDate && // Filter by earliest date only if needed for team list
          match.group_name === groupFilter && !match.is_playoff
      )
      .forEach((match: Match) => {
        // Exclude playoff placeholder teams
        if (
          match.team1 &&
          !match.team1.match(/^(?:[1-4](?:st|nd|rd|th)|Winner|Loser)\b/i)
        ) {
          teams.add(match.team1);
        }
        if (
          match.team2 &&
          !match.team2.match(/^(?:[1-4](?:st|nd|rd|th)|Winner|Loser)\b/i)
        ) {
          teams.add(match.team2);
        }
      });
    return Array.from(teams).sort();
  };

  const getUniqueLocation = (groupFilter: string): string | null => {
    const locations = new Set<string>();
    // Consider all matches in the group for location, not just the first date
    matches
      .filter(
        (match: Match) =>
          match.group_name === groupFilter &&
          !match.is_playoff &&
          match.location
      )
      .forEach((match: Match) => locations.add(match.location!));

    // If multiple locations, show them; otherwise, show the single one or TBD
    const uniqueLocations = Array.from(locations);
    if (uniqueLocations.length === 0) return "TBD";
    if (uniqueLocations.length === 1) return uniqueLocations[0];
    return uniqueLocations.join(" / "); // Or handle multiple locations differently
  };

  // 3. Group matches by Group Name and then by Date
  const matchesByGroupThenDate: Record<string, MatchesByDate> =
    groupNames.reduce((acc, groupName) => {
      const groupMatches = matches.filter(
        (match) => match.group_name === groupName && !match.is_playoff
      );

      const matchesByDate: MatchesByDate = groupMatches.reduce(
        (dateAcc, match) => {
          const date = match.date;
          if (!dateAcc[date]) {
            dateAcc[date] = [];
          }
          dateAcc[date].push(match);
          // Sort matches within the same date by time
          dateAcc[date].sort((a: Match, b: Match) => {
            if (!a.time) return 1; // Matches without time last
            if (!b.time) return -1;
            return a.time.localeCompare(b.time);
          });
          return dateAcc;
        },
        {} as MatchesByDate
      );

      acc[groupName] = matchesByDate;
      return acc;
    }, {} as Record<string, MatchesByDate>);

  // --- Playoff Data Processing (remains the same) ---
  const playoffMatches = matches
    .filter((match: Match) => match.is_playoff)
    .sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      // Define playoff order more robustly
      const playoffOrder: { [key: string]: number } = {
        QUARTER: 4,
        SEMI: 3,
        "3RD PLACE": 2,
        FINAL: 1,
        // Add other potential labels if needed
      };

      // Extract the base label (e.g., "QUARTER" from "QUARTER-1")
      const getBaseLabel = (groupName: string | null) =>
        (groupName || "PLAYOFF").toUpperCase().split("-")[0].trim();

      const labelA = getBaseLabel(a.group_name);
      const labelB = getBaseLabel(b.group_name);

      const orderA = playoffOrder[labelA] || 99; // Default large number for unknown/other labels
      const orderB = playoffOrder[labelB] || 99;

      if (orderA !== orderB) return orderA - orderB; // Sort by playoff stage first

      // If same stage, compare potential suffixes (e.g., QUARTER-1 vs QUARTER-2)
      const suffixA = parseInt((a.group_name || "").split("-")[1] || "0", 10);
      const suffixB = parseInt((b.group_name || "").split("-")[1] || "0", 10);
      if (suffixA !== suffixB) return suffixA - suffixB;

      // Then sort by time if dates and stages/suffixes are the same
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

  // --- Render ---
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center relative flex flex-col">
      {/* Header Bar (remains the same) */}
      <div className="bg-blue-grey-200 py-3 shadow-md w-full z-20">
        <div className="mx-auto flex justify-between px-4 items-baseline">
          <img
            src="/images/logo_mladost.png"
            alt="Left Logo"
            className="h-10 md:h-12 w-16"
          />
          <h1 className="text-xl md:text-xl font-bold text-blue-800 uppercase text-center flex-grow">
            {tournament.name} - {category.name}
          </h1>
          <img
            src="/images/logo_mladost.png"
            alt="Right Logo"
            className="h-10 md:h-12 w-16"
          />
        </div>
      </div>

      {/* Main Content Area with Background */}
      <div
        className="flex-grow p-4 md:p-8 bg-no-repeat bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/background.svg')" }}
      >
        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-8 items-start max-w-6xl mx-auto relative z-10">
          {/* --- Group Column 1 --- */}
          {groupNames.length > 0 && (
            <div className="flex flex-col">
              <GroupTable
                group={groupNames[0]}
                teams={getUniqueTeams(groupNames[0])}
                location={getUniqueLocation(groupNames[0])}
              />
            </div>
          )}
          {groupNames.length === 0 && (
            <div className="text-white/70 text-center col-span-1 md:col-span-3">
              No group matches found.
            </div>
          )}
          {/* --- Center Column (Playoffs) --- */}
          {groupNames.length > 0 && (
            <div className="flex flex-col items-center justify-start space-y-4 pt-8 md:pt-16">
              {playoffMatches.length > 0 ? (
                playoffMatches.map((match: Match) => (
                  <PlayoffMatchItem key={match.id} match={match} />
                ))
              ) : (
                <p className="text-white/70 mt-8">Playoffs TBD</p>
              )}
            </div>
          )}
          {/* --- Group Column 2 --- */}
          {groupNames.length > 1 && (
            <div className="flex flex-col">
              <GroupTable
                group={groupNames[1]}
                teams={getUniqueTeams(groupNames[1])}
                location={getUniqueLocation(groupNames[1])}
              />
            </div>
          )}
          {groupNames.length === 1 && <div />}{" "}
          {/* Empty div to maintain grid structure */}
          {/* --- Match Lists Row (Below Grid) --- */}
          {/* This row spans all 3 columns */}
          <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-4 md:gap-8 justify-between mt-4">
            {/* Group 1 Matches */}
            {groupNames.length > 0 && (
              <GroupMatchesColumn
                matchesByDate={matchesByGroupThenDate[groupNames[0]] || {}}
              />
            )}
            {/* Optional: Spacer or divider if needed between group match lists */}
            {/* {groupNames.length > 1 && <div className="border-l border-gray-600 hidden md:block"></div>} */}
            {/* Group 2 Matches */}
            {groupNames.length > 1 && (
              <GroupMatchesColumn
                matchesByDate={matchesByGroupThenDate[groupNames[1]] || {}}
              />
            )}
            {/* Handle case with only one group */}
            {groupNames.length === 1 && <div className="flex-1"></div>}{" "}
            {/* Fills space if only one group */}
          </div>
        </div>
      </div>
    </div>
  );
}
