import { useTranslation } from 'react-i18next';
import { Icon } from "@iconify/react"
import logoImg from '../../assets/zoo-dark.png';
import { NavLink } from "react-router-dom";


const Sidebar = ({ openMenu, closeMenu }) => {

    const { t } = useTranslation();

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
                    <li className="w-full" ><NavLink to={'/histories'} className={({ isActive }) => isActive ? activeLink : normalLink} ><Icon icon={'mdi:history'} className="text-2xl" /> {t('header.history')}</NavLink></li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar