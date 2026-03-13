import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuBrain } from "react-icons/lu";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Public links - always visible (removed Home, only Browse)
    const publicLinks = [
        { name: 'Browse', path: '/quizzes' },
    ];

    // Private links - only when logged in (removed My Quizzes)
    const privateLinks = [
        { name: 'Create Quiz', path: '/create' },
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        alert("Logged out successfully!");
    };

    return (
        <nav className="sticky top-0 left-0 w-full bg-white z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <LuBrain className="w-6 h-6 text-indigo-600" />
                        <span className="text-xl font-bold tracking-tight text-zinc-900">QuizMaster</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Public Links */}
                        {publicLinks.map((link, i) => (
                            <Link key={i} to={link.path} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}

                        {/* Private Links - Only when logged in */}
                        {isAuthenticated() && privateLinks.map((link, i) => (
                            <Link key={i} to={link.path} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated() ? (
                            <>
                                {/* Logged In - Show user name and logout */}
                                <span className="text-gray-700 font-medium">
                                    Hi, {user?.name}!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Logged Out - Show login and signup */}
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-3">
                        {/* Public Links */}
                        {publicLinks.map((link, i) => (
                            <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium">
                                {link.name}
                            </Link>
                        ))}

                        {/* Private Links - Only when logged in */}
                        {isAuthenticated() && privateLinks.map((link, i) => (
                            <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium">
                                {link.name}
                            </Link>
                        ))}

                        {/* Auth Links */}
                        {isAuthenticated() ? (
                            <>
                                <div className="pt-3 border-t border-gray-200">
                                    <span className="block text-gray-700 font-medium mb-3">
                                        Hi, {user?.name}!
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
