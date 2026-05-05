import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';

const FilterSelect = () => {

    const { t } = useTranslation();
    const [showFilter, setShowFilter] = useState(false);
    // const [dietFilter, setDietFilter] = useState('all');
    // const [sortOrder, setSortOrder] = useState('recent');
    const [activeFilterLabel, setActiveFilterLabel] = useState(t('header.allCategory'));

    const showLangManagement = ' opacity-100 z-30';
    const hideLangManagement = ' opacity-0 -z-50';

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

    return (
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
    )
}

export default FilterSelect;