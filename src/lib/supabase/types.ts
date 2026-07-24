export type BookingStatus =
  | "pending_verification"
  | "confirmed"
  | "rejected"
  | "expired"
  | "completed"
  | "no_show"
  | "cancelled";

export type SlotTimeEnum = "11:00" | "18:00";

export type BookingRow = {
  id: string;
  created_at: string;
  treatment_id: string;
  treatment_name: string;
  treatment_price: number;
  extension_id: string | null;
  extension_name: string | null;
  extension_price: number | null;
  booking_date: string;
  booking_time: SlotTimeEnum;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_notes: string;
  reference_photo_path: string | null;
  deposit_amount: number;
  proof_photo_path: string;
  status: BookingStatus;
  hold_expires_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  balance_paid: boolean;
  removal_requested: boolean;
  removal_surcharge: number | null;
  admin_notes: string | null;
  google_calendar_event_id: string | null;
};

export type DayOverrideRow = {
  booking_date: string;
  slots: SlotTimeEnum[];
  updated_at: string;
};

export type StudioSettingsRow = {
  id: true;
  google_refresh_token: string | null;
  google_calendar_id: string | null;
};

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: Partial<BookingRow> &
          Pick<
            BookingRow,
            | "treatment_id"
            | "treatment_name"
            | "treatment_price"
            | "booking_date"
            | "booking_time"
            | "customer_name"
            | "customer_phone"
            | "customer_email"
            | "proof_photo_path"
          >;
        Update: Partial<BookingRow>;
        Relationships: [];
      };
      day_overrides: {
        Row: DayOverrideRow;
        Insert: Partial<DayOverrideRow> & Pick<DayOverrideRow, "booking_date">;
        Update: Partial<DayOverrideRow>;
        Relationships: [];
      };
      studio_settings: {
        Row: StudioSettingsRow;
        Insert: Partial<StudioSettingsRow>;
        Update: Partial<StudioSettingsRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
