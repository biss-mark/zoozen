import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layouts/Header';
import ScrollTop from '../components/ui/ScrollTop';
import Footer from '../components/layouts/Footer';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import Cards from '../components/ui/Cards';


const searchList = ['Lion', 'Wolf', 'Elephant', 'Angelfish', 'Zebra', 'Snake', 'Giraffe', 'Bear', 'Shark', 'Eagle', 'Kangaroo', 'Penguin', 'Tiger', 'Cheetah', 'Dolphin', 'Octopus', 'Rabbit', 'Horse', 'Leopard', 'Crocodile', 'Hyena', 'Flamingo'];
const AnimalDetail = () => {

    const { t } = useTranslation();

    const { id } = useParams();
    const location = useLocation();

    const imageDeBase = location.state?.imageUrl;
    const scrollRef = useRef(null);

    const [imageAnimal, setImageAnimal] = useState([]);
    const [animalData, setAnimalData] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [IShow, setIShow] = useState(false);
    const [wikiDescription, setWikiDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageDesc, setImageDesc] = useState("");
    const [favorites, setFavorites] = useState([])

    const navigate = useNavigate();

    // 1. Récupération des infos de l'animal principal (Ninja + Wikipédia)
    useEffect(() => {
        const fetchFacts = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const searchName = id.replace(/-/g, ' ');

                // APPEL API NINJAS (Par nom)
                const ninjaRes = await axios.get(`https://api.api-ninjas.com/v1/animals?name=${searchName}`, {
                    headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                });

                // APPEL WIKIPEDIA
                const animalInfo = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&exchars=500&titles=${searchName}&format=json&origin=*`);
                const animalInfoData = await animalInfo.json();
                const pages = animalInfoData.query.pages;
                const firstPage = Object.values(pages)[0];

                if (firstPage && firstPage.extract) {
                    setWikiDescription(firstPage.extract);
                } else {
                    setWikiDescription(t('header.unavailable'));
                }

                if (ninjaRes.data && ninjaRes.data.length > 0) {
                    setAnimalData(ninjaRes.data[0]);
                } else {
                    // Fallback si l'API est vide ou quota dépassé
                    setAnimalData({
                        name: searchName,
                        characteristics: { lifespan: "10-15 years", weight: "Unknown", diet: "Omnivore" }
                    });
                }
            } catch (error) {
                console.error("Erreur récupération infos animal :", error);
                // Fallback en cas de crash
                setAnimalData({
                    name: id.replace(/-/g, ' '),
                    characteristics: { lifespan: "10-15 years", weight: "Unknown", diet: "Omnivore" }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, [id, t]);

    // 2. Récupération de la galerie d'images Unsplash (Dépend du nom de l'animal principal)
    useEffect(() => {
        const fetchImage = async () => {
            if (!animalData?.name) return;

            try {
                const imageName = `${animalData.name} animal wildlife`;
                const resUnsplash = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(imageName)}&per_page=10`,
                    { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
                );
                const resData = await resUnsplash.json();
                setImageAnimal(resData.results || []);
            } catch (error) {
                console.error('Error Unsplash : ', error);
            }
        };

        fetchImage();
    }, [animalData?.name]);

    useEffect(() => {
        const animalDiet = animalData?.characteristics?.diet;

        if (!animalDiet || !searchList) return;

        const fetchSimilarAnimals = async () => {
            try {
                const randomSelection = [...searchList]
                    .filter(name => name.toLowerCase() !== animalData.name.toLowerCase())
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);

                const fetchSingleAnimal = async (name) => {
                    try {
                        const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(name)}`, {
                            headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                        });

                        let ninjaData = [];
                        if (resNinja.ok) ninjaData = await resNinja.json();

                        const facts = (ninjaData && ninjaData.length > 0) ? ninjaData[0] : { name, characteristics: { diet: animalDiet } };

                        const resUnsplash = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(name + " animal")}&per_page=1`, {
                            headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` }
                        });
                        const unsplashData = resUnsplash.ok ? await resUnsplash.json() : null;
                        const imageUrl = unsplashData?.results[0]?.urls.regular || '/placeholder.jpg';

                        return {
                            ...facts,
                            displayId: crypto.randomUUID(),
                            name: facts.name || name,
                            imageDeFond: imageUrl,
                            characteristics: facts.characteristics || {}
                        };
                    } catch (err) {
                        return { name, displayId: Math.random(), imageDeFond: '/placeholder.jpg', characteristics: {} };
                    }
                };

                const results = await Promise.all(randomSelection.map(name => fetchSingleAnimal(name)));

                setAnimals(results);

            } catch (error) {
                console.error("Erreur animaux similaires :", error);
            }
        };

        fetchSimilarAnimals();
    }, [animalData?.characteristics?.diet]);



    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 200;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const closeImageUrl = () => {
        document.body.style.overflow = 'unset';
        setIShow(false);
        setImageUrl('');
        setImageDesc('');
    }
    const fetchImageUrl = (url, desc) => {

        document.body.style.overflow = 'hidden';
        setIShow(true);
        setImageUrl(url);
        setImageDesc(desc);
    }


    const saveAsFavorite = (animal, e) => {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }


        let savedFavorites = JSON.parse(localStorage.getItem('zoozenFavorite')) || [];


        const isAlreadyFav = savedFavorites.some(fav => fav.name.toLowerCase() === id.toLowerCase());

        if (isAlreadyFav) {

            savedFavorites = savedFavorites.filter(fav => fav.name.toLowerCase() !== id.toLowerCase());
        } else {

            const newFavorite = {
                name: id,
                imageDeFond: animal.image || animal.imageDeFond,
                characteristics: animal.characteristics || {},
                locations: animal.locations || [],
                displayId: animal.displayId || Math.random(),

            };
            savedFavorites.push(newFavorite);
        }


        localStorage.setItem('zoozenFavorite', JSON.stringify(savedFavorites));


        if (setFavorites) {
            setFavorites(savedFavorites);
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-8 h-8 border-4 border-zoo-green border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-500 dark:text-stone-200 text-sm ">Chargement...</p>
            </div>
        )
    }





    return (
        <div className=" dark:bg-zoo-dark transition-all duration-300 dark:text-white">
            <ScrollTop />
            <Header />

            <section className={` ${IShow === false ? 'hidden' : 'flex'} bg-white dark:bg-zoo-dark text-black dark:text-white inset-0 fixed items-center justify-center z-999 `}>
                <div className="w-full h-full max-w-180 max-h-150 rounded-lg shadow-md relative flex items-center justify-center">
                    <div className="absolute top-4 right-4 flex items-center gap-3">
                        <button className="cursor-pointer bg-white dark:bg-zoo-dark rounded p-1" onClick={closeImageUrl}><Icon icon={'material-symbols:close-rounded'} className='text-3xl ' /></button>
                    </div>
                    <img src={imageUrl} alt={imageDesc} className="rounded-lg object-contain h-full w-full" />
                </div>
            </section>

            <div>

                <section className="flex items-center gap-3 my-3 w-full max-w-300 mx-auto">
                    <button onClick={() => navigate(-1)} className='p-2 cursor-pointer flex items-center justify-center'><Icon icon={'material-symbols:arrow-back-ios-new-rounded'} className='text-3xl dark:text-white' /></button>
                    <h1 className="dark:text-white flex items-center text-[20px] font-semibold mb-1">
                        <span className="">animal</span>
                        <Icon icon={'mdi:slash-forward'} className='text-2xl' />
                        <span>{id}</span>
                    </h1>
                </section>

                <section className="w-full max-w-300 mx-auto px-4 pb-9">
                    {imageDeBase && (
                        <img src={imageDeBase} alt={'animal/', id} className='w-full max-h-125 object-cover rounded-[15px] ' />
                    )}

                    {animalData ? (
                        <div className="details mt-4">
                            <h1 className='text-3xl font-bold '>{animalData.name}</h1>
                            <button
                                className="flex items-center justify-center gap-1 my-2 cursor-pointer py-2 px-2 bg-red-600/10  text-red-500 rounded-md"
                                onClick={(e) => saveAsFavorite(id, e)}
                            >
                                <Icon
                                    icon={favorites.some(f => f.name.toLowerCase() === id.toLowerCase()) ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'}
                                    className='text-xl'
                                />
                            </button>
                            <p className="my-4">{wikiDescription}</p>
                            <ul className="list-disc">
                                <h2 className="text-xl font-semibold capitalize mb-4">{t('header.someCharacteristics')}</h2>
                                {animalData.characteristics?.diet && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.diet')} :</span> {animalData.characteristics.diet}</li>
                                )}

                                {animalData.characteristics?.habitat && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.habitat')} :</span> {animalData.characteristics.habitat}</li>
                                )}

                                {animalData.characteristics?.prey && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.meal')} :</span> {animalData.characteristics.prey}</li>
                                )}

                                {animalData.characteristics?.type && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.type')} :</span> {animalData.characteristics.type}</li>
                                )}

                                {animalData.characteristics?.group && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.group')} :</span> {animalData.characteristics.group}</li>
                                )}

                                {animalData.characteristics?.lifespan && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.lifespan')} :</span> {animalData.characteristics.lifespan}</li>
                                )}

                                {animalData.characteristics?.age_of_sexual_maturity && (
                                    <li className='ml-6'><span className='font-medium'>{t('header.age_of_sexual_maturity')} :</span> {animalData.characteristics.age_of_sexual_maturity}</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <p>Données scientifiques indisponibles pour le moment.</p>
                    )}

                </section>
            </div>

            <section className="relative group w-full max-w-300 mx-auto px-4 pb-9">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => scroll('left')}
                        className="cursor-pointer p-2 focus:border-2 border-zinc-100 rounded-full transition-colors"
                    >
                        <Icon icon={'material-symbols:arrow-left-alt'} className='text-4xl' />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="cursor-pointer p-2 focus:border-2 border-zinc-100 rounded-full transition-colors"
                    >
                        <Icon icon={'material-symbols:arrow-right-alt'} className='text-4xl' />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="w-full overflow-x-auto scroll-smooth no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="flex items-center gap-3 pb-4">
                        {imageAnimal.map(image => (
                            <div className="min-w-40 h-40 rounded-lg overflow-hidden shadow-md" key={image.id} onClick={() => fetchImageUrl(image.urls.small, image.alt_description)}>
                                <img
                                    src={image.urls.small}
                                    alt={image.alt_description}
                                    title={image.alt_description}
                                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className=''>
                <h2 className="text-center text-2xl font-bold my-4">Some animals that might interest you</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(animals.map((item) => {
                        if (!item || !item.name) return null;
                        return (
                            <Link
                                key={item.displayId}
                                to={`/animal/${(item.name || 'unknown').toLowerCase().replace(/\s+/g, '-')}`}
                                state={{ imageUrl: item.imageDeFond }}
                                className="decoration-0"
                            >
                                <Cards animal={item} imageUrl={item.imageDeFond} />
                            </Link>
                        )
                    })
                    )}
                </div>

            </section>


            <Footer />
        </div>
    );
};

export default AnimalDetail;