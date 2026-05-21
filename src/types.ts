export enum RoomType {
  Simple = "Simple",
  Deluxe = "Deluxe",
  Suite = "Suite",
  Confort = "Confort"
}

export enum RoomStatus {
  Available = "Disponible",
  Occupied = "Occupée",
  Cleaning = "En Nettoyage"
}

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
}

export enum BookingStatus {
  Pending = "En attente",
  Active = "Confirmée",
  Completed = "Complétée",
  Cancelled = "Annulée"
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  roomNumber: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  amount: number;
  status: BookingStatus;
  createdAt: string; // ISO String
}

export enum OrderStatus {
  Preparing = "En préparation",
  Ready = "Prêt",
  Delivered = "Livré",
  Cancelled = "Annulé"
}

export interface Order {
  id: string;
  itemName: string;
  category: "Plat" | "Boisson" | "Dessert" | "Snack";
  price: number;
  location: string; // room / table number / etc.
  createdAt: string; // ISO string or simple time description
  status: OrderStatus;
}

export enum MeetingRoomStatus {
  Available = "Disponible",
  Occupied = "Occupée",
  Maintenance = "Maintenance"
}

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  ratePerHour: number;
  status: MeetingRoomStatus;
  currentBookingText?: string;
}

export interface MeetingBooking {
  id: string;
  meetingRoomId: string;
  meetingRoomName: string;
  clientName: string;
  date: string;
  startHour: string;
  durationHours: number;
  amount: number;
  status: BookingStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  totalSpent: number;
  lastVisit: string;
}

export enum ReviewCategory {
  Stay = "Séjour",
  Restaurant = "Restauration",
  Meeting = "Salles de Réunion"
}

export interface Review {
  id: string;
  clientName: string;
  category: ReviewCategory;
  rating: number; // 1 to 5 stars
  comment: string;
  date: string; // YYYY-MM-DD
}
