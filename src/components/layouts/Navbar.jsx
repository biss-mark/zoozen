import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import logoImg from '../../assets/logo_noir.png';
import { Link, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';

const Navbar = ({ openMenu }) => {

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

    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
            localStorage.setItem('theme', 'light');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };


    const activeLink = "font-semibold border-b-2";
    const normalLink = "";

    return (
        <header className='bg-zoo-green w-full p-4 flex items-center justify-between'>
            <Link to={'/'} ><img src={logoImg} alt='Logo Zoozen' className='w-38' /></Link>
            <nav className="hidden md:flex">
                <ul className='flex items-center justify-between gap-5'>
                    <li>
                        <NavLink to={'/'} className={({ isActive }) => isActive ? activeLink : normalLink} >{t('header.home')}</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/research'} className={({ isActive }) => isActive ? activeLink : normalLink} >{t('header.search')}</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/explore'} className={({ isActive }) => isActive ? activeLink : normalLink} >{t('header.explore')}</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/favorites'} className={({ isActive }) => isActive ? activeLink : normalLink} >{t('header.favorites')}</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/histories'} className={({ isActive }) => isActive ? activeLink : normalLink} >{t('header.history')}</NavLink>
                    </li>
                </ul>
            </nav>
            <div className="gap-1 flex items-center ">
                <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleShow} translate="no" className=' border-2 border-black text-black bg-black/20 rounded-sm px-4 cursor-pointer'>
                        {i18n.language === 'fr' ? 'Fr' : 'En'}
                    </button>
                    <ul className={`absolute top-8 bg-white dark:bg-black dark:text-white w-38 -left-17 rounded-md p-1 transition-all duration-300 ${showLang ? showLangManagement : hideLangManagement}`}>
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
                <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-full hover:bg-black/10 transition-all" title="Changer de thème" >
                    <Icon icon={isDark ? 'ri:sun-fill' : 'ri:moon-fill'} className='text-2xl' />
                </button>

                <button className='cursor-pointer p-2 rounded-full hover:bg-black/10 transition-all hidden sm:flex md:hidden'>
                    <NavLink to={'/research'} className={({ isActive }) => isActive ? activeLink : normalLink} >
                        <Icon icon={'material-symbols:search-rounded'} className="text-2xl" />
                    </NavLink>
                </button>

                <button className='cursor-pointer p-2 rounded-full hover:bg-black/10 transition-all md:hidden' onClick={openMenu}>
                    <Icon icon={'material-symbols:menu'} className='text-2xl' />
                </button>
            </div>
        </header>
    )
}

export default Navbar;