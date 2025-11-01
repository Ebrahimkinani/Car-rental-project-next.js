/**
 * Navbar Component
 * Main navigation header with theme toggle
 */

"use client";

import Link from "next/link";
import {useState, useEffect, useRef, Fragment} from "react";
import {NAV_LINKS} from "@/lib/constants";
import {cn} from "@/lib/utils";
import {useScrollPosition} from "@/hooks/useScrollPosition";
import {useAuth} from "@/contexts/AuthContext";
import {usePathname} from "next/navigation";
import {useState as useLocalState} from "react";
import {NotificationBell} from "@/components/notifications/NotificationBell";
import {NotificationDropdown} from "@/components/notifications/NotificationDropdown";
import {User, LogOut} from "lucide-react";

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isInHero = useScrollPosition();
    const {user, logout} = useAuth();
    const [showNotif, setShowNotif] = useLocalState(false);
    const notificationRef = useRef < HTMLDivElement > (null);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event : MouseEvent) {
            if (notificationRef.current && ! notificationRef.current.contains(event.target as Node)) {
                setShowNotif(false);
            }
        }

        if (showNotif) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return() => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotif]);

    // Hide the public navbar on admin routes
    if (pathname ?. startsWith("/admin")) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="fixed top-5 left-0 right-0 z-50">
            <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8">
                <div className={
                    cn("flex h-16 items-center justify-between rounded-2xl backdrop-blur-md border shadow-lg px-6 transition-all duration-300", isInHero ? "bg-white/20 border-white/30" : "bg-white/90 border-gray-200")
                }>
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-secondary-600">
                                <span className="text-xl font-bold text-white">C</span>
                            </div>
                            <span className="text-xl font-bold text-black! transition-colors duration-300">
                                Cars Project
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {
                        NAV_LINKS.map((link, index) => (
                            <Fragment key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm font-medium text-black! hover:text-primary-500! transition-colors duration-300">
                                    {link.label}
                                </Link>
                                {index === 0 && (
                                    <Link href="/cars/category" className="text-sm font-medium text-black! hover:text-primary-500! transition-colors duration-300">
                                        Categories
                                    </Link>
                                )}
                            </Fragment>
                        ))
                    } </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        {
                        user ? (
                            <> {/* Username and Bell Icon */}
                                <div className="hidden md:flex md:items-center md:space-x-2">
                                    <span className="text-sm text-black! font-medium">
                                        {
                                        user.firstName || user.username
                                    } </span>
                                    {/* Notifications */}
                                    <div className="relative"
                                        ref={notificationRef}>
                                        <NotificationBell onClick={
                                            () => setShowNotif((v) => !v)
                                        }/> {
                                        showNotif && (
                                            <NotificationDropdown/>)
                                    } </div>
                                </div>
                                {/* Profile Icon */}
                                <Link href="/profile" className="hidden md:flex items-center justify-center h-10 w-10 rounded-lg border border-primary-500 bg-transparent text-black! hover:text-primary-500! hover:border-primary-600 hover:bg-white transition-all duration-300" title="Profile">
                                    <User className="h-5 w-5"/>
                                </Link>
                                {/* Logout Icon */}
                                <button onClick={handleLogout}
                                    className="hidden md:flex items-center justify-center h-10 w-10 rounded-lg border border-primary-500 bg-transparent text-black! hover:text-primary-500! hover:border-primary-600 hover:bg-white transition-all duration-300"
                                    title="Logout">
                                    <LogOut className="h-5 w-5"/>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="hidden md:block rounded-lg border border-gray-300 text-black! hover:text-black! hover:border-gray-400 hover:bg-gray-50 px-4 py-2 text-sm font-medium transition-all duration-300">
                                    Sign In
                                </Link>
                            </>
                        )
                    }


                        {/* Mobile menu button */}
                        <button onClick={
                                () => setMobileMenuOpen(!mobileMenuOpen)
                            }
                            className="md:hidden"
                            aria-label="Toggle menu">
                            <svg className="h-6 w-6 text-black! transition-colors duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                {
                                mobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16"/>
                                )
                            } </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={
                cn("md:hidden mt-2", mobileMenuOpen ? "block" : "hidden")
            }>
                <div className={
                    cn("space-y-1 rounded-2xl backdrop-blur-md border shadow-lg px-4 pb-3 pt-2 transition-all duration-300", isInHero ? "bg-white/20 border-white/30" : "bg-white/90 border-gray-200")
                }>
                    {
                    NAV_LINKS.map((link, index) => (
                        <Fragment key={link.href}>
                            <Link
                                href={link.href}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-black! hover:text-primary-500! hover:bg-gray-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}>
                                {link.label}
                            </Link>
                            {index === 0 && (
                                <Link href="/cars/category" className="block rounded-lg px-3 py-2 text-base font-medium text-black! hover:text-primary-500! hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    Categories
                                </Link>
                            )}
                        </Fragment>
                    ))
                }

                    {
                    user ? (
                        <>
                            <div className="px-4 py-2 text-sm text-black! font-medium">
                                Welcome, {
                                user.firstName || user.username
                            } </div>
                            <Link href="/profile" className="flex items-center gap-2 rounded-lg border border-primary-500 text-black! hover:text-primary-500! hover:border-primary-600 hover:bg-gray-50 px-4 py-2 text-base font-medium transition-all duration-300"
                                onClick={
                                    () => setMobileMenuOpen(false)
                            }>
                                <User className="h-5 w-5"/>
                                Profile
                            </Link>
                            <button onClick={
                                    () => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }
                                }
                                className="flex items-center gap-2 rounded-lg border border-primary-500 text-black! hover:text-primary-500! hover:border-primary-600 hover:bg-gray-50 px-4 py-2 text-base font-medium transition-all duration-300">
                                <LogOut className="h-5 w-5"/>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="block rounded-lg border border-gray-300 text-black! hover:text-black! hover:border-gray-400 hover:bg-gray-50 px-4 py-2 text-base font-medium transition-all duration-300"
                                onClick={
                                    () => setMobileMenuOpen(false)
                            }>
                                Sign In
                            </Link>
                        </>
                    )
                } </div>
            </div>
        </nav>
    );
}

