import { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";

interface Card {
  id: string;
  name: string;
  imageUrl?: string;
  type?: string;
}

const SkeletonCard = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="w-full h-64 bg-gray-300 dark:bg-gray-600" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
    </div>
  </div>
);

const CardSearch = () => {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Auto-apply dark mode on load
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  const searchCards = async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      setCards(data.cards);
    } catch (err) {
      console.error(err);
      setCards([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        searchCards(query);
      } else {
        setCards([]);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-gray-200 to-white dark:from-purple-950 dark:via-gray-900 dark:to-black text-black dark:text-white transition-colors duration-300 px-4 py-8">
      {/* Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
      >
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Search Bar */}
      <div className="w-full max-w-xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-6 drop-shadow-md">
          🔍 Magic Card Search
        </h1>
        <input
          type="text"
          placeholder="Enter card name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && cards.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
          {cards
            .filter((card) => card.imageUrl)
            .slice(0, 20)
            .map((card) => (
              <Tilt
                key={card.id}
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="all"
                scale={1.05}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                transitionSpeed={500}
                className="rounded-xl cursor-pointer"
              >
                <div
                  onClick={() => setSelectedCard(card)}
                  className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-lg"
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-bold text-lg">{card.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {card.type}
                    </p>
                  </div>
                </div>
              </Tilt>
            ))}
        </div>
      )}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedCard(null)} // close on background click
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal itself
          >
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>

            {selectedCard.imageUrl && (
              <img
                src={selectedCard.imageUrl}
                alt={selectedCard.name}
                className="w-full rounded-lg mb-4"
              />
            )}

            <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Type:</strong> {selectedCard.type || "Unknown"}
            </p>
            {/* Add more fields here if needed, like rarity, set, text, etc. */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSearch;
