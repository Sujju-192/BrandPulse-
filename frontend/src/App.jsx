import Landing from "./components/Landing";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Influencers from "./components/Influencers";
import NewPrompt from "./components/Input";
import Strategy from "./components/Strategy";
import CreativePage from "./components/CreativePage";
import Ideas from "./components/Ideas";
import Profile from "./components/ProfilePage";
import InfluencerFinder from "./components/SearchInflu";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="add-idea" replace />} />
          <Route path="add-idea" element={<Ideas/>} />
          <Route path="new-prompt" element={<NewPrompt/>} />
          <Route path="influencers" element={<InfluencerFinder />} />
          <Route path="creative" element={<CreativePage />} />
          <Route path="strategy" element={<Strategy/>} />
          <Route path="profile" element={<Profile/>} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/app" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
