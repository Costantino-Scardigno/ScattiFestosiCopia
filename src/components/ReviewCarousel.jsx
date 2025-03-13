import React from "react";

import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { Card2 } from "./Card2";

function ReviewCarousel() {
  return (
    <section
      id="recensioni"
      className="carousel slide h-review pb-5 pt-6 "
      data-bs-ride="carousel"
      data-bs-interval="2000"
    >
      <h2 className="display-1 text-black text-center  ">Recensioni</h2>
      <div className="carousel-inner">
        {/* Prima slide */}
        <div className="carousel-item active">
          <div className="d-flex justify-content-evenly w-100 ">
            <Card2
              image="https://it.pinterest.com/pin/3096293487930265/"
              title="Costantino Scardigno"
              subtitle="Perfetta per Eventi Speciali"
              description="Ho usato l'app durante il matrimonio e l'esperienza è stata eccezionale. Gli invitati hanno condiviso foto e video che hanno reso l'evento ancora più emozionante. Consigliata a chi vuole rivivere ogni momento!"
            />
          </div>
        </div>

        {/* Seconda slide */}
        <div className="carousel-item">
          <div className="d-flex justify-content-evenly w-100 ">
            <Card2
              image="https://it.pinterest.com/pin/3096293487930265/"
              title="Davide Scardigno"
              subtitle="Un Must-Have per Ogni Evento"
              description="Utilizzo questa app per tutte le feste e le riunioni di famiglia. È davvero semplice da usare e permette a tutti di contribuire, rendendo ogni album un vero e proprio diario di ricordi. Un'ottima idea realizzata alla perfezione!"
            />
          </div>
        </div>

        {/* Terza slide */}
        <div className="carousel-item">
          <div className="d-flex justify-content-evenly w-100">
            <Card2
              image="https://it.pinterest.com/pin/3096293487930265/"
              title="Lucia Scardigno"
              subtitle="Esperienza Indimenticabile!"
              description="L'app è semplicemente fantastica! Organizzare un album condiviso per il compleanno di mio figlio è stato un gioco da ragazzi. Tutti hanno potuto aggiungere foto e video in tempo reale, creando un ricordo unico e coinvolgente."
            />
          </div>
        </div>
      </div>

      {/* Controlli di navigazione */}
      <button
        className="carousel-control-prev "
        type="button"
        data-bs-target="#reviewCarousel"
        data-bs-slide="prev"
      >
        <IoIosArrowBack className="fs-1 text-black me-5 d-none d-xxl-block mt-5m " />
      </button>

      <button
        className="carousel-control-next  "
        type="button"
        data-bs-target="#reviewCarousel"
        data-bs-slide="next"
      >
        <IoIosArrowForward className="fs-1 text-black d-none d-xxl-block mt-5m  " />
      </button>
    </section>
  );
}

export default ReviewCarousel;
