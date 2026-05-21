import { Room, RoomType, RoomStatus, Booking, BookingStatus, Order, OrderStatus, MeetingRoom, MeetingRoomStatus, MeetingBooking, Review, ReviewCategory } from "./types";

export const INITIAL_ROOMS: Room[] = [
  { id: "r1", number: "101", type: RoomType.Simple, price: 80, status: RoomStatus.Occupied },
  { id: "r2", number: "102", type: RoomType.Simple, price: 80, status: RoomStatus.Available },
  { id: "r3", number: "201", type: RoomType.Deluxe, price: 150, status: RoomStatus.Available },
  { id: "r4", number: "203", type: RoomType.Deluxe, price: 150, status: RoomStatus.Occupied },
  { id: "r5", number: "305", type: RoomType.Confort, price: 110, status: RoomStatus.Cleaning },
  { id: "r6", number: "Suite Royale", type: RoomType.Suite, price: 300, status: RoomStatus.Occupied },
  { id: "r7", number: "301", type: RoomType.Confort, price: 110, status: RoomStatus.Available },
  { id: "r8", number: "Suite Kivu", type: RoomType.Suite, price: 250, status: RoomStatus.Available },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    clientName: "Jean Dupont",
    clientEmail: "jean@email.com",
    clientPhone: "+243 812 345 678",
    roomNumber: "101",
    startDate: "2026-05-16",
    endDate: "2026-05-18",
    amount: 160,
    status: BookingStatus.Active,
    createdAt: "2026-05-15T10:30:00Z"
  },
  {
    id: "b2",
    clientName: "Sarah Martin",
    clientEmail: "sarah.m@email.com",
    clientPhone: "+243 999 888 777",
    roomNumber: "203",
    startDate: "2026-05-17",
    endDate: "2026-05-20",
    amount: 450,
    status: BookingStatus.Pending,
    createdAt: "2026-05-16T14:22:00Z"
  },
  {
    id: "b3",
    clientName: "Eliezer K.",
    clientEmail: "eliezer@email.com",
    clientPhone: "+243 855 123 456",
    roomNumber: "Suite Royale",
    startDate: "2026-05-16",
    endDate: "2026-05-25",
    amount: 2700,
    status: BookingStatus.Active,
    createdAt: "2026-05-14T08:15:00Z"
  },
  {
    id: "b4",
    clientName: "Marc T.",
    clientEmail: "marc.t@email.com",
    clientPhone: "+243 898 909 101",
    roomNumber: "305",
    startDate: "2026-05-14",
    endDate: "2026-05-16",
    amount: 220,
    status: BookingStatus.Completed,
    createdAt: "2026-05-12T11:00:00Z"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "o1",
    itemName: "Menu Fast-Food",
    category: "Plat",
    price: 18,
    location: "Chambre 101",
    createdAt: "2026-05-21T12:20:00Z",
    status: OrderStatus.Preparing
  },
  {
    id: "o2",
    itemName: "Carpe Grillée",
    category: "Plat",
    price: 25,
    location: "Table 4",
    createdAt: "2026-05-21T12:12:00Z",
    status: OrderStatus.Ready
  },
  {
    id: "o3",
    itemName: "2x Café Select",
    category: "Boisson",
    price: 3,
    location: "Salle Réunion",
    createdAt: "2026-05-21T11:55:00Z",
    status: OrderStatus.Delivered
  },
  {
    id: "o4",
    itemName: "Poulet Grillé",
    category: "Plat",
    price: 12,
    location: "Chambre 203",
    createdAt: "2026-05-21T11:24:00Z",
    status: OrderStatus.Preparing
  }
];

export const INITIAL_MEETING_ROOMS: MeetingRoom[] = [
  { id: "mr1", name: "Salle Tanganyika", capacity: 50, ratePerHour: 100, status: MeetingRoomStatus.Available },
  { id: "mr2", name: "Salle Kivu", capacity: 25, ratePerHour: 60, status: MeetingRoomStatus.Occupied, currentBookingText: "Séminaire Banque Centrale (10:00 - 15:00)" },
  { id: "mr3", name: "Salle Virunga", capacity: 12, ratePerHour: 40, status: MeetingRoomStatus.Available },
];

export const INITIAL_MEETING_BOOKINGS: MeetingBooking[] = [
  {
    id: "mb1",
    meetingRoomId: "mr2",
    meetingRoomName: "Salle Kivu",
    clientName: "Banque Centrale du Congo",
    date: "2026-05-21",
    startHour: "10:00",
    durationHours: 5,
    amount: 300,
    status: BookingStatus.Active
  }
];

// Available options for creating orders
export const MENU_ITEMS = [
  { name: "Carpe Grillée", category: "Plat", price: 25 },
  { name: "Poulet Grillé", category: "Plat", price: 12 },
  { name: "Menu Fast-Food", category: "Plat", price: 18 },
  { name: "Sauté de Boeuf", category: "Plat", price: 20 },
  { name: "Plat de Bananes Plantain", category: "Plat", price: 8 },
  { name: "2x Café Select", category: "Boisson", price: 3 },
  { name: "Jus Local Gingembre", category: "Boisson", price: 4 },
  { name: "Bière Locale Premium", category: "Boisson", price: 5 },
  { name: "Salade de Fruits", category: "Dessert", price: 6 },
  { name: "Gâteau Maison Maman Kinja", category: "Dessert", price: 7 }
] as const;

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "v1",
    clientName: "Jean Dupont",
    category: ReviewCategory.Stay,
    rating: 5,
    comment: "Excellent séjour ! Le personnel est attentionné et la chambre Suite Kivu offre une vue lac splendide. Je recommande vivement.",
    date: "2026-05-19"
  },
  {
    id: "v2",
    clientName: "Sarah Martin",
    category: ReviewCategory.Restaurant,
    rating: 4,
    comment: "La Carpe Grillée était absolument exquise et bien relevée ! Un peu d'attente lors du service, mais la fraîcheur compense largement.",
    date: "2026-05-20"
  },
  {
    id: "v3",
    clientName: "Eliezer K.",
    category: ReviewCategory.Meeting,
    rating: 5,
    comment: "La Salle Tanganyika a répondu parfaitement à nos exigences pour notre conférence corporate. Climatisation et sonorisation au top.",
    date: "2026-05-21"
  }
];
