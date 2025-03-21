import React from "react";
import {
  Plus,
  Share2,
  Image,
  Heart,
  MessageSquare,
  Search,
  Trash,
} from "lucide-react";

const AlbumsTab = ({
  albums,
  noResults,
  resetSearch,
  setSelectedAlbum,
  setUploadModalOpen,
  openShareModal,
  openDeleteAlbumModal,
}) => {
  return (
    <>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
        <h2 className="display-4 mb-0 text-primary-custom">I miei Album</h2>
        <button
          className="btn-secondary-custom border-1 btn d-flex align-items-center mt-3 mt-sm-0"
          onClick={() => setUploadModalOpen(true)}
        >
          <Plus size={18} className="me-2" />
          <span>Nuovo Album</span>
        </button>
      </div>

      {/* Visualizzazione messaggio per nessun risultato di ricerca */}
      {noResults ? (
        <div className="text-center mt-5 py-5">
          <div
            className="rounded-circle bg-secondary-light d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <Search size={32} className="text-primary-custom" />
          </div>
          <h3 className="h5 mb-2 text-primary-custom">Nessun album trovato</h3>
          <p className="text-muted-custom col-md-6 mx-auto">
            La tua ricerca non ha prodotto risultati. Prova a utilizzare termini
            diversi.
          </p>
          <button className="btn btn-outline-custom mt-3" onClick={resetSearch}>
            Mostra tutti gli album
          </button>
        </div>
      ) : albums.length > 0 ? (
        <div className="row g-4">
          {albums.map((album) => (
            <div key={album.id} className="col-md-6 col-lg-4">
              <div
                className="card bg-white-custom h-100 shadow-sm rounded-4 border-custom"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedAlbum(album)}
              >
                <div style={{ height: "200px" }}>
                  <img
                    src={
                      album.photos && album.photos.length > 0
                        ? album.photos[0].url
                        : "https://i.pinimg.com/736x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg"
                    }
                    alt={album.name || album.title}
                    className="card-img rounded-top-4 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/300/200";
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-primary-custom">
                    {album.name}
                  </h5>
                  <div className="d-flex justify-content-between small text-muted-custom mb-2">
                    <span>{album.photoCount} foto</span>
                    <div className="d-flex align-items-center">
                      <Share2 size={14} className="me-1" />
                      <span>Condiviso con {album.shared || 0}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 small mb-3">
                    <div className="d-flex align-items-center">
                      <Heart size={14} className="me-1 text-danger" />
                      <span className="me-1"></span>
                      <span>{album.totalLikeCount || 0}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <MessageSquare
                        size={14}
                        className="me-1 text-secondary-custom"
                      />
                      <span className="me-1"></span>
                      <span>{album.totalCommentCount || 0}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-delete-custom btn-animated-album rounded-5 flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={(e) => openDeleteAlbumModal(album, e)}
                    >
                      <Trash size={16} className="me-2" />
                      <span>Elimina</span>
                    </button>
                    <button
                      className="btn btn-secondary-custom btn-animated-album rounded-5 flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareModal(album);
                      }}
                    >
                      <Share2 size={16} className="me-2" />
                      <span>Condividi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="col-md-6 col-lg-4">
            <div
              className="card h-100 border-dashed-custom d-flex align-items-center justify-content-center p-4 bg-white-custom"
              style={{ cursor: "pointer" }}
              onClick={() => setUploadModalOpen(true)}
            >
              <div className="text-center">
                <div
                  className="rounded-circle bg-secondary-light d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <Plus size={32} className="text-primary-custom" />
                </div>
                <p className="mb-1 fw-medium text-primary-custom">
                  Crea nuovo album
                </p>
                <p className="text-muted-custom small">
                  Aggiungi e condividi nuove foto
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div
            className="rounded-circle bg-secondary-light d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <Image size={32} className="text-primary-custom" />
          </div>
          <h3 className="h5 mb-2 text-primary-custom">Nessun album creato</h3>
          <p className="text-muted-custom col-md-6 mx-auto">
            Non hai ancora creato album. Crea il tuo primo album per iniziare a
            condividere le tue foto!
          </p>
          <button
            className="btn btn-primary-custom mt-3"
            onClick={() => setUploadModalOpen(true)}
          >
            <Plus size={16} className="me-2" />
            Crea il tuo primo album
          </button>
        </div>
      )}
    </>
  );
};

export default AlbumsTab;
