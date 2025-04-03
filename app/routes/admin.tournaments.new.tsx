import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useNavigate, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import LoadingSpinner from "~/components/LoadingSpinner";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    return redirect("/login");
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  // Insert new tournament
  const { data, error } = await supabase
    .from("tournaments")
    .insert([
      {
        name,
        start_date: startDate,
        end_date: endDate,
        status: "upcoming",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating tournament:", error);
    return null;
  }

  return redirect(`/admin/tournaments/${data.id}`);
};

export default function NewTournament() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "submitting";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div>
      <h1>Create New Tournament</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tournament Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              "Create Tournament"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/dashboard")}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
