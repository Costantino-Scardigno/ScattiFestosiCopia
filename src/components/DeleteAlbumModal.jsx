import React, { useState, useEffect } from "react";
import { AlertTriangle, Loader, Trash } from "lucide-react";

const DeleteAlbumModal = ({
  isOpen,
  onClose,
  onConfirm,
  album,
  isDeleting,
  error,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Reset isClosing quando il modale viene aperto
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen || !album) return null;

  // Funzione per gestire la chiusura con animazione
  const handleClose = () => {
    if (isDeleting || isClosing) return;

    setIsClosing(true);

    // Aggiungi le classi per l'animazione di chiusura
    const modale = document.getElementById("delete-album-modale");
    const modaleBackDrop = document.getElementById("delete-album-backdrop");

    if (modale && modaleBackDrop) {
      modale.classList.remove("animation");
      modale.classList.add("animation-close");
      modaleBackDrop.classList.remove("animation");
      modaleBackDrop.classList.add("animation-close");

      // Attendi che l'animazione finisca prima di chiudere effettivamente il modale
      setTimeout(() => {
        onClose();
      }, 1000); // Durata dell'animazione (1 secondo)
    } else {
      // Fallback in caso gli elementi non vengano trovati
      onClose();
    }
  };

  // Funzione per gestire la conferma con animazione
  const handleConfirm = () => {
    if (isDeleting || isClosing) return;

    onConfirm();
  };

  return (
    <>
      {/* Modale */}
      <div
        id="delete-album-modale"
        className="modal animation"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light-custom border-custom rounded-4">
            <div className="modal-header bg-secondary-custom border-bottom border-custom rounded-top-4">
              <h5 className="modal-title text-primary-custom">
                Conferma eliminazione album
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={isDeleting || isClosing}
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 text-danger">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p className="mb-0 text-primary-custom">
                    Sei sicuro di voler eliminare l'album{" "}
                    <strong>{album.name}</strong>?
                  </p>
                  <p className="small text-muted-custom mb-0">
                    Questa azione eliminerà l'album e tutte le foto in esso
                    contenute. Non può essere annullata.
                  </p>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              <div className="mt-3">
                <div
                  className="rounded overflow-hidden"
                  style={{ height: "150px" }}
                >
                  <img
                    src={
                      album.photos && album.photos.length > 0
                        ? album.photos[0].url
                        : "https://i.pinimg.com/736x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg"
                    }
                    alt={album.name || "Album da eliminare"}
                    className="img-fluid w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <h6 className="text-primary-custom mb-0">{album.name}</h6>
                  <div className="small text-muted-custom">
                    {album.photoCount} foto
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top border-custom">
              <button
                type="button"
                className="btn btn-outline-custom"
                onClick={handleClose}
                disabled={isDeleting || isClosing}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn btn-danger d-flex align-items-center"
                onClick={handleConfirm}
                disabled={isDeleting || isClosing}
              >
                {isDeleting ? (
                  <>
                    <Loader size={16} className="me-2 animate-spin" />
                    <span>Eliminazione...</span>
                  </>
                ) : (
                  <>
                    <Trash size={16} className="me-2" />
                    <span>Elimina album</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop del modale */}
      <div
        id="delete-album-backdrop"
        className="modal-backdrop bg-modal animation"
        style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
      ></div>
    </>
  );
};

export default DeleteAlbumModal;
