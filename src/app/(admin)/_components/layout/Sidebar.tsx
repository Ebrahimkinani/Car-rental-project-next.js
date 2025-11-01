"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {adminNav, NavItem} from "../../_config/admin-nav";
import {Fragment, useState, useEffect} from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    LogOut
} from "lucide-react";

function Item({
    item,
    depth = 0,
    onMobileClose,
    isCollapsed = false
} : {
    item : NavItem;
    depth? : number;
    onMobileClose? : () => void;
    isCollapsed? : boolean
}) {
    const pathname = usePathname();
    const active = item.href ? pathname.startsWith(item.href) : false;
    const Icon = item.icon;
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const baseClasses = `flex items-center ${
        isCollapsed ? 'justify-center gap-0' : 'gap-3'
    } rounded-xl ${
        isCollapsed ? 'px-2 py-3' : 'px-4 py-3'
    } text-sm font-medium transition-all duration-200 group relative`;
    const activeClasses = "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-blue-500/25";
    const inactiveClasses = "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm";
    const paddingClasses = isCollapsed ? "" : (
        depth > 0 ? `ml-${
            depth * 4
        }` : ""
    );

    const content = (
        <div className={
                `${baseClasses} ${
                    active ? activeClasses : inactiveClasses
                } ${paddingClasses}`
            }
            title={
                isCollapsed ? item.label : undefined
        }>
            {/* Active indicator */}
            {
            active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"/>
            )
        }

            {
            Icon ? (
                <Icon className={
                    `h-5 w-5 transition-colors ${
                        active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                    }`
                }/>
            ) : null
        }

            {
            !isCollapsed && <span className="flex-1">
                {
                item.label
            }</span>
        }

            {
            hasChildren && !isCollapsed && (
                <div onClick={
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }
                    }
                    className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer">
                    {
                    isExpanded ? (
                        <ChevronDown className="h-4 w-4"/>
                    ) : (
                        <ChevronRight className="h-4 w-4"/>
                    )
                } </div>
            )
        } </div>
    );

    const handleClick = () => {
        if (item.href && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <li> {
            item.href ? (
                <Link href={
                        item.href
                    }
                    className="block"
                    onClick={handleClick}>
                    {content} </Link>
            ) : (
                <button className="w-full text-left"
                    onClick={
                        () => setIsExpanded(!isExpanded)
                }>
                    {content} </button>
            )
        }

            {
            hasChildren && isExpanded && item.children && (
                <ul className="mt-2 ml-6 space-y-1 border-l border-slate-200 pl-4">
                    {
                    item.children.map((child) => (
                        <Item key={
                                child.label
                            }
                            item={child}
                            depth={
                                depth + 1
                            }
                            onMobileClose={onMobileClose}
                            isCollapsed={isCollapsed}/>
                    ))
                } </ul>
            )
        } </li>
    );
}

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse state
    const { logout } = useAuth();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return() => window.removeEventListener('resize', checkMobile);
    }, []);

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            if (isMobile) {
                closeMobileSidebar();
            }
        } catch (e) {
            console.error('Failed to logout', e);
        }
    };

    const SidebarContent = () => (
        <> {/* Header Section */}
            <div className="p-4 lg:p-6 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        {
                        !isCollapsed && (
                            <div className="hidden lg:block">
                                <h1 className="text-xl font-bold text-slate-900">Wheelzie</h1>
                                <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
                            </div>
                        )
                    } </div>
                    <div className="flex items-center gap-2">
                        {/* Desktop Collapse Toggle */}
                        <button onClick={
                                () => setIsCollapsed(!isCollapsed)
                            }
                            className="hidden lg:inline-flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label={
                                isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                            }
                            title={
                                isCollapsed ? 'Expand' : 'Collapse'
                        }>
                            {
                            isCollapsed ? (
                                <ChevronRight className="h-5 w-5 text-slate-600"/>
                            ) : (
                                <ChevronLeft className="h-5 w-5 text-slate-600"/>
                            )
                        } </button>
                        {/* Mobile Close Button */}
                        {
                        isMobile && (
                            <button onClick={closeMobileSidebar}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden">
                                <X className="h-5 w-5 text-slate-600"/>
                            </button>
                        )
                    } </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className={
                `flex-1 overflow-y-auto ${
                    isCollapsed ? 'p-2' : 'p-4'
                }`
            }>
                <nav>
                    <ul className="space-y-2">
                        {
                        adminNav.map((it) => (
                            <Fragment key={
                                it.label
                            }>
                                <Item item={it}
                                    onMobileClose={closeMobileSidebar}
                                    isCollapsed={isCollapsed}/>
                            </Fragment>
                        ))
                    } </ul>
                </nav>
            </div>

            {/* Footer Section */}
            <div className={
                `border-t border-slate-200 bg-slate-50/50 ${
                    isCollapsed ? 'p-2' : 'p-4'
                }`
            }>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`${
                        isCollapsed
                            ? 'w-full flex items-center justify-center p-2 rounded-lg hover:bg-white text-slate-700'
                            : 'w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-slate-700 hover:shadow-sm border border-slate-200'
                    }`}
                    title={isCollapsed ? 'Logout' : undefined}
                >
                    <LogOut className="h-4 w-4" />
                    { !isCollapsed && <span className="text-sm font-medium">Logout</span> }
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {
                    !isCollapsed && <span className="font-medium">System Online</span>
                } </div>
                {
                !isCollapsed && <p className="text-xs text-slate-400 mt-1">Enhanced Sidebar v2.0</p>
            } </div>
        </>
    );

    return (
        <> {/* Mobile Menu Button */}
            {
            isMobile && (
                <button onClick={
                        () => setIsMobileOpen(true)
                    }
                    className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 lg:hidden">
                    <Menu className="h-6 w-6 text-slate-700"/>
                </button>
            )
        }

            {/* Mobile Overlay */}
            {
            isMobile && isMobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeMobileSidebar}/>
            )
        }

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex shrink-0 border-r border-slate-200 bg-secondary-gradient shadow-sm flex-col transition-all duration-300 ${isCollapsed ? 'w-36' : 'w-72'}`}>
                <SidebarContent/>
            </aside>

            {/* Mobile Sidebar */}
            {
            isMobile && (
                <aside className={
                    `fixed top-0 left-0 h-full w-80 bg-secondary-gradient shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
                        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`
                }>
                    <SidebarContent/>
                </aside>
            )
        } </>
    );
}

