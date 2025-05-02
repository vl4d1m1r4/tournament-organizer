import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import LoadingSpinner from "~/components/LoadingSpinner";
import MatchEditForm from "~/components/MatchEditForm";
import Notification from "~/components/Notification";

// Define types
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

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Category {
  id: number;
  tournament_id: number;
  name: string;
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

// Helper to format time (from HH:MM:SS to HH:MM)
const formatTime = (timeString: string | null): string => {
  if (!timeString) return "--:--";
  return timeString.substring(0, 5);
};

// Calculate end time based on start time and duration (45 min default)
const calculateEndTime = (startTime: string | null, durationMinutes = 45): string => {
  if (!startTime) return "--:--";
  
  const [hours, minutes] = startTime.split(":").map(Number);
  
  let endMinutes = minutes + durationMinutes;
  let endHours = hours + Math.floor(endMinutes / 60);
  endMinutes = endMinutes % 60;
  
  // Format as HH:MM
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
};

// Calculate time overlap between matches
const checkMatchesOverlap = (
  match1: Match, 
  match2: Match, 
  categoryDurations: Record<number, number>,
  defaultDuration: number
): boolean => {
  // If either match doesn't have a time, we can't determine overlap
  if (!match1.time || !match2.time) return false;
  
  // Parse times into minutes for easier comparison
  const [hours1, minutes1] = match1.time.split(':').map(Number);
  const [hours2, minutes2] = match2.time.split(':').map(Number);
  
  const startMinutes1 = hours1 * 60 + minutes1;
  const startMinutes2 = hours2 * 60 + minutes2;
  
  // Get appropriate durations for each match's category
  const duration1 = categoryDurations[match1.category_id] || defaultDuration;
  const duration2 = categoryDurations[match2.category_id] || defaultDuration;
  
  const endMinutes1 = startMinutes1 + duration1;
  const endMinutes2 = startMinutes2 + duration2;
  
  // Check for overlap - if one match starts before the other ends
  return (startMinutes1 < endMinutes2 && startMinutes2 < endMinutes1);
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  // Get the tournament
  const { data: tournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single();

  if (tournamentError) {
    throw new Response("Tournament not found", { status: 404 });
  }

  // Get categories for this tournament
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("tournament_id", tournamentId);

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
    return json({ tournament, matches: [], categories: [] }, { headers: response.headers });
  }

  // Get matches for this tournament
  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return json({ tournament, matches: [], categories }, { headers: response.headers });
  }

  return json({ tournament, matches, categories }, { headers: response.headers });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
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
  }

  return json({ _action: action });
};

export default function AdminMatchesByLocation() {
  const { tournament, matches, categories } = useLoaderData<typeof loader>();
  const [defaultDuration, setDefaultDuration] = useState(45); // Default duration for categories without custom duration
  const [categoryDurations, setCategoryDurations] = useState<Record<number, number>>({});
  const [showOnlyConflicts, setShowOnlyConflicts] = useState(false);
  const [showDurationSettings, setShowDurationSettings] = useState(false);
  const [editingMatchDetails, setEditingMatchDetails] = useState<Match | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // Add forceRefresh state to force re-computation of memoized values
  const [forceRefresh, setForceRefresh] = useState(0);

  // Effect to trigger refresh when defaultDuration changes
  useEffect(() => {
    setForceRefresh(prev => prev + 1);
  }, [defaultDuration]);

  // Get match duration for a specific category
  const getMatchDuration = (categoryId: number): number => {
    return categoryDurations[categoryId] || defaultDuration;
  };

  // Group matches by location
  const matchesByLocation = useMemo(() => {
    const locationMap: Record<string, Match[]> = {};
    
    matches.forEach((match: Match) => {
      const location = match.location || "No Location";
      if (!locationMap[location]) {
        locationMap[location] = [];
      }
      locationMap[location].push(match);
    });
    
    // Sort matches within each location by date and time
    Object.keys(locationMap).forEach(location => {
      locationMap[location].sort((a, b) => {
        // First sort by date
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;
        
        // If same date, sort by time
        if (!a.time) return 1; // Matches without time go last
        if (!b.time) return -1; // Matches without time go last
        return a.time.localeCompare(b.time);
      });
    });
    
    return locationMap;
  }, [matches]);

  // Group matches by date for each location
  const matchesByLocationAndDate = useMemo(() => {
    const result: Record<string, Record<string, Match[]>> = {};
    
    Object.keys(matchesByLocation).forEach(location => {
      result[location] = {};
      
      matchesByLocation[location].forEach(match => {
        if (!result[location][match.date]) {
          result[location][match.date] = [];
        }
        result[location][match.date].push(match);
      });
    });
    
    return result;
  }, [matchesByLocation]);

  // Detect overlapping matches for each date at each location
  const overlapMap = useMemo(() => {
    const result: Record<string, Record<string, Record<number, boolean>>> = {};
    
    Object.keys(matchesByLocationAndDate).forEach(location => {
      result[location] = {};
      
      Object.keys(matchesByLocationAndDate[location]).forEach(date => {
        result[location][date] = {};
        const dateMatches = matchesByLocationAndDate[location][date];
        
        // Check each match against other matches on the same date
        dateMatches.forEach(match => {
          // Default to no overlap
          result[location][date][match.id] = false;
          
          // Compare with all other matches
          for (const otherMatch of dateMatches) {
            // Skip comparing with itself
            if (otherMatch.id === match.id) continue;
            
            // If we find an overlap, mark it
            if (checkMatchesOverlap(match, otherMatch, categoryDurations, defaultDuration)) {
              result[location][date][match.id] = true;
              break;
            }
          }
        });
      });
    });
    
    return result;
  }, [matchesByLocationAndDate, categoryDurations, defaultDuration, forceRefresh]);

  // Count overlaps per location
  const countLocationOverlaps = useMemo(() => {
    const result: Record<string, number> = {};
    
    Object.keys(matchesByLocationAndDate).forEach(location => {
      let overlapCount = 0;
      
      Object.keys(matchesByLocationAndDate[location]).forEach(date => {
        const dateMatches = matchesByLocationAndDate[location][date];
        
        // Create a set to avoid double-counting matches
        const overlappingMatchIds = new Set<number>();
        
        // Check each match pair for overlap
        for (let i = 0; i < dateMatches.length; i++) {
          for (let j = i + 1; j < dateMatches.length; j++) {
            if (checkMatchesOverlap(dateMatches[i], dateMatches[j], categoryDurations, defaultDuration)) {
              overlappingMatchIds.add(dateMatches[i].id);
              overlappingMatchIds.add(dateMatches[j].id);
            }
          }
        }
        
        overlapCount += overlappingMatchIds.size;
      });
      
      result[location] = overlapCount;
    });
    
    return result;
  }, [matchesByLocationAndDate, categoryDurations, defaultDuration, forceRefresh]);

  // Handle changing a category's duration
  const handleCategoryDurationChange = (categoryId: number, duration: number) => {
    setCategoryDurations(prev => ({
      ...prev,
      [categoryId]: duration
    }));
    
    const categoryName = categories.find(c => c.id === categoryId)?.name || 'Category';
    setNotification({
      message: `Recalculating overlaps for ${categoryName} with ${duration} minute duration...`,
      type: "success"
    });
    // Clear the notification after 2 seconds
    setTimeout(() => setNotification(null), 2000);
  };

  // Reset all category durations to default
  const resetCategoryDurations = () => {
    setCategoryDurations({});
  };

  // Handle match edit completion
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Match Edit Form */}
      {editingMatchDetails && (
        <MatchEditForm
          match={editingMatchDetails}
          categories={categories}
          onClose={() => setEditingMatchDetails(null)}
          afterSubmit={handleMatchEditComplete}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Matches by Location
          </h1>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <label htmlFor="defaultDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Default Duration (min)
              </label>
              <input
                id="defaultDuration"
                type="number"
                min="15"
                max="180"
                step="5"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={defaultDuration}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setDefaultDuration(newValue);
                  setNotification({
                    message: `Recalculating overlaps with ${newValue} minute default duration...`,
                    type: "success"
                  });
                  // Clear the notification after 2 seconds
                  setTimeout(() => setNotification(null), 2000);
                }}
              />
            </div>

            <div className="w-full sm:w-auto flex items-end space-x-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  showOnlyConflicts 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors`}
                onClick={() => setShowOnlyConflicts(!showOnlyConflicts)}
              >
                {showOnlyConflicts ? 'Show All Locations' : 'Show Conflicts Only'}
              </button>
              
              <button
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  showDurationSettings 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors`}
                onClick={() => setShowDurationSettings(!showDurationSettings)}
              >
                {showDurationSettings ? 'Hide Durations' : 'Category Durations'}
              </button>
            </div>
          </div>
        </div>
        
        {tournament && (
          <div className="bg-blue-50 p-3 rounded-lg mb-6 text-sm border border-blue-200">
            <p className="font-medium text-blue-800">
              Viewing: {tournament.name}
            </p>
            <p className="text-blue-700 mt-1">
              Tournament dates: {formatDateDDMMYYYY(tournament.start_date)} - {formatDateDDMMYYYY(tournament.end_date)}
            </p>
          </div>
        )}
        
        {/* Category Duration Settings */}
        {showDurationSettings && categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-blue-900">
                Category-Specific Match Durations
              </h3>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={resetCategoryDurations}
              >
                Reset All to Default
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(category => (
                <div key={category.id} className="border rounded p-3">
                  <label 
                    htmlFor={`category-${category.id}`} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {category.name}
                  </label>
                  <div className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      type="number"
                      min="15"
                      max="180"
                      step="5"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={categoryDurations[category.id] || defaultDuration}
                      onChange={(e) => handleCategoryDurationChange(category.id, Number(e.target.value))}
                    />
                    <span className="ml-2 text-sm text-gray-500">min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="bg-white p-3 rounded-lg mb-6 text-sm border shadow-sm">
          <h3 className="font-medium text-gray-800 mb-2">Match Status Legend:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 border-l-4 border-blue-500 mr-2"></div>
              <span>No scheduling conflicts</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 border-l-4 border-red-500 mr-2"></div>
              <span className="text-red-600 font-medium">Time overlap with another match</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Note: Default match duration is {defaultDuration} minutes, but each category can have its own duration setting.
          </p>
        </div>
        
        {Object.keys(matchesByLocation).length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No matches found for the selected tournament.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {Object.keys(matchesByLocation)
              .sort()
              .filter(location => !showOnlyConflicts || countLocationOverlaps[location] > 0)
              .map((location) => (
                <div key={location} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">{location}</h2>
                    {countLocationOverlaps[location] > 0 && (
                      <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {countLocationOverlaps[location]} overlapping {countLocationOverlaps[location] === 1 ? 'match' : 'matches'}
                      </div>
                    )}
                  </div>
                  
                  {/* Calculate the right number of columns based on date count */}
                  {(() => {
                    const datesForLocation = Object.keys(matchesByLocationAndDate[location]).sort();
                    const dateCount = datesForLocation.length;
                    
                    // Choose the appropriate grid class based on number of dates
                    let gridClass = "grid gap-4 p-4 auto-rows-fr grid-cols-1";
                    
                    if (dateCount === 2) {
                      gridClass = "grid gap-4 p-4 auto-rows-fr grid-cols-1 md:grid-cols-2";
                    } else if (dateCount === 3) {
                      gridClass = "grid gap-4 p-4 auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
                    } else if (dateCount >= 4) {
                      gridClass = "grid gap-4 p-4 auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
                    }
                    
                    return (
                      <div className={gridClass}>
                        {datesForLocation.map((date) => (
                          <div key={date} className="border rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="bg-blue-100 px-3 py-2 border-b">
                              <h3 className="font-semibold text-blue-800">{formatDateDDMMYYYY(date)}</h3>
                            </div>
                            
                            <div className="p-2 space-y-1 flex-1">
                              {matchesByLocationAndDate[location][date].map((match) => {
                                const categoryDuration = getMatchDuration(match.category_id);
                                const startTime = formatTime(match.time);
                                const endTime = calculateEndTime(match.time, categoryDuration);
                                const hasOverlap = overlapMap[location]?.[date]?.[match.id] || false;
                                const categoryName = categories.find(c => c.id === match.category_id)?.name || '';
                                
                                return (
                                  <div 
                                    key={match.id} 
                                    className={`border-l-4 ${hasOverlap ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} p-2 rounded-r text-sm relative cursor-pointer hover:shadow-md transition-shadow group`}
                                    onClick={() => setEditingMatchDetails(match)}
                                  >
                                    {/* Edit icon */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="bg-gray-800 text-white p-1 rounded-full flex items-center justify-center w-5 h-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </span>
                                    </div>
                                   
                                    <div className="font-medium flex justify-between pr-6">
                                      <span>
                                        {startTime} - {endTime}
                                        {hasOverlap && (
                                          <span className="ml-2 text-xs font-bold text-red-600">
                                            ⚠️ OVERLAP
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                                        {categoryDuration}min
                                      </span>
                                    </div>
                                    <div className={`mt-1 ${hasOverlap ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                                      {match.team1} vs {match.team2}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {categoryName}
                                      {match.is_playoff && (
                                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                                          {match.group_name || "Playoff"}
                                        </span>
                                      )}
                                    </div>
                                    {match.score1 !== null && match.score2 !== null && (
                                      <div className="mt-0.5 font-semibold">
                                        Score: {match.score1} - {match.score2}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ))}
          </div>
        )}
        
        <div className="mt-8">
          <a 
            href={`/admin/tournaments/${tournament.id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Tournament
          </a>
        </div>
      </div>
    </div>
  );
} 