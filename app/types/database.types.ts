export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: number;
          name: string;
          status: string;
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          status: string;
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          tournament_id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          tournament_id: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          tournament_id?: number;
          name?: string;
          created_at?: string;
        };
      };
      matches: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: number;
          tournament_id: number;
          category_id: number;
          team1: string;
          team2: string;
          score1?: number | null;
          score2?: number | null;
          date: string;
          time?: string | null;
          location: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          tournament_id?: number;
          category_id?: number;
          team1?: string;
          team2?: string;
          score1?: number | null;
          score2?: number | null;
          date?: string;
          time?: string | null;
          location: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
