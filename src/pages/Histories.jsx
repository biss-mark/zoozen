import { useEffect, useRef, useState } from "react";
import Footer from "../components/layouts/Footer"
import Header from "../components/layouts/Header"
import ScrollTop from "../components/ui/ScrollTop"
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Confirmation from "../components/ui/Confirmation";
import { Link, NavLink } from "react-router-dom";
import Cards from "../components/ui/Cards";

const Histories = () => {

  const { t } = useTranslation();
  const [showFilter, setShowFilter] = useState(false);
  const [showHistoriqueP, setShowHistoriqueP] = useState(false);
  const [dietFilter, setDietFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [activeFilterLabel, setActiveFilterLabel] = useState(t('header.allCategory'));
  const [letConfirm, setLetConfirm] = useState({ isOpen: false, animalName: '' });


  const showLangManagement = ' opacity-100 z-30';
  const hideLangManagement = ' opacity-0 -z-50';

  const [zoozenHistory, setZoozenHistory] = useState(() => {
    const HistoryStorage = localStorage.getItem('zoozenHistory');
    return HistoryStorage ? JSON.parse(HistoryStorage) : [];
  });

  const confirmDelete = (animal) => {
    setLetConfirm({ isOpen: true, animalName: animal.name })
  }

  const onConfirmDelete = () => {
    removeHistory(letConfirm.animalName);
  }

  const removeHistory = (name) => {
    const updated = zoozenHistory.filter(fav => fav.name !== name);
    localStorage.setItem('zoozenHistory', JSON.stringify(updated));
    setZoozenHistory(updated);
  };

  const deleteAllHistoric = () => {
    const isConfirmed = window.confirm("Voulez-vous vraiment effacer tout votre historique de recherche ?");

    if (isConfirmed) {
      setZoozenHistory([]);
      localStorage.removeItem('zoozenHistory');
    }
  };

  const toggleShow = () => {
    setShowFilter(!showFilter);
  }

  const toggleHide = () => {
    setShowHistoriqueP(!showHistoriqueP);
  }

  const dropdownRef = useRef(null);
  const moovdownRef = useRef(null);

  useEffect(() => {
    if (!showFilter) return;

    const handleClickOutside = (event) => {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }

  }, [showFilter]);

  useEffect(() => {
    if (!showHistoriqueP) return;

    const handleChangePage = (event) => {

      if (moovdownRef.current && !moovdownRef.current.contains(event.target)) {
        setShowHistoriqueP(false);
      }
    };

    document.addEventListener("mousedown", handleChangePage);
    document.addEventListener("touchstart", handleChangePage);

    return () => {
      document.removeEventListener("mousedown", handleChangePage);
      document.removeEventListener("touchstart", handleChangePage);
    }

  }, [showHistoriqueP])


  const filteredHistorys = zoozenHistory.filter(fav => dietFilter === 'all' || fav.characteristics?.diet === dietFilter).sort((a, b) => {
    const timeA = a.viewedAt || 0;
    const timeB = b.viewedAt || 0;
    return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
  });


  return (
    <div className='dark:bg-zoo-dark dark:text-white transition-all duration-300 min-h-screen'>
      <Header />
      <ScrollTop />

      {letConfirm ?
        <Confirmation
          thisName={letConfirm.animalName}
          isActive={letConfirm.isOpen}
          onClose={() => setLetConfirm({ ...letConfirm, isOpen: false })}
          onConfirm={onConfirmDelete}
          isHistoryPage={true}
          isFavoritePage={false}
        />
        :
        ''
      }

      <section className="my-5">
        <h2 className="font-bold text-3xl text-center mb-6 dark:text-white transition-all duration-300">{t('historique.historiqueTitle')}</h2>
        <div className="flex flex-col gap-6 items-center justify-around sm:flex-row">

          <div className="w-full relative max-w-75" ref={moovdownRef}>
            <p className='w-full bg-white dark:bg-black/30 border border-stone-300 dark:border-white/30 rounded-lg px-4 py-1.5 flex items-center justify-between font-medium shadow-sm cursor-pointer' onClick={toggleHide}>
              <span>{t('historique.historyViews')}</span>
              <Icon icon={'material-symbols:keyboard-arrow-down'} className={`text-[30px] transition-transform duration-200 ${showHistoriqueP ? 'rotate-180' : ''}`} />
            </p>

            <ul className={`absolute left-0 right-0 mt-1 bg-white/90 dark:bg-black/90 border border-stone-200 dark:border-white/30 rounded-lg shadow-lg z-10 overflow-hidden ${showHistoriqueP ? showLangManagement : hideLangManagement}`}>
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
            </ul>
          </div>

          <div className="w-full relative max-w-75" ref={dropdownRef}>
            <p className='w-full bg-white dark:bg-black/30 border border-stone-300 dark:border-white/30 rounded-lg px-4 py-1.5 flex items-center justify-between font-medium shadow-sm cursor-pointer' onClick={toggleShow}>
              <span>{t('favorite.favoriteFilter')} ({activeFilterLabel})</span>
              <Icon icon={'material-symbols:keyboard-arrow-down'} className={`text-[30px] transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
            </p>

            <ul className={`absolute left-0 right-0 mt-1 bg-white/90 dark:bg-black/90 border border-stone-200 dark:border-white/30 rounded-lg shadow-lg z-10 overflow-hidden ${showFilter ? showLangManagement : hideLangManagement}`}>
              <li className="w-full p-1 text-lg font-medium bg-zinc-100/90 dark:bg-zinc-800/90">{t('header.category')}</li>
              <li>
                <button onClick={() => { setDietFilter('Carnivore'); setActiveFilterLabel(t('header.carnivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.carnivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('Herbivore'); setActiveFilterLabel(t('header.herbivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.herbivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('Omnivore'); setActiveFilterLabel(t('header.omnivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.omnivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('all'); setActiveFilterLabel(t('header.allCategory')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.allCategory')}
                </button>
              </li>

              <li className="w-full p-1 text-lg font-medium mt-1 bg-zinc-100/90 dark:bg-zinc-800/90">Date</li>

              <li>
                <button onClick={() => { setSortOrder('recent'); setActiveFilterLabel(t('header.recent')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.recent')}
                </button>
              </li>
              <li>
                <button onClick={() => { setSortOrder('old'); setActiveFilterLabel(t('header.old')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 text-left cursor-pointer">
                  {t('header.old')}
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="">
          {filteredHistorys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-8">
              {filteredHistorys.map((item) => (
                <Link key={item.displayId} to={`/animal/${item.name.toLowerCase().replace(/\s+/g, '-')}`} state={{ imageUrl: item.imageDeFond }} className="decoration-0">
                  <Cards
                    key={item.name}
                    animal={item}
                    imageUrl={item.imageDeFond}
                    isHistoryPage={true}
                    isFavoritePage={false}
                    onRemove={confirmDelete}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center my-16 py-16 bg-white dark:bg-black/30 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-700 shadow-sm">
              <Icon icon="mdi:bed-empty" className="text-4xl text-stone-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="font-medium text-stone-500 dark:text-zinc-400">{t('favorite.favoriteNotFound')}</p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1">Vos animaux favoris apparaîtront ici.</p>
            </div>
          )}

          {zoozenHistory.length > 0 && (
            <button onClick={deleteAllHistoric} className="bg-red-700 text-white text-xl p-2 cursor-pointer rounded-lg flex items-center justify-center gap-2 mt-10 mx-auto">
              <Icon icon={'material-symbols:delete'} className='text-3xl' />
              Tout supprimer
            </button>
          )}
          </div>

      </section>

      <Footer />
    </div>
  )
}

export default Histories