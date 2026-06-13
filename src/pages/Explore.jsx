import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../components/layouts/Header';
import { useTranslation } from 'react-i18next';

const MOCK_EXPLORE_POOL = [
    { name: "Lion", characteristics: { diet: "Carnivore", lifespan: "10-14 years", habitat: "Savannah" } },
    { name: "Tiger", characteristics: { diet: "Carnivore", lifespan: "10-15 years", habitat: "Forest" } },
    { name: "Cheetah", characteristics: { diet: "Carnivore", lifespan: "10-12 years", habitat: "Savannah" } },
    { name: "Wolf", characteristics: { diet: "Carnivore", lifespan: "6-8 years", habitat: "Forests, Tundra" } },
    { name: "Elephant", characteristics: { diet: "Herbivore", lifespan: "60-70 years", habitat: "Savannah" } },
    { name: "Giraffe", characteristics: { diet: "Herbivore", lifespan: "20-25 years", habitat: "Savannah" } },
    { name: "Koala", characteristics: { diet: "Herbivore", lifespan: "13-18 years", habitat: "Eucalyptus forests" } },
    { name: "Zebra", characteristics: { diet: "Herbivore", lifespan: "20-25 years", habitat: "Grasslands" } },
    { name: "Panda", characteristics: { diet: "Omnivore", lifespan: "20 years", habitat: "Mountain forests" } },
    { name: "Bear", characteristics: { diet: "Omnivore", lifespan: "20-25 years", habitat: "Forests" } },
    { name: "Chimpanzee", characteristics: { diet: "Omnivore", lifespan: "40-50 years", habitat: "Tropical rainforest" } },
    { name: "Fox", characteristics: { diet: "Omnivore", lifespan: "3-4 years", habitat: "Diverse" } }
];

export default function Explore() {
    const navigate = useNavigate();
    const [allAnimals, setAllAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('zoozenFavorite')) || [];
        setFavorites(savedFavorites);
    }, []);

    useEffect(() => {
        const loadExploreData = async () => {
            setLoading(true);

            try {
                const promises = MOCK_EXPLORE_POOL.map(async (animal) => {
                    try {
                        const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animal.name)}`, {
                            headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY || '' }
                        });
                        const ninjaData = resNinja.ok ? await resNinja.json() : [];


                        const finalName = (ninjaData && ninjaData[0]?.name) || animal.name;

                        const finalCharacteristics = (ninjaData && ninjaData[0]?.characteristics) || animal.characteristics;
                        const finalLocations = (ninjaData && ninjaData[0]?.locations) || [animal.characteristics.habitat];
                        const displayId = (ninjaData && ninjaData[0]?.displayId) || Math.random();


                        const resUnsplash = await fetch(
                            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(finalName + " animal wildlife")}&per_page=1`,
                            { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
                        );
                        const unsplashData = resUnsplash.ok ? await resUnsplash.json() : null;
                        const imageUrl = unsplashData?.results[0]?.urls.regular || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500';

                        return {
                            id: crypto.randomUUID(),
                            displayId: displayId,
                            name: finalName,
                            diet: finalCharacteristics?.diet || animal.characteristics.diet,
                            lifespan: finalCharacteristics?.lifespan || "Unknown",
                            habitat: finalCharacteristics?.habitat || "Unknown",
                            characteristics: finalCharacteristics,
                            locations: finalLocations,
                            image: imageUrl
                        };
                    } catch (err) {
                        return {
                            id: crypto.randomUUID(),
                            displayId: Math.random(),
                            name: animal.name,
                            diet: animal.characteristics.diet,
                            lifespan: animal.characteristics.lifespan,
                            habitat: animal.characteristics.habitat,
                            characteristics: animal.characteristics,
                            locations: [animal.characteristics.habitat],
                            image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500'
                        };
                    }
                });

                const results = await Promise.all(promises);
                setAllAnimals(results);
            } catch (error) {
                console.error("Erreur d'exploration :", error);
            } finally {
                setLoading(false);
            }
        };

        loadExploreData();
    }, []);

    const carnivores = allAnimals.filter(a => a.diet?.toLowerCase() === 'carnivore');
    const herbivores = allAnimals.filter(a => a.diet?.toLowerCase() === 'herbivore');
    const omnivores = allAnimals.filter(a => a.diet?.toLowerCase() === 'omnivore');

    // 1. GESTION DES FAVORIS UNIQUEMENT
    const handleToggleFavorite = (animal, e) => {
        e.preventDefault();
        e.stopPropagation(); // Empêche de déclencher le Link parent
        let savedFavorites = JSON.parse(localStorage.getItem('zoozenFavorite')) || [];
        const isFav = savedFavorites.some(fav => fav.name.toLowerCase() === animal.name.toLowerCase());

        if (isFav) {
            savedFavorites = savedFavorites.filter(fav => fav.name.toLowerCase() !== animal.name.toLowerCase());
        } else {
            const newFavorite = {
                name: animal.name,
                imageDeFond: animal.image,
                characteristics: animal.characteristics,
                locations: animal.locations,
                displayId: animal.displayId || Math.random(),
                viewedAt: new Date().getTime()
            };
            savedFavorites.push(newFavorite);
        }

        localStorage.setItem('zoozenFavorite', JSON.stringify(savedFavorites));
        setFavorites(savedFavorites);
    };

    // 2. GESTION DE L'HISTORIQUE ET REDIRECTION VERS /SEARCH
    const handleAddToHistoryAndNavigate = (animal, e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/search', { state: { autoSearchQuery: animal.name } });
    };

    const saveAnimalToCardHistory = (animal) => {
        let savedHistory = JSON.parse(localStorage.getItem('zoozenHistory')) || [];

        const newEntry = {
            name: animal.name,
            imageDeFond: animal.image,
            characteristics: animal.characteristics,
            locations: animal.locations,
            displayId: animal.displayId,
            viewedAt: new Date().getTime()
        };

        savedHistory = savedHistory.filter(hist => hist.name.toLowerCase() !== animal.name.toLowerCase());
        savedHistory.unshift(newEntry);

        localStorage.setItem('zoozenHistory', JSON.stringify(savedHistory));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zoo-dark text-stone-800 transition-all duration-300">
            <Header />
            <div className="max-w-325 mx-auto space-y-12 p-4">

                <header className="text-center space-y-3 max-w-3xl mx-auto pt-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-zoo-green/80 text-emerald-800 dark:text-zoo-dark rounded-full text-xs font-semibold tracking-wide uppercase">
                        <Icon icon="lucide:sparkles" className="w-4 h-4 animate-pulse" /> Écosystèmes Globaux
                    </div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
                        Le Hub de la Biodiversité
                    </h1>
                    <p className="text-stone-600 dark:text-stone-200 text-sm">
                        Découvrez les espèces du monde entier triées sur le volet selon leur comportement biologique et leur chaîne trophique.
                    </p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-8 h-8 border-4 border-zoo-green border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-stone-500 dark:text-stone-200 text-sm ">Cartographie du règne animal en cours...</p>
                    </div>
                ) : (
                    <div className="space-y-16">

                        {carnivores.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between border-b border-red-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-red-400/10 text-red-600 rounded-xl">
                                            <Icon icon="mdi:bone" className="text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-[20px] capitalize font-bold text-stone-900 dark:text-white">{t('header.carnivorous')}</h2>
                                            <p className="text-xs text-stone-400 font-medium">Super-prédateurs et chasseurs agiles</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-red-500/5 text-red-400 font-mono text-xs font-bold rounded-full border ">
                                        {carnivores.length} espèces actives
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {carnivores.map(animal => (
                                        <Link
                                            key={animal.id}
                                            to={`/animal/${(animal.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}
                                            state={{ imageUrl: animal.image }}
                                            className="decoration-0 block"
                                            onClick={() => saveAnimalToCardHistory(animal)}
                                        >
                                            <ExploreCard
                                                animal={animal}
                                                isFavorite={favorites.some(f => f.name.toLowerCase() === animal.name.toLowerCase())}
                                                onToggleFavorite={handleToggleFavorite}
                                                onNavigate={() => handleAddToHistoryAndNavigate(animal.name)}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Section Herbivores */}
                        {herbivores.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-400/10 text-emerald-600 rounded-xl">
                                            <Icon icon="ph:leaf-bold" className="text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-[20px] capitalize font-bold text-stone-900 dark:text-white">{t('header.herbivorous')}</h2>
                                            <p className="text-xs text-stone-400 font-medium">Gardiens des plaines et des forêts végétales</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/5 text-emerald-500 font-mono text-xs font-bold rounded-full border">
                                        {herbivores.length} espèces actives
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {herbivores.map(animal => (
                                        <Link
                                            key={animal.id}
                                            to={`/animal/${(animal.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}
                                            state={{ imageUrl: animal.image }}
                                            className="decoration-0 block"
                                            onClick={() => saveAnimalToCardHistory(animal)}
                                        >
                                            <ExploreCard
                                                animal={animal}
                                                isFavorite={favorites.some(f => f.name.toLowerCase() === animal.name.toLowerCase())}
                                                onToggleFavorite={handleToggleFavorite}
                                                onNavigate={handleAddToHistoryAndNavigate}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Section Omnivores */}
                        {omnivores.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-amber-400/10 text-amber-500 rounded-xl">
                                            <Icon icon="fluent:food-apple-24-filled" className="text-2xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-[20px] capitalize font-bold text-stone-900 dark:text-white">{t('header.omnivorous')}</h2>
                                            <p className="text-xs text-stone-400 font-medium">Alimentation mixte et grande adaptabilité</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-400/5 text-amber-500 font-mono text-xs font-bold rounded-full border">
                                        {omnivores.length} espèces actives
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {omnivores.map(animal => (
                                        <Link
                                            key={animal.id}
                                            to={`/animal/${(animal.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}
                                            state={{ imageUrl: animal.image }}
                                            className="decoration-0 block"
                                            onClick={() => saveAnimalToCardHistory(animal)}
                                        >
                                            <ExploreCard
                                                animal={animal}
                                                isFavorite={favorites.some(f => f.name.toLowerCase() === animal.name.toLowerCase())}
                                                onToggleFavorite={handleToggleFavorite}
                                                onNavigate={handleAddToHistoryAndNavigate}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ExploreCard({ animal, isFavorite, onToggleFavorite, onNavigate }) {
    return (
        <div className="bg-white dark:bg-zoo-dark dark:text-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-100 dark:border-stone-100/20 transition-all duration-300 flex flex-col group relative">

            <div className="h-44 overflow-hidden relative bg-stone-100 dark:bg-black/30">
                <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />

                <button
                    onClick={(e) => onNavigate(animal, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/90 dark:text-white text-stone-700 hover:bg-emerald-800 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm"
                    title="En savoir plus"
                >
                    <Icon icon="lucide:arrow-up-right" width="16" />
                </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-stone-800 dark:text-white capitalize truncate">{animal.name}</h3>
                        <button
                            onClick={(e) => onToggleFavorite(animal, e)}
                            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors text-red-500 shrink-0"
                            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                            <Icon icon={isFavorite ? "ph:heart-fill" : "ph:heart"} width="22" className="transition-transform active:scale-75" />
                        </button>
                    </div>
                    <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                        <Icon icon="ph:map-pin-fill" className="text-[14px]" />
                        <span className="truncate">{animal.habitat}</span>
                    </p>
                </div>
                <div className="pt-2 border-t border-stone-50 dark:border-stone-50/20 flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-300">
                    <span className="font-medium">Espérance de vie :</span>
                    <span className="font-semibold text-stone-700 dark:text-neutral-400">{animal.lifespan}</span>
                </div>
            </div>
        </div>
    );
}