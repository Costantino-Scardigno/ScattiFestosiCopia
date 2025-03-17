import { useState } from "react";
import "../components/Hero.css";
import Form from "./Form";
import { href, Link, Links } from "react-router-dom";

function MyHero() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    const element = document.getElementById("how");
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container-fluid padding-top-5 bg-light-custom">
      <div className="row">
        <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-7 d-flex flex-column justify-content-between px-4">
          <h1
            id="my-text"
            className="display-1 fw-bold lh-sm text-primary-custom"
          >
            Il modo semplice e gratuito numero 1 per raccogliere{" "}
            <span className="font-effect">foto</span> e{" "}
            <span className="font-effect text-secondary-custom">video</span> dei
            tuoi ospiti.
          </h1>
          <p className="fs-1 fw-lighter m-0 text-primary-custom">
            Abbiamo reso facile e semplice la raccolta di foto e video in tempo
            reale in un album condiviso accessibile ai tuoi invitati
          </p>
          <div className="row ">
            <div className="col-sm-6 mt-4">
              <button
                onClick={handleClick}
                className="btn-animated-album btn btn-primary-custom w-100 rounded-pill mb-3 py-3 fs-4 text-white"
              >
                Come funziona?
              </button>
            </div>
            <div className="col-sm-6 mt-4 ">
              {/* Bottone "Crea Album" */}
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-animated-album btn-secondary-custom w-100 py-3  rounded-pill fs-4 fw-bold"
              >
                Crea Album
              </button>

              <Form show={showModal} onClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-12 col-xl-5 d-lg-none d-xl-block d-md-none d-lg-block d-sm-none d-md-block d-none d-sm-block d-xl-none d-xxl-block px-4">
          <div className="grid-container">
            <div className="rounded-4 item item1"></div>
            <div className="item item2 d-lg-none d-xl-block">
              <video
                className="w-100 rounded-4"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="../src/assets/matrimonio.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="rounded-4 item item4"></div>
            <div className="rounded-4 item item12"></div>
            <div className="rounded-4 item item10"></div>
            <div className="rounded-4 item item11"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyHero;
