import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  Heart,
  MessageSquare,
  Share2,
  User,
  Send,
  Loader,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const PhotoView = ({
  selectedPhoto,
  setSelectedPhoto,
  selectedAlbum,
  toggleLike,
  addComment,
  newComment,
  setNewComment,
  refreshTrigger,
  deleteComment,
}) => {
  const [photoDetails, setPhotoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // Stato per tracciare se l'utente ha messo like

  // Stato per la gestione dei commenti con paginazione
  const [displayedComments, setDisplayedComments] = useState([]);
  const [commentsPerPage] = useState(9); // Numero di commenti da caricare inizialmente
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  // Ref per il contenitore dei commenti
  const commentsContainerRef = useRef(null);

  // Effetto per caricare i dettagli della foto
  useEffect(() => {
    if (!selectedPhoto || !selectedPhoto.id) {
      setLoading(false);
      return;
    }

    // Recupera il token dal localStorage
    const token = localStorage.getItem("authToken");

    fetch(
      `http://localhost:8080/api/photos/${selectedPhoto.id}?includeDetails=true`,
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
          throw new Error("Errore nel recupero dei dettagli della foto!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dettagli foto recuperati:", data);
        setPhotoDetails(data);

        // Gestione iniziale dei commenti
        const allComments = data.comments || [];
        const initialComments = allComments.slice(0, commentsPerPage);
        setDisplayedComments(initialComments);
        setHasMoreComments(allComments.length > commentsPerPage);

        setLoading(false);

        // Verifica lo stato del like
        checkLikeStatus(data.id);
      })
      .catch((error) => {
        console.error("Errore nel caricamento della foto:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedPhoto?.id, refreshTrigger, commentsPerPage]);

  // Funzione per verificare se l'utente ha messo like alla foto
  const checkLikeStatus = (photoId) => {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/api/likes/photo/${photoId}/status`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel verificare lo stato del like");
        }
        return response.json();
      })
      .then((data) => {
        // Imposta lo stato isLiked in base alla risposta
        setIsLiked(data.message === "true");
      })
      .catch((error) => {
        console.error("Errore nel verificare lo stato del like:", error);
      });
  };

  // Funzione per gestire il click sul pulsante like
  const handleToggleLike = () => {
    setIsLiked(!isLiked);

    // Chiama la funzione toggleLike passata come prop
    toggleLike(photoDetails.id);
  };

  // Funzione per caricare più commenti
  const loadMoreComments = () => {
    if (!photoDetails || !photoDetails.comments || loadingMoreComments) return;

    setLoadingMoreComments(true);

    const allComments = photoDetails.comments || [];
    const nextPage = currentPage + 1;
    const endIndex = nextPage * commentsPerPage;
    const nextComments = allComments.slice(0, endIndex);

    setDisplayedComments(nextComments);
    setCurrentPage(nextPage);
    setHasMoreComments(endIndex < allComments.length);
    setLoadingMoreComments(false);
  };

  // Evento scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        !commentsContainerRef.current ||
        !hasMoreComments ||
        loadingMoreComments
      )
        return;

      const { scrollTop, scrollHeight, clientHeight } =
        commentsContainerRef.current;

      // Carica più commenti quando l'utente è a 30px dal fondo
      if (scrollTop + clientHeight >= scrollHeight - 30) {
        loadMoreComments();
      }
    };

    const container = commentsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMoreComments, loadingMoreComments]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    addComment(selectedPhoto.id, newComment);
  };

  // Gestisce l'eliminazione di un commento
  const handleDeleteComment = (commentId) => {
    if (!commentId) return;

    if (window.confirm("Sei sicuro di voler eliminare questo commento?")) {
      // Recupera il token dal localStorage
      const token = localStorage.getItem("authToken");

      fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Errore nell'eliminazione del commento");
          }
          // Aggiorna la lista dei commenti visualizzati rimuovendo quello eliminato
          setDisplayedComments(
            displayedComments.filter((comment) => comment.id !== commentId)
          );

          // Se ci sono più commenti disponibili, aggiorna anche i dettagli della foto
          if (photoDetails && photoDetails.comments) {
            const updatedComments = photoDetails.comments.filter(
              (comment) => comment.id !== commentId
            );
            setPhotoDetails({
              ...photoDetails,
              comments: updatedComments,
            });
          }

          if (typeof deleteComment === "function") {
            deleteComment(commentId);
          }
        })
        .catch((error) => {
          console.error("Errore nell'eliminazione del commento:", error);
          alert(
            "Non è stato possibile eliminare il commento: " + error.message
          );
        });
    }
  };

  // Formatta la data in modo leggibile
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Mostra un indicatore di caricamento
  if (loading) {
    return (
      <div className="card shadow-sm border-custom">
        <div
          className="card-body d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <Loader
              className="animate-spin mb-3 text-secondary-custom"
              size={40}
            />
            <p className="text-primary-custom">Caricamento dettagli foto...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostra eventuali errori
  if (error) {
    return (
      <div className="card shadow-sm border-custom">
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
          <button
            className="btn btn-outline-custom"
            onClick={() => setSelectedPhoto(null)}
          >
            Torna all'album
          </button>
        </div>
      </div>
    );
  }

  // Usa photoDetails se disponibile, altrimenti selectedPhoto come fallback
  const photo = photoDetails || selectedPhoto;
  const comments = photo.comments || [];

  const likesCount =
    photo.likeCount !== undefined
      ? photo.likeCount
      : photo.likes !== undefined
      ? photo.likes
      : 0;

  return (
    <div className="card shadow-sm border-custom">
      <div className="card-header bg-dashboard d-flex align-items-center">
        <button
          className="bg-dashboard border-0 rounded-circle me-2"
          onClick={() => setSelectedPhoto(null)}
        >
          <ArrowLeft size={30} color="#e1bb80" />
        </button>
        <h5 className="mb-0 text-primary-custom">
          Foto da {selectedAlbum.name}
        </h5>
      </div>

      <div className="row g-0">
        <div className="col-md-8 bg-dashboard">
          <div className="bg-dark text-center">
            <img
              src={photo.url}
              alt=""
              className="img-fluid"
              style={{ maxHeight: "600px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/800/600";
              }}
            />
          </div>
          <div className="bg-dashboard border-top border-bottom p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button
                  className={`btn btn-sm ${
                    isLiked ? "text-danger" : "text-muted-custom"
                  } d-flex align-items-center d-flex flex-column flex-md-row`}
                  onClick={handleToggleLike}
                >
                  <Heart
                    className="me-1"
                    size={18}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  <span>{likesCount} mi piace</span>
                </button>
                <button className="btn btn-sm text-muted-custom d-flex align-items-center d-flex flex-column flex-md-row">
                  <MessageSquare
                    className="me-1 text-secondary-custom"
                    size={18}
                  />
                  <span>{comments.length} commenti</span>
                </button>
              </div>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted-custom">
                  {formatDate(photo.timestamp)}
                </small>
                <button className="btn btn-sm text-muted-custom">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-md-4 bg-dashboard border-start d-flex flex-column"
          style={{ minHeight: "300px" }}
        >
          <div
            className="flex-grow-1 overflow-auto p-3"
            ref={commentsContainerRef}
            style={{ maxHeight: "568px" }}
          >
            <h6 className="mb-3 text-primary-custom">Commenti</h6>
            {displayedComments.length === 0 ? (
              <p className="text-muted-custom text-center my-5">
                Nessun commento. Sii il primo a commentare!
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {displayedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="d-flex">
                      <div
                        className="rounded-circle bg-secondary-custom d-flex align-items-center justify-content-center me-2"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <User size={16} className="text-primary-custom" />
                      </div>
                      <div>
                        <div>
                          <span className="small fw-medium text-primary-custom">
                            {comment.username || comment.user}
                          </span>
                          <span
                            className="ms-2 text-muted-custom"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {formatDate(comment.createdAt) || comment.time}
                          </span>
                        </div>
                        <p className="mb-0 small text-primary-custom">
                          {comment.content || comment.text}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm text-danger p-0"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Elimina commento"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {loadingMoreComments && (
                  <div className="text-center py-2">
                    <div
                      className="spinner-border spinner-border-sm text-secondary-custom"
                      role="status"
                    >
                      <span className="visually-hidden">Caricamento...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 border-top">
            <div className="d-flex">
              <div
                className="rounded-circle bg-secondary-custom d-flex align-items-center justify-content-center me-2"
                style={{ width: "32px", height: "32px" }}
              >
                <User size={16} className="text-primary-custom" />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Aggiungi un commento..."
                  className="form-control rounded-pill pe-4 rounded-end-0"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    }
                  }}
                />
                <div className="input-group-append">
                  <button
                    className="btn rounded-end-4 border-start-0 rounded-top-0 rounded-start-0 border-custom bg-white-custom"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send size={16} className="text-secondary-custom" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoView;
