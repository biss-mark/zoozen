import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
// Note : Ajuste le chemin d'import du Footer selon ton projet
import Footer from '../components/layouts/Footer';
import { useTranslation } from 'react-i18next';

export default function HistoriqueResearch() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ---- ÉTAT (STATE) ----
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // const [filterType, setFilterType] = useState('all'); // 'all' ou 'recent'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);



  const handleKeywordClick = (keyword) => {

    navigate('/search', { state: { autoSearchQuery: keyword } });
  };

  const deleteSingleKeyword = (keywordToDelete, e) => {
    e.stopPropagation();
    const updated = searchHistory.filter(item => item !== keywordToDelete);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };


  const deleteAllHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout votre historique de recherche ?")) {
      setSearchHistory([]);
      localStorage.removeItem('searchHistory');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zoo-dark text-stone-800 dark:text-white transition-colors duration-300 flex flex-col justify-between">
      <div>

        <Header />


        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-zoo-dark dark:text-white">
            Votre historique
          </h1>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

            <div className="relative w-full sm:w-64">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                onBlur={() => setTimeout(() => setIsFilterDropdownOpen(false), 200)}
                className="w-full bg-white dark:bg-black/30 border border-stone-300 dark:border-white/30 rounded-lg px-4 py-2.5 flex items-center justify-between text-sm font-medium shadow-sm cursor-pointer"
              >
                <span>Historique des recherches</span>
                <Icon icon="lucide:chevron-down" className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white/90 dark:bg-black/90 border border-stone-200 dark:border-zinc-800 rounded-lg shadow-lg z-10 overflow-hidden">
                  <li>
                    <NavLink to={`/historique-research`} >
                      <button className="w-full py-3 px-4 text-left cursor-pointer">
                        {t('historique.researchHistory')}
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/historique-views`} >
                      <button className="w-full py-3 px-4 text-left cursor-pointer">
                        {t('historique.historyViews')}
                      </button>
                    </NavLink>
                  </li>
                </div>
              )}
            </div>

            <div className="relative w-full sm:w-48">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                onBlur={() => setTimeout(() => setIsSortDropdownOpen(false), 200)}
                className="w-full bg-white dark:bg-black/30 border border-stone-300 dark:border-white/30 rounded-lg px-4 py-2.5 flex items-center justify-between text-sm font-medium shadow-sm cursor-pointer"
              >
                <span>Plus récent</span>
                <Icon icon="lucide:chevron-down" className={`transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white/90 dark:bg-black/90 border border-stone-200 dark:border-zinc-800 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors">
                    Plus récent
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liste des Mots-clés */}
          {searchHistory.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-black/30 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-700 shadow-sm">
              <Icon icon="lucide:history" className="text-4xl text-stone-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="font-medium text-stone-500 dark:text-zinc-400">Votre historique de recherche est vide.</p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">Les animaux que vous recherchez apparaîtront ici.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchHistory.map((keyword, index) => (
                <div
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="group w-full flex items-center justify-between px-6 py-4 bg-stone-100 dark:bg-zinc-900/60 hover:bg-emerald-50 dark:hover:bg-zinc-800/80 text-stone-800 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-200 rounded-lg cursor-pointer transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:search" className="text-stone-400 group-hover:text-emerald-600 text-[18px]" />
                    <span className="font-medium capitalize">{keyword}</span>
                  </div>
                  <button
                    onClick={(e) => deleteSingleKeyword(keyword, e)}
                    className="text-stone-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-stone-200/50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
                    title="Supprimer cet élément"
                  >
                    <Icon icon="lucide:x" className="text-[18px]" />
                  </button>
                </div>
              ))}

              <div className="flex justify-center mt-8">
                <button
                  onClick={deleteAllHistory}
                  className="flex items-center gap-2 px-6 py-3 bg-[#bbf7d0] hover:bg-[#a7f3d0] text-emerald-950 font-medium rounded-xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Icon icon="lucide:trash-2" className="text-[18px]" />
                  <span>Tout supprimer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}