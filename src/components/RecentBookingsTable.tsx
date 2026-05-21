import React from "react";
import { CheckCircle, Clock, Check, X, RotateCcw } from "lucide-react";
import { Booking, BookingStatus } from "../types";

interface RecentBookingsTableProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export default function RecentBookingsTable({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
}: RecentBookingsTableProps) {
  // Sort by created time or date to show recent first
  const sortedBookings = [...bookings].slice(0, 5);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Active:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
            <CheckCircle className="w-3.5 h-3.5" /> Confirmée
          </span>
        );
      case BookingStatus.Pending:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/15">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case BookingStatus.Completed:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-700/40">
            Complétée
          </span>
        );
      case BookingStatus.Cancelled:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/15">
            Annulée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Réservations Récentes</h3>
          <p className="text-xs text-slate-400">Suivi en direct des séjours hôteliers</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/30 border-b border-slate-800/60">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Chambre</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Dates de séjour</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider font-sans text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                  Aucune réservation enregistrée
                </td>
              </tr>
            ) : (
              sortedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200 font-sans">{booking.clientName}</div>
                    <div className="text-xs text-slate-400 font-mono">{booking.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-200 font-mono">{booking.roomNumber}</div>
                    <div className="text-xs text-slate-400 font-sans">Tarif simple</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-300 font-sans">
                      {booking.startDate} <span className="text-slate-500 font-normal">au</span> {booking.endDate}
                    </span>
                    <div className="text-xs text-indigo-400 font-semibold mt-0.5">{booking.amount} $ total</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {booking.status === BookingStatus.Pending && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.Active)}
                            className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Confirmer la réservation (Check-In)"
                          >
                            <Check className="w-3.3 h-3.3" /> Confirmer
                          </button>
                          <button
                            onClick={() => onUpdateStatus(booking.id, BookingStatus.Cancelled)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {booking.status === BookingStatus.Active && (
                        <button
                          onClick={() => onUpdateStatus(booking.id, BookingStatus.Completed)}
                          className="p-1 px-2 text-slate-300 bg-slate-700/60 hover:bg-slate-700/90 border border-slate-600/50 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Libérer la chambre (Check-Out)"
                        >
                          <RotateCcw className="w-3.3 h-3.3" /> Check-Out
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteBooking(booking.id)}
                        className="text-xs text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Détruire l'enregistrement"
                      >
                        Effacer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
