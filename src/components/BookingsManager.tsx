import React, { useState } from "react";
import { Plus, Search, Calendar, Phone, Mail, CheckCircle, Clock } from "lucide-react";
import { Booking, BookingStatus } from "../types";

interface BookingsManagerProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onOpenAddBookingModal: () => void;
}

export default function BookingsManager({
  bookings,
  onUpdateStatus,
  onOpenAddBookingModal,
}: BookingsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Active:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
      case BookingStatus.Pending:
        return "bg-amber-500/10 text-amber-400 border-amber-500/15";
      case BookingStatus.Completed:
        return "bg-slate-700/30 text-slate-300 border-slate-700/40";
      case BookingStatus.Cancelled:
        return "bg-rose-500/10 text-rose-400 border-rose-500/15";
    }
  };

  return (
    <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">Registres des Réservations</h3>
          <p className="text-xs text-slate-400">Gérer l'accueil des voyageurs et les dates de séjour</p>
        </div>
        <button
          onClick={onOpenAddBookingModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Réserver un Séjour
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 font-sans">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Chercher par nom de client, email ou chambre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-750 rounded-xl focus:outline-none focus:border-indigo-500 text-sm placeholder:text-slate-500 text-slate-100 bg-slate-800/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 border border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-slate-800 text-slate-200 cursor-pointer"
        >
          <option value="All" className="bg-slate-800">Tous les séjours</option>
          <option value={BookingStatus.Active} className="bg-slate-800">Confirmée (En cours)</option>
          <option value={BookingStatus.Pending} className="bg-slate-800">En attente</option>
          <option value={BookingStatus.Completed} className="bg-slate-800">Complétée</option>
          <option value={BookingStatus.Cancelled} className="bg-slate-800">Annulée</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-800 rounded-2xl">
            Aucun séjour ne correspond à cette recherche.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 border border-slate-800/80 rounded-2xl hover:border-indigo-500/30 hover:bg-[#161e2e]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#161e2e]/20"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-450 border border-indigo-500/15 rounded-full h-11 w-11 flex items-center justify-center font-bold font-display">
                  {b.clientName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-200 text-base font-sans">{b.clientName}</h4>
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {b.clientEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {b.clientPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:text-right">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 block tracking-wide font-sans">
                    Chambre assignée
                  </span>
                  <span className="text-sm font-bold text-indigo-400 font-mono">
                    Numéro {b.roomNumber}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 block tracking-wide font-sans">
                    Calendrier de Séjour
                  </span>
                  <span className="text-sm font-semibold text-slate-300 font-sans flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {b.startDate} au {b.endDate}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 block tracking-wide font-sans">
                    Facturation brute
                  </span>
                  <span className="text-base font-bold text-white font-display">
                    {b.amount} $
                  </span>
                </div>
              </div>

              {/* Action commands directly on record */}
              <div className="border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0 flex items-center gap-2 justify-end">
                {b.status === BookingStatus.Pending && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(b.id, BookingStatus.Active)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Enregistrer Check-In
                    </button>
                    <button
                      onClick={() => onUpdateStatus(b.id, BookingStatus.Cancelled)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/40 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </>
                )}

                {b.status === BookingStatus.Active && (
                  <button
                    onClick={() => onUpdateStatus(b.id, BookingStatus.Completed)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Libérer / Facturer (Check-Out)
                  </button>
                )}

                {b.status === BookingStatus.Completed && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Séjour Soldé et Clôturé
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
