import React, { useState } from "react";
import { Camera, X, Plus, Loader } from "lucide-react";

// Le animazioni CSS saranno incluse nel file CSS globale
// @keyframes overlay-in {
//   0% {
//     transform: scale(0, 0.003);
//   }
//   33%,
//   36% {
//     transform: scale(1, 0.003);
//   }
//   66%,
//   100% {
//     transform: scale(1, 1);
//   }
// }
//
// @keyframes overlay-out {
//   100%,
//   66% {
//     transform: scale(1, 1);
//   }
//   33%,
//   36% {
//     transform: scale(1, 0.003);
//   }
//   0% {
//     transform: scale(0, 0.003);
//   }
// }
//
// .animation {
//   animation: overlay-in 1s both;
// }
//
// .animation-close {
//   animation: overlay-out 1s reverse both;
// }

const DashboardModal = ({
  setUploadModalOpen,
  handleFileChange,
  uploadedFiles,
  removeFile,
  onAlbumCreated,
}) => {
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    // Se la chiusura è già in corso, non fare niente
    if (isClosing) return;

    setIsClosing(true);

    // Aggiungi le classi per l'animazione di chiusura
    const modale = document.getElementById("modale");
    const modaleBackDrop = document.getElementById("modale-backdrop");

    if (modale && modaleBackDrop) {
      modale.classList.remove("animation");
      modale.classList.add("animation-close");
      modaleBackDrop.classList.remove("animation");
      modaleBackDrop.classList.add("animation-close");

      // Attendi che l'animazione finisca prima di chiudere effettivamente il modale
      setTimeout(() => {
        setUploadModalOpen(false);
      }, 1000); // Durata dell'animazione (1 secondo)
    } else {
      // Fallback in caso gli elementi non vengano trovati
      setUploadModalOpen(false);
    }
  };

  const createNewAlbum = async () => {
    // Validazione
    if (!albumTitle.trim()) {
      setError("Il titolo dell'album è obbligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: albumTitle,
            description: albumDescription,
            eventDate: new Date(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante la creazione dell'album");
      }

      const newAlbum = await response.json();
      console.log("Album creato con successo:", newAlbum);

      if (uploadedFiles.length > 0) {
        for (const fileObj of uploadedFiles) {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          formData.append("eventId", newAlbum.id);

          const uploadResponse = await fetch(
            "https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/photos/upload",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            console.error(`Errore durante il caricamento di ${fileObj.name}`);
          }
        }
      }

      // Inizia l'animazione di chiusura con successo
      handleClose();

      // Chiamare il callback con l'album appena creato
      if (onAlbumCreated) {
        onAlbumCreated(newAlbum);
      }
    } catch (err) {
      console.error("Errore durante la creazione dell'album:", err);
      setError("Si è verificato un errore durante la creazione dell'album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modale */}
      <div
        id="modale"
        className="modal animation"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-top-4 bg-light-custom">
            <div className="modal-header rounded-top-4 bg-secondary-custom">
              <h5 className="modal-title text-primary-custom">
                Crea nuovo album
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={loading || isClosing}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label text-primary-custom">
                  Nome dell'album
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Inserisci un nome per il tuo album"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  disabled={loading || isClosing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-primary-custom">
                  Descrizione (opzionale)
                </label>
                <textarea
                  className="form-control"
                  placeholder="Aggiungi una descrizione"
                  rows="3"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  disabled={loading || isClosing}
                ></textarea>
              </div>

              <div>
                <label className="form-label text-primary-custom">
                  Seleziona foto
                </label>
                <div
                  className="border border-2 rounded p-4 text-center border-custom"
                  style={{ borderStyle: "dashed" }}
                >
                  <div className="d-flex flex-column align-items-center">
                    <Camera size={32} className="text-secondary-custom mb-2" />
                    <p className="text-muted-custom mb-2">
                      Trascina qui le tue foto o
                    </p>
                    <label className="btn-animated-album btn btn-secondary-custom btn-sm">
                      Sfoglia file
                      <input
                        type="file"
                        multiple
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading || isClosing}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-primary-custom">
                      File selezionati ({uploadedFiles.length})
                    </h6>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="position-relative"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="img-fluid rounded w-100 h-100 object-fit-cover"
                        />
                        <button
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => removeFile(index)}
                          disabled={loading || isClosing}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-custom"
                onClick={handleClose}
                disabled={loading || isClosing}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn-animated-album btn btn-secondary-custom d-flex align-items-center"
                onClick={createNewAlbum}
                disabled={!albumTitle.trim() || loading || isClosing}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="me-2 animate-spin" />
                    <span>Creazione in corso...</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} className="me-2" />
                    <span>Crea album</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop del modale */}
      <div
        id="modale-backdrop"
        className="modal-backdrop  animation"
        style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
      ></div>
    </>
  );
};

export default DashboardModal;
