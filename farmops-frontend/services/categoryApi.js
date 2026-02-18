export const getCategory = async (authToken) => {
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: "GET",
            credentials: "include",
             headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
             }
        });
        
        return await res.json();

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}