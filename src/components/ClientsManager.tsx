import React, { useState } from "react";
import { Search, UserCheck, CreditCard, Award, ExternalLink } from "lucide-react";
import { Booking, Order } from "../types";

interface ClientsManagerProps {
  bookings: Booking[];
  orders: Order[];
}

interface AggregatedCustomer {
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
}

export default function ClientsManager({ bookings, orders }: ClientsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Aggregate customers dynamically from the actual records in memory
  const guestMap = new Map<string, AggregatedCustomer>();

  bookings.forEach((b) => {
    const key = b.clientName.trim();
    const existing = guestMap.get(key);

    // Sum matching restaurant orders placed to their room
    let supplementarySpend = 0;
    orders.forEach((o) => {
      if (o.location === `Chambre ${b.roomNumber}`) {
        supplementarySpend += o.price;
      }
    });

    if (existing) {
      existing.totalBookings += 1;
      existing.totalSpent += b.amount + supplementarySpend;
      if (new Date(b.endDate) > new Date(existing.lastVisit)) {
        existing.lastVisit = b.endDate;
      }
    } else {
      guestMap.set(key, {
        name: b.clientName,
        email: b.clientEmail,
        phone: b.clientPhone,
        totalBookings: 1,
        totalSpent: b.amount + supplementarySpend,
        lastVisit: b.endDate,
      });
    }
  });

  const customerList = Array.from(guestMap.values());

  const filteredCustomers = customerList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyTier = (bookingsCount: number) => {
    if (bookingsCount >= 3) return { label: "Platine", style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/15" };
    if (bookingsCount >= 2) return { label: "Or", style: "bg-amber-500/10 text-amber-400 border-amber-505/15" };
    return { label: "Argent", style: "bg-slate-700/30 text-slate-300 border-slate-700/40" };
  };

  return (
    <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-display">Index des Clients</h3>
          <p className="text-xs text-slate-400">
            Fiches de fidélité et dépenses calculées en temps réel sur {customerList.length} clients
          </p>
        </div>

        <div className="relative w-full sm:w-72 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom de client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-750 bg-slate-800/35 rounded-xl focus:outline-none focus:border-indigo-550 text-xs placeholder:text-slate-500 text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            Aucun client ne figure dans vos registres actuellement.
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const tier = getLoyaltyTier(c.totalBookings);
            return (
              <div
                key={c.name}
                className="border border-slate-800/80 p-5 rounded-2xl bg-[#161e2e]/20 hover:border-indigo-500/30 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-100 text-lg font-sans leading-snug">{c.name}</h4>
                      <p className="text-[11px] text-slate-450 font-mono mt-0.5">{c.email}</p>
                      <p className="text-[11px] text-slate-450 font-mono">{c.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tier.style}`}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs font-sans">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wide">
                        Séjours Totaux
                      </span>
                      <span className="font-bold text-slate-300 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {c.totalBookings} voyage{c.totalBookings > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wide">
                        Dépenses cumulées
                      </span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> {c.totalSpent.toLocaleString()} $
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Dernière nuit : {c.lastVisit}</span>
                  <span className="text-indigo-400 font-semibold cursor-pointer hover:underline flex items-center gap-0.5">
                    Historique <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
