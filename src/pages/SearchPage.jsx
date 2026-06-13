import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { GoogleGenAI } from '@google/genai';
import Header from '../components/layouts/Header';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Footer from '../components/layouts/Footer';

const LOCAL_ANIMALS_MOCK = [
    { name: "Lion", characteristics: { diet: "Carnivore", lifespan: "10-14 years", weight: "120kg-250kg", habitat: "Savannah" } },
    { name: "Tiger", characteristics: { diet: "Carnivore", lifespan: "10-15 years", weight: "65kg-310kg", habitat: "Forest" } },
    { name: "Elephant", characteristics: { diet: "Herbivore", lifespan: "60-70 years", weight: "3,000kg-6,000kg", habitat: "Rainforest, Savannah" } },
    { name: "Giraffe", characteristics: { diet: "Herbivore", lifespan: "20-25 years", weight: "800kg-1,200kg", habitat: "Savannah" } },
    { name: "Panda", characteristics: { diet: "Omnivore", lifespan: "20 years", weight: "70kg-120kg", habitat: "Mountain forests" } },
    { name: "Bear", characteristics: { diet: "Omnivore", lifespan: "20-25 years", weight: "80kg-600kg", habitat: "Forests, Tundra" } }
];

const SEARCH_POOL = ["Lion", "Tiger", "Elephant", "Giraffe", "Panda", "Bear", "Cheetah", "Wolf", "Fox", "Eagle"];

const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function SearchPage() {

    const [query, setQuery] = useState("");
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState("All");


    const [historyList, setHistoryList] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });


    const location = useLocation();

    useEffect(() => {
        if (location.state?.autoSearchQuery) {
            const queryFromHistory = location.state.autoSearchQuery;
            setQuery(queryFromHistory);

            setLoading(true);
            fetchAnimalData(queryFromHistory).then(result => {
                setAnimals(result);
                setLoading(false);
            });
        }
    }, [location.state]);


    useEffect(() => {
        const fetchInitialAnimals = async () => {
            setLoading(true);
            try {
                const selectedNames = [...SEARCH_POOL]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 8);

                const results = await Promise.all(selectedNames.map(name => fetchAnimalData(name)));
                setAnimals(results.flat());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialAnimals();
    }, []);

    const fetchAnimalData = async (animalName) => {

        // return;

        try {
            const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animalName)}`, {
                headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
            });
            let ninjaData = resNinja.ok ? await resNinja.json() : [];

            if (!Array.isArray(ninjaData) || ninjaData.length === 0) {
                const localMatches = LOCAL_ANIMALS_MOCK.filter(a => a.name.toLowerCase().includes(animalName.toLowerCase()));
                ninjaData = localMatches.length > 0 ? localMatches : [];
            }

            if (ninjaData.length === 0) {
                return [];
            }

            const completeAnimalsList = await Promise.all(ninjaData.map(async (animal) => {
                try {
                    const resUnsplash = await fetch(
                        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(animal.name + " animal wildlife")}&per_page=1`,
                        { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
                    );
                    const unsplashData = resUnsplash.ok ? await resUnsplash.json() : null;
                    const imageUrl = unsplashData?.results[0]?.urls.regular || 'https://images.unsplash.com/';

                    return {
                        ...animal,
                        id: crypto.randomUUID(),
                        image: imageUrl,
                        characteristics: animal.characteristics || {}
                    };
                } catch (err) {
                    return {
                        ...animal,
                        id: crypto.randomUUID(),
                        image: 'https://images.unsplash.com/',
                        characteristics: animal.characteristics || {}
                    };
                }
            }));

            return completeAnimalsList;

        } catch (error) {
            console.error('erreur: ', error);
            return [];
        }
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        const searchName = query.trim();
        saveToHistory(searchName);

        const result = await fetchAnimalData(searchName);
        setAnimals(result);
        setLoading(false);
    };


    const handleImageSearch = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            const imagePart = await fileToGenerativePart(file);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    imagePart,
                    "Identify the animal in this picture. Answer ONLY with its common name in English and in one word, nothing else. No punctuation, no sentences. Example: Lion"
                ],
            });

            const detectedAnimal = response.text.trim();

            if (detectedAnimal) {
                setQuery(detectedAnimal);
                saveToHistory(detectedAnimal);
                const result = await fetchAnimalData(detectedAnimal);
                setAnimals(result);
            } else {
                alert("Impossible d'identifier l'animal sur cette image.");
            }
        } catch (error) {
            console.error("Erreur lors de l'analyse de l'image :", error);
            alert("Une erreur est survenue lors de l'analyse de l'image.");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };


    const saveToHistory = (name) => {
        const cleanHistory = historyList.filter(item => item.toLowerCase() !== name.toLowerCase());
        const newHistory = [name, ...cleanHistory].slice(0, 10);

        setHistoryList(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };


    const deleteSingleHistory = (nameToDelete, e) => {
        e.stopPropagation();
        const updated = historyList.filter(item => item !== nameToDelete);
        setHistoryList(updated);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    };


    const deleteAllHistoric = () => {
        if (window.confirm("Voulez-vous vraiment effacer tout votre historique ?")) {
            setHistoryList([]);
            localStorage.removeItem('searchHistory');
        }
    };

    const handleHistoryClick = async (name) => {
        setQuery(name);
        setLoading(true);
        const result = await fetchAnimalData(name);
        setAnimals(result);
        setLoading(false);
    };


    const saveAnimalToCardHistory = (animal) => {

        const historyStorage = localStorage.getItem('zoozenHistory');
        let currentHistory = historyStorage ? JSON.parse(historyStorage) : [];


        const newEntry = {
            name: animal.name,
            imageDeFond: animal.image,
            characteristics: animal.characteristics,
            locations: animal.locations,
            displayId: animal.displayId || Math.random(),
            viewedAt: new Date().getTime()
        };

        currentHistory = currentHistory.filter(item => item.name !== animal.name);

        const updatedHistory = [newEntry, ...currentHistory];

        const limitedHistory = updatedHistory.slice(0, 90);

        localStorage.setItem('zoozenHistory', JSON.stringify(limitedHistory));

    };

    const filteredAnimals = animals.filter(animal => {
        if (selectedDiet === "All") return true;
        const animalDiet = animal.characteristics?.diet;
        if (!animalDiet) return false;
        return animalDiet.toLowerCase() === selectedDiet.toLowerCase();
    });

    return (
        <div className="bg-white dark:bg-zoo-dark dark:text-white text-zoo-dark transition-all duration-300">
            <Header />

            <div className="max-w-6xl mx-auto space-y-8 mb-10 px-2">
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto my-10 shadow-sm rounded-full bg-white dark:bg-zoo-dark border border-gray-300 focus-within:ring-2 focus-within:border-0 focus-within:ring-zoo-green transition-all flex items-center pr-2 pl-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher un animal par écrit ou par image..."
                        className="w-full py-3.5 outline-none text-zoo-dark dark:text-white bg-transparent pr-4"
                    />

                    <div className="flex items-center gap-2">
                        <label className="p-2.5 rounded-full text-stone-400 hover:text-emerald-500 hover:bg-stone-100 transition-all cursor-pointer flex items-center justify-center">
                            <Icon icon="lucide:camera" className="text-[20px]" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSearch}
                                className="hidden"
                            />
                        </label>

                        <button type="submit" className="bg-zoo-green hover:bg-emerald-800 text-black p-2.5 rounded-full transition-colors flex items-center justify-center">
                            <Icon icon='lucide:search' className='text-[18px]' />
                        </button>
                    </div>
                </form>


                {historyList.length > 0 && (
                    <div className="bg-white dark:bg-black/50 p-4 transition-all duration-300 rounded-xl shadow-sm max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-200 flex items-center gap-1">Recent Searches</span>
                            <button onClick={deleteAllHistoric} className="cursor-pointer text-xs text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium">
                                <Icon icon='material-symbols:delete' className='text-[18px]' />
                                Clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {historyList.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleHistoryClick(item)}
                                    className="group flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-zoo-dark hover:bg-emerald-50 dark:hover:bg-zoo-dark text-stone-600 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-200 rounded-full text-sm cursor-pointer transition-all border border-transparent hover:border-emerald-200"
                                >
                                    <span>{item}</span>
                                    <span onClick={(e) => deleteSingleHistory(item, e)} className="text-stone-400 dark:text-stone-600 hover:text-red-400 p-0.5 rounded-full transition-colors">
                                        <Icon icon={'material-symbols:close-rounded'} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <div className="flex justify-center flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
                    {["All", "Carnivore", "Herbivore", "Omnivore"].map((diet) => (
                        <button
                            key={diet}
                            onClick={() => setSelectedDiet(diet)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDiet === diet
                                ? "bg-zoo-green text-black shadow-sm"
                                : "bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-black/60 border border-stone-200"
                                }`}
                        >
                            {diet}
                        </button>
                    ))}
                </div>


                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-stone-400 text-sm animate-pulse">Analyse de l'environnement en cours...</p>
                    </div>
                ) : filteredAnimals.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-zoo-dark text-stone-400 dark:text-white transition-all duration-300 rounded-2xl border border-dashed border-stone-300">
                        <p className="font-medium">Aucun animal ne correspond à ce nom.</p>
                        <p className="text-xs mt-1">Veuillez entrer un mot clé ou réinitialisez les filtres.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredAnimals.map((animal) => (
                            <Link
                                key={animal.id}
                                to={`/animal/${(animal.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}
                                state={{ imageUrl: animal.image }}
                                className="decoration-0"
                                onClick={() => saveAnimalToCardHistory(animal)}
                            >
                                <AnimalCard animal={animal} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>


            <Footer />


        </div>


    );
}










function AnimalCard({ animal }) {
    const [isFav, setIsFav] = useState(() => {
        const savedFavs = localStorage.getItem('zoozenFavorite');
        if (!savedFavs) return false;
        const favsArray = JSON.parse(savedFavs);
        return favsArray.some(fav => fav.name.toLowerCase() === animal.name.toLowerCase());
    });

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const savedFavs = localStorage.getItem('zoozenFavorite');
        let favsArray = savedFavs ? JSON.parse(savedFavs) : [];

        if (isFav) {
            favsArray = favsArray.filter(fav => fav.name.toLowerCase() !== animal.name.toLowerCase());
        } else {
            const favAnimal = {
                name: animal.name,
                imageDeFond: animal.image,
                characteristics: animal.characteristics,
                locations: animal.locations,
                displayId: animal.displayId || Math.random(),
                viewedAt: new Date().getTime()

            };
            favsArray.push(favAnimal);
        }

        localStorage.setItem('zoozenFavorite', JSON.stringify(favsArray));
        setIsFav(!isFav);
    };

    return (
        <div className="bg-white dark:bg-zoo-dark rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all duration-300 group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative bg-stone-200">
                <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                <button
                    onClick={toggleFavorite}
                    className={`absolute top-3 right-3 p-2 cursor-pointer rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors flex items-center justify-center hover:text-red-500 ${isFav ? 'text-red-500' : 'text-stone-600'
                        }`}
                >
                    <Icon
                        icon={isFav ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'}
                        className="text-[18px] text-current"
                    />
                </button>

                {animal.characteristics?.diet && (
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-stone-900/60 backdrop-blur-sm text-white tracking-wide uppercase">
                        {animal.characteristics.diet}
                    </span>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 dark:text-white capitalize mb-1">{animal.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-stone-100 pt-3 text-stone-500 dark:text-white">
                    <div>
                        <span className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-gray-400">Lifespan</span>
                        <span className="font-medium text-stone-700 dark:text-white">{animal.characteristics?.lifespan || "Unknown"}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-gray-400">Location</span>
                        <span className="font-medium text-stone-700 truncate block dark:text-white">{animal.characteristics?.location || "Unknown"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}