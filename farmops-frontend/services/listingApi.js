export const getListings = async (authToken) => {
    try {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/listings", {
            method: "GET",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
            }
        });
        return await data.json();
    } catch (e) {
        console.error("Error fetching listings:", e);
        return [];
    }
}

export const addListing = async (authToken, listingData) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/listings", {
            method: "POST",
            credentials: "include",
            headers: {
                "authorization": `Bearer ${authToken}`,
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: listingData,
        })

        const responseData = await res.json();
        
        if(res.ok) {
            console.log("Listing added successfully:", responseData);
            return responseData;
        } else {
            console.error("Failed to add listing:", responseData);
            return null;
        }
    } catch (error) {
        console.error("Error adding listing:", error);
        return null;
    }
}