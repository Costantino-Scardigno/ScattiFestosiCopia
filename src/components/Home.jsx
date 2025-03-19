import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import MyHero from "./Hero";
import MyNavbar from "./Navbar";
import ReviewCarousel from "./ReviewCarousel";
import Mysection from "./Section";
import SectionHow from "./SectionHow";
import Form from "./Form";

function Home() {
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();

  // Controlla se c'è un'indicazione di aprire il form di login
  useEffect(() => {
    // Verifica se c'è uno state con openLoginForm
    if (location.state?.openLoginForm) {
      setShowForm(true);
    }

    // Verifica se esiste un pendingShareCode nel localStorage
    const pendingShareCode = localStorage.getItem("pendingShareCode");
    if (pendingShareCode) {
      setShowForm(true);
    }
  }, [location]);

  return (
    <>
      <div id="home">
        <MyNavbar setShowForm={setShowForm} />
        <MyHero setShowForm={setShowForm} />
        <Mysection />
        <SectionHow />
        <ReviewCarousel />
        <Footer />
        <Form show={showForm} onClose={() => setShowForm(false)} />
      </div>
    </>
  );
}

export default Home;
