export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      allergies: {
        Row: {
          allergen: string
          created_at: string
          id: string
          notes: string | null
          severity: string | null
          user_id: string
        }
        Insert: {
          allergen: string
          created_at?: string
          id?: string
          notes?: string | null
          severity?: string | null
          user_id: string
        }
        Update: {
          allergen?: string
          created_at?: string
          id?: string
          notes?: string | null
          severity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_daily: {
        Row: {
          created_at: string
          date: string
          id: string
          new_users: number
          popular_symptoms: Json | null
          total_checks: number
          total_conversations: number
          total_users: number
          updated_at: string
          urgency_distribution: Json | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          new_users?: number
          popular_symptoms?: Json | null
          total_checks?: number
          total_conversations?: number
          total_users?: number
          updated_at?: string
          urgency_distribution?: Json | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          new_users?: number
          popular_symptoms?: Json | null
          total_checks?: number
          total_conversations?: number
          total_users?: number
          updated_at?: string
          urgency_distribution?: Json | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at: string | null
          requests_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_name: string
          key_prefix: string
          last_used_at?: string | null
          requests_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_name?: string
          key_prefix?: string
          last_used_at?: string | null
          requests_count?: number
          user_id?: string
        }
        Relationships: []
      }
      chronic_conditions: {
        Row: {
          condition_name: string
          created_at: string
          diagnosed_date: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          condition_name: string
          created_at?: string
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          condition_name?: string
          created_at?: string
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          conversation_type: string
          created_at: string
          id: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_type: string
          created_at?: string
          id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string | null
          end_date: string | null
          frequency: string | null
          id: string
          is_current: boolean
          medication_name: string
          notes: string | null
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_current?: boolean
          medication_name: string
          notes?: string | null
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_current?: boolean
          medication_name?: string
          notes?: string | null
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_type: string | null
          checks_remaining: number
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          subscription_tier: string
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          blood_type?: string | null
          checks_remaining?: number
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          subscription_tier?: string
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          blood_type?: string | null
          checks_remaining?: number
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          subscription_tier?: string
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      symptom_checks: {
        Row: {
          ai_summary: string | null
          conversation_id: string | null
          created_at: string
          id: string
          predictions: Json
          symptoms: Json
          urgency_explanation: string | null
          urgency_level: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          predictions?: Json
          symptoms?: Json
          urgency_explanation?: string | null
          urgency_level?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          predictions?: Json
          symptoms?: Json
          urgency_explanation?: string | null
          urgency_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_checks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
