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

export const getAllExpenses = async (authToken) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-expenses`, {
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
