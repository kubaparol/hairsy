export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          client_id: string | null;
          created_at: string;
          deleted_at: string | null;
          end_time: string;
          id: string;
          note: string | null;
          salon_id: string;
          service_duration_snapshot: number | null;
          service_id: string | null;
          service_name_snapshot: string | null;
          service_price_snapshot: number | null;
          start_time: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          end_time: string;
          id?: string;
          note?: string | null;
          salon_id: string;
          service_duration_snapshot?: number | null;
          service_id?: string | null;
          service_name_snapshot?: string | null;
          service_price_snapshot?: number | null;
          start_time: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          end_time?: string;
          id?: string;
          note?: string | null;
          salon_id?: string;
          service_duration_snapshot?: number | null;
          service_id?: string | null;
          service_name_snapshot?: string | null;
          service_price_snapshot?: number | null;
          start_time?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'v_complete_salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          },
        ];
      };
      consents: {
        Row: {
          accepted_at: string;
          id: string;
          ip_address: unknown | null;
          policy_version: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          accepted_at?: string;
          id?: string;
          ip_address?: unknown | null;
          policy_version: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          accepted_at?: string;
          id?: string;
          ip_address?: unknown | null;
          policy_version?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'consents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          phone: string | null;
          role: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          phone?: string | null;
          role: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      salons: {
        Row: {
          city: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          name: string | null;
          owner_id: string;
          phone: string | null;
          postal_code: string | null;
          street: string | null;
          street_number: string | null;
          updated_at: string;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          owner_id: string;
          phone?: string | null;
          postal_code?: string | null;
          street?: string | null;
          street_number?: string | null;
          updated_at?: string;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          owner_id?: string;
          phone?: string | null;
          postal_code?: string | null;
          street?: string | null;
          street_number?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'salons_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          duration_minutes: number;
          id: string;
          name: string;
          price: number;
          salon_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_minutes: number;
          id?: string;
          name: string;
          price: number;
          salon_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          name?: string;
          price?: number;
          salon_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'services_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'services_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'v_complete_salons';
            referencedColumns: ['id'];
          },
        ];
      };
      working_hours: {
        Row: {
          close_time: string;
          created_at: string;
          day_of_week: number;
          id: string;
          open_time: string;
          salon_id: string;
          updated_at: string;
        };
        Insert: {
          close_time: string;
          created_at?: string;
          day_of_week: number;
          id?: string;
          open_time: string;
          salon_id: string;
          updated_at?: string;
        };
        Update: {
          close_time?: string;
          created_at?: string;
          day_of_week?: number;
          id?: string;
          open_time?: string;
          salon_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'working_hours_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'working_hours_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'v_complete_salons';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      v_bookings_with_status: {
        Row: {
          client_email: string | null;
          client_first_name: string | null;
          client_id: string | null;
          client_phone: string | null;
          created_at: string | null;
          deleted_at: string | null;
          end_time: string | null;
          id: string | null;
          note: string | null;
          salon_id: string | null;
          service_duration_snapshot: number | null;
          service_id: string | null;
          service_name_snapshot: string | null;
          service_price_snapshot: number | null;
          start_time: string | null;
          status: string | null;
          type: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_salon_id_fkey';
            columns: ['salon_id'];
            isOneToOne: false;
            referencedRelation: 'v_complete_salons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          },
        ];
      };
      v_complete_salons: {
        Row: {
          city: string | null;
          description: string | null;
          id: string | null;
          latitude: number | null;
          longitude: number | null;
          name: string | null;
          phone: string | null;
          postal_code: string | null;
          street: string | null;
          street_number: string | null;
        };
        Insert: {
          city?: string | null;
          description?: string | null;
          id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          street?: string | null;
          street_number?: string | null;
        };
        Update: {
          city?: string | null;
          description?: string | null;
          id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          street?: string | null;
          street_number?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      anonymize_user_profile: {
        Args: { p_user_id: string };
        Returns: undefined;
      };
      gbt_bit_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_bool_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_bool_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_bpchar_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_bytea_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_cash_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_cash_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_date_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_date_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_enum_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_enum_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_float4_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_float4_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_float8_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_float8_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_inet_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int2_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int2_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int4_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int4_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int8_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_int8_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_intv_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_intv_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_intv_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_macad_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_macad_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_macad8_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_macad8_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_numeric_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_oid_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_oid_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_text_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_time_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_time_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_timetz_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_ts_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_ts_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_tstz_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_uuid_compress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_uuid_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_var_decompress: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbt_var_fetch: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey_var_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey_var_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey16_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey16_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey2_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey2_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey32_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey32_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey4_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey4_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey8_in: {
        Args: { '': unknown };
        Returns: unknown;
      };
      gbtreekey8_out: {
        Args: { '': unknown };
        Returns: unknown;
      };
      get_booking_status: {
        Args: { p_end_time: string };
        Returns: string;
      };
      is_salon_complete: {
        Args: { p_salon_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
