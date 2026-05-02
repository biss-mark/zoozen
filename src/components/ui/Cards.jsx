import { Icon } from "@iconify/react";
import { useState } from "react";

const Cards = ({ animal, imageUrl, isFavoritePage = false, onRemove }) => {

  const scientificName = animal.characteristics?.lifespan || "LifeSpan unknown";
  const diet = animal.characteristics?.diet || "Non spécifié";
  const location = animal.locations?.[0] || "Monde";

  const [zoozenFavorite, setZoozenFavorite] = useState(() => {
    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    return favoriteStorage ? JSON.parse(favoriteStorage) : [];
  });

  const [zoozenHistory, setZoozenHistory] = useState(() => {
    const HistoryStorage = localStorage.getItem('zoozenHistory');
    return HistoryStorage ? JSON.parse(HistoryStorage) : [];
  });

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavoritePage) {
      onRemove(animal.name);
    } else {
      saveAsFavorites(e);
    }
  };

  const addToHistory = (animal, imageUrl) => {
    const historyStorage = localStorage.getItem('zoozenHistory');
    let currentHistory = historyStorage ? JSON.parse(historyStorage) : [];

    const newEntry = {
      name: animal.name,
      imageDeFond: imageUrl,
      characteristics: animal.characteristics,
      locations: animal.locations,
      displayId: animal.displayId,
      viewedAt: new Date().getTime()
    };

    currentHistory = currentHistory.filter(item => item.name !== animal.name);

    const updatedHistory = [newEntry, ...currentHistory];

    const limitedHistory = updatedHistory.slice(0, 20);

    localStorage.setItem('zoozenHistory', JSON.stringify(limitedHistory));
    console.log('added');

    setZoozenHistory(limitedHistory);
  };

  const saveAsFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    const currentFavorites = favoriteStorage ? JSON.parse(favoriteStorage) : [];

    const isAlreadyFavorite = currentFavorites.some(fav => fav.name === animal.name);

    let updatedFavorites;

    if (isAlreadyFavorite) {
      return;
    } else {
      const newFavorite = {
        name: animal.name,
        imageDeFond: imageUrl,
        characteristics: animal.characteristics,
        locations: animal.locations,
        displayId: animal.displayId,
        viewedAt: new Date().getTime()
      };
      updatedFavorites = [...currentFavorites, newFavorite];
    }

    localStorage.setItem('zoozenFavorite', JSON.stringify(updatedFavorites));
    setZoozenFavorite(updatedFavorites);
  };

  const isFav = zoozenFavorite.some(fav => fav.name === animal.name);

  return (
    <div className="bg-white dark:bg-zoo-dark rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all duration-300" onClick={() => addToHistory(animal, imageUrl)}>


      <div className="bg-cover relative bg-center h-48 w-full transition-transform duration-500 overflow-hidden cursor-pointer">
        <img src={imageUrl} className="absolute w-full h-full hover:scale-120 object-cover transition-all duration-500" alt="" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold  uppercase  ${diet == 'Carnivore' ? 'text-red-300' : diet == 'Herbivore' ? 'text-zoo-green' : 'text-amber-300'} `}>{diet}</span>
          <button onClick={handleButtonClick} className="cursor-pointer p-2 bg-zoo-green rounded-full">
            <Icon
              icon={isFavoritePage ? 'material-symbols:delete-outline' : 'material-symbols:bookmark-heart'}
              className={`text-xl ${isFavoritePage ? 'text-black' : (isFav ? 'text-red-500' : '')}`}
            />
          </button>
        </div>
        <h2 className="text-xl font-bold dark:text-white capitalize mt-1 transition-all duration-300">{animal.name}</h2>
        <p className="text-sm text-zinc-500 italic mb-3">{scientificName}</p>

        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-300">
          <span>📍 {location}</span>
        </div>
      </div>
    </div>
  );
};


export default Cards;