import React, { useState } from "react";
import { Plus, Search, HelpCircle, UtensilsCrossed, Coffee, Check, Play, Trash2 } from "lucide-react";
import { Order, OrderStatus } from "../types";
import { MENU_ITEMS } from "../data";

interface RestaurantManagerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenNewOrderModal: () => void;
}

export default function RestaurantManager({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onOpenNewOrderModal,
}: RestaurantManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || o.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats based on actual database in memory
  const revenueTotal = orders.reduce((sum, o) => sum + o.price, 0);
  const mealsCount = orders.filter((o) => o.category === "Plat").length;
  const drinksCount = orders.filter((o) => o.category === "Boisson").length;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Preparing:
        return "bg-amber-500/10 text-amber-400 border-amber-500/15";
      case OrderStatus.Ready:
        return "bg-sky-500/10 text-sky-400 border-sky-500/15";
      case OrderStatus.Delivered:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
      case OrderStatus.Cancelled:
        return "bg-rose-500/10 text-rose-400 border-rose-500/15";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visual quick info banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#1e293b]/60 p-5 rounded-2xl border border-slate-800/85 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Cuisines Actives</span>
            <span className="text-2xl font-bold text-white font-display">
              {orders.filter((o) => o.status !== OrderStatus.Delivered).length} plats / boissons
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/15 rounded-xl">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b]/60 p-5 rounded-2xl border border-slate-800/85 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Chiffre Resto (Jour)</span>
            <span className="text-2xl font-bold text-emerald-400 font-display">{revenueTotal} $</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-xl">
            <span className="text-lg font-bold font-display">$</span>
          </div>
        </div>

        <div className="bg-[#1e293b]/60 p-5 rounded-2xl border border-slate-800/85 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Ventilation Plats / Boissons</span>
            <span className="text-2xl font-bold text-white font-display">
              {mealsCount} Repas <span className="text-xs text-slate-400">/ {drinksCount} Cafés</span>
            </span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 rounded-xl">
            <Coffee className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white font-display">Suivi des Services Cuisine</h3>
            <p className="text-xs text-slate-400">Suivre la préparation et livraison du room service</p>
          </div>
          <button
            onClick={onOpenNewOrderModal}
            className="bg-amber-550 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Passer une commande hôtelière
          </button>
        </div>

        {/* Search menu bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 font-sans">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filtre par repas, chambre (ex. Chambre 101) ou table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-750 rounded-xl focus:outline-none focus:border-indigo-500 text-sm placeholder:text-slate-505 text-slate-100 bg-slate-800/30"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-slate-800 text-slate-200 cursor-pointer"
          >
            <option value="All" className="bg-slate-800">Toutes catégories</option>
            <option value="Plat" className="bg-slate-800">Plat principal</option>
            <option value="Boisson" className="bg-slate-800">Boissons</option>
            <option value="Dessert" className="bg-slate-800">Dessert</option>
          </select>
        </div>

        {/* Real Live database table */}
        <div className="border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left order-collapse">
            <thead>
              <tr className="bg-[#161e2e]/60 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-405 uppercase font-sans">Désignation</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-405 uppercase font-sans">Lieu de service</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-405 uppercase font-sans">Prix</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-405 uppercase font-sans">État actuel</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-405 uppercase font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400 bg-[#161e2e]/10">
                    Aucune commande en cuisine enregistrée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors bg-[#161e2e]/10">
                    <td className="px-6 py-4 font-semibold text-slate-200 font-sans">
                      {o.itemName}
                      <span className="text-[10px] bg-slate-700/60 text-slate-300 uppercase px-1.5 py-0.5 rounded-sm ml-2 font-semibold">
                        {o.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-450">{o.location}</td>
                    <td className="px-6 py-4 font-bold text-slate-205 font-display">{o.price} $</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === OrderStatus.Preparing && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, OrderStatus.Ready)}
                            className="text-xs px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                            title="Marquer comme Prêt"
                          >
                            <Play className="w-3 h-3 fill-amber-400 text-amber-400" /> Prêt
                          </button>
                        )}

                        {o.status === OrderStatus.Ready && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, OrderStatus.Delivered)}
                            className="text-xs px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                            title="Marquer comme Livré"
                          >
                            <Check className="w-3 h-3" /> Livré
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          className="hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer la commande"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
