import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Room, RoomType, RoomStatus, Order, OrderStatus, Booking, BookingStatus } from "../types";
import { MENU_ITEMS } from "../data";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRooms: Room[];
  onSubmit: (bookingData: Omit<Booking, "id" | "createdAt" | "amount"> & { roomRate: number }) => void;
}

export function AddBookingModal({ isOpen, onClose, availableRooms, onSubmit }: AddBookingModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [startDate, setStartDate] = useState("2026-05-21");
  const [endDate, setEndDate] = useState("2026-05-23");
  const [status, setStatus] = useState<BookingStatus>(BookingStatus.Active);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(80);

  useEffect(() => {
    if (availableRooms.length > 0 && !roomNumber) {
      setRoomNumber(availableRooms[0].number);
      setSelectedRoomPrice(availableRooms[0].price);
    }
  }, [availableRooms, roomNumber]);

  if (!isOpen) return null;

  const handleRoomChange = (num: string) => {
    setRoomNumber(num);
    const room = availableRooms.find((r) => r.number === num);
    if (room) {
      setSelectedRoomPrice(room.price);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !roomNumber) {
      alert("S'il vous plaît, renseignez le nom du client et choisissez une chambre.");
      return;
    }
    onSubmit({
      clientName,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, "")}@email.com`,
      clientPhone: clientPhone || "+243 000 000 000",
      roomNumber,
      startDate,
      endDate,
      status,
      roomRate: selectedRoomPrice,
    });
    // Reset state
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setRoomNumber("");
    onClose();
  };

  // Calculate day difference for total computation preview
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const estimatedAmount = selectedRoomPrice * diffDays;
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#1e293b] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-[#161e2e]/50">
          <div>
            <h3 className="text-base font-bold text-white font-display">Nouvelle Réservation</h3>
            <p className="text-xs text-slate-400">Associer un client à une chambre de l'hôtel</p>
          </div>
          <button onClick={onClose} className="p-1 px-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[80vh] font-sans text-sm text-slate-200 bg-[#1e293b]">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom Complet du Client *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jean Dupont"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-505"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
              <input
                type="email"
                placeholder="jean@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-505"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Téléphone</label>
              <input
                type="text"
                placeholder="+243 812..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-505"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sélectionner la Chambre *</label>
            {availableRooms.length === 0 ? (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl text-xs">
                ⚠️ Aucune chambre disponible actuellement. Terminez d'abord un séjour en cours ou mettez à jour le statut d'une chambre dans l'onglet Chambres.
              </div>
            ) : (
              <select
                value={roomNumber}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-505 cursor-pointer"
              >
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.number} className="bg-slate-800">
                    Chambre {room.number} — {room.type} ({room.price} $/nuit)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date d'Arrivée</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date de Départ</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Statut Initial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={BookingStatus.Active} className="bg-slate-800">Confirmée (Check-In Direct)</option>
                <option value={BookingStatus.Pending} className="bg-slate-800">En Attente</option>
              </select>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total estimé :</span>
              <span className="text-xl font-bold text-white font-display">
                {estimatedAmount} $ <span className="text-xs text-slate-500 font-normal">({diffDays} nuit{diffDays > 1 ? "s" : ""})</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/50 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={availableRooms.length === 0}
              className="px-5 py-2 bg-indigo-650 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" /> Enregistrer la Réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Add Restaurant Order Modal
interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  occupiedRooms: Room[];
  onSubmit: (orderData: Omit<Order, "id" | "createdAt" | "status">) => void;
}

export function AddOrderModal({ isOpen, onClose, occupiedRooms, onSubmit }: AddOrderModalProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ITEMS[0].name);
  const [category, setCategory] = useState<"Plat" | "Boisson" | "Dessert" | "Snack">("Plat");
  const [price, setPrice] = useState(MENU_ITEMS[0].price);
  const [location, setLocation] = useState("Chambre 101");

  useEffect(() => {
    // Sync price and category when selection shifts
    const item = MENU_ITEMS.find((m) => m.name === selectedMenuItem);
    if (item) {
      setCategory(item.category as any);
      setPrice(item.price);
    }
  }, [selectedMenuItem]);

  useEffect(() => {
    // Propose an occupied room or first general location
    if (occupiedRooms.length > 0) {
      setLocation(`Chambre ${occupiedRooms[0].number}`);
    } else {
      setLocation("Table 1");
    }
  }, [occupiedRooms]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      itemName: selectedMenuItem,
      category,
      price,
      location,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-[#161e2e]/50">
          <div>
            <h3 className="text-base font-bold text-white font-display">Nouvelle Commande Cuisine</h3>
            <p className="text-xs text-slate-400">Ajouter directement un repas ou produit au restaurant</p>
          </div>
          <button onClick={onClose} className="p-1 px-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 font-sans text-sm bg-[#1e293b] text-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Choisir dans la Carte (Menu)</label>
            <select
              value={selectedMenuItem}
              onChange={(e) => setSelectedMenuItem(e.target.value)}
              className="w-full px-4 py-2 border border-slate-750 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-505 cursor-pointer"
            >
              {MENU_ITEMS.map((item) => (
                <option key={item.name} value={item.name} className="bg-slate-800">
                  {item.name} [{item.category}] — {item.price} $
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catégorie</label>
              <input
                type="text"
                disabled
                value={category}
                className="w-full px-4 py-2 bg-slate-800/40 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tarif de Facturation ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Destination de Livraison</label>
            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Ex. Chambre 101, Table 4, Salon"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-505 text-slate-100"
              />
              {occupiedRooms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-500 self-center">Chambres occupées :</span>
                  {occupiedRooms.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setLocation(`Chambre ${r.number}`)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        location === `Chambre ${r.number}`
                          ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-semibold"
                          : "bg-slate-800 hover:bg-slate-750 text-slate-400 border-slate-750"
                      }`}
                    >
                      {r.number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/50 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer text-sm"
            >
              Créer la Commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Add Bedroom Modal
interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: Omit<Room, "id">) => void;
}

export function AddRoomModal({ isOpen, onClose, onSubmit }: AddRoomModalProps) {
  const [number, setNumber] = useState("");
  const [type, setType] = useState<RoomType>(RoomType.Simple);
  const [price, setPrice] = useState(80);
  const [status, setStatus] = useState<RoomStatus>(RoomStatus.Available);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) {
      alert("S'il vous plaît, indiquez le numéro de chambre.");
      return;
    }
    onSubmit({
      number,
      type,
      price,
      status,
    });
    setNumber("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-805 flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-[#161e2e]/50">
          <div>
            <h3 className="text-base font-bold text-white font-display">Nouvelle Chambre</h3>
            <p className="text-xs text-slate-400">Enregistrer une nouvelle chambre d'hôtel</p>
          </div>
          <button onClick={onClose} className="p-1 px-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-5 space-y-4 font-sans text-sm bg-[#1e293b] text-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Numéro ou Nom de la chambre *</label>
            <input
              type="text"
              required
              placeholder="e.g. 104, 302, Suite Lac Kivu"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder:text-slate-505"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catégorie</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className="w-full px-4 py-2 border border-slate-755 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={RoomType.Simple} className="bg-slate-800">Simple (Fridg / Wifi)</option>
                <option value={RoomType.Confort} className="bg-slate-800">Confort (Lit Queen)</option>
                <option value={RoomType.Deluxe} className="bg-slate-800">Deluxe (Vue Lac)</option>
                <option value={RoomType.Suite} className="bg-slate-800">Suite Impériale</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tarif par nuit ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-750 bg-slate-800/40 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Disponibilité Initiale</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className="w-full px-4 py-2 border border-slate-755 bg-slate-800 text-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={RoomStatus.Available} className="bg-slate-800">Libre (Disponible direct)</option>
              <option value={RoomStatus.Cleaning} className="bg-slate-800">En Nettoyage</option>
              <option value={RoomStatus.Occupied} className="bg-slate-800">Occupée d'office</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800/50 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer text-sm"
            >
              Ajouter la Chambre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
