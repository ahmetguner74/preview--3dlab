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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          content_en: string
          content_tr: string
          created_at: string
          id: string
          image_url: string | null
          section_key: string
          sort_order: number | null
          title_en: string
          title_tr: string
          updated_at: string
        }
        Insert: {
          content_en: string
          content_tr: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_key: string
          sort_order?: number | null
          title_en: string
          title_tr: string
          updated_at?: string
        }
        Update: {
          content_en?: string
          content_tr?: string
          created_at?: string
          id?: string
          image_url?: string | null
          section_key?: string
          sort_order?: number | null
          title_en?: string
          title_tr?: string
          updated_at?: string
        }
        Relationships: []
      }
      cesium_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          metadata: Json | null
          project_id: string | null
          updated_at: string
          upload_status: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string
          upload_status?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string
          upload_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cesium_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cesium_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cesium_layers: {
        Row: {
          created_at: string
          created_by: string | null
          data_url: string
          id: string
          layer_type: string
          metadata: Json | null
          name: string
          opacity: number
          project_id: string | null
          sort_order: number | null
          style_config: Json | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_url: string
          id?: string
          layer_type: string
          metadata?: Json | null
          name: string
          opacity?: number
          project_id?: string | null
          sort_order?: number | null
          style_config?: Json | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_url?: string
          id?: string
          layer_type?: string
          metadata?: Json | null
          name?: string
          opacity?: number
          project_id?: string | null
          sort_order?: number | null
          style_config?: Json | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cesium_layers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cesium_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cesium_notes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          height: number | null
          id: string
          latitude: number
          longitude: number
          project_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          height?: number | null
          id?: string
          latitude: number
          longitude: number
          project_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          height?: number | null
          id?: string
          latitude?: number
          longitude?: number
          project_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cesium_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cesium_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cesium_project_permissions: {
        Row: {
          created_at: string
          id: string
          permission_level: string
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          permission_level?: string
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          permission_level?: string
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cesium_project_permissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cesium_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cesium_projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          slug: string
          status: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      map_services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          layer_name: string
          name: string
          service_type: string
          service_url: string
          thumbnail_url: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          layer_name: string
          name: string
          service_type: string
          service_url: string
          thumbnail_url?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          layer_name?: string
          name?: string
          service_type?: string
          service_url?: string
          thumbnail_url?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_3d_models: {
        Row: {
          created_at: string | null
          id: string
          model_type: string
          model_url: string
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_type: string
          model_url: string
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_type?: string
          model_url?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_3d_models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          created_at: string | null
          id: string
          image_type: string
          image_url: string
          project_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_type: string
          image_url: string
          project_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_type?: string
          image_url?: string
          project_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_videos: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          sort_order: number | null
          thumbnail_url: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_videos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          architect: string | null
          area: string | null
          category: string | null
          client: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          slug: string
          status: Database["public"]["Enums"]["project_status"] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          visible: boolean | null
          year: string | null
        }
        Insert: {
          architect?: string | null
          area?: string | null
          category?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          slug: string
          status?: Database["public"]["Enums"]["project_status"] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          visible?: boolean | null
          year?: string | null
        }
        Update: {
          architect?: string | null
          area?: string | null
          category?: string | null
          client?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["project_status"] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          visible?: boolean | null
          year?: string | null
        }
        Relationships: []
      }
      site_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_key: string
          image_url: string
          settings: Json
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_key: string
          image_url: string
          settings?: Json
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_key?: string
          image_url?: string
          settings?: Json
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      tour_hotspots: {
        Row: {
          created_at: string
          custom_data: Json | null
          description: string | null
          hotspot_type: string
          id: string
          panorama_id: string
          position: Json
          target_panorama_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          hotspot_type?: string
          id?: string
          panorama_id: string
          position?: Json
          target_panorama_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_data?: Json | null
          description?: string | null
          hotspot_type?: string
          id?: string
          panorama_id?: string
          position?: Json
          target_panorama_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_hotspots_panorama_id_fkey"
            columns: ["panorama_id"]
            isOneToOne: false
            referencedRelation: "tour_panoramas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_hotspots_target_panorama_id_fkey"
            columns: ["target_panorama_id"]
            isOneToOne: false
            referencedRelation: "tour_panoramas"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_panoramas: {
        Row: {
          created_at: string
          id: string
          image_url: string
          initial_view: Json | null
          sort_order: number | null
          title: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          initial_view?: Json | null
          sort_order?: number | null
          title: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          initial_view?: Json | null
          sort_order?: number | null
          title?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_panoramas_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "virtual_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      virtual_tours: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string
          status: string
          thumbnail: string | null
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          status?: string
          thumbnail?: string | null
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          status?: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_project_access: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      project_status: "taslak" | "yayinda" | "arsiv"
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
    Enums: {
      project_status: ["taslak", "yayinda", "arsiv"],
    },
  },
} as const
