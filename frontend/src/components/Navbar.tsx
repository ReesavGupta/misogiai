import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, PenLine, User, LogOut, LogIn, BookMarked } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggler'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold">ThreadSpire</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-1 text-sm font-medium"
                >
                  <PenLine size={18} />
                  <span>Create Thread</span>
                </Link>
                <Link
                  to="/collections"
                  className="flex items-center space-x-1 text-sm font-medium"
                >
                  <BookMarked size={18} />
                  <span>Collections</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-sm font-medium"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PenLine size={18} />
                  <span>Create Thread</span>
                </Link>
                <Link
                  to="/collections"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookMarked size={18} />
                  <span>Collections</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 w-full justify-start p-2"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
