import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ThreadPage from './pages/Thread'
import CreateThreadPage from './pages/CreateThread'
import EditThreadPage from './pages/EditThread'
import ProfilePage from './pages/Profile'
import CollectionsPage from './pages/Collections'
import CollectionDetailPage from './pages/CollectionDetail'
import NotFoundPage from './pages/NotFound'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          {/* Public routes */}
          <Route
            index
            element={<HomePage />}
          />
          <Route
            path="login"
            element={<LoginPage />}
          />
          <Route
            path="signup"
            element={<SignupPage />}
          />
          <Route
            path="thread/:id"
            element={<ThreadPage />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="create"
              element={<CreateThreadPage />}
            />
            <Route
              path="edit/:id"
              element={<EditThreadPage />}
            />
            <Route
              path="profile"
              element={<ProfilePage />}
            />
            <Route
              path="collections"
              element={<CollectionsPage />}
            />
            <Route
              path="collections/:id"
              element={<CollectionDetailPage />}
            />
          </Route>

          {/* 404 route */}
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
