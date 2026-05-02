import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // AJOUTE useLocation
import axios from 'axios';

const AnimalDetail = () => {
    const { id } = useParams(); // Le nom de l'animal (pour API Ninjas)
    const location = useLocation(); // <--- RÉCUPÈRE LA LOCATION

    // Récupère l'image depuis l'état, ou utilise null si elle n'existe pas
    const imageDeBase = location.state?.imageUrl;

    const [animalData, setAnimalData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // PLUS BESOIN D'APPELER UNSPLASH ICI !
        // On garde l'image de base

        const fetchFacts = async () => {
            setLoading(true);
            try {
                // Appelle UNIQUEMENT API Ninjas pour les faits
                const ninjaRes = await axios.get(`https://api.api-ninjas.com/v1/animals?name=${id}`, {
                    headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                });

                if (ninjaRes.data.length > 0) {
                    setAnimalData(ninjaRes.data[0]);
                }
            } catch (error) {
                console.error("Erreur faits:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, [id]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container p-4">
            <h1 className="text-capitalize" style={{ color: '#4c1d95' }}>{id}</h1>

            {/* UTILISE L'IMAGE TRANSMISE */}
            {imageDeBase && (
                <img src={imageDeBase} alt={id} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '15px' }} />
            )}

            {animalData ? (
                <div className="details">
                    <p><strong>Nom scientifique :</strong> {animalData.taxonomy?.scientific_name}</p>
                    <p><strong>Régime :</strong> {animalData.characteristics?.diet}</p>
                    <p><strong>Habitat :</strong> {animalData.characteristics?.habitat}</p>
                </div>
            ) : (
                <p>Données scientifiques indisponibles pour le moment.</p>
            )}

            {/* Reste de ton affichage de données scientifiques... */}
        </div>
    );
};

export default AnimalDetail