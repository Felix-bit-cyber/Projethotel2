import React, { useState, useEffect } from "react";
import {
  Home,
  Bed,
  Calendar,
  Utensils,
  DoorOpen,
  Users,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle,
  Menu,
  X
} from "lucide-react";

import {
  Room,
  RoomStatus,
  RoomType,
  Booking,
  BookingStatus,
  Order,
  OrderStatus,
  MeetingRoom,
  MeetingRoomStatus,
  MeetingBooking,
  Review,
  ReviewCategory
} from "./types";

import {
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_ORDERS,
  INITIAL_MEETING_ROOMS,
  INITIAL_MEETING_BOOKINGS,
  INITIAL_REVIEWS
} from "./data";

// Sub-components
import KPICards from "./components/KPICards";
import RecentBookingsTable from "./components/RecentBookingsTable";
import LatestOrdersList from "./components/LatestOrdersList";
import DynamicCharts from "./components/DynamicCharts";
import RoomsManager from "./components/RoomsManager";
import BookingsManager from "./components/BookingsManager";
import RestaurantManager from "./components/RestaurantManager";
import MeetingManager from "./components/MeetingManager";
import ClientsManager from "./components/ClientsManager";
import ReviewsManager from "./components/ReviewsManager";

// Modals
import { AddBookingModal, AddOrderModal, AddRoomModal } from "./components/Modals";

export default function App() {
  // Sidebar state for mobile responsiveness
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core records persisted locally
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("mk_rooms");
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("mk_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("mk_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>(() => {
    const saved = localStorage.getItem("mk_meeting_rooms");
    return saved ? JSON.parse(saved) : INITIAL_MEETING_ROOMS;
  });

  const [meetingBookings, setMeetingBookings] = useState<MeetingBooking[]>(() => {
    const saved = localStorage.getItem("mk_meeting_bookings");
    return saved ? JSON.parse(saved) : INITIAL_MEETING_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("mk_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem("mk_active_tab");
    return saved || "dashboard";
  });

  // Modal display toggles
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Persist values in localStorage
  useEffect(() => {
    localStorage.setItem("mk_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("mk_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("mk_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("mk_meeting_rooms", JSON.stringify(meetingRooms));
  }, [meetingRooms]);

  useEffect(() => {
    localStorage.setItem("mk_meeting_bookings", JSON.stringify(meetingBookings));
  }, [meetingBookings]);

  useEffect(() => {
    localStorage.setItem("mk_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("mk_active_tab", activeTab);
  }, [activeTab]);

  // Notifications alerts
  const [notifications, setNotifications] = useState<string[]>([
    "Bienvenue sur l'administration Maman Kinja",
    "La chambre Suite Royale est occupée aujourd'hui",
    "Nouvelle commande de Carpe Grillée reçue pour Table 4"
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState("");

  const clearNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  // ACTIONS on Rooms
  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
  };

  const handleAddRoom = (roomData: Omit<Room, "id">) => {
    const newRoom: Room = {
      id: "r_" + Date.now(),
      ...roomData
    };
    setRooms((prev) => [...prev, newRoom]);
    setNotifications((prev) => [`Chambre ${roomData.number} créée avec succès`, ...prev]);
  };

  // ACTIONS on Bookings / Cascading Effects
  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        // CASCADING EFFECT: Check-In (Active) makes Room "Occupied"
        if (status === BookingStatus.Active) {
          setRooms((roomsPrev) =>
            roomsPrev.map((r) =>
              r.number === b.roomNumber ? { ...r, status: RoomStatus.Occupied } : r
            )
          );
          setNotifications((prevNotif) => [`Check-In effectué pour ${b.clientName}`, ...prevNotif]);
        }

        // CASCADING EFFECT: Check-Out (Completed) makes Room "En Nettoyage" (Cleaning)
        if (status === BookingStatus.Completed) {
          setRooms((roomsPrev) =>
            roomsPrev.map((r) =>
              r.number === b.roomNumber ? { ...r, status: RoomStatus.Cleaning } : r
            )
          );
          setNotifications((prevNotif) => [`Check-Out complété pour ${b.clientName}. Chambre ${b.roomNumber} envoyée en nettoyage.`, ...prevNotif]);
        }

        // CASCADING EFFECT: Cancelled makes Room "Disponible" (Available)
        if (status === BookingStatus.Cancelled) {
          setRooms((roomsPrev) =>
            roomsPrev.map((r) =>
              r.number === b.roomNumber ? { ...r, status: RoomStatus.Available } : r
            )
          );
          setNotifications((prevNotif) => [`Réservation de ${b.clientName} annulée`, ...prevNotif]);
        }

        return { ...b, status };
      })
    );
  };

  const handleDeleteBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      // Free the associated room
      setRooms((roomsPrev) =>
        roomsPrev.map((r) =>
          r.number === booking.roomNumber ? { ...r, status: RoomStatus.Available } : r
        )
      );
    }
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleAddBooking = (
    bookingData: Omit<Booking, "id" | "createdAt" | "amount"> & { roomRate: number }
  ) => {
    const sDate = new Date(bookingData.startDate);
    const eDate = new Date(bookingData.endDate);
    const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const finalAmount = bookingData.roomRate * diffDays;

    const newBooking: Booking = {
      id: "b_" + Date.now(),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      roomNumber: bookingData.roomNumber,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      amount: finalAmount,
      status: bookingData.status,
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);

    // CASCADING EFFECT: If initially booked as Active, lock the room
    if (bookingData.status === BookingStatus.Active) {
      setRooms((roomsPrev) =>
        roomsPrev.map((r) =>
          r.number === bookingData.roomNumber ? { ...r, status: RoomStatus.Occupied } : r
        )
      );
    }

    setNotifications((prev) => [`Nouvelle réservation enregistrée pour ${bookingData.clientName}`, ...prev]);
  };

  // ACTIONS on Restaurant Food Orders
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setNotifications((prev) => [`La commande [${order.itemName}] est désormais ${status}`, ...prev]);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleAddOrder = (orderData: Omit<Order, "id" | "createdAt" | "status">) => {
    const newOrder: Order = {
      id: "o_" + Date.now(),
      itemName: orderData.itemName,
      category: orderData.category,
      price: orderData.price,
      location: orderData.location,
      createdAt: new Date().toISOString(),
      status: OrderStatus.Preparing
    };
    setOrders((prev) => [newOrder, ...prev]);
    setNotifications((prev) => [`Cuisine: Commande de [${orderData.itemName}] lancée pour ${orderData.location}`, ...prev]);
  };

  // ACTIONS on Meeting Bookings
  const handleAddMeetingBooking = (bookingData: Omit<MeetingBooking, "id" | "amount" | "status">) => {
    const room = meetingRooms.find((r) => r.id === bookingData.meetingRoomId);
    if (!room) return;

    const amount = room.ratePerHour * bookingData.durationHours;

    const newBooking: MeetingBooking = {
      id: "mb_" + Date.now(),
      ...bookingData,
      amount,
      status: BookingStatus.Active
    };

    setMeetingBookings((prev) => [newBooking, ...prev]);

    // Set Room status to occupied
    setMeetingRooms((prev) =>
      prev.map((r) =>
        r.id === bookingData.meetingRoomId
          ? {
              ...r,
              status: MeetingRoomStatus.Occupied,
              currentBookingText: `${bookingData.clientName} (${bookingData.startHour} - ${bookingData.durationHours}h)`
            }
          : r
      )
    );

    setNotifications((prev) => [`Congres: ${bookingData.clientName} a loué la ${bookingData.meetingRoomName}`, ...prev]);
  };

  const handleUpdateMeetingBookingStatus = (bookingId: string, status: BookingStatus) => {
    setMeetingBookings((prev) =>
      prev.map((mb) => {
        if (mb.id !== bookingId) return mb;

        if (status === BookingStatus.Completed) {
          // Free meeting room
          setMeetingRooms((prevRooms) =>
            prevRooms.map((r) =>
              r.id === mb.meetingRoomId
                ? { ...r, status: MeetingRoomStatus.Available, currentBookingText: undefined }
                : r
            )
          );
          setNotifications((p) => [`Séminaire de ${mb.clientName} terminé. Salle de réunion libérée.`, ...p]);
        }
        return { ...mb, status };
      })
    );
  };

  const handleAddReview = (reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      id: "v_" + Date.now(),
      ...reviewData,
      date: new Date().toISOString().split("T")[0]
    };
    setReviews((prev) => [newReview, ...prev]);
    setNotifications((prev) => [`Nouvel avis : ${reviewData.clientName} (${reviewData.rating} Étoiles)`, ...prev]);
  };

  const handleResetData = () => {
    if (confirm("Voulez-vous réinitialiser toutes les données aux valeurs de démonstration ?")) {
      localStorage.clear();
      setRooms(INITIAL_ROOMS);
      setBookings(INITIAL_BOOKINGS);
      setOrders(INITIAL_ORDERS);
      setMeetingRooms(INITIAL_MEETING_ROOMS);
      setMeetingBookings(INITIAL_MEETING_BOOKINGS);
      setReviews(INITIAL_REVIEWS);
      setActiveTab("dashboard");
      setNotifications(["Données réinitialisées"]);
    }
  };

  // Computed available rooms list
  const availableRoomsList = rooms.filter((r) => r.status === RoomStatus.Available);
  const occupiedRoomsList = rooms.filter((r) => r.status === RoomStatus.Occupied);

  // Render sub controllers matching routers
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DynamicCharts rooms={rooms} orders={orders} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentBookingsTable
                  bookings={bookings}
                  onUpdateStatus={handleUpdateBookingStatus}
                  onDeleteBooking={handleDeleteBooking}
                />
              </div>

              <div>
                <LatestOrdersList
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                  onOpenNewOrderModal={() => setIsOrderModalOpen(true)}
                />
              </div>
            </div>

            {/* Client Reviews & Rating Section */}
            <div className="pt-2 animate-fade-in">
              <div className="mb-4">
                <h3 className="text-xl font-bold font-display text-white">Retours & Avis Clients</h3>
                <p className="text-xs text-slate-400">Évaluation de l'expérience de séjour, restauration et séminaires d'affaires</p>
              </div>
              <ReviewsManager
                reviews={reviews}
                onAddReview={handleAddReview}
                recentClientNames={Array.from(new Set(bookings.map((b) => b.clientName))).filter(Boolean) as string[]}
              />
            </div>

            {/* Quick action buttons desk */}
            <div className="bg-slate-800 text-white rounded-2xl p-6 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div>
                <h4 className="font-bold text-lg font-display">Opérations Rapides</h4>
                <p className="text-xs text-slate-300">Ajouter directement des mouvements ou forcer des réservations en un clic</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all shadow-xs"
                >
                  + Enregistrer Voyageur
                </button>
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all"
                >
                  + Nouveau Repas Cuisine
                </button>
                <button
                  onClick={() => setIsRoomModalOpen(true)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold text-xs rounded-xl cursor-pointer transition-all border border-slate-600"
                >
                  + Ajouter Unité Hôtel
                </button>
                <button
                  onClick={handleResetData}
                  className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs rounded-xl cursor-pointer transition-all border border-rose-500/20"
                >
                  Réinitialiser Démo
                </button>
              </div>
            </div>
          </div>
        );
      case "chambres":
        return (
          <RoomsManager
            rooms={rooms}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            onOpenAddRoomModal={() => setIsRoomModalOpen(true)}
          />
        );
      case "reservations":
        return (
          <BookingsManager
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onOpenAddBookingModal={() => setIsBookingModalOpen(true)}
          />
        );
      case "restaurant":
        return (
          <RestaurantManager
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onOpenNewOrderModal={() => setIsOrderModalOpen(true)}
          />
        );
      case "salles":
        return (
          <MeetingManager
            meetingRooms={meetingRooms}
            meetingBookings={meetingBookings}
            onAddMeetingBooking={handleAddMeetingBooking}
            onUpdateMeetingStatus={handleUpdateMeetingBookingStatus}
          />
        );
      case "clients":
        return <ClientsManager bookings={bookings} orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-slate-100 antialiased">
      {/* 1. Sidebar Panel Setup */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-[#1e293b]/50 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 backdrop-blur-md ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo element */}
          <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold font-display text-white tracking-tight">
                Maman Kinja
              </h1>
              <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-extrabold font-sans">
                Horizon Dashboard
              </span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-slate-800 text-slate-400 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation link stacks */}
          <nav className="p-4 space-y-1 font-sans">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("chambres");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "chambres"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <Bed className="w-5 h-5" />
              <span>Chambres</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("reservations");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "reservations"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Réservations</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("restaurant");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "restaurant"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <Utensils className="w-5 h-5" />
              <span>Restaurant</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("salles");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "salles"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <DoorOpen className="w-5 h-5" />
              <span>Salles de Réunions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("clients");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "clients"
                  ? "bg-indigo-500/10 text-indigo-400 border-r-3 border-indigo-500 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Clients</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer branding */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-800/60 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
            <span className="text-[11px] text-slate-400 font-medium font-mono uppercase tracking-wider">
              Service connectif
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            © 2026 Maman Kinja Sarl
          </span>
        </div>
      </aside>

      {/* Overlay backdrop for mobile sidebars */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#000]/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* 2. Main Content Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 max-w-7xl mx-auto w-full p-4 md:p-8">
        {/* Interactive Header with Navigation metadata */}
        <header className="flex items-center justify-between gap-4 mb-6 transition-all">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-300 shadow-xs hover:bg-slate-700/80"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold text-indigo-400 capitalize tracking-wide font-sans">
                Pages / {activeTab === "dashboard" ? "Tableau de Bord" : activeTab}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display mt-0.5 tracking-tight capitalize">
                {activeTab === "dashboard" ? "Tableau de bord principal" : `${activeTab}`}
              </h2>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Input for lookups */}
            <div className="relative hidden lg:block font-sans">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher ..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="bg-slate-800/80 border border-slate-700/60 rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:border-indigo-500 text-xs text-slate-100 placeholder-slate-500"
              />
            </div>

            {/* Notification alert bells */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative p-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 hover:bg-slate-700/80 cursor-pointer shadow-xs transition-transform"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
                )}
              </button>

              {/* Notification overlay dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden font-sans">
                  <div className="p-3 bg-slate-900 border-b border-slate-700/80 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">Notifications ({notifications.length})</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-700/80 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center p-4 text-xs text-slate-400">Aucun message non lu</p>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="p-3 text-xs flex justify-between gap-2 hover:bg-slate-700/45 text-slate-300">
                          <span>{notif}</span>
                          <button
                            onClick={() => clearNotification(idx)}
                            className="text-slate-400 hover:text-rose-400 font-bold cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar identity indicator */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-1.5 pr-3.5 rounded-full shadow-xs">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
                alt="Profile Avatar"
                className="w-7 h-7 rounded-full"
              />
              <span className="text-xs font-bold text-slate-200 hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* 3. Core KPI card deck for ALL subpages (provides status metrics context directly) */}
        <KPICards
          rooms={rooms}
          bookings={bookings}
          orders={orders}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
        />

        {/* 4. Active interactive page display workspace container */}
        <div className="flex-1 animate-fade-in">{renderTabContent()}</div>
      </main>

      {/* POPUP MODAL ENGINES */}
      <AddBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        availableRooms={availableRoomsList}
        onSubmit={handleAddBooking}
      />

      <AddOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        occupiedRooms={occupiedRoomsList}
        onSubmit={handleAddOrder}
      />

      <AddRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSubmit={handleAddRoom}
      />
    </div>
  );
}
