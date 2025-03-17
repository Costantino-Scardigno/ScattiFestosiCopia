import React from "react";
import { Folder, Share2, Upload, Settings } from "lucide-react";

const DashboardSideBar = ({
  activeTab,
  setActiveTab,
  setSelectedAlbum,
  setSelectedPhoto,
}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedAlbum(null);
    setSelectedPhoto(null);
  };

  return (
    <div className="bg-dashboard shadow-sm p-3 pt-4 border-bottom border-top ">
      <div className="d-lg-flex d-md-flex d-sm-flex-column align-items-center gap-4">
        <button
          className={`border-1 text-start d-flex align-items-center justify-content-center mb-2 py-2 rounded-5 bg-review w-100 ${
            activeTab === "albums"
              ? "btn-dash"
              : "btn-white text-primary-custom"
          }`}
          onClick={() => handleTabClick("albums")}
        >
          <Folder className="mx-2" size={18} />
          <span>I miei Album</span>
        </button>
        <button
          className={`border-1 text-start d-flex align-items-center justify-content-center mb-2 py-2 rounded-5 bg-review w-100 ${
            activeTab === "shared"
              ? "btn-dash"
              : "btn-white text-primary-custom"
          }`}
          onClick={() => handleTabClick("shared")}
        >
          <Share2 className="mx-2" size={18} />
          <span>Condivisi con me</span>
        </button>
        <button
          className={`border-1 text-start d-flex align-items-center justify-content-center mb-2 py-2 rounded-5 bg-review w-100 ${
            activeTab === "upload"
              ? "btn-dash"
              : "btn-white text-primary-custom"
          }`}
          onClick={() => handleTabClick("upload")}
        >
          <Upload className="mx-2" size={18} />
          <span>Carica Foto</span>
        </button>
        <button
          className={`border-1 text-start d-flex align-items-center justify-content-center mb-2 py-2 rounded-5 bg-review w-100 ${
            activeTab === "settings"
              ? "btn-dash"
              : "btn-white text-primary-custom"
          }`}
          onClick={() => handleTabClick("settings")}
        >
          <Settings className="mx-2" size={18} />
          <span>Impostazioni</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSideBar;
