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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      exercise_logs: {
        Row: {
          category: string
          completed_at: string
          created_at: string
          difficulty: string
          duration_minutes: number | null
          exercise_id: string
          exercise_name: string
          id: string
          notes: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string
          created_at?: string
          difficulty: string
          duration_minutes?: number | null
          exercise_id: string
          exercise_name: string
          id?: string
          notes?: string | null
          rating?: number | null
          user_id?: string
        }
        Update: {
          category?: string
          completed_at?: string
          created_at?: string
          difficulty?: string
          duration_minutes?: number | null
          exercise_id?: string
          exercise_name?: string
          id?: string
          notes?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string
          created_at: string
          current_value: number
          deadline: string | null
          description: string | null
          id: string
          is_completed: boolean
          priority: string | null
          target_value: number
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          current_value?: number
          deadline?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean
          priority?: string | null
          target_value?: number
          title: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_value?: number
          deadline?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean
          priority?: string | null
          target_value?: number
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          best_streak: number
          category: string
          color: string
          completed_dates: string[]
          created_at: string
          icon: string
          id: string
          is_active: boolean
          name: string
          streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          category?: string
          color?: string
          completed_dates?: string[]
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          best_streak?: number
          category?: string
          color?: string
          completed_dates?: string[]
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          completed_at: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          session_type: string
          user_id: string
          was_completed: boolean
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration_minutes: number
          id?: string
          notes?: string | null
          session_type?: string
          user_id?: string
          was_completed?: boolean
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          session_type?: string
          user_id?: string
          was_completed?: boolean
        }
        Relationships: []
      }
      reminders: {
        Row: {
          category: string | null
          created_at: string
          has_device_alarm: boolean
          id: string
          is_active: boolean
          notes: string | null
          priority: string | null
          repeat_days: string[] | null
          text: string
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          has_device_alarm?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          priority?: string | null
          repeat_days?: string[] | null
          text: string
          time: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          has_device_alarm?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          priority?: string | null
          repeat_days?: string[] | null
          text?: string
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          break_duration: number
          created_at: string
          daily_goal_hours: number | null
          id: string
          long_break_duration: number
          notification_enabled: boolean
          sound_enabled: boolean
          theme: string
          updated_at: string
          user_id: string
          work_duration: number
        }
        Insert: {
          break_duration?: number
          created_at?: string
          daily_goal_hours?: number | null
          id?: string
          long_break_duration?: number
          notification_enabled?: boolean
          sound_enabled?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
          work_duration?: number
        }
        Update: {
          break_duration?: number
          created_at?: string
          daily_goal_hours?: number | null
          id?: string
          long_break_duration?: number
          notification_enabled?: boolean
          sound_enabled?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
          work_duration?: number
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
