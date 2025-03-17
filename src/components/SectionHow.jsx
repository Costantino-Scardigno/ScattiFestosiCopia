import "../components/SectionHow.css";

function SectionHow() {
  return (
    <>
      <section
        id="how"
        className="conteiner-fluid  bg-light-custom px-4 pt-xl-5  pb-xl-5 pt-0"
      >
        <div className="row justify-content-evenly">
          <h2 className="text-center display-1 my-5 text-primary-custom ">
            Come funziona?
          </h2>
          <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 border-custom rounded-5 d-flex flex-column justify-content-evenly fixed-height bg-white-custom ">
            <div>
              <h2 className="display-1 text-secondary-custom">01</h2>
            </div>
            <div>
              <h3 className="display-5 text-primary-custom">
                Crea un album gratuito
              </h3>
            </div>
            <div>
              <p className="fs-2 text-primary-custom">
                Registrati, crea il tuo album
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 border-custom rounded-5 d-flex flex-column justify-content-evenly fixed-height bg-white-custom ">
            <div>
              <h2 className="display-1 text-secondary-custom">02</h2>
            </div>
            <div>
              <h3 className="display-5 text-primary-custom">
                Condividi il tuo album
              </h3>
            </div>
            <div>
              <p className="fs-3 text-primary-custom">
                ScattiFestosi creerà un URL e codice QR unici da condividere con
                i tuoi ospiti
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 border-custom rounded-5 d-flex flex-column justify-content-evenly fixed-height bg-white-custom">
            <div>
              <h2 className="display-1 text-secondary-custom">03</h2>
            </div>
            <div>
              <h3 className="display-5 text-primary-custom">
                Raccogli ricordi
              </h3>
            </div>
            <div>
              <p className="fs-3 text-primary-custom">
                Gli ospiti caricano foto e video che vanno direttamente
                nell'album condiviso
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SectionHow;
