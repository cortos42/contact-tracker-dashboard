export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      callback_requests: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_type: string
          id: string
          project_id: string | null
          signed_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_type: string
          id?: string
          project_id?: string | null
          signed_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          project_id?: string | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      eligibility_submissions: {
        Row: {
          construction_year: string
          email: string
          id: string
          income_range: string | null
          name: string
          occupancy_status: string | null
          occupants: string
          phone: string
          planned_works: string[] | null
          postal_code: string
          property_type: string
          submitted_at: string
        }
        Insert: {
          construction_year: string
          email: string
          id?: string
          income_range?: string | null
          name: string
          occupancy_status?: string | null
          occupants: string
          phone: string
          planned_works?: string[] | null
          postal_code: string
          property_type: string
          submitted_at?: string
        }
        Update: {
          construction_year?: string
          email?: string
          id?: string
          income_range?: string | null
          name?: string
          occupancy_status?: string | null
          occupants?: string
          phone?: string
          planned_works?: string[] | null
          postal_code?: string
          property_type?: string
          submitted_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          appointment_status:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          contact_comment: string | null
          contact_status:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          created_at: string | null
          eligibility_submission_id: string | null
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          work_status: Database["public"]["Enums"]["work_status"] | null
        }
        Insert: {
          appointment_status?:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          contact_comment?: string | null
          contact_status?:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          created_at?: string | null
          eligibility_submission_id?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          work_status?: Database["public"]["Enums"]["work_status"] | null
        }
        Update: {
          appointment_status?:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          contact_comment?: string | null
          contact_status?:
            | Database["public"]["Enums"]["project_phase_status"]
            | null
          created_at?: string | null
          eligibility_submission_id?: string | null
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          work_status?: Database["public"]["Enums"]["work_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_eligibility_submission_id_fkey"
            columns: ["eligibility_submission_id"]
            isOneToOne: false
            referencedRelation: "eligibility_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          attic_material: string | null
          attic_surface: string | null
          client_address: string
          client_email: string
          client_name: string
          client_phone: string
          client_remainder: number | null
          crawl_space_material: string | null
          crawl_space_surface: string | null
          created_at: string | null
          current_heating: string | null
          current_ventilation: string | null
          current_water_heater: string | null
          floor_material: string | null
          floor_surface: string | null
          id: string
          project_id: string | null
          proposed_heating: string | null
          proposed_ventilation: string | null
          proposed_water_heater: string | null
          signed_at: string | null
          signed_document_url: string | null
          solar_inverter_brand: string | null
          solar_inverter_count: number | null
          solar_panel_brand: string | null
          solar_panel_count: number | null
          solar_power_kw: number | null
          subsidies_amount: number | null
          total_cost: number | null
          updated_at: string | null
          vent_outlets: number | null
          wall_material: string | null
          wall_method: string | null
          wall_surface: string | null
          window_color: string | null
          window_material: string | null
        }
        Insert: {
          attic_material?: string | null
          attic_surface?: string | null
          client_address: string
          client_email: string
          client_name: string
          client_phone: string
          client_remainder?: number | null
          crawl_space_material?: string | null
          crawl_space_surface?: string | null
          created_at?: string | null
          current_heating?: string | null
          current_ventilation?: string | null
          current_water_heater?: string | null
          floor_material?: string | null
          floor_surface?: string | null
          id?: string
          project_id?: string | null
          proposed_heating?: string | null
          proposed_ventilation?: string | null
          proposed_water_heater?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          solar_inverter_brand?: string | null
          solar_inverter_count?: number | null
          solar_panel_brand?: string | null
          solar_panel_count?: number | null
          solar_power_kw?: number | null
          subsidies_amount?: number | null
          total_cost?: number | null
          updated_at?: string | null
          vent_outlets?: number | null
          wall_material?: string | null
          wall_method?: string | null
          wall_surface?: string | null
          window_color?: string | null
          window_material?: string | null
        }
        Update: {
          attic_material?: string | null
          attic_surface?: string | null
          client_address?: string
          client_email?: string
          client_name?: string
          client_phone?: string
          client_remainder?: number | null
          crawl_space_material?: string | null
          crawl_space_surface?: string | null
          created_at?: string | null
          current_heating?: string | null
          current_ventilation?: string | null
          current_water_heater?: string | null
          floor_material?: string | null
          floor_surface?: string | null
          id?: string
          project_id?: string | null
          proposed_heating?: string | null
          proposed_ventilation?: string | null
          proposed_water_heater?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          solar_inverter_brand?: string | null
          solar_inverter_count?: number | null
          solar_panel_brand?: string | null
          solar_panel_count?: number | null
          solar_power_kw?: number | null
          subsidies_amount?: number | null
          total_cost?: number | null
          updated_at?: string | null
          vent_outlets?: number | null
          wall_material?: string | null
          wall_method?: string | null
          wall_surface?: string | null
          window_color?: string | null
          window_material?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_status: "paid" | "pending" | "rejected"
      project_phase_status: "success" | "failure" | "pending"
      work_status: "not_started" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
