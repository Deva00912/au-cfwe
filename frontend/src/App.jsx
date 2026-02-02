import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import ErrorBoundary from "./components/ErrorBoundary";
import SimpleToastContainer from "./components/SimpleToastContainer";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AllNews from "./pages/AllNews";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import GalleryAdmin from "./pages/GalleryAdmin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NewsDetail from "./pages/NewsDetail";
import ProgramAdmin from "./pages/ProgramAdmin";
import ProgramDetail from "./pages/ProgramDetail";
import Programs from "./pages/Programs";
import ProjectAdmin from "./pages/ProjectAdmin";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import StaffManagement from "./pages/StaffManagement";
// import store from "./store/store";

function App() {
  return (
    // <Provider store={store}>
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <SimpleToastContainer />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/programs/:id" element={<ProgramDetail />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/news" element={<AllNews />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/programs"
                    element={
                      <ProtectedRoute>
                        <ProgramAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/gallery"
                    element={
                      <ProtectedRoute>
                        <GalleryAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/projects"
                    element={
                      <ProtectedRoute>
                        <ProjectAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/staff"
                    element={
                      <ProtectedRoute>
                        <StaffManagement />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </ToastProvider>
    </AuthProvider>
    // </Provider>
  );
}

export default App;
