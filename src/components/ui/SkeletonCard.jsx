
const SkeletonCard = () => {
    return (
        <div className="card bg-white dark:bg-zoo-dark rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden w-full animate-pulse">
            {/* <div className=""></div> */}
            {/* image */}
            <div className="w-full h-48 bg-gray-300 mb-4"></div>

            <div className="p-4">
                {/* title */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                {/* description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>

        </div>
    );
};

export default SkeletonCard;