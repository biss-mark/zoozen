import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Header from '../components/layouts/Header';
import ScrollTop from '../components/ui/ScrollTop';
import Footer from '../components/layouts/Footer';
import { Icon } from '@iconify/react';

const AnimalDetail = () => {
    const { id } = useParams();
    const location = useLocation(); 

    const imageDeBase = location.state?.imageUrl;

    const [animalData, setAnimalData] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchFacts = async () => {
            setLoading(true);
            try {
                const ninjaRes = await axios.get(`https://api.api-ninjas.com/v1/animals?name=${id}`, {
                    headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                });

                const dataAnimal = ninjaRes.json();
                console.log(dataAnimal);
                

                // setAnimalData(dataAnimal);

                // if (ninjaRes.data.length > 0) {
                //     setAnimalData(ninjaRes.data[0]);
                // }
            } catch (error) {
                console.error("Fatale error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, [id]);

    // console.log(animalData);
    

    if (loading) return <p className='absolute inset-0'>loading...</p>;

    return (
        <div className=" dark:bg-zoo-dark transition-all duration-300">
            <ScrollTop/>
            <Header/>
            <section className="flex items-center gap-3 my-3 w-full max-w-300 mx-auto">
                <button onClick={() => navigate(-1)} className='p-2 cursor-pointer flex items-center justify-center'><Icon icon={'material-symbols:arrow-back-ios-new-rounded'} className='text-3xl dark:text-white'/></button>
                <h1 className="dark:text-white flex items-center text-2xl font-semibold mb-1">
                    <span className="">animal</span>
                    <Icon icon={'mdi:slash-forward'} className='text-2xl'/>
                    <span>{id}</span>
                </h1>
            </section>

            <section className="w-full max-w-300 mx-auto px-4 pb-9">
            {imageDeBase && (
                <img src={imageDeBase} alt={id} className='w-full max-h-125 object-cover rounded-[15px] '/>
            )}

            {animalData ? (
                <div className="details">
                    <h1 className='text-3xl font-bold '>{id}</h1>
                    <p><strong>Régime :</strong> {animalData.characteristics?.diet}</p>
                    <p><strong>Habitat :</strong> {animalData.characteristics?.habitat}</p>
                </div>
            ) : (
                <p>Données scientifiques indisponibles pour le moment.</p>
            )}

            </section>
            {/* Reste de ton affichage de données scientifiques... */}
            <Footer/>
        </div>
    );
};

export default AnimalDetail