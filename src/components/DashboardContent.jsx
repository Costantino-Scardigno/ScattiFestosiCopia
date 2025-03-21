import React, { useState } from "react";
import "./Dashboard.css";
import AlbumView from "./AlbumView";
import PhotoView from "./PhotoView";
import DeleteAlbumModal from "./DeleteAlbumModal";
import AlbumsTab from "./AlbumsTab";
import SharedTab from "./SharedTab";
import UploadTab from "./UploadTab";
import SettingsTab from "./SettingsTab";

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

  // Renderizza il contenuto in base alla tab attiva
  const renderTabContent = () => {
    if (selectedAlbum && !selectedPhoto) {
      return (
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
      );
    }

    if (selectedPhoto) {
      return (
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
      );
    }

    // Altrimenti, mostra il contenuto basato sulla tab attiva
    switch (activeTab) {
      case "albums":
        return (
          <AlbumsTab
            albums={albums}
            noResults={noResults}
            resetSearch={resetSearch}
            setSelectedAlbum={setSelectedAlbum}
            setUploadModalOpen={setUploadModalOpen}
            openShareModal={openShareModal}
            openDeleteAlbumModal={openDeleteAlbumModal}
          />
        );
      case "shared":
        return (
          <SharedTab
            isLoadingShared={isLoadingShared}
            sharedAlbums={sharedAlbums}
            setSelectedAlbum={setSelectedAlbum}
          />
        );
      case "upload":
        return (
          <UploadTab
            albums={albums}
            handleFileChange={handleFileChange}
            uploadedFiles={uploadedFiles}
            removeFile={removeFile}
            setUploadedFiles={setUploadedFiles}
          />
        );
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 flex-grow-1 bg-light-custom">
      {renderTabContent()}

      {/* Utilizziamo il componente modale per l'eliminazione dell'album */}
      <DeleteAlbumModal
        isOpen={albumToDelete !== null}
        onClose={closeDeleteAlbumModal}
        onConfirm={confirmDeleteAlbum}
        album={albumToDelete}
        isDeleting={deleteLoading}
        error={deleteError}
      />
    </div>
  );
};

export default DashboardContent;
