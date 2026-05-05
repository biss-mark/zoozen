import { useEffect, useRef, useState } from 'react'
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import ScrollTop from '../components/ui/ScrollTop'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import Cards from '../components/ui/Cards'
import { Link } from 'react-router-dom'
import Confirmation from '../components/ui/Confirmation'

const Favorites = () => {

  const { t } = useTranslation();
  const [showFilter, setShowFilter] = useState(false);
  const [dietFilter, setDietFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [activeFilterLabel, setActiveFilterLabel] = useState(t('header.allCategory'));
  const [letConfirm, setLetConfirm] = useState({ isOpen: false, animalName: '' });

  const [zoozenFavorite, setZoozenFavorite] = useState(() => {
    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    return favoriteStorage ? JSON.parse(favoriteStorage) : [];
  });

  const confirmDelete = (animal) => {
    setLetConfirm({ isOpen: true, animalName: animal.name })
  }

  const removeFavorite = (name) => {
    const updated = zoozenFavorite.filter(fav => fav.name !== name);
    localStorage.setItem('zoozenFavorite', JSON.stringify(updated));
    setZoozenFavorite(updated);
  };

  const onConfirmDelete = () => {
    removeFavorite(letConfirm.animalName);
  }

  const toggleShow = () => {
    setShowFilter(!showFilter);
  }

  const dropdownRef = useRef(null);

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

  const showLangManagement = ' opacity-100 z-30';
  const hideLangManagement = ' opacity-0 -z-50';

  const filteredFavorites = zoozenFavorite.filter(fav => dietFilter === 'all' || fav.characteristics?.diet === dietFilter).sort((a, b) => {
    const timeA = a.viewedAt || 0;
    const timeB = b.viewedAt || 0;
    return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
  });
  

  return (
    <div className='dark:bg-zoo-dark dark:text-white transition-all duration-300 h-screen'>
      <ScrollTop />
      <Header />
      {letConfirm ?
        <Confirmation
          thisName={letConfirm.animalName}
          isActive={letConfirm.isOpen}
          onClose={() => setLetConfirm({ ...letConfirm, isOpen: false })}
          onConfirm={onConfirmDelete}
        />
        :
        ''
      }
      <section className="my-5">
        <div className="flex flex-col gap-4 items-center justify-around sm:flex-row">
          <h2 className="font-bold text-3xl text-center">{t('favorite.favoriteTitle')}</h2>

          <div className="w-full relative max-w-75" ref={dropdownRef}>
            <p className='border-2 w-full px-3 py-2 flex items-center justify-between gap-3 rounded-lg cursor-pointer' onClick={toggleShow}>
              <span>{t('favorite.favoriteFilter')} ({activeFilterLabel})</span>
              <Icon icon={showFilter ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'} className='text-[35px]' />
            </p>

            <ul className={`absolute border-2 w-full mt-3 bg-white dark:bg-zoo-dark overflow-hidden rounded-lg ${showFilter ? showLangManagement : hideLangManagement}`}>
              <li className="w-full p-1 text-lg font-medium mt-1 bg-zinc-100 dark:bg-zinc-800">{t('header.category')}</li>
              <li>
                <button onClick={() => { setDietFilter('Carnivore'); setActiveFilterLabel(t('header.carnivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.carnivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('Herbivore'); setActiveFilterLabel(t('header.herbivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.herbivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('Omnivore'); setActiveFilterLabel(t('header.omnivorous')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.omnivorous')}
                </button>
              </li>
              <li>
                <button onClick={() => { setDietFilter('all'); setActiveFilterLabel(t('header.allCategory')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.allCategory')}
                </button>
              </li>

              <li className="w-full p-1 text-lg font-medium mt-1 bg-zinc-100 dark:bg-zinc-800">Date</li>

              <li>
                <button onClick={() => { setSortOrder('recent'); setActiveFilterLabel(t('header.recent')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.recent')}
                </button>
              </li>
              <li>
                <button onClick={() => { setSortOrder('old'); setActiveFilterLabel(t('header.old')); setShowFilter(false); }}
                  className="w-full py-1.5 px-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-left cursor-pointer">
                  {t('header.old')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-8">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((item) => (
              <Link key={item.displayId} to={`/animal/${item.name.toLowerCase().replace(/\s+/g, '-')}`} state={{ imageUrl: item.imageDeFond }} className="decoration-0">
                <Cards
                  key={item.name}
                  animal={item}
                  imageUrl={item.imageDeFond}
                  isFavoritePage={true}
                  onRemove={confirmDelete}
                />
              </Link>
            ))
          ) : (
            <p className='col-span-full mt-10 text-2xl text-center opacity-50'>
              {t('favorite.favoriteNotFound')}
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Favorites;