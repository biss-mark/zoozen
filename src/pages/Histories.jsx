import { useState } from "react";
import Footer from "../components/layouts/Footer"
import Header from "../components/layouts/Header"
import ScrollTop from "../components/ui/ScrollTop"

const Histories = () => {

  const [zoozenFavorite, setZoozenFavorite] = useState(() => {
    const favoriteStorage = localStorage.getItem('zoozenFavorite');
    return favoriteStorage ? JSON.parse(favoriteStorage) : [];
  });

  return (
    <div>
      <Header />
      <ScrollTop />

      <section className="my-5">
        <h2 className="font-bold text-3xl text-center dark:text-white transition-all duration-300">Votre historique</h2>

        {zoozenFavorite.length > 0 ? (
          zoozenFavorite.map((favorite, index) => (
            <article key={index} >{favorite}</article>
          ))
        ) : (
          <p className='mt-3 text-xl text-center dark:text-white transition-all duration-300'>Aucun favori pour le moment.</p>
        )}

      </section>

      <Footer />
    </div>
  )
}

export default Histories