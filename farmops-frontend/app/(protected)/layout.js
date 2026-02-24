"use client"
import { MyHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {

    const { authToken } = MyHook();
    const router = useRouter();

    useEffect(() => {
        if(!authToken) {
            router.push('/auth');
        }
    }, [authToken]);

    return (
        <>
            {children}
        </>
    );
}