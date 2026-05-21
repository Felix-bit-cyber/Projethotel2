import React, { useState } from "react";
import { Plus, Search, Check, Flame, RefreshCcw, LayoutGrid, List } from "lucide-react";
import { Room, RoomStatus, RoomType } from "../types";

interface RoomsManagerProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  onOpenAddRoomModal: () => void;
}

export default function RoomsManager({ rooms, onUpdateRoomStatus, onOpenAddRoomModal }: RoomsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || room.status === statusFilter;
    const matchesType = typeFilter === "All" || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.Available:
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
          pill: "bg-emerald-400",
          hover: "hover:bg-emerald-500/20"
        };
      case RoomStatus.Occupied:
        return {
          bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/15",
          pill: "bg-indigo-400",
          hover: "hover:bg-indigo-500/20"
        };
      case RoomStatus.Cleaning:
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/15",
          pill: "bg-amber-400",
          hover: "hover:bg-amber-500/20"
        };
    }
  };

  return (
    <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">Gestion des Chambres</h3>
          <p className="text-xs text-slate-400">Modifier les disponibilités et tarifs des {rooms.length} unités</p>
        </div>
        <button
          onClick={onOpenAddRoomModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Ajouter une Chambre
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 font-sans">
        <div className="relative flex-1">
          <label className="sr-only">Search</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par numéro ou style..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-750 rounded-xl focus:outline-none focus:border-indigo-500 text-sm placeholder:text-slate-500 text-slate-100 bg-slate-800/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-slate-800 text-slate-200 cursor-pointer"
          >
            <option value="All" className="bg-slate-800">Tous les Statuts</option>
            <option value={RoomStatus.Available} className="bg-slate-800">Disponible</option>
            <option value={RoomStatus.Occupied} className="bg-slate-800">Occupée</option>
            <option value={RoomStatus.Cleaning} className="bg-slate-800">En Nettoyage</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-slate-800 text-slate-200 cursor-pointer"
          >
            <option value="All" className="bg-slate-800">Toutes les Catégories</option>
            <option value={RoomType.Simple} className="bg-slate-800">Simple</option>
            <option value={RoomType.Deluxe} className="bg-slate-800">Deluxe</option>
            <option value={RoomType.Suite} className="bg-slate-800">Suite</option>
            <option value={RoomType.Confort} className="bg-slate-800">Confort</option>
          </select>
        </div>
      </div>

      {/* Grid rendering list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm">
            Aucune chambre ne correspond à vos filtres
          </div>
        ) : (
          filteredRooms.map((room) => {
            const config = getStatusColor(room.status);
            return (
              <div
                key={room.id}
                className="group border border-slate-800/80 rounded-2xl p-4 hover:shadow-xl hover:border-indigo-500/30 transition-all bg-[#161e2e]/40 relative overflow-hidden"
              >
                {/* Header detail */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {room.type}
                    </span>
                    <h4 className="text-lg font-bold text-white font-display mt-2">
                      Chambre {room.number}
                    </h4>
                  </div>
                  <span className="text-lg font-bold text-slate-200 font-display">
                    {room.price} $ <span className="text-[10px] text-slate-500 font-normal">/nuit</span>
                  </span>
                </div>

                {/* Big status pills */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-colors ${config.bg}`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${config.pill}`} />
                    <span>{room.status}</span>
                  </div>

                  {/* Actions to toggle states directly inside card */}
                  <div className="flex gap-1 ml-2">
                    {room.status !== RoomStatus.Available && (
                      <button
                        onClick={() => onUpdateRoomStatus(room.id, RoomStatus.Available)}
                        className="p-1 hover:bg-[#1e293b] bg-[#1e293b]/50 border border-slate-700/60 rounded-md transition-colors text-emerald-400 cursor-pointer"
                        title="Désigner comme Disponible"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {room.status !== RoomStatus.Cleaning && (
                      <button
                        onClick={() => onUpdateRoomStatus(room.id, RoomStatus.Cleaning)}
                        className="p-1 hover:bg-[#1e293b] bg-[#1e293b]/50 border border-slate-700/60 rounded-md transition-all text-amber-400 cursor-pointer"
                        title="Désigner comme Nettoyage"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub features list */}
                <div className="mt-4 pt-3 border-t border-slate-800/65 flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Climatisation : Oui</span>
                  <span>Mini Bar : Oui</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
