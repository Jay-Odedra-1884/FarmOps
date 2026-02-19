export const getComments = async (authToken, listing_id, page = 1) => {
    try {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + `/comments/?listing_id=${listing_id}&page=${page}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
        })

        return await data.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return { success: false, message: 'Failed to fetch comments' };
    }
}