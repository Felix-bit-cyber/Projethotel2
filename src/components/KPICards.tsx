import React from "react";
import { Bed, DollarSign, Utensils, CalendarCheck } from "lucide-react";
import { Room, Booking, Order, RoomStatus, BookingStatus } from "../types";

interface KPICardsProps {
  rooms: Room[];
  bookings: Booking[];
  orders: Order[];
  onTabChange: (tab: string) => void;
}

export default function KPICards({ rooms, bookings, orders, onTabChange }: KPICardsProps) {
  // 1. Occupied rooms
  const occupiedRoomsCount = rooms.filter((r) => r.status === RoomStatus.Occupied).length;
  const totalRoomsCount = rooms.length;

  // 2. Today's Revenue (Calculated dynamically)
  // Sum of occupied rooms' active daily rates + delivered/ready orders
  const roomRevenueToday = rooms
    .filter((r) => r.status === RoomStatus.Occupied)
    .reduce((sum, r) => sum + r.price, 0);

  const restaurantRevenueToday = orders
    .reduce((sum, o) => sum + o.price, 0);

  const totalRevenueToday = roomRevenueToday + restaurantRevenueToday;

  // 3. Daily food orders count
  const activeOrdersCount = orders.length;

  // 4. New Bookings today (placed or starting today)
  const newBookingsCount = bookings.filter(
    (b) => b.status === BookingStatus.Pending || b.startDate === "2026-05-21"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* Card 1: Rooms occupied */}
      <button
        onClick={() => onTabChange("chambres")}
        className="flex items-center gap-4 bg-[#1e293b]/80 p-5 rounded-2xl shadow-lg border border-slate-800 hover:border-indigo-500/40 transition-all group duration-200 cursor-pointer text-left"
        id="kpi-rooms"
      >
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full group-hover:scale-110 transition-transform">
          <Bed className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 font-sans">Chambres Occupées</p>
          <h3 className="text-2xl font-bold text-white font-display">
            {occupiedRoomsCount} <span className="text-sm text-slate-500">/ {totalRoomsCount}</span>
          </h3>
          <p className="text-xs text-indigo-400 mt-1 font-mono">
            {((occupiedRoomsCount / totalRoomsCount) * 100).toFixed(0)}% d'occupation
          </p>
        </div>
      </button>

      {/* Card 2: Revenue */}
      <div
        className="flex items-center gap-4 bg-[#1e293b]/80 p-5 rounded-2xl shadow-lg border border-slate-800 transition-all duration-200"
        id="kpi-revenue"
      >
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 font-sans">Revenus du Jour</p>
          <h3 className="text-2xl font-bold text-white font-display">
            {totalRevenueToday.toLocaleString("fr-FR")} $
          </h3>
          <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-mono">
            <span>Hôtel: {roomRevenueToday} $</span>
            <span>•</span>
            <span>Resto: {restaurantRevenueToday} $</span>
          </div>
        </div>
      </div>

      {/* Card 3: Food orders */}
      <button
        onClick={() => onTabChange("restaurant")}
        className="flex items-center gap-4 bg-[#1e293b]/80 p-5 rounded-2xl shadow-lg border border-slate-800 hover:border-indigo-500/40 transition-all group duration-200 cursor-pointer text-left"
        id="kpi-orders"
      >
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full group-hover:scale-110 transition-transform">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 font-sans">Commandes Resto</p>
          <h3 className="text-2xl font-bold text-white font-display">{activeOrdersCount}</h3>
          <p className="text-xs text-amber-400 mt-1 font-mono">
            {orders.filter((o) => o.status !== "Livré").length} actives en cuisine
          </p>
        </div>
      </button>

      {/* Card 4: New bookings */}
      <button
        onClick={() => onTabChange("reservations")}
        className="flex items-center gap-4 bg-[#1e293b]/80 p-5 rounded-2xl shadow-lg border border-slate-800 hover:border-indigo-500/40 transition-all group duration-200 cursor-pointer text-left"
        id="kpi-bookings"
      >
        <div className="p-3 bg-violet-500/10 text-violet-400 rounded-full group-hover:scale-110 transition-transform">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 font-sans">Nouvelles Réservations</p>
          <h3 className="text-2xl font-bold text-white font-display">{newBookingsCount}</h3>
          <p className="text-xs text-violet-400 mt-1 font-mono">
            Saisie ou arrivée aujourd'hui
          </p>
        </div>
      </button>
    </div>
  );
}
