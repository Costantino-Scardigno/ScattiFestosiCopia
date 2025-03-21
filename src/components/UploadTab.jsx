import React, { useState } from "react";
import { Camera, X, Loader } from "lucide-react";

const UploadTab = ({
  albums,
  handleFileChange,
  uploadedFiles,
  removeFile,
  setUploadedFiles,
}) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUploadPhotos = async () => {
    // Verifica se sono stati selezionati file
    if (uploadedFiles.length === 0) {
      alert("Seleziona almeno un file da caricare");
      return;
    }

    // Ottieni l'ID dell'album selezionato dal dropdown
    const albumSelectElement = document.querySelector("select.form-select");
    const selectedAlbumId = albumSelectElement.value;

    if (!selectedAlbumId || selectedAlbumId === "Seleziona Album") {
      alert("Seleziona un album in cui caricare le foto");
      return;
    }

    // Imposta lo stato di caricamento
    setUploadLoading(true);

    try {
      // Recupera il token dal localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error(
          "Token di autenticazione non trovato. Effettua nuovamente il login."
        );
      }

      // Carica ogni file individualmente
      const uploadPromises = uploadedFiles.map(async (fileObj) => {
        const formData = new FormData();
        // Usa 'file' come nome del parametro invece di 'photos' (come richiesto dal backend)
        formData.append("file", fileObj.file);
        // Usa 'eventId' come nome del parametro invece di 'albumId' (come richiesto dal backend)
        formData.append("eventId", selectedAlbumId);

        const response = await fetch(
          "https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/photos/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Errore durante il caricamento della foto"
          );
        }

        return await response.json();
      });

      // Attendi che tutte le foto siano caricate
      await Promise.all(uploadPromises);

      // Resetta la lista dei file dopo l'upload
      setUploadedFiles([]);

      // Mostra un messaggio di successo
      alert("Foto caricate con successo!");
    } catch (error) {
      console.error("Errore durante il caricamento delle foto:", error);
      alert(
        error.message ||
          "Si è verificato un errore durante il caricamento delle foto"
      );
    } finally {
      // Reimposta lo stato del bottone
      setUploadLoading(false);
    }
  };

  return (
    <div className="card bg-white-custom shadow-sm border-custom">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="h5 mb-0 text-primary-custom">Carica nuove foto</h3>
          <select
            className="form-select border-custom"
            style={{ width: "auto" }}
          >
            <option>Seleziona Album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border-dashed-custom rounded p-5 text-center">
          <div className="d-flex flex-column align-items-center">
            <Camera size={48} className="text-secondary-custom mb-3" />
            <p className="text-muted-custom mb-2">Trascina qui le tue foto o</p>
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
              Supporta JPG, PNG e GIF fino a 1000MB
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
                    <p className="mb-0 small text-muted-custom">{file.size}</p>
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
              <button
                className="btn btn-primary-custom d-flex align-items-center"
                onClick={handleUploadPhotos}
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <Loader size={16} className="me-2 animate-spin" />
                    <span>Caricamento...</span>
                  </>
                ) : (
                  <span>Carica foto</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadTab;
