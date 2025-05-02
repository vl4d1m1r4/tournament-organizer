import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import LoadingSpinner from "./LoadingSpinner";

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

interface Category {
  id: number;
  tournament_id: number;
  name: string;
}

interface MatchEditFormProps {
  match: Match;
  categories: Category[];
  onClose: () => void;
  afterSubmit?: (data: any) => void;
}

export default function MatchEditForm({ match, categories, onClose, afterSubmit }: MatchEditFormProps) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "submitting";
  
  // Find the current category's name
  const categoryName = categories.find(c => c.id === match.category_id)?.name || "Unknown";
  
  // Add useEffect to handle the callback when fetcher completes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && afterSubmit) {
      afterSubmit(fetcher.data);
    }
  }, [fetcher.state, fetcher.data, afterSubmit]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };
  
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="flex justify-between items-center mb-6">
          <h2>Edit Match</h2>
          <button
            className="btn-icon"
            onClick={onClose}
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
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_action" value="updateMatch" />
          <input type="hidden" name="matchId" value={match.id} />
          
          <div className="form-group">
            <label>Category:</label>
            <p className="font-medium">{categoryName}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-isPlayoff">Match Type:</label>
            <select
              id="edit-isPlayoff"
              name="isPlayoff"
              defaultValue={String(match.is_playoff)}
              disabled={isLoading}
            >
              <option value="false">Group Match</option>
              <option value="true">Playoff Match</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-groupName">Group/Playoff Name:</label>
            <input
              type="text"
              id="edit-groupName"
              name="groupName"
              defaultValue={match.group_name || ""}
              placeholder="e.g., Group A / FINAL"
              disabled={isLoading}
            />
            <small>Playoff examples: QUARTER-1, SEMI-2, FINAL</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-team1">Team 1:</label>
            <input
              type="text"
              id="edit-team1"
              name="team1"
              defaultValue={match.team1}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-team2">Team 2:</label>
            <input
              type="text"
              id="edit-team2"
              name="team2"
              defaultValue={match.team2}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-date">Date:</label>
            <input
              type="date"
              id="edit-date"
              name="date"
              defaultValue={match.date}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-time">Time:</label>
            <input
              type="time"
              id="edit-time"
              name="time"
              defaultValue={match.time || ""}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-location">Location:</label>
            <input
              type="text"
              id="edit-location"
              name="location"
              defaultValue={match.location || ""}
              placeholder="Enter match location"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-score1">Score Team 1:</label>
            <input
              type="number"
              id="edit-score1"
              name="score1"
              defaultValue={match.score1 ?? ""}
              min="0"
              placeholder="Score"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-score2">Score Team 2:</label>
            <input
              type="number"
              id="edit-score2"
              name="score2"
              defaultValue={match.score2 ?? ""}
              min="0"
              placeholder="Score"
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
                <span className="ml-2">Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </>
  );
} 