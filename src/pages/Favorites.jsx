import { useState } from 'react'
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import ScrollTop from '../components/ui/ScrollTop'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

const Favorites = () => {

  const { t } = useTranslation();

  const [showLang, setShowLang] = useState(false);

  const toggleShow = () => {
    setShowLang(!showLang);
  }
  const showLangManagement = ' opacity-100 z-30';
  const hideLangManagement = ' opacity-0 -z-50';

  const [zoozenFavorite] = useState(() => {
    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    return favoriteStorage ? JSON.parse(favoriteStorage) : [];
  });

  return (
    <div className=' dark:bg-zoo-dark dark:text-white  transition-all duration-300'>
      {showLang ? (<div onClick={toggleShow} className='fixed w-full h-full top-0 left-0 z-20' />) : ''}
      {/* scroll top button  */}
      <ScrollTop />
      {/* header */}
      <Header />
      <section className="my-5">
        <div className="flex flex-col gap-4 items-center justify-around sm:flex-row">
          <h2 className="font-bold text-3xl text-center dark:text-white">{t('favorite.favoriteTitle')}</h2>

          <div className="w-full relative max-w-75">
            <p className='border-2 w-full p-2 flex items-center justify-between gap-3 rounded-lg cursor-pointer' onClick={toggleShow}>
              {t('favorite.favoriteFilter')} (carnivore)
              <Icon icon={'material-symbols:keyboard-arrow-up'} className='text-[40px]' />
            </p>
            <ul className={`absolute border-2 w-full mt-3 bg-white dark:bg-zoo-dark overflow-hidden rounded-lg  ${showLang ? showLangManagement : hideLangManagement} `}>
              <li className="w-full p-1 text-lg font-medium mt-1 capitalize">{t('header.category')}</li>
              <li className=""><button className="w-full py-1.5 px-4 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  mt-1.5 cursor-pointer text-left">{t('header.carnivorous')}</button></li>
              <li className=""><button className="w-full py-1.5 px-4 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  mt-1.5 cursor-pointer text-left">{t('header.herbivorous')}</button></li>
              <li className=""><button className="w-full py-1.5 px-4 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  mt-1.5 cursor-pointer text-left">{t('header.omnivorous')}</button></li>
              <li className="w-full p-1 text-lg font-medium mt-1">Date</li>
              <li className=""><button className="w-full py-1.5 px-4 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  mt-1.5 cursor-pointer text-left">{t('header.recent')}</button></li>
              <li className=""><button className="w-full py-1.5 px-4 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white  mt-1.5 cursor-pointer text-left">{t('header.old')}</button></li>
            </ul>
          </div>
        </div>

        {zoozenFavorite.length > 0 ? (
          zoozenFavorite.map((favorite, index) => (
            <article key={index} >{favorite}</article>
          ))
        ) : (
          <p className='mt-3 text-xl text-center dark:text-white'>{t('favorite.favoriteNotFound')}</p>
        )}

      </section>

      {/* footer */}
      <Footer />
    </div>
  )
}

export default Favorites