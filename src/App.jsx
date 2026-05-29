import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Histories from "./pages/Histories";
import AnimalDetail from "./pages/AnimalDetail";
import HistoriqueReasearch from "./pages/HistoriqueReasearch";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="/historique-views" element={<Histories />} />

        <Route path="/historique-research" element={<HistoriqueReasearch />} />

        <Route path="/animal/:id" element={<AnimalDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App