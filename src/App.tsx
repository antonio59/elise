import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Eager load public pages
import PublicHome from "./pages/PublicHome";
import PublicGallery from "./pages/PublicGallery";
import NotFound from "./pages/NotFound";
import { Layout, PublicLayout, AuthLayout } from "./components/Layout";

// Lazy load auth pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

// Lazy load protected pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyBooks = lazy(() => import("./pages/MyBooks"));
const MyArt = lazy(() => import("./pages/MyArt"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Loading spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-violet-50 to-accent-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <PublicHome />
              </PublicLayout>
            }
          />
          <Route
            path="/gallery"
            element={
              <PublicLayout>
                <PublicGallery />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Suspense fallback={<PageLoader />}>
                  <Login />
                </Suspense>
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <Suspense fallback={<PageLoader />}>
                  <Signup />
                </Suspense>
              </AuthLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/books"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Layout>
                    <MyBooks />
                  </Layout>
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/art"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Layout>
                    <MyArt />
                  </Layout>
                </ProtectedRoute>
              </Suspense>
            }
          />

          {/* Legacy redirects */}
          <Route path="/bookshelf" element={<Navigate to="/books" replace />} />
          <Route path="/wishlist" element={<Navigate to="/books" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
