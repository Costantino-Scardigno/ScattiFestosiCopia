import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Heart, MessageSquare } from "lucide-react";

const SharedAlbumView = () => {
  const { shareCode } = useParams();
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se l'utente è autenticato
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      // Se non è autenticato, salva il codice di condivisione e reindirizza alla home
      localStorage.setItem("pendingShareCode", shareCode);
      navigate("/", { state: { openLoginForm: true } });
      return;
    }

    // Se l'utente è autenticato, procedi a caricare l'album condiviso
    fetchSharedAlbum();
  }, [shareCode, navigate]);

  const fetchSharedAlbum = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/events/share/${shareCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Aggiungi token per l'autenticazione
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Album non trovato");
        } else if (response.status === 401) {
          // Se non autorizzato, reindirizza al login
          localStorage.setItem("pendingShareCode", shareCode);
          navigate("/", { state: { openLoginForm: true } });
          return;
        }
        throw new Error("Errore nel recupero dell'album");
      }

      const data = await response.json();
      setAlbum(data);

      // Aggiungi automaticamente l'album agli album condivisi dell'utente se necessario
      saveSharedAlbumToUser(data.id);
    } catch (error) {
      console.error("Errore:", error);
      setError(error.message || "Si è verificato un errore");
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per salvare l'album condiviso all'utente corrente
  const saveSharedAlbumToUser = async (albumId) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken || !albumId) return;

    try {
      const response = await fetch(
        "https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/events/accept-share",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            eventId: albumId,
            shareCode: shareCode,
          }),
        }
      );

      if (!response.ok) {
        console.error("Errore nel salvare l'album condiviso");
        return;
      }

      console.log("Album condiviso salvato con successo");
    } catch (error) {
      console.error("Errore nel salvare l'album condiviso:", error);
    }
  };

  // Gestione visualizzazione foto
  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  // Funzione per andare alla dashboard con la tab degli album condivisi selezionata
  const goToDashboardShared = () => {
    navigate("/dashboard", { state: { activeTab: "shared" } });
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-3">Caricamento album condiviso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <Image size={64} className="text-muted" />
                </div>
                <h2 className="mb-3">Oops! Qualcosa è andato storto</h2>
                <p className="text-muted mb-4">{error}</p>
                <Link to="/" className="btn btn-primary">
                  Torna alla home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          Album non trovato o link non valido.
        </div>
        <Link to="/" className="btn btn-primary mt-3">
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="col-auto">
          <button
            className="btn btn-secondary-custom d-flex align-items-center"
            onClick={goToDashboardShared}
          >
            <span>Vai ai tuoi album condivisi</span>
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 "> {album.name}</h1>
          {album.description && <p className="lead">{album.description}</p>}
          <div className="d-flex align-items-center text-muted small">
            <span>{album.photoCount || album.photos.length} foto</span>
            <span className="mx-2">•</span>
            <span>Condiviso pubblicamente</span>
          </div>
        </div>
      </div>

      {album.photos && album.photos.length > 0 ? (
        <div className="row g-3">
          {album.photos.map((photo) => (
            <div
              className="col-6 col-md-4 col-lg-3"
              key={photo.id}
              onClick={() => openPhoto(photo)}
            >
              <div className="card h-100 border-0 shadow-sm hover-zoom">
                <div
                  className="card-img-container"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Album photo"}
                    className="card-img-top h-100 w-100 object-fit-cover"
                  />
                </div>
                <div className="card-footer bg-white border-0 py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center me-3">
                        <Heart size={14} className="text-danger me-1" />
                        <span>{photo.likeCount || 0}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <MessageSquare
                          size={14}
                          className="text-primary me-1"
                        />
                        <span>{photo.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <Image size={32} className="text-muted" />
          </div>
          <h3 className="h5">Nessuna foto in questo album</h3>
          <p className="text-muted">Questo album non contiene ancora foto.</p>
        </div>
      )}

      {/* Modale per visualizzare la foto selezionata */}
      {selectedPhoto && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closePhoto}
        >
          <button
            type="button"
            className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
            onClick={closePhoto}
            aria-label="Close"
          ></button>
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content modal-dialog  modal-dialog-center border-0 bg-transparent">
              <div className="modal-body p-0 text-center">
                <img
                  src={selectedPhoto.url}
                  className="img-fluid rounded mx-auto d-block"
                  alt={selectedPhoto.caption || "Photo view"}
                  style={{ maxHeight: "80vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedAlbumView;
