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
    <div className="flex items-center mb-2 items-stretch w-full">
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
  rightAlign?: boolean;
  teams: string[];
  location: string | null;
}> = ({ group, rightAlign, teams, location }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-row items-start">
        {!rightAlign && (
          <div className="font-bold text-base mb-1 flex items-center justify-center">
            {/* Smaller circle */}
            <span className="text-white bg-blue-800/80 h-5 w-5 whitespace-nowrap flex items-center justify-center mt-1 p-4">
              {group}
            </span>
          </div>
        )}
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
        {rightAlign && (
          <div className="font-bold text-base mb-1 flex items-center justify-center">
            {/* Smaller circle */}
            <span className="text-white bg-blue-800/80 h-5 w-5 whitespace-nowrap flex items-center justify-center mt-1 p-4">
              {group}
            </span>
          </div>
        )}
      </div>
      {location && (
        /* Reduced padding and font size, added truncate */
        <div
          className="bg-[#F97316] text-xs text-white text-center p-1 w-1/2 mx-auto"
          title={location}
        >
          {location}
        </div>
      )}
    </div>
  );
};

// Component for Playoff Match Item - Updated to include date/time/location
const PlayoffMatchItem: React.FC<{ match: Match }> = ({ match }) => {
  const label = match.group_name || "PLAYOFF";
  const isFinal = label.toUpperCase() === "FINAL";

  const labelStyles = isFinal
    ? "text-md font-semibold py-2 px-4" // Slightly more padding for final label
    : "text-sm py-1 px-4";
  const teamBoxStyles = isFinal
    ? "p-4 text-base" // Reduced padding for final teams
    : "p-2 text-sm"; // Reduced padding for other teams

  return (
    <div className="flex flex-col items-center mb-4 w-auto min-w-[180px]">
      {/* Orange Box - Horizontal Teams */}
      <div
        className={`bg-[#F97316] text-white rounded-t text-center shadow-md w-full ${teamBoxStyles}`}
      >
        <div className="flex items-center justify-center gap-2 font-semibold whitespace-nowrap">
          <span className="flex-1 text-right" title={match.team1 || "TBD"}>
            {match.team1 || "TBD"}
          </span>
          <span className="text-xs font-normal opacity-80 flex-shrink-0">
            vs
          </span>
          <span className="flex-1 text-left" title={match.team2 || "TBD"}>
            {match.team2 || "TBD"}
          </span>
        </div>
      </div>
      {/* Blue Box for Label */}
      <div
        className={`bg-[#1D4ED8] text-white text-center shadow-md w-full ${labelStyles}`}
        // Note: removed rounded-b here if date/time box is added below
      >
        {label.toUpperCase()}
      </div>
      {/* New Box for Date/Time/Location */}
      <div className="bg-gray-700/70 text-white text-xs text-center p-1 rounded-b shadow-md w-full">
        <span>{formatDate(match.date)}</span>
        {match.time && <span> | {formatTime(match.time)}</span>}
        {match.location && (
          <span className="block" title={match.location}>
            {match.location}
          </span>
        )}
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
  const numberOfDays = sortedDates.length;

  if (numberOfDays === 0) {
    return null; // Or some placeholder if needed
  }

  let gridColsClass = "grid-cols-1";
  if (numberOfDays >= 2) gridColsClass += " md:grid-cols-2";
  if (numberOfDays >= 3) gridColsClass += " lg:grid-cols-3";

  return (
    <div className={`grid ${gridColsClass} gap-4 mt-4 w-full`}>
      {sortedDates.map((date) => {
        const dailyMatches = matchesByDate[date];
        return (
          <div key={date} className="flex flex-col">
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
  ).sort((a, b) => {
    const aIsLetter = /^[A-Za-z]/.test(a);
    const bIsLetter = /^[A-Za-z]/.test(b);
    const aIsNumber = /^\d/.test(a);
    const bIsNumber = /^\d/.test(b);

    if (aIsLetter && bIsNumber) return -1; // Letters before numbers
    if (aIsNumber && bIsLetter) return 1; // Numbers after letters

    if (aIsLetter && bIsLetter) {
      return a.localeCompare(b); // Sort letters alphabetically
    }

    if (aIsNumber && bIsNumber) {
      // Try numeric sort first, fallback to locale compare if not pure numbers
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    }

    // Fallback for mixed types or other characters (e.g., special symbols)
    return a.localeCompare(b);
  });

  // Calculate midpoint for splitting groups visually
  const midPoint = Math.ceil(groupNames.length / 2);
  const leftGroupNames = groupNames.slice(0, midPoint);
  const rightGroupNames = groupNames.slice(midPoint);

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

  const hasPlayoffs = playoffMatches.length > 0;
  const numberOfGroups = groupNames.length;

  let mainGridClasses =
    "grid grid-cols-1 gap-4 md:gap-8 items-start max-w-6xl mx-auto relative z-10";

  if (numberOfGroups > 1) {
    // Default: Left Groups (1fr), Center Playoffs (auto), Right Groups (1fr)
    mainGridClasses += " md:grid-cols-[1fr_auto_1fr]";
  } else if (numberOfGroups === 1 && hasPlayoffs) {
    // One Group (2fr), Playoffs (1fr)
    mainGridClasses += " md:grid-cols-[2fr_1fr]";
  } else {
    // One Group, No Playoffs OR No Groups, Yes Playoffs OR No Groups, No Playoffs
    // All these cases use a single centered column layout.
    mainGridClasses += " md:grid-cols-1";
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center relative flex flex-col">
      {/* Header Bar */}
      <div className="bg-blue-grey-200 py-3 shadow-md w-full z-20">
        <div className="mx-auto flex justify-between px-4 items-center">
          <img src="/images/rhino_logo.svg" alt="Left Logo" className="w-16" />
          <h1 className="text-xl md:text-xl font-bold text-blue-800 uppercase text-center flex-grow m-0">
            {tournament.name} - {category.name}
          </h1>
          <img
            src="/images/mladost_logo.svg"
            alt="Right Logo"
            className="w-16"
          />
        </div>
      </div>

      {/* Main Content Area with Background */}
      <div
        className="flex-grow p-4 md:p-8 bg-no-repeat bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/background.svg')" }}
      >
        {/* Main Grid container (Group Tables & Playoffs) */}
        <div className={mainGridClasses}>
          {/* Column 1: Left Groups OR Single Group */}
          {numberOfGroups > 0 && (
            <div
              className={`flex flex-col space-y-4 ${
                // Center single group column if it's the only thing (no playoffs)
                numberOfGroups === 1 && !hasPlayoffs
                  ? "md:w-2/3 md:mx-auto"
                  : ""
              } ${
                // Explicitly set start col for clarity, though implicit in some cases
                numberOfGroups > 1 || (numberOfGroups === 1 && hasPlayoffs)
                  ? "md:col-start-1"
                  : ""
              }`}
            >
              {(numberOfGroups === 1 ? groupNames : leftGroupNames).map(
                (groupName) => (
                  <GroupTable
                    key={groupName}
                    group={groupName}
                    teams={getUniqueTeams(groupName)}
                    location={getUniqueLocation(groupName)}
                  />
                )
              )}
            </div>
          )}

          {/* Column 2: Playoffs */}
          {hasPlayoffs && (
            <div
              className={`flex flex-col items-center justify-start space-y-4 pt-8 order-last md:order-none ${
                // Ensure playoffs are visually after groups on mobile if multiple cols
                numberOfGroups > 1 ? "md:col-start-2" : ""
              } ${
                numberOfGroups === 1 && hasPlayoffs ? "md:col-start-2" : ""
              } ${
                numberOfGroups === 0
                  ? "md:col-start-1" // Center (in 1-col grid) if no groups
                  : ""
              }`}
            >
              {playoffMatches.map((match: Match) => (
                <PlayoffMatchItem key={match.id} match={match} />
              ))}
            </div>
          )}

          {/* Column 3: Right Groups */}
          {numberOfGroups > 1 && (
            <div className="flex flex-col space-y-4 md:col-start-3 order-3">
              {rightGroupNames.map((groupName) => (
                <GroupTable
                  key={groupName}
                  group={groupName}
                  rightAlign={true}
                  teams={getUniqueTeams(groupName)}
                  location={getUniqueLocation(groupName)}
                />
              ))}
            </div>
          )}

          {/* No Matches Message */}
          {numberOfGroups === 0 && !hasPlayoffs && (
            <div className="text-white/70 text-center md:col-start-1 py-8">
              No group or playoff matches found for this category.
            </div>
          )}
        </div>

        {/* Match Lists Section (Below Main Grid) */}
        {numberOfGroups > 0 && ( // Only show if there are groups
          <div
            className={`mt-8 max-w-6xl mx-auto relative z-10 grid grid-cols-1 ${
              numberOfGroups > 1 ? "md:grid-cols-2" : "md:grid-cols-1" // Two columns only if more than one group
            } gap-4 md:gap-8`}
          >
            {/* Left/Single Column for Group Matches */}
            <div
              className={`flex flex-col space-y-4 ${
                numberOfGroups === 1 ? "md:w-2/3 md:mx-auto" : "" // Center single group's match list
              }`}
            >
              {(numberOfGroups === 1 ? groupNames : leftGroupNames).map(
                (groupName) => (
                  <GroupMatchesColumn
                    matchesByDate={matchesByGroupThenDate[groupName] || {}}
                  />
                )
              )}
            </div>

            {/* Right Column for Right Group Matches */}
            {numberOfGroups > 1 && (
              <div className="flex flex-col space-y-4 md:items-end">
                {rightGroupNames.map((groupName) => (
                  <GroupMatchesColumn
                    matchesByDate={matchesByGroupThenDate[groupName] || {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="max-w-6xl mx-auto relative z-10 mt-8 text-center text-white">
          <p className="font-bold text-lg md:text-xl mb-2 [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
            Tournament Opening SATURDAY 03.05.2025 at 18:00 in the sports hall
            Dr. Jovan Kalauzi
          </p>
          <p className="font-bold text-lg md:text-xl [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
            Отварање на турнирот САБОТА 03.05.2025г во 18:00 часот во спортска
            сала Д-р Јован Калаузи
          </p>
        </div>
      </div>
    </div>
  );
}
