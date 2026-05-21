import React, { useState } from "react";
import { Star, MessageSquarePlus, MessageSquare, Filter, Calendar, User, CheckCircle } from "lucide-react";
import { Review, ReviewCategory } from "../types";

interface ReviewsManagerProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, "id" | "date">) => void;
  recentClientNames?: string[];
}

export default function ReviewsManager({
  reviews,
  onAddReview,
  recentClientNames = []
}: ReviewsManagerProps) {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<number | "All">("All");

  // Form state
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState<ReviewCategory>(ReviewCategory.Stay);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  const catCounts = {
    [ReviewCategory.Stay]: reviews.filter((r) => r.category === ReviewCategory.Stay).length,
    [ReviewCategory.Restaurant]: reviews.filter((r) => r.category === ReviewCategory.Restaurant).length,
    [ReviewCategory.Meeting]: reviews.filter((r) => r.category === ReviewCategory.Meeting).length,
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category === selectedCategory;
    const matchRat = selectedRating === "All" || r.rating === selectedRating;
    return matchCat && matchRat;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    onAddReview({
      clientName: clientName.trim(),
      category,
      rating,
      comment: comment.trim(),
    });

    // Reset form
    setClientName("");
    setComment("");
    setRating(5);
    setCategory(ReviewCategory.Stay);
    setShowSuccessMsg(true);

    setTimeout(() => {
      setShowSuccessMsg(false);
    }, 4000);
  };

  // Helper to color badge categories
  const getCategoryBadgeClass = (cat: ReviewCategory) => {
    switch (cat) {
      case ReviewCategory.Stay:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case ReviewCategory.Restaurant:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case ReviewCategory.Meeting:
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats Summary Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b]/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
          <span className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Note Générale</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-display">{averageRating}</span>
            <span className="text-slate-500 text-sm">/ 5</span>
          </div>
          <div className="flex items-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 mt-2 font-mono">{totalReviews} avis au total</span>
        </div>

        {/* Category Breakdown widgets */}
        <div className="bg-[#1e293b]/50 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-indigo-400 font-bold">🛌 Hôtel / Séjour</span>
            <span className="font-mono bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400">
              {catCounts[ReviewCategory.Stay]}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalReviews > 0 ? (catCounts[ReviewCategory.Stay] / totalReviews) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Commentaires d'expérience de chambres</p>
        </div>

        <div className="bg-[#1e293b]/50 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-amber-400 font-bold">🍳 Restauration</span>
            <span className="font-mono bg-amber-500/10 px-2 py-0.5 rounded text-amber-400">
              {catCounts[ReviewCategory.Restaurant]}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalReviews > 0 ? (catCounts[ReviewCategory.Restaurant] / totalReviews) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Retours sur la carte de cuisine</p>
        </div>

        <div className="bg-[#1e293b]/50 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="text-teal-400 font-bold">🤝 Salles Corporate</span>
            <span className="font-mono bg-teal-500/10 px-2 py-0.5 rounded text-teal-400">
              {catCounts[ReviewCategory.Meeting]}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalReviews > 0 ? (catCounts[ReviewCategory.Meeting] / totalReviews) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Avis sur les congrès et séminaires</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left stack (2 Cols): Reviews Filters and Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1e293b]/80 border border-slate-800/85 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white font-display">Tous les avis clients</h3>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap gap-2 text-xs font-sans">
                {/* Category selectors */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-750 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">Toutes les rubriques</option>
                  <option value={ReviewCategory.Stay}>🏨 Séjour</option>
                  <option value={ReviewCategory.Restaurant}>🍳 Restauration</option>
                  <option value={ReviewCategory.Meeting}>🤝 Salles Corporate</option>
                </select>

                {/* Stars selector */}
                <select
                  value={selectedRating}
                  onChange={(e) =>
                    setSelectedRating(e.target.value === "All" ? "All" : Number(e.target.value))
                  }
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-750 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">Toutes les notes</option>
                  <option value="5">★ 5 Étoiles</option>
                  <option value="4">★ 4 Étoiles</option>
                  <option value="3">★ 3 Étoiles</option>
                  <option value="2">★ 2 Étoiles</option>
                  <option value="1">★ 1 Étoile</option>
                </select>
              </div>
            </div>

            {/* List presentation */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredReviews.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-400 text-sm">Aucun avis ne correspond à vos filtres sélectionnés.</p>
                </div>
              ) : (
                filteredReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-[#161e2e]/30 border border-slate-800/60 hover:bg-[#161e2e]/50 rounded-xl transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100 font-sans">
                            {r.clientName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeClass(
                              r.category
                            )}`}
                          >
                            {r.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {r.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic mt-2.5 font-sans leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column (1 Col): Leave a review form */}
        <div className="bg-[#1e293b]/90 border border-slate-800/85 rounded-2xl p-5 self-start text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1.5">
            <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base font-display">Laisser un avis</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
            Permettez aux clients d'enregistrer à chaud leurs retours d'expérience hôtelière.
          </p>

          {showSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Avis client enregistré avec succès ! Ajouté au tableau de bord.</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Nom du client *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex : Jean Dupont"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-505 placeholder-slate-600"
                />
                <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>
              
              {/* Quick autofill tag desk */}
              {recentClientNames.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] text-slate-500 block mb-1">Clients récents :</span>
                  <div className="flex flex-wrap gap-1">
                    {recentClientNames.slice(0, 3).map((name) => (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setClientName(name)}
                        className="text-[9px] px-2 py-0.5 rounded bg-slate-800 border border-slate-750 hover:bg-slate-700/80 transition-all text-slate-300"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Rubrique concernée</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReviewCategory)}
                className="w-full px-3 py-2 border border-slate-755 bg-slate-800 text-slate-105 rounded-lg focus:outline-none focus:border-indigo-505 cursor-pointer"
              >
                <option value={ReviewCategory.Stay}>🏨 Séjour (Hébergement)</option>
                <option value={ReviewCategory.Restaurant}>🍳 Restauration (Repas/Boisson)</option>
                <option value={ReviewCategory.Meeting}>🤝 Salles (Réunions/Congrès)</option>
              </select>
            </div>

            {/* Visual star interactive picker */}
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Évaluation *</label>
              <div className="flex items-center gap-1.5 p-2 bg-slate-800/40 border border-slate-750 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-[10px] font-mono font-bold text-amber-400">
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                    ? "Très bien"
                    : rating === 3
                    ? "Moyen"
                    : rating === 2
                    ? "Passable"
                    : "Médiocre"}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Commentaire / Avis *</label>
              <textarea
                required
                rows={4}
                placeholder="Rédigez le commentaire laissé par le passager ou le client hôtelier..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-750 bg-slate-800/40 rounded-lg text-slate-110 focus:outline-none focus:border-indigo-505 placeholder:text-slate-600 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm"
            >
              Envoyer l'Avis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
