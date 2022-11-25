export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: number;
          created_at: string | null;
          todo: number;
          created_by: string;
          text: string;
          image_url: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          todo: number;
          created_by: string;
          text: string;
          image_url?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          todo?: number;
          created_by?: string;
          text?: string;
          image_url?: string | null;
        };
      };
      todos: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          is_complete: boolean;
          completed_at: string | null;
          inserted_at: string;
          hidden_by_default: boolean;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          is_complete?: boolean;
          completed_at?: string | null;
          inserted_at?: string;
          hidden_by_default?: boolean;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          is_complete?: boolean;
          completed_at?: string | null;
          inserted_at?: string;
          hidden_by_default?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type Todo = Database["public"]["Tables"]["todos"]["Row"];
