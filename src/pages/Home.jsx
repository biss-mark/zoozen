import { useTranslation } from 'react-i18next';
import Header from '../components/layouts/Header'
import zooLight from '../assets/zoo-light.png';
import { useEffect, useRef, useState } from 'react';
import Cards from '../components/ui/Cards';
import ScrollTop from '../components/ui/ScrollTop';
import animalVideo from '../assets/zoozen_video.mp4';
import { Icon } from '@iconify/react';
import Footer from '../components/layouts/Footer';
import { useInView } from 'react-intersection-observer';
import bee from '../assets/svg/bee.svg';
import giraffe from '../assets/svg/giraffe.svg';
import lion from '../assets/svg/lion.svg';
import butterfly from '../assets/svg/butterfly.svg';
import crow from '../assets/svg/crow.svg';
import dolphin from '../assets/svg/dolphin.svg';
import fly from '../assets/svg/fly.svg';
import jellyfish from '../assets/svg/jellyfish.svg';
import koala from '../assets/svg/koala.svg';
import shrimp from '../assets/svg/shrimp.svg';
import theants from '../assets/svg/theants.svg';
import whale from '../assets/svg/whale.svg';

const Home = () => {

    const { t } = useTranslation();

    const animalBanner = [
        '/crocodile2.jpg',
        '/faucon2.jpg',
        '/gepard6.jpg',
        '/girafe3.jpg',
        '/leopard2.jpg',
        '/lion4.jpg',
        '/loup2.jpg',
        '/ours_brun3.jpg',
    ];

    const [randomIndex] = useState(() => Math.floor(Math.random() * 3));
    const hero = t(`home.hero_text${randomIndex === 0 ? 'One' : randomIndex === 1 ? 'Two' : 'Three'}`);

    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    const stats = [
        { value: 500, suffix: "+", label: t('home.keyFigureStateOne') },
        { value: 24, suffix: "", label: t('home.keyFigureStateTwo') },
        { value: 10, suffix: "k+", label: t('home.keyFigureStateThree') }
    ];

    const [index, setIndex] = useState(0);



    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % animalBanner.length);
        }, 10000);

        return () => clearInterval(timer);
    }, [animalBanner.length]);

    const currentImg = animalBanner[index];


    const searchList = ['Lion', 'Wolf', 'elephant', 'fish', 'zebra', 'snake'];
    const [animalsChoice] = useState(() => {
        return searchList[Math.floor(Math.random() * searchList.length)];
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resNinja = await fetch(`https://api.api-ninjas.com/v1/animals?name=${animalsChoice}`, {
                    headers: { 'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY }
                });
                const dataAnimals = await resNinja.json();

                const limitedAnimals = dataAnimals.slice(0, 4);

                const resUnsplash = await fetch(
                    `https://api.unsplash.com/search/photos?query=${animalsChoice}&per_page=04`,
                    { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}` } }
                );
                const dataPhotos = await resUnsplash.json();

                const combinedData = limitedAnimals.map((animal, index) => ({
                    ...animal,
                    imageDeFond: dataPhotos.results[index]?.urls.regular || '/placeholder.jpg'
                }));

                setAnimals(combinedData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [animalsChoice]);



    if (loading) return <div className="text-center p-20 dark:text-white">Chargement du monde animal...</div>;

    return (
        <div className=' dark:bg-zoo-dark transition-all duration-300'>
            <ScrollTop />

            <main className='w-full mx-auto max-w-750'>
                <Header />
                {/* section banner */}
                <section
                    style={{ backgroundImage: `url(${currentImg})` }}
                    className={`p-3 h-[70vh] w-full bg-cover bg-center transition-all duration-400 flex flex-col items-center justify-center text-white relative`}>
                    <div className="absolute inset-0 flex items-center flex-col justify-center gap-10 bg-black/60">
                        <div className="relative gap-3 flex items-center">
                            <img src={zooLight} alt="" className='w-10' />
                            <h1 className="font-bold text-3xl">Zoozen</h1>
                        </div>
                        <p className="text-2xl text-center">{t('header.banner')}</p>
                    </div>
                </section>

                {/* section hero */}

                <section className="p-3 flex flex-col items-center justify-center gap-4">
                    <h2 className="font-bold text-3xl text-center dark:text-white ">
                        {t('home.hero_title')}
                    </h2>
                    <main className='border-3 max-w-96 w-full mx-auto dark:text-white '></main>
                    <p className="text-justify md:text-center text-lg dark:text-white ">
                        {hero}
                    </p>
                </section>

                {/* section animal */}

                <section className="p-3">
                    <h1 className="text-3xl font-bold text-center dark:text-white mb-3 ">{t('home.animal_title')}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {animals.map((item, index) => (
                            <Cards key={index} animal={item} imageUrl={item.imageDeFond} />
                        ))}
                    </div>
                </section>

                {/* section video */}

                <VideoSection />

                {/* section key figure */}

                <section className="my-12 px-4" ref={ref}>
                    <h2 className="font-bold text-center text-3xl mb-8 dark:text-white">{t('home.keyFigure_title')}</h2>

                    <div className="bg-slate-900 dark:bg-[#080808] rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-8 p-12 text-center text-white">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="font-bold text-4xl md:text-5xl text-zoo-green">
                                    {inView ? (
                                        <>
                                            <SimpleCounter end={stat.value} duration={2000} />
                                            {stat.suffix}
                                        </>
                                    ) : (
                                        <span className="">0{stat.suffix}</span>
                                    )}
                                </div>
                                <p className="text-gray-300 text-lg font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section facts */}

                <Facts />

            </main>

            {/* footer */}
            <Footer />
        </div>
    )
}

// Counter component

const SimpleCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimesTamp = null;
        const step = (timesTamp) => {
            if (!startTimesTamp) startTimesTamp = timesTamp;
            const progress = Math.min((timesTamp - startTimesTamp) / duration, 1);
            // On calcule la valeur actuelle
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <span className="">{count}</span>
}

// video component

const VideoSection = () => {

    const { t } = useTranslation();

    const [pause, setPause] = useState(true);
    const videoPlaying = useRef(null);


    const [mystere] = useState(() => Math.floor(Math.random() * 3));

    const currentMystere = t(`home.videoText${mystere === 0 ? 'One' : mystere === 1 ? 'Two' : 'Three'}`);

    const playVideo = () => {
        if (videoPlaying.current.paused) {
            videoPlaying.current.play();
            setPause(false);
        } else {
            videoPlaying.current.pause();
            setPause(true);
        }
    }

    return (
        <div className='flex flex-col-reverse sm:flex-row gap-8 items-center justify-between my-10 p-3'>

            <div className='relative overflow-hidden w-full text-center dark:bg-black bg-black/90 text-white flex items-center justify-center h-60 rounded-lg'>
                <video ref={videoPlaying} loop className='h-full'>
                    <source src={animalVideo} type="video/mp4" />
                </video>
                <div onClick={playVideo}
                    className={`absolute inset-0 flex items-center bg-black/40 justify-center transition-all ${pause ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="p-2 rounded-full hover:bg-black/20 cursor-pointer">
                        <Icon icon={!pause ? 'ic:outline-pause' : 'material-symbols:play-arrow'} className='text-2xl' />
                    </button>
                </div>
            </div>

            <div className="w-full text-lg dark:text-white text-justify md:text-center sm:text-left "> {currentMystere} </div>
        </div>
    )
}

// facts component

const Facts = () => {

    const { t } = useTranslation();
    const [facts, setFacts] = useState([]);

    const generateFacts = () => {

        const arrayFacts = [
            { image: lion, text: t('home.factMysteryOne') },
            { image: bee, text: t('home.factMysteryThree') },
            { image: butterfly, text: t('home.factMysteryTwo') },
            { image: crow, text: t('home.factMysteryFour') },
            { image: dolphin, text: t('home.factMysteryFive') },
            { image: fly, text: t('home.factMysterySix') },
            { image: jellyfish, text: t('home.factMysterySeven') },
            { image: koala, text: t('home.factMysteryHeight') },
            { image: shrimp, text: t('home.factMysteryNine') },
            { image: theants, text: t('home.factMysteryTen') },
            { image: whale, text: t('home.factMysteryEleven') },
            { image: giraffe, text: t('home.factMysteryTwelve') }
        ];

        const selection = [];


        for (let i = 0; i < 3; i++) {
            let randomIndex = arrayFacts[Math.floor(Math.random() * arrayFacts.length)];

            while (selection.some(c => c.text === randomIndex.text)) {
                randomIndex = arrayFacts[Math.floor(Math.random() * arrayFacts.length)];
            }

            selection.push(randomIndex);
        }


        setFacts(selection);

    };

    useEffect(() => {
        generateFacts();
    }, []);






    return (
        <div className="m-6">
            <h2 className="font-bold text-center text-3xl mb-8 dark:text-white">{t('home.factTitle')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-3">
                {facts.map((a, index) => (
                    <article key={index} className="bg-zoo-op-green dark:bg-zoo-green p-3 rounded-xl text-center text-lg flex flex-col items-center">
                        <img src={a.image} alt="" className='w-30' />
                        <p className=''>{a.text}</p>
                    </article>
                ))}
                {/* <button onClick={generateFacts}>button</button> */}
            </div>
        </div>
    )
}

export default Home;