import React, { useState } from "react";
import { Loader, Trash2, AlertTriangle } from "lucide-react";

const DeletePhotoModal = ({ photo, onClose, onDelete }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(onClose, 1000);
  };

  const confirmDeletePhoto = async () => {
    if (!photo || !photo.id) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/photos/${photo.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione della foto");
      }

      // Chiama la funzione di callback per aggiornare l'UI
      onDelete(photo.id);
    } catch (error) {
      console.error("Errore nell'eliminazione della foto:", error);
      setDeleteError(
        error.message ||
          "Si è verificato un errore durante l'eliminazione della foto"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className={`modal fade show d-block ${
        isClosing ? "animation-close" : "animation"
      }`}
      style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-light-custom border-custom rounded-4">
          <div className="modal-header bg-secondary-custom border-bottom border-custom rounded-top-4">
            <h5 className="modal-title text-primary-custom">
              Conferma eliminazione
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={deleteLoading}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3 text-danger">
                <AlertTriangle size={32} />
              </div>
              <div>
                <p className="mb-0 text-primary-custom">
                  Sei sicuro di voler eliminare questa foto?
                </p>
                <p className="small text-muted-custom mb-0">
                  Questa azione non può essere annullata.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="alert alert-danger mt-3" role="alert">
                {deleteError}
              </div>
            )}

            <div className="mt-3">
              <div
                className="rounded overflow-hidden"
                style={{ height: "150px" }}
              >
                <img
                  src={photo.url}
                  alt="Foto da eliminare"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer border-top border-custom">
            <button
              type="button"
              className="btn btn-outline-custom"
              onClick={handleClose}
              disabled={deleteLoading}
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-danger d-flex align-items-center"
              onClick={confirmDeletePhoto}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader size={16} className="me-2 animate-spin" />
                  <span>Eliminazione...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} className="me-2" />
                  <span>Elimina foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePhotoModal;
