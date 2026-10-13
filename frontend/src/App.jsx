
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ProgramOverview from "./components/ProgramOverview.jsx";
import ServiceCards from "./components/ServiceCards.jsx";
import AcademicInfo from "./components/AcademicInfo.jsx";
import NewsAnnouncements from "./components/NewsAnnouncements.jsx";
import Footer from "./components/Footer.jsx";
import PortalModal from "./components/PortalModal.jsx";
import "./App.css";

function App() {
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    message: "Menghubungkan ke REST API...",
    endpoint: "http://localhost:3000/api/health",
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("portal_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/health", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();
        setApiStatus({
          connected: true,
          message: data.message || "REST API berjalan dengan baik",
          endpoint: "http://localhost:3000/api/health",
        });
      } catch {
        setApiStatus({
          connected: false,
          message: "REST API offline / belum dijalankan pada port 3000",
          endpoint: "http://localhost:3000/api/health",
        });
      }
    };

    checkApiHealth();
  }, []);

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("portal_user", JSON.stringify(user));
      localStorage.setItem("portal_token", token);
    } catch {
      // storage error ignored
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("portal_user");
      localStorage.removeItem("portal_token");
    } catch {
      // storage error ignored
    }
    setIsPortalModalOpen(false);
  };

  const handleOpenLogin = () => {
    setSelectedService(null);
    setIsPortalModalOpen(true);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsPortalModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPortalModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="academic-portal-app">
      <Navbar 
        apiStatus={apiStatus} 
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin} 
      />

      <main>
        <Hero 
          apiStatus={apiStatus} 
          onOpenLogin={handleOpenLogin} 
        />
        
        <ServiceCards 
          onSelectService={handleSelectService} 
        />

        <ProgramOverview />

        <AcademicInfo />

        <NewsAnnouncements />
      </main>

      <Footer 
        onOpenLogin={handleOpenLogin} 
      />

      <PortalModal 
        isOpen={isPortalModalOpen} 
        onClose={handleCloseModal} 
        selectedService={selectedService}
        apiStatus={apiStatus}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;

