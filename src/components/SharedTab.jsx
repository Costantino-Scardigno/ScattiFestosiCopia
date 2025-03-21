import React from "react";
import { Share2, Heart, MessageSquare, Loader } from "lucide-react";

const SharedTab = ({ isLoadingShared, sharedAlbums, setSelectedAlbum }) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-4 mb-0 text-primary-custom">
          Album condivisi con me
        </h2>
      </div>

      {isLoadingShared ? (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary-custom" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p className="mt-3 text-primary-custom">
            Caricamento album condivisi...
          </p>
        </div>
      ) : sharedAlbums.length > 0 ? (
        <div className="row g-4">
          {sharedAlbums.map((album) => (
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
                        : "/api/placeholder/300/200"
                    }
                    alt={album.name}
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
                  <p className="text-muted-custom small">
                    Condiviso da: {album.createdByUsername}
                  </p>
                  <div className="d-flex justify-content-between small text-muted-custom mb-2">
                    <span>{album.photoCount} foto</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 small mb-3">
                    <div className="d-flex align-items-center">
                      <Heart size={14} className="me-1 text-danger" />
                      <span>{album.totalLikeCount || 0}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <MessageSquare
                        size={14}
                        className="me-1 text-secondary-custom"
                      />
                      <span>{album.totalCommentCount || 0}</span>
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
            className="rounded-circle bg-secondary-light d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <Share2 size={32} className="text-primary-custom" />
          </div>
          <h3 className="h5 mb-2 text-primary-custom">
            Nessun album condiviso
          </h3>
          <p className="text-muted-custom col-md-6 mx-auto">
            Al momento non ci sono album condivisi con te. Quando qualcuno
            condividerà un album, apparirà qui.
          </p>
        </div>
      )}
    </>
  );
};

export default SharedTab;
