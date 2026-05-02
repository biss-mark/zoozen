import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layouts/Header';
import ScrollTop from '../components/ui/ScrollTop';
import Footer from '../components/layouts/Footer';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const AnimalDetail = () => {

    const { t } = useTranslation();

    const { id } = useParams();
    const location = useLocation();

    const imageDeBase = location.state?.imageUrl;

    const [animalData, setAnimalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wikiDescription, setWikiDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchFacts = async () => {
            setLoading(true);
            try {

                const searchName = id.replace(/-/g, ' ');

                const ninjaRes = await axios.get(`https://api.api-ninjas.com/v1/animals?name=${searchName}`, {
                    headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                });

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
                    setAnimalData(null);
                }
            } catch (error) {
                console.error("Fatale error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, [id, t]);


    if (loading) return <p className='absolute inset-0'>loading...</p>;

    return (
        <div className=" dark:bg-zoo-dark transition-all duration-300 dark:text-white">
            <ScrollTop />
            <Header />
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
                    <img src={imageDeBase} alt={id} className='w-full max-h-125 object-cover rounded-[15px] ' />
                )}

                {animalData ? (
                    <div className="details mt-4">
                        <h1 className='text-3xl font-bold '>{animalData.name}</h1>
                        <p className="my-4">{wikiDescription}</p>
                        <ul className="list-disc">
                            <h2 className="text-xl font-semibold capitalize">{t('header.someCharacteristics')}</h2>
                            <li className='ml-6'><span className='font-medium'>{t('header.diet')} :</span> {animalData.characteristics?.diet}</li>
                            <li className='ml-6'><span className='font-medium'>{t('header.habitat')} :</span> {animalData.characteristics?.habitat}</li>
                            <li className='ml-6'><span className='font-medium'>{t('header.meal')} :</span> {animalData.characteristics?.prey}</li>
                            <li className='ml-6'><span className='font-medium'>{t('header.type')} :</span> {animalData.characteristics?.type}</li>
                            <li className='ml-6'><span className='font-medium'>{t('header.group')} :</span> {animalData.characteristics?.group}</li>
                        </ul>
                    </div>
                ) : (
                    <p>Données scientifiques indisponibles pour le moment.</p>
                )}

            </section>
            {/* Reste de ton affichage de données scientifiques... */}
            <Footer />
        </div>
    );
};

export default AnimalDetail