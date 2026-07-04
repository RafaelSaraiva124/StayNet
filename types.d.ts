interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
}

type HotelImage = {
  id: string;
  url: string;
  publicId: string;
  order?: number;
};

type RoomType = "Single" | "Double";

type CreateHotelInput = {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone?: string;
  images: Array<{ url: string; publicId: string; order?: number }>;

  singleRoomPrice?: number;
  singleRoomTotal?: number;
  singleRoomDescription?: string;

  doubleRoomPrice?: number;
  doubleRoomTotal?: number;
  doubleRoomDescription?: string;
};

type ImageSliderProps = {
  images: HotelImage[];
  hotelName?: string;
};

interface HotelCardProps {
  id: string;
  name: string;
  city: string;
  country?: string | null;
  images: HotelImage[];
  description?: string | null;
}

interface RoomConfig {
  id: string;
  roomType: RoomType;
  pricePerNight: string;
  totalRooms: number;
  description: string | null;
}

interface CreateHotelRoomsInput {
  hotelId: string;
  singleRoom?: RoomConfig;
  doubleRoom?: RoomConfig;
}

interface HotelWithRooms {
  id: string;
  name: string;
  singleRoom: RoomConfig | null;
  doubleRoom: RoomConfig | null;
}

interface ReservasCardProps {
  hotel: HotelWithRooms;
}

interface CheckoutData {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: string;
  nights: number;
  roomType: RoomType;
  hotelName: string;
  specialRequests?: string;
}

interface CheckoutSessionResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  holdId?: string;
  error?: string;
}

interface PaymentStatus {
  paid: boolean;
  bookingId?: string;
  status?: string;
}

interface CartItem {
  id: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: string;
  nights: number;
  roomType: RoomType;
  hotelName: string;
  hotelId: string;
  specialRequests?: string;
  addedAt: number;
}

interface Booking {
  bookingId: string;
  hotelId: string;
  hotelName: string;
  roomType: "Single" | "Double";
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  userFullName: string;
  userEmail: string;
  label: string;
}

interface PartnerApplication {
  id: string;
  userId: string;
  hotelName: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
  userFullName: string;
  userEmail: string;
  createdAt: Date | null;
}

interface Partner {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date | null;
}
