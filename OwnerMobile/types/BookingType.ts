export interface BookingType {
  // User details
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  tel_number: string;

  // Booking details
  check_in: Date;
  check_out: Date;
  booking_type: string;
  created_at: Date;

  // Accommodation details
  adult_count: number;
  child_count: number;
  bonfire_kit_count: number;
  tent_pitching_count: number;
  is_cabin: boolean;
  note: string;

  // Booking status
  status: string;

  // Payment status
  transaction_id: string;
  transactionStatus: string;
  transactionType: string;
  xendit_id: string | null;
  price: string;
}


