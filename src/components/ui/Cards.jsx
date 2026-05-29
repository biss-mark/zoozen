import { Icon } from "@iconify/react";
import { useState } from "react";

const Cards = ({ animal, imageUrl, isFavoritePage = false, isHistoryPage = false, onRemove }) => {

  const scientificName = animal.characteristics?.lifespan || "LifeSpan unknown";
  const diet = animal.characteristics.diet || "Non spécifié";
  const location = animal.locations?.[0] || "Monde";

  console.log(diet);
  console.log(scientificName);
  console.log(location);
  

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
      onRemove(animal);
    } else if(isHistoryPage) {
      onRemove(animal);
    } else {
      saveAsFavorites(e);
    }
  };

  const saveAsFavoriteToHistory = (e) => {
    saveAsFavorites(e);
  }

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

    const limitedHistory = updatedHistory.slice(0, 90);

    localStorage.setItem('zoozenHistory', JSON.stringify(limitedHistory));

    setZoozenHistory(limitedHistory);
  };

  const saveAsFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    const currentFavorites = favoriteStorage ? JSON.parse(favoriteStorage) : [];

    const isAlreadySavedAsFavorite = currentFavorites.some(fav => fav.name === animal.name);
    let updatedFavorites = [];


    if (isAlreadySavedAsFavorite) {
      updatedFavorites = currentFavorites.filter(fav => fav.name !== animal.name);
      console.log(`${animal.name} retiré des favoris`);
    } else {
      const newFavorite = {
        name: animal.name,
        imageDeFond: imageUrl,
        characteristics: animal.characteristics,
        locations: animal.locations,
        displayId: animal.displayId || Math.random(),
        viewedAt: new Date().getTime()
      };
      updatedFavorites = [...currentFavorites, newFavorite];
      console.log(`${animal.name} ajouté aux favoris`);
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
          <div className="flex items-center justify-between gap-3">
          <button onClick={saveAsFavoriteToHistory} className={`cursor-pointer p-2 bg-zoo-green rounded-full ${isHistoryPage ? 'flex' : 'hidden'} `}>
            <Icon icon={'material-symbols:bookmark-heart'} className={`text-xl ${isFav ? 'text-red-500' : 'text-black'}`} />
          </button>

          <button onClick={handleButtonClick} className="cursor-pointer p-2 bg-zoo-green rounded-full">
            <Icon
              icon={isFavoritePage ? 'material-symbols:delete-outline' : isHistoryPage ? 'material-symbols:delete-outline' : 'material-symbols:bookmark-heart'}
              className={`text-xl ${isFavoritePage && isFav ? 'text-red-500' : 'text-black'}`}
            />
          </button>
          </div>
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