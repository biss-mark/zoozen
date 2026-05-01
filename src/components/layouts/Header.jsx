import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Header = () => {

    const [toggleMenu, setToggleMenu] = useState(true);

    return (
        <div className='text-black'>
            {!toggleMenu ? (<div className='bg-black/40 fixed w-full h-screen z-20 md:hidden backdrop-blur-[10px]' onClick={() => setToggleMenu(true)} />) : ''}
            
            <Sidebar openMenu={toggleMenu} closeMenu={() => setToggleMenu(true)} />
            <Navbar openMenu={() => setToggleMenu(false)} />
        </div>
    )
}

export default Header