import { Icon } from '@iconify/react';
import { Navigate } from 'react-router-dom';
import { t } from 'i18next';

const SkeletonDetailCard = () => {
    return (
        <div className=' dark:bg-zoo-dark transition-all duration-300 dark:text-white'>
            <section className="flex items-center gap-3 my-3 w-full max-w-300 mx-auto">
                <button onClick={() => Navigate(-1)} className='cursor-pointer flex items-center justify-center'><Icon icon={'material-symbols:arrow-back-ios-new-rounded'} className='text-3xl dark:text-white' /></button>
                <h1 className="dark:bg-gray-300 w-full max-w-96 mr-4 mb-1 h-7 rounded-md"></h1>
            </section>

            <section className="w-full max-w-300 mx-auto px-4 pb-9">
                <div className='w-full h-115 bg-gray-300 rounded-[15px] '></div>
                <div className="details mt-4">
                    <h1 className='w-full max-w-100 bg-gray-300 h-6 rounded-md'></h1>
                    <div className="my-4">
                        <p className="w-full bg-gray-300 h-5 rounded-md mb-3"></p>
                        <p className="w-full bg-gray-300 h-5 rounded-md mb-3"></p>
                        <p className="w-full bg-gray-300 h-5 rounded-md mb-3"></p>
                        <p className="w-full max-w-125 bg-gray-300 h-5 rounded-md mb-3"></p>
                    </div>
                    <ul className="list-disc">
                        <h2 className="text-xl font-semibold capitalize mb-4">{t('header.someCharacteristics')}</h2>
                        <li className='mb-3 ml-6 max-w-120 rounded-md h-5 bg-zoo-dark dark:bg-gray-300'></li>
                        <li className='mb-3 ml-6 max-w-110 rounded-md h-5 bg-zoo-dark dark:bg-gray-300'></li>
                        <li className='mb-3 ml-6 max-w-90 rounded-md h-5 bg-zoo-dark dark:bg-gray-300'></li>
                        <li className='mb-3 ml-6 max-w-125 rounded-md h-5 bg-zoo-dark dark:bg-gray-300'></li>
                        <li className='mb-3 ml-6 max-w-100 rounded-md h-5 bg-zoo-dark dark:bg-gray-300'></li>
                    </ul>
                </div>

            </section>
        </div>
    );
};

export default SkeletonDetailCard;