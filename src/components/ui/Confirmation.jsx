import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Confirmation = ({ thisName, isActive, onClose, onConfirm, isHistoryPage = false, isFavoritePage = false }) => {

    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isActive, onClose]);

    if (!isActive) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-9999 flex items-start p-1 justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl scale-in-center">
                <h3 className="text-lg font-bold text-gray-900">Confirmation</h3>
                <p className="mt-2 text-gray-600">
                    Voulez-vous vraiment supprimer <span className="font-bold">{thisName}</span> de vos {isHistoryPage ? 'historiques' : isFavoritePage ? 'favoris' : 'animaux'} ?
                </p>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border-2 border-gray-200 bg-gray-100 rounded-md hover:bg-gray-200" >Annuler</button>
                </div>
            </div>
        </div>,
        document.body
    );
};
export default Confirmation;