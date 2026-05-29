import { useTranslation } from 'react-i18next';
import { Icon } from "@iconify/react"
import logoImg from '../../assets/zoo-dark.png';
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';


const Sidebar = ({ openMenu, closeMenu }) => {
    const { t, i18n } = useTranslation();
    const [showLang, setShowLang] = useState(false);

    const toggleShow = () => {
        setShowLang(!showLang);
    }

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!showLang) return;

        const handleClickOutside = (event) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLang(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }

    }, [showLang]);

    const showLangManagement = ' opacity-100 z-30';
    const hideLangManagement = ' opacity-0 -z-50';

    const changeL = (lng) => {
        setShowLang(false);
        setTimeout(() => {
            i18n.changeLanguage(lng);
        }, 1000);
    };

    useEffect(() => {
        if (!openMenu) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeMenu();
                }
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [openMenu, closeMenu]);

    const activeLink = "font-semibold bg-black/30 flex items-center gap-3 p-3 rounded-xl transition-all ";
    const normalLink = " flex items-center gap-3 p-3 rounded-xl hover:bg-black/30 transition-all";

    return (
        <aside className={`
            z-20 fixed h-full w-56 bg-zoo-green pt-10 transition-all md:hidden
            ${openMenu ? '-translate-x-96' : 'translate-x-0'}
        `}>
            <button className=" absolute right-3 top-1 cursor-pointer p-2 rounded-full hover:bg-black/10 transition-all" onClick={closeMenu}>
                <Icon icon={'material-symbols:close-rounded'} className="text-2xl" />
            </button>
            <h1 className="flex gap-2 justify-center items-center font-bold text-3xl border-b-2 pb-2 px-2 ">
                <img src={logoImg} alt="logo zoozen" className="w-8" />
                Zoozen
            </h1>
            <nav className="mt-5 overflow-x-auto">
                <ul className='flex flex-col items-center justify-between gap-5 p-2'>
                    <li className="w-full" ><NavLink to={'/'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'material-symbols:other-houses-rounded'} className="text-2xl" /> {t('header.home')}</NavLink></li>
                    <li className="w-full" ><NavLink to={'/research'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'material-symbols:search-rounded'} className="text-2xl" /> {t('header.search')}</NavLink></li>
                    <li className="w-full" ><NavLink to={'/explore'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'zondicons:explore'} className="text-xl" /> {t('header.explore')}</NavLink></li>
                    <li className="w-full" ><NavLink to={'/favorites'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'material-symbols-light:favorite'} className="text-2xl" /> {t('header.favorites')}</NavLink></li>
                    <li className="w-full" ><NavLink to={'/historique-views'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'mdi:history'} className="text-2xl" /> {t('header.history')}</NavLink></li>
                </ul>

                <ul className="flex flex-col items-center justify-between gap-5 p-2 absolute left-0 bottom-0 border-t-2 w-full">
                    <li className="w-full">
                        <div className="relative w-full" ref={dropdownRef}>
                            <button onClick={toggleShow} translate="no" className='font-semibold bg-black/30 flex items-center gap-3 py-2 px-4 rounded-xl transition-all w-full cursor-pointer'>
                                {i18n.language === 'fr' ?
                                    (
                                        <span className="w-full flex gap-3 items-center">
                                            <Icon icon={'circle-flags:fr'} className='text-xl' />
                                            Francais
                                        </span>
                                    ) : (
                                        <span className="w-full flex gap-3 items-center">
                                            <Icon icon={'circle-flags:us'} className='text-xl' />
                                            English
                                        </span>
                                    )
                                }
                            </button>
                            <ul className={`absolute bg-white dark:bg-black dark:text-white w-full left-0 bottom-14 rounded-xl font-semibold p-1 transition-all duration-300 ${showLang ? showLangManagement : hideLangManagement}`}>
                                <li className="">
                                    <button onClick={() => changeL('en')} className="w-full px-2 py-1 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 flex gap-3 items-center justify-between transition-all border-b-2 ">
                                        <Icon icon={'material-symbols:check'} className={`text-3xl ${i18n.language === 'en' ? 'opacity-100' : 'opacity-0'}`} />
                                        <span className="w-full flex gap-2 items-center">
                                            <Icon icon={'circle-flags:us'} className='text-xl' />
                                            {t('header.englishLanguage')}
                                        </span>
                                    </button>
                                </li>
                                <li className="">
                                    <button onClick={() => changeL('fr')} className="w-full px-2 py-1 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 flex gap-3 items-center justify-between transition-all">
                                        <Icon icon={'material-symbols:check'} className={`text-3xl ${i18n.language === 'fr' ? 'opacity-100' : 'opacity-0'}`} />
                                        <span className="w-full flex gap-2 items-center">
                                            <Icon icon={'circle-flags:fr'} className='text-xl' />
                                            {t('header.frenchLanguage')}
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar