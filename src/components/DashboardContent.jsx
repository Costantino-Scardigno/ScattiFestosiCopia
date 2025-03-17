import React, { useState } from "react";
import "./Dashboard.css";
import {
  Plus,
  Camera,
  Share2,
  Image,
  Heart,
  MessageSquare,
  Search,
  X,
  AlertTriangle,
  Loader,
} from "lucide-react";
import AlbumView from "./AlbumView";
import PhotoView from "./PhotoView";
import { Trash } from "lucide-react";

const DashboardContent = ({
  activeTab,
  albums,
  setUploadModalOpen,
  setUploadPhotoModalOpen,
  selectedAlbum,
  selectedPhoto,
  albumPhotos,
  setSelectedAlbum,
  setSelectedPhoto,
  toggleLike,
  addComment,
  newComment,
  deleteComment,
  setNewComment,
  handleFileChange,
  uploadedFiles,
  removeFile,
  refreshTrigger,
  deleteAlbum,
  noResults,
  resetSearch,
  openShareModal,
  isLoadingShared,
  sharedAlbums,
  setUploadedFiles,
}) => {
  // Stato per il modale di eliminazione album
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Funzione per aprire il modale di conferma eliminazione
  const openDeleteAlbumModal = (album, e) => {
    e.stopPropagation();
    setAlbumToDelete(album);
  };

  // Funzione per chiudere il modale
  const closeDeleteAlbumModal = () => {
    setAlbumToDelete(null);
    setDeleteError(null);
  };

  // Funzione per confermare l'eliminazione dell'album
  const confirmDeleteAlbum = async () => {
    if (!albumToDelete || !albumToDelete.id) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // Chiamata alla funzione deleteAlbum passata come prop
      await deleteAlbum(albumToDelete.id);

      // Chiudi il modale dopo l'eliminazione
      closeDeleteAlbumModal();
    } catch (error) {
      console.error("Errore nell'eliminazione dell'album:", error);
      setDeleteError(
        "Si è verificato un errore durante l'eliminazione dell'album"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 flex-grow-1  bg-light-custom">
      {!selectedAlbum && !selectedPhoto ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="display-4 mb-0 text-primary-custom">
              {activeTab === "albums" && "I miei Album"}
              {activeTab === "shared" && "Album condivisi con me"}
              {activeTab === "upload" && "Carica nuove foto"}
              {activeTab === "settings" && "Impostazioni"}
            </h2>
            {activeTab === "albums" && (
              <button
                className="btn-secondary-custom border-1 btn d-flex align-items-center"
                onClick={() => setUploadModalOpen(true)}
              >
                <Plus size={18} className="me-2" />
                <span>Nuovo Album</span>
              </button>
            )}
          </div>

          {activeTab === "albums" && (
            <>
              {/* Visualizzazione messaggio per nessun risultato di ricerca */}
              {noResults ? (
                <div className="text-center mt-5 py-5">
                  <div
                    className="rounded-circle bg-secondary-light d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <Search size={32} className="text-primary-custom" />
                  </div>
                  <h3 className="h5 mb-2 text-primary-custom">
                    Nessun album trovato
                  </h3>
                  <p className="text-muted-custom col-md-6 mx-auto">
                    La tua ricerca non ha prodotto risultati. Prova a utilizzare
                    termini diversi.
                  </p>
                  <button
                    className="btn btn-outline-custom mt-3"
                    onClick={resetSearch}
                  >
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
                  <h3 className="h5 mb-2 text-primary-custom">
                    Nessun album creato
                  </h3>
                  <p className="text-muted-custom col-md-6 mx-auto">
                    Non hai ancora creato album. Crea il tuo primo album per
                    iniziare a condividere le tue foto!
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
          )}

          {activeTab === "shared" && (
            <>
              {isLoadingShared ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-secondary-custom"
                    role="status"
                  >
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
                    Al momento non ci sono album condivisi con te. Quando
                    qualcuno condividerà un album, apparirà qui.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "upload" && (
            <div className="card bg-white-custom shadow-sm border-custom">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="h5 mb-0 text-primary-custom">
                    Carica nuove foto
                  </h3>
                  <select
                    className="form-select border-custom"
                    style={{ width: "auto" }}
                  >
                    <option>Seleziona Album</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                    <option value="new">Nuovo Album</option>
                  </select>
                </div>

                <div className="border-dashed-custom rounded p-5 text-center">
                  <div className="d-flex flex-column align-items-center">
                    <Camera size={48} className="text-secondary-custom mb-3" />
                    <p className="text-muted-custom mb-2">
                      Trascina qui le tue foto o
                    </p>
                    <label className="btn btn-secondary-custom">
                      Sfoglia file
                      <input
                        type="file"
                        multiple
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-muted-custom small mt-2">
                      Supporta JPG, PNG e GIF fino a 10MB
                    </p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="h6 mb-3 text-primary-custom">
                      File selezionati ({uploadedFiles.length})
                    </h4>
                    <div className="d-flex flex-column gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center bg-light-custom p-3 rounded border-custom"
                        >
                          <div
                            className="me-3"
                            style={{ width: "64px", height: "64px" }}
                          >
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="img-fluid rounded h-100 w-100 object-fit-cover"
                            />
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-medium text-primary-custom">
                              {file.name}
                            </p>
                            <p className="mb-0 small text-muted-custom">
                              {file.size}
                            </p>
                          </div>
                          <button
                            className="btn btn-sm btn-light rounded-circle"
                            onClick={() => removeFile(index)}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-outline-custom"
                        onClick={() => setUploadedFiles([])}
                      >
                        Annulla
                      </button>
                      <button className="btn btn-primary-custom">
                        Carica foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}

      {selectedAlbum && !selectedPhoto && (
        <AlbumView
          selectedAlbum={selectedAlbum}
          setSelectedAlbum={setSelectedAlbum}
          albumPhotos={albumPhotos}
          setSelectedPhoto={setSelectedPhoto}
          setUploadModalOpen={setUploadModalOpen}
          setUploadPhotoModalOpen={setUploadPhotoModalOpen}
          toggleLike={toggleLike}
          refreshTrigger={refreshTrigger}
          openShareModal={openShareModal}
        />
      )}

      {selectedPhoto && (
        <PhotoView
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
          selectedAlbum={selectedAlbum}
          toggleLike={toggleLike}
          addComment={addComment}
          newComment={newComment}
          setNewComment={setNewComment}
          refreshTrigger={refreshTrigger}
          deleteComment={deleteComment}
        />
      )}

      {/* Modale di conferma eliminazione album */}
      {albumToDelete && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
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
                  onClick={closeDeleteAlbumModal}
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
                      Sei sicuro di voler eliminare l'album{" "}
                      <strong>{albumToDelete.name}</strong>?
                    </p>
                    <p className="small text-muted-custom mb-0">
                      Questa azione eliminerà l'album e tutte le foto in esso
                      contenute. Non può essere annullata.
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
                      src={
                        albumToDelete.photos && albumToDelete.photos.length > 0
                          ? albumToDelete.photos[0].url
                          : "https://i.pinimg.com/736x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg"
                      }
                      alt={albumToDelete.name || "Album da eliminare"}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                  </div>
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <h6 className="text-primary-custom mb-0">
                      {albumToDelete.name}
                    </h6>
                    <div className="small text-muted-custom">
                      {albumToDelete.photoCount} foto
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top border-custom">
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={closeDeleteAlbumModal}
                  disabled={deleteLoading}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center"
                  onClick={confirmDeleteAlbum}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
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
      )}
    </div>
  );
};

export default DashboardContent;
