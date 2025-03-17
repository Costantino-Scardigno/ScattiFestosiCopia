import React, { useEffect, useState } from "react";
import {
  Image,
  Share2,
  Heart,
  MessageSquare,
  Upload,
  Loader,
  ArrowLeft,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

const AlbumView = ({
  selectedAlbum,
  setSelectedAlbum,
  setSelectedPhoto,
  setUploadPhotoModalOpen,
  toggleLike,
  refreshTrigger,
}) => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePhotoId, setDeletePhotoId] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    console.log("AlbumView useEffect - selectedAlbum:", selectedAlbum);

    // Verifica che esista un album selezionato con un ID
    if (!selectedAlbum || !selectedAlbum.id) {
      setLoading(false);
      return;
    }

    // Recupera il token dal localStorage
    const token = localStorage.getItem("authToken");
    setLoading(true);

    fetch(
      `http://localhost:8080/api/events/${selectedAlbum.id}?includeDetails=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Album data fetched:", data);
        setEventData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching album:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedAlbum?.id, refreshTrigger]);

  // Funzione per aprire il modale di conferma
  const openDeleteModal = (photo, e) => {
    e.stopPropagation();
    setPhotoToDelete(photo);
  };

  // Funzione per chiudere il modale
  const closeDeleteModal = () => {
    setPhotoToDelete(null);
    setDeleteError(null);
  };

  // Funzione per eliminare la foto
  const confirmDeletePhoto = async () => {
    if (!photoToDelete || !photoToDelete.id) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8080/api/photos/${photoToDelete.id}`,
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

      // Aggiorna i dati dopo l'eliminazione
      setEventData((prevData) => {
        return {
          ...prevData,
          photos: prevData.photos.filter((p) => p.id !== photoToDelete.id),
          photoCount: prevData.photoCount - 1,
        };
      });

      // Chiudi il modale
      closeDeleteModal();
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <Loader className="animate-spin text-secondary-custom" size={40} />
        <p className="mt-3 text-primary-custom">
          Caricamento album in corso...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!eventData) {
    return (
      <div className="alert alert-warning">Nessun dato album disponibile</div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <button
          className="bg-dashboard border-0 rounded-circle me-2"
          onClick={() => setSelectedAlbum(null)}
        >
          <ArrowLeft size={30} color="#e1bb80" />
        </button>
        <h2 className="h4 mb-0 display-6 font-effect">{eventData.name}</h2>
      </div>
      <div className="d-flex flex-column flex-sm-row justify-content-between  align-items-center mb-4">
        <div className="d-flex align-items-center gap-3 small text-muted-custom mb-4 mb-sm-0 mb-md-0 mb-lg-0">
          <div className="d-flex align-items-center">
            <Image size={16} className="me-1" />
            <span>{eventData.photoCount || 0} foto</span>
          </div>
          <div className="d-flex align-items-center">
            <Share2 size={16} className="me-1" />
            <span>Condiviso con 0</span>
          </div>
          <div className="d-flex align-items-center">
            <Heart size={16} className="me-1 text-danger" />
            <span>{eventData.totalLikeCount}</span>
          </div>
          <div className="d-flex align-items-center">
            <MessageSquare size={16} className="me-1 text-secondary-custom" />
            <span>{eventData.totalCommentCount || 0} commenti</span>
          </div>
        </div>
        <button
          className="btn-animated-album btn btn-secondary-custom d-flex align-items-center"
          onClick={() => setUploadPhotoModalOpen(true)}
        >
          <Upload size={16} className="me-1" />
          <span>Aggiungi foto</span>
        </button>
      </div>
      <div className="row g-3">
        {eventData.photos && eventData.photos.length > 0 ? (
          eventData.photos.map((photo) => (
            <div key={photo.id} className="col-md-6 col-lg-3">
              <div
                className="card h-100 shadow-sm rounded-4 border-custom"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div style={{ height: "200px" }}>
                  <img
                    src={photo.url}
                    alt=""
                    className="card-img rounded-bottom-0 rounded-top-4 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
                <div className="card-body rounded-bottom-4 bg-card-photo">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center">
                        <Heart
                          className={`me-1 ${
                            photo.likes ? "text-danger" : "text-muted-custom"
                          }`}
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(photo.id);
                          }}
                        />
                        <span className="small">{photo.likeCount || 0}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <MessageSquare
                          className="me-1 text-secondary-custom"
                          size={16}
                        />
                        <span className="small">
                          {photo.comments ? photo.comments.length : 0}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm border-custom btn-delete-custom"
                      onClick={(e) => openDeleteModal(photo, e)}
                    >
                      <Trash2 className="" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4">
            <p className="text-muted-custom">Nessuna foto in questo album</p>
          </div>
        )}
      </div>

      {/* Modale di conferma eliminazione */}
      {photoToDelete && (
        <div
          className="modal fade show d-block"
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
                  onClick={closeDeleteModal}
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
                      src={photoToDelete.url}
                      alt="Foto da eliminare"
                      className="img-fluid w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://i.pinimg.com/736x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top border-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={closeDeleteModal}
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
      )}
    </div>
  );
};

export default AlbumView;
