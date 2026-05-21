import React from "react";
import { Room, Order, RoomStatus, RoomType } from "../types";

interface DynamicChartsProps {
  rooms: Room[];
  orders: Order[];
}

export default function DynamicCharts({ rooms, orders }: DynamicChartsProps) {
  // 1. Calculate Room Status distribution
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === RoomStatus.Available).length;
  const occupiedRooms = rooms.filter((r) => r.status === RoomStatus.Occupied).length;
  const cleaningRooms = rooms.filter((r) => r.status === RoomStatus.Cleaning).length;

  const availablePct = totalRooms > 0 ? (availableRooms / totalRooms) * 100 : 0;
  const occupiedPct = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
  const cleaningPct = totalRooms > 0 ? (cleaningRooms / totalRooms) * 100 : 0;

  // 2. Calculate Revenue breakdown
  const roomRev = rooms
    .filter((r) => r.status === RoomStatus.Occupied)
    .reduce((sum, r) => sum + r.price, 0);

  const restoRev = orders.reduce((sum, o) => sum + o.price, 0);
  const totalRev = roomRev + restoRev;

  const roomRevPct = totalRev > 0 ? (roomRev / totalRev) * 100 : 0;
  const restoRevPct = totalRev > 0 ? (restoRev / totalRev) * 100 : 0;

  // 3. Occupancy by room type
  const types = [RoomType.Simple, RoomType.Deluxe, RoomType.Suite, RoomType.Confort];
  const occupancyByType = types.map((type) => {
    const roomsOfType = rooms.filter((r) => r.type === type);
    const occupiedOfType = roomsOfType.filter((r) => r.status === RoomStatus.Occupied);
    const rate = roomsOfType.length > 0 ? (occupiedOfType.length / roomsOfType.length) * 100 : 0;
    return {
      type,
      total: roomsOfType.length,
      occupied: occupiedOfType.length,
      rate,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Chart Card 1: Status des chambres (Live telemetry) */}
      <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-5">
        <h4 className="text-sm font-bold text-slate-400 font-sans tracking-wide uppercase mb-4">
          Statut des Chambres
        </h4>
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-3xl font-bold text-white font-display">{occupiedRooms}</span>
          <span className="text-xs text-slate-400">sur {totalRooms} chambres</span>
        </div>

        {/* Dynamic visual stacking progress bar */}
        <div className="w-full h-3.5 bg-slate-900/60 rounded-full overflow-hidden flex mb-6">
          <div
            style={{ width: `${occupiedPct}%` }}
            className="h-full bg-indigo-500 transition-all duration-500"
            title={`Occupées: ${occupiedPct.toFixed(0)}%`}
          />
          <div
            style={{ width: `${availablePct}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Disponibles: ${availablePct.toFixed(0)}%`}
          />
          <div
            style={{ width: `${cleaningPct}%` }}
            className="h-full bg-amber-400 transition-all duration-500"
            title={`En Nettoyage: ${cleaningPct.toFixed(0)}%`}
          />
        </div>

        {/* Legend with exact metrics */}
        <div className="space-y-3 font-sans">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-indigo-550 inline-block" />
              <span>Occupée</span>
            </div>
            <span className="text-slate-400">{occupiedRooms} ({occupiedPct.toFixed(0)}%)</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Disponible</span>
            </div>
            <span className="text-slate-400">{availableRooms} ({availablePct.toFixed(0)}%)</span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span>Nettoyage</span>
            </div>
            <span className="text-slate-400">{cleaningRooms} ({cleaningPct.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Chart Card 2: Split of Revenue streams */}
      <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-5">
        <h4 className="text-sm font-bold text-slate-400 font-sans tracking-wide uppercase mb-4">
          Répartition des Revenus
        </h4>
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-3xl font-bold text-white font-display">{totalRev.toLocaleString()} $</span>
          <span className="text-xs text-slate-400">Revenus cumulés du jour</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-indigo-200">Réservations Chambres</span>
              <span>{roomRev} $ ({roomRevPct.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-slate-900/60 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${roomRevPct}%` }}
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-amber-400">Restaurant & Café</span>
              <span>{restoRev} $ ({restoRevPct.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-slate-900/60 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${restoRevPct}%` }}
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs text-indigo-300/80 leading-relaxed font-sans">
          ⚡ Ces statistiques sont calculées dynamiquement à l'aide des tarifs hôteliers et de la facturation instantanée du restaurant.
        </div>
      </div>

      {/* Chart Card 3: Occupancy relative to category capacity */}
      <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-5">
        <h4 className="text-sm font-bold text-slate-400 font-sans tracking-wide uppercase mb-4">
          Occupation par Catégorie
        </h4>

        <div className="space-y-3.5">
          {occupancyByType.map((item) => (
            <div key={item.type} className="flex flex-col">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-300">{item.type}</span>
                <span className="text-slate-400 font-mono">
                  {item.occupied} / {item.total} chambres ({(item.rate).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.rate}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.rate > 75
                      ? "bg-violet-600"
                      : item.rate > 40
                      ? "bg-sky-500"
                      : "bg-emerald-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
