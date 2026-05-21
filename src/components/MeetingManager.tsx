import React, { useState } from "react";
import { Plus, Check, Calendar, Users, DoorOpen } from "lucide-react";
import { MeetingRoom, MeetingBooking, MeetingRoomStatus, BookingStatus } from "../types";

interface MeetingManagerProps {
  meetingRooms: MeetingRoom[];
  meetingBookings: MeetingBooking[];
  onAddMeetingBooking: (booking: Omit<MeetingBooking, "id" | "amount" | "status">) => void;
  onUpdateMeetingStatus: (bookingId: string, status: BookingStatus) => void;
}

export default function MeetingManager({
  meetingRooms,
  meetingBookings,
  onAddMeetingBooking,
  onUpdateMeetingStatus,
}: MeetingManagerProps) {
  const [clientName, setClientName] = useState("");
  const [roomId, setRoomId] = useState(meetingRooms[0]?.id || "");
  const [date, setDate] = useState("2026-05-21");
  const [startHour, setStartHour] = useState("14:00");
  const [duration, setDuration] = useState(3);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      alert("S'il vous plaît, indiquez le nom de l'organisation ou du client.");
      return;
    }
    const room = meetingRooms.find((r) => r.id === roomId);
    onAddMeetingBooking({
      meetingRoomId: roomId,
      meetingRoomName: room ? room.name : "Salle réunion",
      clientName,
      date,
      startHour,
      durationHours: duration,
    });
    setClientName("");
  };  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Active:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
      case BookingStatus.Pending:
        return "bg-amber-500/10 text-amber-400 border-amber-500/15";
      case BookingStatus.Completed:
        return "bg-slate-800 text-slate-300 border-slate-700/65";
      case BookingStatus.Cancelled:
        return "bg-rose-500/10 text-rose-400 border-rose-500/15";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left item: Room Inventory list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6">
            <h3 className="text-xl font-bold text-white font-display mb-4">Salles de Réunions & Congrès</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {meetingRooms.map((room) => (
                <div key={room.id} className="border border-slate-805/80 p-4 rounded-xl relative overflow-hidden bg-[#161e2e]/20">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-550/15 rounded-lg">
                      <DoorOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 font-mono">{room.ratePerHour} $/heure</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-base font-sans mt-3">{room.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-450 font-mono mt-1">
                    <Users className="w-3.5 h-3.5" /> Max {room.capacity} places
                  </div>

                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      room.status === MeetingRoomStatus.Available
                        ? "bg-emerald-505/10 text-emerald-400 border-emerald-500/15"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-550/15"
                    }`}>
                      {room.status}
                    </span>
                    {room.currentBookingText && (
                      <p className="text-[10px] text-indigo-400 italic mt-1 font-sans font-medium">
                        {room.currentBookingText}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings log list */}
          <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6">
            <h3 className="text-lg font-bold text-white font-display mb-3">Séminaires & Conférences Programmés</h3>
            <div className="space-y-3">
              {meetingBookings.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">Aucun séminaire n'est prévu</p>
              ) : (
                meetingBookings.map((mb) => (
                  <div key={mb.id} className="p-4 border border-slate-800/80 rounded-xl hover:bg-slate-800/20 bg-[#161e2e]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-250 font-sans">{mb.clientName}</h4>
                      <p className="text-xs text-indigo-400 font-semibold font-mono">{mb.meetingRoomName}</p>
                      <span className="text-[11px] text-slate-450 font-sans">
                        Le {mb.date} de {mb.startHour} ({mb.durationHours} Heures)
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[11px] text-slate-500 block font-mono">Montant</span>
                        <span className="font-bold text-slate-200 font-display">{mb.amount} $</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(mb.status)}`}>
                        {mb.status}
                      </span>

                      {mb.status === BookingStatus.Active && (
                        <button
                          onClick={() => onUpdateMeetingStatus(mb.id, BookingStatus.Completed)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700/60 rounded font-semibold transition-colors cursor-pointer"
                        >
                          Clôturer
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right item: Booking seminar form */}
        <div className="bg-[#1e293b]/90 rounded-2xl shadow-lg border border-slate-800/85 p-6 self-start text-white">
          <h3 className="text-lg font-bold text-white font-display mb-1">Ranger un Congrès</h3>
          <p className="text-xs text-slate-400 mb-4 font-sans">Enregistrer une occupation corporate horaire</p>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Société / Client *</label>
              <input
                type="text"
                required
                placeholder="Ex. Banque Centrale ou PNUD"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-105 focus:outline-none focus:border-indigo-500 placeholder:text-slate-505"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Choisir la Salle</label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-750 bg-slate-800 text-slate-105 focus:outline-none focus:border-indigo-505"
              >
                {meetingRooms.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-800">
                    {r.name} ({r.ratePerHour} $/h)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Date d'occupation</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-105 focus:outline-none focus:border-indigo-505 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Heure de début</label>
                <input
                  type="text"
                  placeholder="14:00"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-110 focus:outline-none focus:border-indigo-505"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Durée (Heures)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-110 focus:outline-none focus:border-indigo-5c5"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center bg-[#161e2e]/40 p-3 rounded-lg">
              <span className="font-semibold text-slate-450 text-[10px]">Facturation prévue :</span>
              <span className="text-sm font-bold text-white font-display">
                {(meetingRooms.find((r) => r.id === roomId)?.ratePerHour || 0) * duration} $
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" /> Réserver la Salle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
