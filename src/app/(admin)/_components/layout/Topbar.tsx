"use client";
import Image from "next/image";
import {useState} from "react";
import {NotificationBell} from "@/components/notifications/NotificationBell";
import {NotificationDropdown} from "@/components/notifications/NotificationDropdown";
import {useAuth} from "@/contexts/AuthContext";
import ProfileEditDrawer from "./ProfileEditDrawer";

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
    const {user} = useAuth();

    const displayName = user ?. firstName || user ?. lastName ? `${
        user.firstName || ''
    } ${
        user.lastName || ''
    }`.trim() : user ?. email ?. split('@')[0] || 'User';

    const avatarUrl = user ?. avatar || '/images/default-avatar.png';

    return (
        <>
            <header className="sticky top-0 z-10 flex h-23 items-center justify-between border-b bg-secondary-gradient px-8">
                <div className="font-medium">Admin</div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <NotificationBell onClick={
                            () => setOpen((v) => !v)
                        }/> {
                        open && <NotificationDropdown/>
                    } </div>
                    <button onClick={
                            () => setProfileDrawerOpen(true)
                        }
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                        <span className="text-sm text-zinc-600">
                            {displayName}</span>
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-200 border-2 border-zinc-300">
                            {
                            user ?. avatar ? (
                                <Image alt="avatar"
                                    src={avatarUrl}
                                    width={32}
                                    height={32}
                                    className="object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-500 to-purple-600 text-white text-xs font-bold">
                                    {
                                    displayName.charAt(0).toUpperCase()
                                } </div>
                            )
                        } </div>
                    </button>
                </div>
            </header>
            <ProfileEditDrawer open={profileDrawerOpen}
                onClose={
                    () => setProfileDrawerOpen(false)
                }/>
        </>
    );
}

