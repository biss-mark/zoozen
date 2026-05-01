import { Icon } from '@iconify/react'

const ScrollTop = () => {
    


    const handleTop = () => {
        scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className='text-black'>
            <button onClick={handleTop} className={`fixed bottom-5 right-5 p-1 rounded-full bg-zoo-green z-40 cursor-pointer shadow-sm `}>
                <Icon icon={'material-symbols:keyboard-arrow-up'} className='text-[40px]' />
            </button >
        </div>
    )
}

export default ScrollTop