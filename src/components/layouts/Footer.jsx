import { useEffect, useState } from 'react';
import footerDark from '../../assets/zoo-dark.png';
import footerLight from '../../assets/zoo-light.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {

    const { t } = useTranslation();

    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className='bg-[#F5F5F5] dark:bg-[#080808] dark:text-white transition-all duration-300'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-3">
                <div className="w-full">
                    <h3 className="font-semibold text-[20px] flex items-center gap-2">{t('footer.footerTitleOne')}</h3>
                    <ul className='list-disc py-2 px-5'>
                        <li><a href="#">{t('footer.footerExplorationOne')}</a></li>
                        <li><a href="#">{t('footer.footerExplorationTwo')}</a></li>
                        <li><a href="#">{t('footer.footerExplorationThree')}</a></li>
                        <li><a href="#">{t('footer.footerExplorationFour')}</a></li>
                        <li><a href="#">{t('footer.footerExplorationFive')}</a></li>
                    </ul>
                </div>
                <div className="w-full">
                    <h3 className="font-semibold text-[20px] flex items-center gap-2">{t('footer.footerTitleTwo')}</h3>
                    <ul className='list-disc py-2 px-5'>
                        <li><a href="#">{t('footer.footerAboutOne')}</a></li>
                        <li><a href="#">{t('footer.footerAboutTwo')}</a></li>
                        <li><a href="#">{t('footer.footerAboutThree')}</a></li>
                        <li><a href="#">{t('footer.footerAboutFour')}</a></li>
                        <li><a href="#">{t('footer.footerAboutFive')}</a></li>
                    </ul>
                </div>

                <div className="w-full">
                    <h3 className="font-semibold text-[20px] flex items-center gap-2">
                        <img src={!isDark ? footerDark : footerLight} alt="zoozen footer" className='w-6' />
                        Zoozen
                    </h3>
                    <p className='p-2'>Zoozen est une plateforme dédiée à l'éducation et à la préservation du monde animalier.  Apprenez à connaître ceux qui partagent notre planète.</p>
                </div>

            </div>

            <div className="bg-[#EEEEEE] dark:bg-black flex flex-col items-center text-center gap-1 p-3 transition-all duration-300">
                <p className="">© 2026 Zoozen Project. Fait avec passion pour la nature sauvage.</p>
                <small className="text-xs">"Apprendre à les connaître, c'est commencer à les protéger."</small>
            </div>
        </div>
    )
}

export default Footer;