import React, { useEffect, useState } from "react";

import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";
import UploadPhotoModal from "./UploadPhotoModal";
import ShareAlbumModal from "./ShareAlbumModal";
import "./Dashboard.css";
import DashboardModal from "./DashboardModal";
import DashboardFolders from "./DashboardFolders";

const Dashboard = () => {
  // Stati principali
  const [albumsFetch, setAlbumsFetch] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [activeTab, setActiveTab] = useState("albums");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadPhotoModalOpen, setUploadPhotoModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Stati per la condivisione
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [albumToShare, setAlbumToShare] = useState(null);

  // Stati per gli album condivisi
  const [sharedAlbums, setSharedAlbums] = useState([]);
  const [isLoadingShared, setIsLoadingShared] = useState(false);

  // Stato per la foto selezionata
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Funzione per aprire il modale di condivisione
  const openShareModal = (album) => {
    setAlbumToShare(album);
    setShareModalOpen(true);
  };

  // Callback per il successo della condivisione
  const handleShareSuccess = () => {
    console.log("Album condiviso con successo");

    setRefreshTrigger((prev) => prev + 1);
  };

  // Funzione per eliminare un album
  const deleteAlbum = async (albumId) => {
    // Chiede conferma prima di eliminare
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare questo album? Questa azione non può essere annullata."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/${albumId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione dell'album");
      }

      // Rimuovi l'album dalla lista locale
      setAlbumsFetch((prevAlbums) =>
        prevAlbums.filter((album) => album.id !== albumId)
      );

      // Aggiorna anche gli album filtrati
      setFilteredAlbums((prevAlbums) =>
        prevAlbums.filter((album) => album.id !== albumId)
      );

      // Se l'album eliminato è quello selezionato, deselezionalo
      if (selectedAlbum && selectedAlbum.id === albumId) {
        setSelectedAlbum(null);
      }

      console.log("Album eliminato con successo");
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'album:", error);
      alert("Si è verificato un errore durante l'eliminazione dell'album");
    }
  };

  // Funzione per gestire la ricerca degli album
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query || query.trim() === "") {
      // Se la query è vuota, mostra tutti gli album
      setFilteredAlbums(albumsFetch);
      setNoResults(false);
      return;
    }

    // Trasforma la query in minuscolo per una ricerca case-insensitive
    const lowercaseQuery = query.toLowerCase().trim();

    // Filtra gli album in base alla query
    const filtered = albumsFetch.filter((album) => {
      const nameMatch =
        album.name && album.name.toLowerCase().includes(lowercaseQuery);
      const descriptionMatch =
        album.description &&
        album.description.toLowerCase().includes(lowercaseQuery);

      return nameMatch || descriptionMatch;
    });

    // Aggiorna lo stato con gli album filtrati
    setFilteredAlbums(filtered);
    setNoResults(filtered.length === 0);
  };

  // Funzione per resettare la ricerca
  const resetSearch = () => {
    setSearchQuery("");
    setFilteredAlbums(albumsFetch);
    setNoResults(false);
  };

  // Funzione per recuperare tutti gli album
  const fetchAllAlbums = () => {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/api/events?includeDetails=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Album caricati:", data);
        setAlbumsFetch(data);
        setFilteredAlbums(data); // Inizializza anche gli album filtrati
      })
      .catch((error) => {
        console.error("Errore nel caricamento degli album:", error);
      });
  };

  // Funzione per recuperare gli album condivisi
  const fetchSharedAlbums = () => {
    setIsLoadingShared(true);
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/api/events/shared?includeDetails=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero degli album condivisi!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Album condivisi caricati:", data);
        setSharedAlbums(data);
        setIsLoadingShared(false);
      })
      .catch((error) => {
        console.error("Errore nel caricamento degli album condivisi:", error);
        setIsLoadingShared(false);
      });
  };

  // Carica gli album all'avvio del componente e quando refreshTrigger cambia
  useEffect(() => {
    fetchAllAlbums();
  }, [refreshTrigger]);

  // Effetto per caricare gli album condivisi quando la tab è "shared"
  useEffect(() => {
    if (activeTab === "shared") {
      fetchSharedAlbums();
    }
  }, [activeTab, refreshTrigger]);

  // Effetto per ricaricare i dati dell'album quando l'album selezionato cambia
  useEffect(() => {
    if (selectedAlbum && selectedAlbum.id) {
      refreshAlbumData(selectedAlbum.id);
    }
  }, [refreshTrigger]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        preview: URL.createObjectURL(file),
        file: file,
      }));
      setUploadedFiles([...uploadedFiles, ...filesArray]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const toggleLike = async (photoId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Verifica se la foto è già piaciuta per determinare l'azione da eseguire
      const checkResponse = await fetch(
        `http://localhost:8080/api/likes/photo/${photoId}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!checkResponse.ok) {
        throw new Error("Errore nella verifica dello stato del like");
      }

      const checkData = await checkResponse.json();
      const isLiked = checkData.message === "true";

      // Esegue l'azione (like o unlike)
      const response = await fetch(
        isLiked
          ? `http://localhost:8080/api/likes/photo/${photoId}`
          : `http://localhost:8080/api/likes`,
        {
          method: isLiked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: isLiked ? undefined : JSON.stringify({ photoId }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nell'operazione di like/unlike");
      }

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Errore nell'operazione di like:", error);
    }
  };

  const addComment = async (photoId, commentText) => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentText,
          photoId: photoId,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiunta del commento");
      }

      // Forza aggiornamento cambiando refreshTrigger
      setRefreshTrigger((prev) => prev + 1);

      // Resetta il campo di input del commento
      setNewComment("");
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  // Funzione per aggiornare i dati di un album specifico
  const refreshAlbumData = async (albumId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:8080/api/events/${albumId}?includeDetails=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Errore nel recupero dei dati dell'album ${albumId}`);
      }

      const data = await response.json();
      console.log("Album aggiornato:", data);

      // Aggiorna lo stato dell'album selezionato
      setSelectedAlbum(data);
    } catch (error) {
      console.error("Errore nell'aggiornamento dei dati dell'album:", error);
    }
  };

  const handleUploadSuccess = async () => {
    setRefreshTrigger((prev) => prev + 1);
    console.log("Upload completato, aggiornamento forzato");
  };

  // Callback per quando un nuovo album viene creato
  const handleAlbumCreated = (newAlbum) => {
    setAlbumsFetch((prevAlbums) => [newAlbum, ...prevAlbums]);
    setFilteredAlbums((prevAlbums) => [newAlbum, ...prevAlbums]);

    setUploadedFiles([]);

    // Forza un aggiornamento generale
    setRefreshTrigger((prev) => prev + 1);

    console.log("Nuovo album creato e aggiunto:", newAlbum);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dashboard">
      <DashboardHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="row">
        <DashboardFolders
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedAlbum={setSelectedAlbum}
          setSelectedPhoto={setSelectedPhoto}
        />
        <DashboardContent
          activeTab={activeTab}
          albums={filteredAlbums}
          sharedAlbums={sharedAlbums}
          isLoadingShared={isLoadingShared}
          setUploadModalOpen={setUploadModalOpen}
          selectedAlbum={selectedAlbum}
          selectedPhoto={selectedPhoto}
          setSelectedAlbum={setSelectedAlbum}
          setSelectedPhoto={setSelectedPhoto}
          toggleLike={toggleLike}
          addComment={addComment}
          newComment={newComment}
          setNewComment={setNewComment}
          handleFileChange={handleFileChange}
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
          setUploadPhotoModalOpen={setUploadPhotoModalOpen}
          refreshAlbumData={refreshAlbumData}
          refreshTrigger={refreshTrigger}
          deleteAlbum={deleteAlbum}
          noResults={noResults}
          resetSearch={resetSearch}
          openShareModal={openShareModal} // Passa la funzione di condivisione
        />
      </div>

      {/* Modali esistenti */}
      {uploadModalOpen && (
        <DashboardModal
          setUploadModalOpen={setUploadModalOpen}
          handleFileChange={handleFileChange}
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
          onAlbumCreated={handleAlbumCreated}
        />
      )}

      {uploadPhotoModalOpen && (
        <UploadPhotoModal
          isOpen={uploadPhotoModalOpen}
          onClose={() => setUploadPhotoModalOpen(false)}
          selectedAlbum={selectedAlbum}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Modale di condivisione */}
      {shareModalOpen && (
        <ShareAlbumModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          selectedAlbum={albumToShare}
          onShareSuccess={handleShareSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
