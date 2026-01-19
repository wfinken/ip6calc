import React, { useState, useEffect } from 'react';

export function SidebarGallery({ onLoadFavorite }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('ipv6_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    const addFavorite = (item) => {
        const updated = [...favorites, item];
        setFavorites(updated);
        localStorage.setItem('ipv6_favorites', JSON.stringify(updated));
    };

    const removeFavorite = (idx) => {
        const updated = favorites.filter((_, i) => i !== idx);
        setFavorites(updated);
        localStorage.setItem('ipv6_favorites', JSON.stringify(updated));
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        FavoritesPanel: ({ currentAddress, currentCidr }) => (
            <div className="glass-card rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-3">
                    <span className="w-1 h-6 accent-bar-orange rounded-full"></span>
                    <span className="text-accent-orange">Favorite Addresses</span>
                </h2>

                <button
                    onClick={() => addFavorite({ address: currentAddress, cidr: currentCidr, note: 'Saved Item' })}
                    className="w-full mb-4 px-3 py-2 bg-yellow-600/20 text-yellow-500 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/30 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    Bookmark Current Address
                </button>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {favorites.length === 0 && (
                        <div className="text-muted text-xs italic text-center py-4">
                            No addresses bookmarked yet.
                        </div>
                    )}
                    {favorites.map((fav, idx) => (
                        <div key={idx} className="bg-main/50 p-3 rounded-lg border border-element hover:border-accent transition-colors group relative">
                            <div
                                className="cursor-pointer"
                                onClick={() => onLoadFavorite(fav.address, fav.cidr)}
                            >
                                <div className="text-primary font-mono text-xs break-all">
                                    {fav.address}/{fav.cidr}
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFavorite(idx); }}
                                className="absolute top-2 right-2 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    };
}
