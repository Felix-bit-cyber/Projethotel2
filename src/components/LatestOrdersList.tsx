import React from "react";
import { Coffee, ChevronRight, Check, Trash2, Clock, CheckCircle, Flame } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface LatestOrdersListProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenNewOrderModal: () => void;
}

export default function LatestOrdersList({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onOpenNewOrderModal,
}: LatestOrdersListProps) {
  // Sort orders by most recent
  const sortedOrders = [...orders].slice(0, 6);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Preparing:
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/15",
          icon: <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
          label: "En préparation"
        };
      case OrderStatus.Ready:
        return {
          bg: "bg-sky-500/10 text-sky-400 border-sky-500/15",
          icon: <Clock className="w-3.5 h-3.5 text-sky-400" />,
          label: "Prêt"
        };
      case OrderStatus.Delivered:
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
          label: "Livré"
        };
      case OrderStatus.Cancelled:
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/15",
          icon: <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />,
          label: "Annulé"
        };
    }
  };

  return (
    <div className="bg-[#1e293b]/80 rounded-2xl shadow-lg border border-slate-800/85 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Commandes Restaurant</h3>
          <p className="text-xs text-slate-400">Commandes en salle & room service en temps réel</p>
        </div>
        <button
          onClick={onOpenNewOrderModal}
          className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all cursor-pointer shadow-xs"
        >
          Commander
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-800/50">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Aucune commande de repas enregistrée
          </div>
        ) : (
          sortedOrders.map((order) => {
            const statusConfig = getStatusStyle(order.status);
            return (
              <div key={order.id} className="py-3 flex items-center justify-between group transition-colors hover:bg-slate-800/20 px-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    order.category === "Boisson" ? "bg-cyan-500/10 text-cyan-400" : "bg-orange-500/10 text-orange-400"
                  }`}>
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 font-sans">{order.itemName}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {order.location} • <span className="capitalize">{order.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-200 font-display">{order.price} $</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusConfig.bg}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Status cycle logic actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    {order.status === OrderStatus.Preparing && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.Ready)}
                        className="p-1 hover:bg-sky-500/10 text-sky-400 rounded-lg transition-colors cursor-pointer"
                        title="Marquer comme Prêt"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {order.status === OrderStatus.Ready && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.Delivered)}
                        className="p-1 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                        title="Marquer comme Livré"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-1 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer la commande"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-[#161e2e]/50 border-t border-slate-800/80 text-[11px] text-slate-400/85 font-mono flex justify-between">
        <span>Total commandes du jour :</span>
        <span className="font-bold text-slate-300">
          {orders.reduce((sum, o) => sum + o.price, 0)} $
        </span>
      </div>
    </div>
  );
}
