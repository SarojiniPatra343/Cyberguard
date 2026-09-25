import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Detect from "./pages/Detect";
import Phishing from "./pages/Phishing";
import Respond from "./pages/Respond";
import Protect from "./pages/Protect";
import Dashboard from "./pages/Dashboard";
import EmailAnalyzer from "./pages/EmailAnalyzer";
import MessageAnalyzer from "./pages/MessageAnalyzer";
import ThreatHistory from "./pages/ThreatHistory";
import ImageAnalyzer from "./pages/image-analyzer";
import VoiceAnalyzer from "./pages/voice-analyzer";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* <Route
          path="/"
          element={<Login />}
        /> */}

        <Route
          path="/"
          element={<Home />}
        />
         <Route 
        path="/register"
        element={<Register />} 
       
       
        /> 

        <Route
          path="/analyze"
          element={<Analyze />}
        />

        <Route
          path="/detect"
          element={<Detect />}
        />

        <Route
          path="/phishing"
          element={<Phishing />}
        />

        <Route
          path="/respond"
          element={<Respond />}
        />

        <Route
          path="/protect"
          element={<Protect />}
        />
        <Route path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/email-analyzer"
          element={<EmailAnalyzer />}
        />

        <Route
          path="/message-analyzer"
          element={<MessageAnalyzer />}
        />
        <Route
          path="/threat-history"
          element={<ThreatHistory />}
        />

        <Route path="/image-analyzer" element={<ImageAnalyzer />} />
        <Route
    path="/voice-analyzer"
    element={<VoiceAnalyzer />}
/>
<Route path="/login" element={<Login />} />


      </Routes>

    </BrowserRouter>
  );
}


export default App;