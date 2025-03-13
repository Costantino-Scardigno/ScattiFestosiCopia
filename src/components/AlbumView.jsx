import React, { useEffect, useState } from "react";
import {
  Image,
  Share2,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Upload,
  Loader,
  ArrowLeft,
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <Loader className="animate-spin" size={40} />
        <p className="mt-3">Caricamento album in corso...</p>
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
          className=" bg-dashboard border-0 rounded-circle me-2"
          onClick={() => setSelectedAlbum(null)}
        >
          <ArrowLeft size={30} color="#5b8fd2" />
        </button>
        <h2 className="h4 mb-0 display-6 font-effect">{eventData.name}</h2>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3 small d-none d-sm-inline-flex text-muted">
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
            <MessageSquare size={16} className="me-1 text-primary" />
            <span>{eventData.totalCommentCount || 0} commenti</span>
          </div>
        </div>
        <button
          className="btn-animated-album btn btn-album d-flex align-items-center"
          onClick={() => setUploadPhotoModalOpen(true)}
        >
          <Upload size={16} className="me-1" />
          <span>Aggiungi foto</span>
        </button>
      </div>
      <div className="row g-3">
        {eventData.photos && eventData.photos.length > 0 ? (
          eventData.photos.map((photo) => (
            <div key={photo.id} className="col-md-6 col-lg-3 ">
              <div
                className="card h-100 shadow-sm rounded-bottom-4"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div style={{ height: "200px" }}>
                  <img
                    src={photo.url}
                    alt=""
                    className="card-img  h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
                <div className="card-body bg-card-photo ">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center">
                        <Heart
                          className={`me-1 ${
                            photo.likes ? "text-danger" : "text-muted"
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
                          className="me-1 text-primary"
                          size={16}
                        />
                        <span className="small">
                          {photo.comments ? photo.comments.length : 0}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4">
            <p>Nessuna foto in questo album</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumView;
