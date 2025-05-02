import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const matchId = params.matchId;
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error) {
    throw new Response("Match not found", { status: 404 });
  }

  // Get category name
  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", match.category_id)
    .single();

  // Format date for display
  const formattedDate = new Date(match.date).toLocaleDateString();
  
  return json({ 
    match, 
    categoryName: category?.name || "Unknown Category",
    formattedDate
  }, { headers: response.headers });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const matchId = params.matchId;
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
  
  // Get current match data to get existing scores
  const { data: match, error: fetchError } = await supabase
    .from("matches")
    .select("score1, score2")
    .eq("id", matchId)
    .single();
  
  if (fetchError) {
    return json({ error: "Failed to fetch match" }, { status: 400 });
  }
  
  // Initialize scores with current values (or 0 if null)
  let score1 = match.score1 || 0;
  let score2 = match.score2 || 0;
  
  // Handle different actions
  switch (action) {
    case "team1_add1":
      score1 += 1;
      break;
    case "team1_add2":
      score1 += 2;
      break;
    case "team1_add3":
      score1 += 3;
      break;
    case "team1_subtract1":
      score1 = Math.max(0, score1 - 1); // Prevent negative score
      break;
    case "team1_subtract2":
      score1 = Math.max(0, score1 - 2);
      break;
    case "team1_subtract3":
      score1 = Math.max(0, score1 - 3);
      break;
    case "team2_add1":
      score2 += 1;
      break;
    case "team2_add2":
      score2 += 2;
      break;
    case "team2_add3":
      score2 += 3;
      break;
    case "team2_subtract1":
      score2 = Math.max(0, score2 - 1);
      break;
    case "team2_subtract2":
      score2 = Math.max(0, score2 - 2);
      break;
    case "team2_subtract3":
      score2 = Math.max(0, score2 - 3);
      break;
    case "set_custom":
      score1 = parseInt(formData.get("score1") as string) || 0;
      score2 = parseInt(formData.get("score2") as string) || 0;
      break;
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
  
  // Update the match with new scores
  const { error: updateError } = await supabase
    .from("matches")
    .update({ score1, score2 })
    .eq("id", matchId);
  
  if (updateError) {
    return json({ error: "Failed to update score" }, { status: 500 });
  }
  
  return json({ success: true, score1, score2 });
};

// Define more specific types for action data
type ActionData = 
  | { success: true; score1: number; score2: number }
  | { error: string };

export default function MatchScore() {
  const { match, categoryName, formattedDate } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  
  const [score1, setScore1] = useState(match.score1 || 0);
  const [score2, setScore2] = useState(match.score2 || 0);
  const [customScore1, setCustomScore1] = useState(match.score1?.toString() || "0");
  const [customScore2, setCustomScore2] = useState(match.score2?.toString() || "0");
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // State for tooltips
  const [showTeam1AddTooltip, setShowTeam1AddTooltip] = useState(false);
  const [showTeam1SubtractTooltip, setShowTeam1SubtractTooltip] = useState(false);
  const [showTeam2AddTooltip, setShowTeam2AddTooltip] = useState(false);
  const [showTeam2SubtractTooltip, setShowTeam2SubtractTooltip] = useState(false);
  
  const isUpdating = navigation.state === "submitting";
  
  // Update local state when scores change from server
  useEffect(() => {
    if (actionData && 'success' in actionData) {
      setScore1(actionData.score1);
      setScore2(actionData.score2);
      setCustomScore1(actionData.score1.toString());
      setCustomScore2(actionData.score2.toString());
    }
  }, [actionData]);
  
  // Update local state when initial data loads
  useEffect(() => {
    setScore1(match.score1 || 0);
    setScore2(match.score2 || 0);
    setCustomScore1(match.score1?.toString() || "0");
    setCustomScore2(match.score2?.toString() || "0");
  }, [match]);

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking inside any tooltip or button
      const target = event.target as HTMLElement;
      if (target.closest('[data-tooltip]') || target.closest('[data-tooltip-trigger]')) {
        return;
      }
      
      setShowTeam1AddTooltip(false);
      setShowTeam1SubtractTooltip(false);
      setShowTeam2AddTooltip(false);
      setShowTeam2SubtractTooltip(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Toggle tooltip visibility
  const toggleTooltip = (tooltipName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the document click from immediately closing it
    
    // Toggle only the selected tooltip
    switch(tooltipName) {
      case 'team1Add':
        setShowTeam1AddTooltip(prev => !prev);
        setShowTeam1SubtractTooltip(false);
        setShowTeam2AddTooltip(false);
        setShowTeam2SubtractTooltip(false);
        break;
      case 'team1Subtract':
        setShowTeam1AddTooltip(false);
        setShowTeam1SubtractTooltip(prev => !prev);
        setShowTeam2AddTooltip(false);
        setShowTeam2SubtractTooltip(false);
        break;
      case 'team2Add':
        setShowTeam1AddTooltip(false);
        setShowTeam1SubtractTooltip(false);
        setShowTeam2AddTooltip(prev => !prev);
        setShowTeam2SubtractTooltip(false);
        break;
      case 'team2Subtract':
        setShowTeam1AddTooltip(false);
        setShowTeam1SubtractTooltip(false);
        setShowTeam2AddTooltip(false);
        setShowTeam2SubtractTooltip(prev => !prev);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-2 sm:p-4">
      {/* Compact Location and Date/Time Header */}
      <div className="text-center mb-2 bg-white rounded-lg shadow-sm p-1.5 sm:p-2">
        <div className="flex flex-wrap justify-center items-center gap-1 text-xs sm:text-sm text-gray-600">
          <span className="font-medium text-blue-800">{match.location || "No location"}</span>
          <span>•</span>
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{match.time?.substring(0, 5) || "No time"}</span>
          {match.group_name && (
            <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded">
              {match.is_playoff ? "Playoff" : "Group"}: {match.group_name}
            </span>
          )}
          <span className="ml-1 text-xs">{categoryName}</span>
        </div>
      </div>

      {/* Team Names Above Score */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-white rounded-lg shadow-md p-2 text-center">
          <h2 className="text-base sm:text-xl font-bold text-blue-700" title={match.team1}>
            {match.team1}
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-md p-2 text-center">
          <h2 className="text-base sm:text-xl font-bold text-blue-700" title={match.team2}>
            {match.team2}
          </h2>
        </div>
      </div>

      {/* Main Score Area - Centered */}
      <div className="mb-2 bg-white rounded-lg shadow-md p-2 sm:p-3 text-center">
        <div className="flex items-center justify-center">
          <span className="text-5xl sm:text-6xl font-bold text-blue-800 tabular-nums">{score1}</span>
          <span className="text-2xl sm:text-4xl mx-3 sm:mx-6 text-gray-400">-</span>
          <span className="text-5xl sm:text-6xl font-bold text-blue-800 tabular-nums">{score2}</span>
        </div>
      </div>

      {/* Score Control Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Team 1 Controls */}
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Add Points Button with Tooltip */}
            <div className="relative">
              <button 
                data-tooltip-trigger="team1Add"
                className="w-full h-14 sm:h-16 text-2xl sm:text-3xl bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 rounded-lg flex items-center justify-center"
                onClick={(e) => toggleTooltip('team1Add', e)}
              >
                +
              </button>
              
              {showTeam1AddTooltip && (
                <div data-tooltip="team1Add" className="absolute left-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded p-1 z-20 w-full">
                  <div className="grid grid-cols-3 gap-1">
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_add1" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +1
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_add2" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +2
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_add3" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +3
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtract Points Button with Tooltip */}
            <div className="relative">
              <button 
                data-tooltip-trigger="team1Subtract"
                className="w-full h-14 sm:h-16 text-2xl sm:text-3xl bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 rounded-lg flex items-center justify-center"
                onClick={(e) => toggleTooltip('team1Subtract', e)}
              >
                -
              </button>
              
              {showTeam1SubtractTooltip && (
                <div data-tooltip="team1Subtract" className="absolute left-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded p-1 z-20 w-full">
                  <div className="grid grid-cols-3 gap-1">
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_subtract1" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score1 < 1}
                        className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -1
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_subtract2" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score1 < 2}
                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -2
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team1_subtract3" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score1 < 3}
                        className="w-full h-14 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -3
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Team 2 Controls */}
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Add Points Button with Tooltip */}
            <div className="relative">
              <button 
                data-tooltip-trigger="team2Add"
                className="w-full h-14 sm:h-16 text-2xl sm:text-3xl bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 rounded-lg flex items-center justify-center"
                onClick={(e) => toggleTooltip('team2Add', e)}
              >
                +
              </button>
              
              {showTeam2AddTooltip && (
                <div data-tooltip="team2Add" className="absolute left-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded p-1 z-20 w-full">
                  <div className="grid grid-cols-3 gap-1">
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_add1" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +1
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_add2" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +2
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_add3" />
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white rounded-md flex items-center justify-center text-xl font-bold"
                      >
                        +3
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtract Points Button with Tooltip */}
            <div className="relative">
              <button 
                data-tooltip-trigger="team2Subtract"
                className="w-full h-14 sm:h-16 text-2xl sm:text-3xl bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 rounded-lg flex items-center justify-center"
                onClick={(e) => toggleTooltip('team2Subtract', e)}
              >
                -
              </button>
              
              {showTeam2SubtractTooltip && (
                <div data-tooltip="team2Subtract" className="absolute left-0 top-full mt-1 bg-white border border-gray-300 shadow-lg rounded p-1 z-20 w-full">
                  <div className="grid grid-cols-3 gap-1">
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_subtract1" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score2 < 1}
                        className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -1
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_subtract2" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score2 < 2}
                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -2
                      </button>
                    </form>
                    <form method="post" onClick={(e) => e.stopPropagation()} className="w-full">
                      <input type="hidden" name="_action" value="team2_subtract3" />
                      <button 
                        type="submit"
                        disabled={isUpdating || score2 < 3}
                        className="w-full h-14 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center justify-center text-xl font-bold disabled:opacity-50"
                      >
                        -3
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Score Option */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-2">
        <button
          type="button"
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="w-full text-blue-600 font-medium text-sm"
        >
          {showCustomForm ? "Hide Custom Score" : "Set Custom Score"}
        </button>
        
        {showCustomForm && (
          <form method="post" className="flex items-center gap-2 mt-1">
            <input type="hidden" name="_action" value="set_custom" />
            <div className="flex-1">
              <input
                type="number"
                id="score1"
                name="score1"
                min="0"
                value={customScore1}
                onChange={e => setCustomScore1(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1"
                aria-label={`${match.team1} score`}
              />
            </div>
            
            <div className="flex-1">
              <input
                type="number"
                id="score2"
                name="score2"
                min="0"
                value={customScore2}
                onChange={e => setCustomScore2(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1"
                aria-label={`${match.team2} score`}
              />
            </div>
            
            <button
              type="submit"
              disabled={isUpdating}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center text-sm disabled:opacity-50"
            >
              Update
            </button>
          </form>
        )}
      </div>

      {/* Footer with status and back button */}
      <div className="bg-white rounded-lg shadow-md p-2 flex justify-between items-center">
        <a
          href={`/admin/tournaments/${match.tournament_id}`}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
        >
          Back
        </a>
        
        <div className="flex items-center">
          {isUpdating && (
            <div className="text-blue-600 font-medium text-xs flex items-center">
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </div>
          )}
          
          {actionData && 'success' in actionData && !isUpdating && (
            <div className="text-green-600 font-medium text-xs flex items-center">
              Score updated
            </div>
          )}
          
          {actionData && 'error' in actionData && !isUpdating && (
            <div className="text-red-600 font-medium text-xs flex items-center">
              {actionData.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 