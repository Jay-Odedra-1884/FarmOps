import toast from "react-hot-toast";

export const getExpenseCategories = async (authToken) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses-categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        
        return await res.json();
    } catch (error) {
        console.error(error);
    } 
};

export const addExpense = async (authToken, expenseData) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(expenseData),
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Transaction added successfully!");
        } else {
            const firstError = data.errors
                ? Object.values(data.errors)[0][0]
                : data.message;
            toast.error(firstError || "Failed to add transaction");
        }
        return data;
    } catch (error) {
        toast.error("Failed to add transaction");
        console.error(error);
    }
};

export const getAllExpenses = async (authToken, page = 1, filter = {}) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-expenses?page=${page}&${new URLSearchParams(filter)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const getExpensesByFarm = async (authToken, farmId, page = 1, filter = {}) => {
    try {
        const params = new URLSearchParams({ farm_id: farmId, page, ...filter });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const addExpenseCategory = async (authToken, name) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses-categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Category added!");
        } else {
            const firstError = data.errors
                ? Object.values(data.errors)[0][0]
                : data.message;
            toast.error(firstError || "Failed to add category");
        }
        return data;
    } catch (error) {
        toast.error("Failed to add category");
        console.error(error);
    }
};
