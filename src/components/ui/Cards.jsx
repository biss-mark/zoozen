import { Icon } from "@iconify/react";

const Cards = ({ animal, imageUrl }) => {
  const scientificName = animal.taxonomy?.scientific_name || "Nom inconnu";
  const diet = animal.characteristics?.diet || "Non spécifié";
  const location = animal.locations?.[0] || "Monde";  

  return (
    <div className="bg-white dark:bg-zoo-dark rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all duration-300">

      <div className="bg-cover relative bg-center h-48 w-full transition-transform duration-500 overflow-hidden cursor-pointer">
        <img src={imageUrl} className="absolute w-full h-full hover:scale-120 object-cover transition-all duration-500" alt="" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold  uppercase  ${diet == 'Carnivore' ? 'text-red-300' : 'text-zoo-green'} `}>{diet}</span>
          <button className="cursor-pointer p-1 hover:bg-zoo-green/40 rounded-full"><Icon icon={'material-symbols:bookmark-heart'} className="text-xl" /></button>
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