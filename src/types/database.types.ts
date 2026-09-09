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
      blog_posts: {
        Row: {
          author_id: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string
          created_at: string
          id: string
          industry: string | null
          status: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          industry?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          industry?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          project_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          project_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          project_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          meeting_url: string | null
          organizer_id: string
          scheduled_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          organizer_id: string
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          organizer_id?: string
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string | null
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id?: string | null
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string | null
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          progress: number
          service: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number
          service: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number
          service?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean
          created_at: string
          id: string
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_name: string
          client_role: string
          company: string
          content: string
          created_at: string
          id: string
          is_featured: boolean
          rating: number
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          client_role: string
          company: string
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          client_role?: string
          company?: string
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price_monthly: number
          price_yearly: number
          currency: string
          features: string
          is_popular: boolean
          is_active: boolean
          sort_order: number
          razorpay_plan_id_monthly: string | null
          razorpay_plan_id_yearly: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price_monthly: number
          price_yearly: number
          currency?: string
          features?: string
          is_popular?: boolean
          is_active?: boolean
          sort_order?: number
          razorpay_plan_id_monthly?: string | null
          razorpay_plan_id_yearly?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price_monthly?: number
          price_yearly?: number
          currency?: string
          features?: string
          is_popular?: boolean
          is_active?: boolean
          sort_order?: number
          razorpay_plan_id_monthly?: string | null
          razorpay_plan_id_yearly?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          client_id: string
          plan_id: string
          status: string
          billing_cycle: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          cancelled_at: string | null
          razorpay_subscription_id: string | null
          razorpay_customer_id: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          plan_id: string
          status?: string
          billing_cycle?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          razorpay_subscription_id?: string | null
          razorpay_customer_id?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          plan_id?: string
          status?: string
          billing_cycle?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          razorpay_subscription_id?: string | null
          razorpay_customer_id?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          id: string
          client_id: string
          subscription_id: string | null
          invoice_id: string | null
          amount: number
          currency: string
          status: string
          payment_method: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          refund_amount: number
          refund_reason: string | null
          refunded_at: string | null
          failure_reason: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          subscription_id?: string | null
          invoice_id?: string | null
          amount: number
          currency?: string
          status?: string
          payment_method?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_amount?: number
          refund_reason?: string | null
          refunded_at?: string | null
          failure_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          subscription_id?: string | null
          invoice_id?: string | null
          amount?: number
          currency?: string
          status?: string
          payment_method?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_amount?: number
          refund_reason?: string | null
          refunded_at?: string | null
          failure_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string
          subscription_id: string | null
          payment_id: string | null
          status: string
          issue_date: string
          due_date: string
          paid_at: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          currency: string
          gst_number: string | null
          billing_name: string | null
          billing_address: string | null
          billing_email: string | null
          billing_phone: string | null
          notes: string | null
          pdf_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number?: string
          client_id: string
          subscription_id?: string | null
          payment_id?: string | null
          status?: string
          issue_date?: string
          due_date?: string
          paid_at?: string | null
          subtotal: number
          tax_rate?: number
          tax_amount: number
          total: number
          currency?: string
          gst_number?: string | null
          billing_name?: string | null
          billing_address?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          notes?: string | null
          pdf_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string
          subscription_id?: string | null
          payment_id?: string | null
          status?: string
          issue_date?: string
          due_date?: string
          paid_at?: string | null
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          currency?: string
          gst_number?: string | null
          billing_name?: string | null
          billing_address?: string | null
          billing_email?: string | null
          billing_phone?: string | null
          notes?: string | null
          pdf_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          hsn_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          hsn_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          amount?: number
          hsn_code?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          id: string
          client_id: string | null
          payment_id: string | null
          invoice_id: string | null
          type: string
          amount: number
          currency: string
          description: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          payment_id?: string | null
          invoice_id?: string | null
          type: string
          amount: number
          currency?: string
          description: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          payment_id?: string | null
          invoice_id?: string | null
          type?: string
          amount?: number
          currency?: string
          description?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
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

/* -------------------------------------------------------------------------- */
/*                     CUSTOM TYPE ALIASES                                    */
/*                                                                            */
/*  These are not auto-generated — they mirror the application-level          */
/*  constraints for columns stored as text in the database.                   */
/* -------------------------------------------------------------------------- */

export type UserRole = "admin" | "client" | "team";
export type ClientStatus = "active" | "inactive" | "pending";
export type ProjectStatus = "active" | "completed" | "cancelled" | "pending";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type MeetingStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
export type SubscriptionStatusType = "active" | "cancelled" | "paused" | "past_due" | "trialing" | "expired";
export type PaymentStatusType = "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded";
export type InvoiceStatusType = "draft" | "sent" | "paid" | "overdue" | "cancelled" | "refunded";
export type BillingCycleType = "monthly" | "yearly";
export type TransactionTypeAlias = "payment" | "refund" | "subscription_created" | "subscription_cancelled" | "subscription_renewed" | "invoice_generated" | "invoice_paid" | "invoice_overdue" | "plan_upgrade" | "plan_downgrade";
