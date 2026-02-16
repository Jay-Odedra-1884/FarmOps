import { AppProvider } from "@/context/AppProvider";

export default function Layout({ children }) {
    return (
        <>

            <AppProvider>
                {children}
            </AppProvider>
        </>
    );
}