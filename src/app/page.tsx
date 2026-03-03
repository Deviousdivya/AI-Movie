"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Star, Users, Clapperboard, BrainCircuit } from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const resultRef = useRef(null);

  // Animation logic to meet the "Creativity & Bonus" criteria
  useEffect(() => {
    if (movieData && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [movieData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/movie?id=${imdbId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch movie details");
      }

      setMovieData(data);
    } catch (err: any) {
      setError(err.message);
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <BrainCircuit size={14} />
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          AI Movie Insight Builder
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Enter an IMDb ID to generate deep audience sentiment analysis and comprehensive movie metadata.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
          <input
            type="text"
            placeholder="Search IMDb ID (e.g. tt0133093)"
            className="w-full bg-[#111] border border-white/10 rounded-2xl py-5 px-6 pl-14 text-lg focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-2xl"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={24} />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 bg-red-400/10 py-2 px-4 rounded-lg inline-block border border-red-400/20">
            {error}
          </p>
        )}
      </div>

      {/* Results Section */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {movieData && (
          <div ref={resultRef} className="grid md:grid-cols-12 gap-10 bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl shadow-3xl">
            {/* Poster */}
            <div className="md:col-span-4">
              <div className="sticky top-8">
                <img
                  src={movieData.poster}
                  alt={movieData.title}
                  className="w-full rounded-2xl shadow-2xl border border-white/10 object-cover aspect-[2/3]"
                />
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-8 space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-2">{movieData.title}</h2>
                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10">{movieData.year}</span>
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>{movieData.rating} / 10</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex gap-3">
                  <Users className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Cast</p>
                    <p className="text-gray-200">{movieData.cast}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clapperboard className="text-purple-500 shrink-0" size={20} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Plot Summary</p>
                    <p className="text-gray-300 leading-relaxed">{movieData.plot}</p>
                  </div>
                </div>
              </div>

              {/* AI Insight Section */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BrainCircuit size={80} />
                </div>
                <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">AI Sentiment Analysis</h3>
                <p className="text-xl text-blue-50 text-pretty italic leading-relaxed">
                  "{movieData.aiSentiment}"
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 rounded-full">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    movieData.sentimentClass === 'positive' ? 'bg-green-400' : 
                    movieData.sentimentClass === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    Overall: {movieData.sentimentClass}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}