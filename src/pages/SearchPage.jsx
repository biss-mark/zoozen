// import React, { useState, useEffect } from 'react';
// import { Icon } from '@iconify/react';
// import logoImg from '../assets/zoo-dark.png';
// // import { Search, Trash2, Heart, Sparkles, Filter } from 'lucide-react';

// // Liste de secours locale si l'API Ninjas est bloquée (Quota)
// const LOCAL_ANIMALS_MOCK = [
//     { name: "Lion", characteristics: { diet: "Carnivore", lifespan: "10-14 years", weight: "120kg-250kg", habitat: "Savannah" } },
//     { name: "Tiger", characteristics: { diet: "Carnivore", lifespan: "10-15 years", weight: "65kg-310kg", habitat: "Forest" } },
//     { name: "Elephant", characteristics: { diet: "Herbivore", lifespan: "60-70 years", weight: "3,000kg-6,000kg", habitat: "Rainforest, Savannah" } },
//     { name: "Giraffe", characteristics: { diet: "Herbivore", lifespan: "20-25 years", weight: "800kg-1,200kg", habitat: "Savannah" } },
//     { name: "Panda", characteristics: { diet: "Omnivore", lifespan: "20 years", weight: "70kg-120kg", habitat: "Mountain forests" } },
//     { name: "Bear", characteristics: { diet: "Omnivore", lifespan: "20-25 years", weight: "80kg-600kg", habitat: "Forests, Tundra" } }
// ];

// // Liste de piochage de base (en anglais pour l'API)
// const SEARCH_POOL = ["Lion", "Tiger", "Elephant", "Giraffe", "Panda", "Bear", "Cheetah", "Wolf", "Fox", "Eagle"];

// export default function SearchPage() {
//     // ---- ÉTATS (STATES) ----
//     const [query, setQuery] = useState("");
//     const [animals, setAnimals] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedDiet, setSelectedDiet] = useState("All");

//     // Initialisation de l'historique depuis le localStorage
//     const [historyList, setHistoryList] = useState(() => {
//         const saved = localStorage.getItem('searchHistory');
//         return saved ? JSON.parse(saved) : [];
//     });

//     // ---- EFFECT : Chargement initial (8 animaux aléatoires) ----
//     useEffect(() => {
//         // Décommente la ligne suivante pour bloquer les appels API et économiser ton quota
//         // return;

//         const fetchInitialAnimals = async () => {
//             setLoading(true);
//             try {
//                 const selectedNames = [...SEARCH_POOL]
//                     .sort(() => 0.5 - Math.random())
//                     .slice(0, 8);

//                 const results = await Promise.all(selectedNames.map(name => fetchAnimalData(name)));
//                 setAnimals(results);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInitialAnimals();
//     }, []);

//     // ---- FONCTION : Appel API combiné (Ninja + Unsplash) ----
//     const fetchAnimalData = async (animalName) => {
//         try {
//             // 1. API Ninjas
//             const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animalName)}`, {
//                 headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
//             });
//             let ninjaData = resNinja.ok ? await resNinja.json() : [];

//             const facts = (Array.isArray(ninjaData) && ninjaData.length > 0)
//                 ? ninjaData[0]
//                 : LOCAL_ANIMALS_MOCK.find(a => a.name.toLowerCase() === animalName.toLowerCase()) || {
//                     name: animalName,
//                     characteristics: { diet: "Unknown", lifespan: "Unknown", weight: "Unknown" }
//                 };

//             // 2. API Unsplash
//             const resUnsplash = await fetch(
//                 `https://api.unsplash.com/search/photos?query=${encodeURIComponent(facts.name + " animal wildlife")}&per_page=1`,
//                 { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
//             );
//             const unsplashData = resUnsplash.ok ? await resUnsplash.json() : null;
//             const imageUrl = unsplashData?.results[0]?.urls.regular || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500';

//             return {
//                 ...facts,
//                 id: crypto.randomUUID(),
//                 displayName: animalName,
//                 image: imageUrl,
//                 characteristics: facts.characteristics || {}
//             };
//         } catch (error) {
//             console.log('erreur: ', error);

//             return {
//                 id: crypto.randomUUID(),
//                 name: animalName,
//                 image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500',
//                 characteristics: { diet: "Unknown" }
//             };
//         }
//     };

//     // ---- GESTION DE LA RECHERCHE ----
//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!query.trim()) return;

//         setLoading(true);
//         const searchName = query.trim();

//         // Ajout à l'historique sans doublons
//         if (!historyList.includes(searchName)) {
//             const newHistory = [searchName, ...historyList].slice(0, 10); // Max 10 éléments
//             setHistoryList(newHistory);
//             localStorage.setItem('searchHistory', JSON.stringify(newHistory));
//         }

//         const result = await fetchAnimalData(searchName);
//         setAnimals([result]); // Remplace la liste par le résultat unique
//         setLoading(false);
//     };

//     // ---- GESTION DE L'HISTORIQUE ----
//     const deleteSingleHistory = (nameToDelete, e) => {
//         e.stopPropagation(); // Évite de déclencher la recherche en cliquant sur la croix
//         const updated = historyList.filter(item => item !== nameToDelete);
//         setHistoryList(updated);
//         localStorage.setItem('searchHistory', JSON.stringify(updated));
//     };

//     const deleteAllHistoric = () => {
//         if (window.confirm("Voulez-vous vraiment effacer tout votre historique ?")) {
//             setHistoryList([]);
//             localStorage.removeItem('searchHistory');
//         }
//     };

//     const handleHistoryClick = async (name) => {
//         setQuery(name);
//         setLoading(true);
//         const result = await fetchAnimalData(name);
//         setAnimals([result]);
//         setLoading(false);
//     };

//     // ---- FILTRAGE CÔTÉ CLIENT (DIET) ----
//     const filteredAnimals = animals.filter(animal => {
//         if (selectedDiet === "All") return true;
//         return animal.characteristics?.diet?.toLowerCase() === selectedDiet.toLowerCase();
//     });

//     return (
//         <div className="min-h-screen bg-stone-50 text-stone-800 p-6 font-sans">
//             <div className="max-w-6xl mx-auto space-y-8">

//                 {/* 1. Header Zen */}
//                 <header className="text-center space-y-2">
//                     {/* 2. Barre de Recherche Principale */}
//                     <form onSubmit={handleSearch} className="relative max-w-xl mx-auto shadow-sm rounded-full overflow-hidden bg-white border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
//                         <input
//                             type="text"
//                             value={query}
//                             onChange={(e) => setQuery(e.target.value)}
//                             placeholder="Rechercher un animal (ex: Lion, Elephant...)"
//                             className="w-full pl-6 pr-14 py-3.5 outline-none text-stone-700 placeholder-stone-400"
//                         />
//                         <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-full transition-colors">
//                             <Icon icon={'lucide:search'} className='text-[18px]' />
//                             search
//                         </button>
//                     </form>
//                 </header>
//                 {/* 3. Section Historique de Recherche */}
//                 {historyList.length > 0 && (
//                     <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm max-w-3xl mx-auto">
//                         <div className="flex justify-between items-center mb-3">
//                             <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">Recent Searches</span>
//                             <button onClick={deleteAllHistoric} className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 font-medium">
//                                 <Icon icon={'material-symbols:delete'} className='text-[18px]' />
//                                 Clear all
//                             </button>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             {historyList.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     onClick={() => handleHistoryClick(item)}
//                                     className="group flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 rounded-full text-sm cursor-pointer transition-all border border-transparent hover:border-emerald-200"
//                                 >
//                                     <span>{item}</span>
//                                     <span onClick={(e) => deleteSingleHistory(item, e)} className="text-stone-400 group-hover:text-red-500 p-0.5 rounded-full hover:bg-stone-200 transition-colors">&times;</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* 4. Barre de Filtres de Catégories (Diet) */}
//                 <div className="flex justify-center items-center gap-2 border-b border-stone-200 pb-4">
//                     {/* <Filter size={14} className="text-stone-400" /> */}
//                     <Icon icon={'material-symbols:filter-list'} className='text-[18px]' />
//                     filter
//                     {["All", "Carnivore", "Herbivore", "Omnivore"].map((diet) => (
//                         <button
//                             key={diet}
//                             onClick={() => setSelectedDiet(diet)}
//                             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDiet === diet
//                                 ? "bg-emerald-800 text-white shadow-sm"
//                                 : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200"
//                                 }`}
//                         >
//                             {diet}
//                         </button>
//                     ))}
//                 </div>

//                 {/* 5. Zone de Contenu Principale */}
//                 {loading ? (
//                     <div className="flex flex-col items-center justify-center py-20 space-y-3">
//                         <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
//                         <p className="text-stone-400 text-sm animate-pulse">Chargement de la faune sauvage...</p>
//                     </div>
//                 ) : filteredAnimals.length === 0 ? (
//                     <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
//                         <p className="text-stone-400 font-medium">Aucun animal ne correspond aux critères actuels.</p>
//                         <p className="text-xs text-stone-400 mt-1">Essayez une autre recherche ou réinitialisez les filtres.</p>
//                     </div>
//                 ) : (
//                     /* Grille de Cartes d'Animaux */
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {filteredAnimals.map((animal) => (
//                             <AnimalCard key={animal.id} animal={animal} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // ---- COMPOSANT INTERNE : Carte d'animal interactive ----
// function AnimalCard({ animal }) {
//     const [isFav, setIsFav] = useState(false);

//     return (
//         <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-100 transition-all duration-300 flex flex-col group">
//             {/* Image Zone */}
//             <div className="h-48 overflow-hidden relative bg-stone-200">
//                 <img
//                     src={animal.image}
//                     alt={animal.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     loading="lazy"
//                 />
//                 {/* Bouton Favori flottant */}
//                 <button
//                     onClick={() => setIsFav(!isFav)}
//                     className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-stone-600 hover:text-red-500 transition-colors"
//                 >
//                     blood
//                     {/* <Heart size={16} fill={isFav ? "#ef4444" : "none"} className={isFav ? "text-red-500" : ""} /> */}
//                     <Icon icon={'material-symbols:favorite'} className='text-[18px]' />
//                 </button>
//                 {/* Badge Diet */}
//                 {animal.characteristics?.diet && (
//                     <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-stone-900/60 backdrop-blur-sm text-white tracking-wide uppercase">
//                         {animal.characteristics.diet}
//                     </span>
//                 )}
//             </div>

//             {/* Informations Zone */}
//             <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
//                 <div>
//                     <h3 className="text-xl font-serif font-bold text-stone-800 capitalize mb-1">{animal.name}</h3>
//                     <p className="text-xs font-mono text-stone-400 tracking-tight">ID: {animal.id.slice(0, 8)}</p>
//                 </div>

//                 {/* Caractéristiques */}
//                 <div className="grid grid-cols-2 gap-2 text-xs border-t border-stone-100 pt-3 text-stone-500">
//                     <div>
//                         <span className="block text-[10px] uppercase font-semibold text-stone-400">Lifespan</span>
//                         <span className="font-medium text-stone-700">{animal.characteristics?.lifespan || "Unknown"}</span>
//                     </div>
//                     <div>
//                         <span className="block text-[10px] uppercase font-semibold text-stone-400">Weight</span>
//                         <span className="font-medium text-stone-700 truncate block">{animal.characteristics?.weight || "Unknown"}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }






















import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import logoImg from '../assets/zoo-dark.png';
// 1. Importer le client Google Gen AI
import { GoogleGenAI } from '@google/genai';

// Liste de secours locale si l'API Ninjas est bloquée (Quota)
const LOCAL_ANIMALS_MOCK = [
    { name: "Lion", characteristics: { diet: "Carnivore", lifespan: "10-14 years", weight: "120kg-250kg", habitat: "Savannah" } },
    { name: "Tiger", characteristics: { diet: "Carnivore", lifespan: "10-15 years", weight: "65kg-310kg", habitat: "Forest" } },
    { name: "Elephant", characteristics: { diet: "Herbivore", lifespan: "60-70 years", weight: "3,000kg-6,000kg", habitat: "Rainforest, Savannah" } },
    { name: "Giraffe", characteristics: { diet: "Herbivore", lifespan: "20-25 years", weight: "800kg-1,200kg", habitat: "Savannah" } },
    { name: "Panda", characteristics: { diet: "Omnivore", lifespan: "20 years", weight: "70kg-120kg", habitat: "Mountain forests" } },
    { name: "Bear", characteristics: { diet: "Omnivore", lifespan: "20-25 years", weight: "80kg-600kg", habitat: "Forests, Tundra" } }
];

const SEARCH_POOL = ["Lion", "Tiger", "Elephant", "Giraffe", "Panda", "Bear", "Cheetah", "Wolf", "Fox", "Eagle"];

// Fonction utilitaire pour convertir un fichier en Base64 pour Gemini
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
    // ---- ÉTATS (STATES) ----
    const [query, setQuery] = useState("");
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState("All");

    const [historyList, setHistoryList] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    // ---- EFFECT : Chargement initial ----
    useEffect(() => {
        const fetchInitialAnimals = async () => {
            setLoading(true);
            try {
                const selectedNames = [...SEARCH_POOL]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 8);

                const results = await Promise.all(selectedNames.map(name => fetchAnimalData(name)));
                setAnimals(results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialAnimals();
    }, []);

    // ---- FONCTION : Appel API combiné (Ninja + Unsplash) ----
    const fetchAnimalData = async (animalName) => {
        try {
            const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(animalName)}`, {
                headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
            });
            let ninjaData = resNinja.ok ? await resNinja.json() : [];

            const facts = (Array.isArray(ninjaData) && ninjaData.length > 0)
                ? ninjaData[0]
                : LOCAL_ANIMALS_MOCK.find(a => a.name.toLowerCase() === animalName.toLowerCase()) || {
                    name: animalName,
                    characteristics: { diet: "Unknown", lifespan: "Unknown", weight: "Unknown" }
                };

            const resUnsplash = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(facts.name + " animal wildlife")}&per_page=1`,
                { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
            );
            const unsplashData = resUnsplash.ok ? await resUnsplash.json() : null;
            const imageUrl = unsplashData?.results[0]?.urls.regular || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500';

            return {
                ...facts,
                id: crypto.randomUUID(),
                displayName: animalName,
                image: imageUrl,
                characteristics: facts.characteristics || {}
            };
        } catch (error) {
            console.log('erreur: ', error);
            return {
                id: crypto.randomUUID(),
                name: animalName,
                image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500',
                characteristics: { diet: "Unknown" }
            };
        }
    };

    // ---- GESTION DE LA RECHERCHE PAR TEXTE ----
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        const searchName = query.trim();
        saveToHistory(searchName);

        const result = await fetchAnimalData(searchName);
        setAnimals([result]);
        setLoading(false);
    };

    // ---- GESTION DE LA RECHERCHE PAR IMAGE (NOUVEAU) ----
    const handleImageSearch = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            // Initialiser Gemini avec votre clé API
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            
            // Convertir l'image sélectionnée
            const imagePart = await fileToGenerativePart(file);

            // Demander au modèle d'identifier l'animal
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    imagePart,
                    "Identify the animal in this image. Respond with ONLY the common English name of the animal, nothing else. No punctuation, no sentences. Example: Lion"
                ],
            });

            const detectedAnimal = response.text.trim();

            if (detectedAnimal) {
                // Mettre à jour la barre de recherche avec le nom trouvé
                setQuery(detectedAnimal);
                // Sauvegarder dans l'historique
                saveToHistory(detectedAnimal);
                // Récupérer les données globales (Ninja + Unsplash) comme pour une recherche classique
                const result = await fetchAnimalData(detectedAnimal);
                setAnimals([result]);
            } else {
                alert("Impossible d'identifier l'animal sur cette image.");
            }
        } catch (error) {
            console.error("Erreur lors de l'analyse de l'image :", error);
            alert("Une erreur est survenue lors de l'analyse de l'image.");
        } finally {
            setLoading(false);
            // Réinitialiser le input pour permettre de remettre la même image si besoin
            e.target.value = "";
        }
    };

    // Sauvegarde centralisée dans l'historique
    const saveToHistory = (name) => {
        if (!historyList.includes(name)) {
            const newHistory = [name, ...historyList].slice(0, 10);
            setHistoryList(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
    };

    // ---- GESTION DE L'HISTORIQUE ----
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
        setAnimals([result]);
        setLoading(false);
    };

    // ---- FILTRAGE CÔTÉ CLIENT (DIET) ----
    const filteredAnimals = animals.filter(animal => {
        if (selectedDiet === "All") return true;
        return animal.characteristics?.diet?.toLowerCase() === selectedDiet.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-zoo-dark text-stone-800 p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. Header Zen */}
                <header className="text-center space-y-4">
                    <img src={logoImg} alt="ZooZen Logo" className="w-16 mx-auto dark:invert-0" />
                    <h1 className="text-3xl font-bold text-emerald-800">ZooZen Exploration</h1>

                    {/* 2. Barre de Recherche Principale (Texte + Image intégrée) */}
                    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto shadow-sm rounded-full bg-white border border-stone-200 focus-within:ring-2 focus-within:ring-emerald-500 transition-all flex items-center pr-2 pl-6">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un animal au clavier ou par image..."
                            className="w-full py-3.5 outline-none text-stone-700 placeholder-stone-400 bg-transparent pr-4"
                        />

                        <div className="flex items-center gap-2">
                            {/* Bouton Recherche par Image */}
                            <label className="p-2.5 rounded-full text-stone-400 hover:text-emerald-700 hover:bg-stone-100 transition-all cursor-pointer flex items-center justify-center">
                                <Icon icon="lucide:camera" className="text-[20px]" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSearch}
                                    className="hidden"
                                />
                            </label>

                            {/* Bouton Soumettre Recherche classique */}
                            <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-full transition-colors flex items-center justify-center">
                                <Icon icon='lucide:search' className='text-[18px]' />
                            </button>
                        </div>
                    </form>
                </header>

                {/* 3. Section Historique de Recherche */}
                {historyList.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">Recent Searches</span>
                            <button onClick={deleteAllHistoric} className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 font-medium">
                                <Icon icon='material-symbols:delete' className='text-[18px]' />
                                Clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {historyList.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleHistoryClick(item)}
                                    className="group flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 rounded-full text-sm cursor-pointer transition-all border border-transparent hover:border-emerald-200"
                                >
                                    <span>{item}</span>
                                    <span onClick={(e) => deleteSingleHistory(item, e)} className="text-stone-400 group-hover:text-red-500 p-0.5 rounded-full hover:bg-stone-200 transition-colors">&times;</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Barre de Filtres de Catégories (Diet) */}
                <div className="flex justify-center items-center gap-2 border-b border-stone-200 pb-4">
                    <Icon icon='material-symbols:filter-list' className='text-[18px] text-stone-400' />
                    {["All", "Carnivore", "Herbivore", "Omnivore"].map((diet) => (
                        <button
                            key={diet}
                            onClick={() => setSelectedDiet(diet)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDiet === diet
                                ? "bg-emerald-800 text-white shadow-sm"
                                : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200"
                                }`}
                        >
                            {diet}
                        </button>
                    ))}
                </div>

                {/* 5. Zone de Contenu Principale */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-stone-400 text-sm animate-pulse">Analyse de l'environnement en cours...</p>
                    </div>
                ) : filteredAnimals.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
                        <p className="text-stone-400 font-medium">Aucun animal ne correspond aux critères actuels.</p>
                        <p className="text-xs text-stone-400 mt-1">Essayez une autre recherche ou réinitialisez les filtres.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredAnimals.map((animal) => (
                            <AnimalCard key={animal.id} animal={animal} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ---- COMPOSANT INTERNE : Carte d'animal interactive ----
function AnimalCard({ animal }) {
    const [isFav, setIsFav] = useState(false);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-100 transition-all duration-300 flex flex-col group">
            <div className="h-48 overflow-hidden relative bg-stone-200">
                <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <button
                    onClick={() => setIsFav(!isFav)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-stone-600 hover:text-red-500 transition-colors flex items-center justify-center"
                >
                    <Icon
                        icon={isFav ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'}
                        className={`text-[18px] ${isFav ? 'text-red-500' : 'text-stone-600'}`}
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
                    <h3 className="text-xl font-serif font-bold text-stone-800 capitalize mb-1">{animal.name}</h3>
                    <p className="text-xs font-mono text-stone-400 tracking-tight">ID: {animal.id.slice(0, 8)}</p>
                </div>
                {/* Reste de votre carte (caractéristiques)... */}
            </div>
        </div>
    );
}