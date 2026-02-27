"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  ReceiptIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SproutIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react";
import { MyHook } from "@/context/AppProvider";
import { getAllExpenses, getExpensesByFarm } from "@/services/expenseApi";

function ExpenseList({
  farmId = null,
  showFarm = true,
  title = "Transactions",
  onDataChange,
}) {
  const { authToken, expenseVersion } = MyHook();
  const [filter, setFilter] = useState({
    type: "",
    category_id: "",
    start_date: "",
    end_date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ── Summary totals ───────────────────────────────────────────────────────
  const totals = useMemo(() => {
    return expenses.reduce(
      (acc, e) => {
        if (e.type === "income") acc.income += Number(e.amount);
        else acc.expense += Number(e.amount);
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [expenses]);

  // Merge new values into existing filter object, reset page to 1
  const handleFilterChange = (key, val) => {
    setCurrentPage(1);
    setFilter((prev) => ({ ...prev, [key]: val }));
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const fmt = (n) =>
    "₹" +
    Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  //featch expenses
  useEffect(() => {
    if (authToken) {
      // Strip empty-string values so they don't get sent as query params
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([, v]) => v !== ""),
      );

      setLoading(true);
      if (farmId) {
        getExpensesByFarm(authToken, farmId, currentPage, cleanFilter)
          .then((res) => {
            setExpenses(res.data.data);
            setLastPage(res.data.last_page ?? 1);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        getAllExpenses(authToken, currentPage, cleanFilter)
          .then((res) => {
            setExpenses(res.data.data);
            setLastPage(res.data.last_page ?? 1);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [authToken, currentPage, filter, expenseVersion]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white shadow rounded-2xl p-5 md:p-6 flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {/* pagination */}

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:text-green-600"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= lastPage}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:text-green-600"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
            {[
              { label: "All", value: "" },
              { label: "Expense", value: "expense" },
              { label: "Income", value: "income" },
            ].map((tab) => (
              <button
                key={tab.value || "all"}
                onClick={() => handleFilterChange("type", tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  filter.type === tab.value
                    ? tab.value === "expense"
                      ? "bg-red-500 text-white shadow-sm"
                      : tab.value === "income"
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Summary pills ── */}
      {!loading && expenses.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-1.5 text-sm font-semibold">
            <TrendingDownIcon className="size-4" />
            {fmt(totals.expense)}
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 rounded-xl px-3 py-1.5 text-sm font-semibold">
            <TrendingUpIcon className="size-4" />
            {fmt(totals.income)}
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold border ${
              totals.income - totals.expense >= 0
                ? "bg-blue-50 border-blue-100 text-blue-600"
                : "bg-orange-50 border-orange-100 text-orange-600"
            }`}
          >
            Net: {fmt(totals.income - totals.expense)}
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div className="flex justify-center items-center py-14">
          <Spinner className="size-9" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400">
          <ReceiptIcon className="size-10 mb-3 text-gray-300" />
          <p className="text-sm">
            {filter.type === ""
              ? "No transactions yet."
              : `No ${filter.type} transactions found.`}
          </p>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">
                    {showFarm && "Farm / "}Crop
                  </th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition-colors duration-100"
                  >
                    {/* Type badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          expense.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {expense.type === "income" ? (
                          <TrendingUpIcon className="size-3" />
                        ) : (
                          <TrendingDownIcon className="size-3" />
                        )}
                        {expense.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>

                    {/* Farm / Crop */}
                    {showFarm ? (
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {expense.farm?.name && (
                            <span className="flex items-center gap-1 text-gray-700 font-medium">
                              <MapPinIcon className="size-3 text-gray-400 shrink-0" />
                              {expense.farm.name}
                            </span>
                          )}
                          {expense.crop?.name && (
                            <span className="flex items-center gap-1 text-gray-400 text-xs">
                              <SproutIcon className="size-3 text-green-400 shrink-0" />
                              {expense.crop.name}
                            </span>
                          )}
                        </div>
                      </td>
                    ) : (
                      <td>
                        {expense.crop?.name && (
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <SproutIcon className="size-3 text-green-400 shrink-0" />
                            {expense.crop.name}
                          </span>
                        )}
                      </td>
                    )}

                    {/* Category */}
                    <td className="px-4 py-3">
                      {expense.category?.name ? (
                        <span className="flex items-center gap-1 text-gray-600">
                          <TagIcon className="size-3 text-gray-400" />
                          {expense.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Note */}
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">
                      {expense.note || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-right font-semibold">
                      <span
                        className={
                          expense.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {expense.type === "income" ? "+" : "-"}
                        {fmt(expense.amount)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-right text-gray-400 whitespace-nowrap">
                      {fmtDate(expense.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <div className="flex sm:hidden flex-col gap-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className={`rounded-xl border px-4 py-3 flex items-start justify-between gap-3 ${
                  expense.type === "income"
                    ? "border-green-100 bg-green-50/40"
                    : "border-red-100 bg-red-50/40"
                }`}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        expense.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {expense.type === "income" ? "Income" : "Expense"}
                    </span>
                    {expense.category?.name && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <TagIcon className="size-3" />
                        {expense.category.name}
                      </span>
                    )}
                  </div>
                  {showFarm && expense.farm?.name && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="size-3" />
                      {expense.farm.name}
                      {expense.crop?.name && (
                        <span className="flex items-center gap-1">
                          <SproutIcon className="size-3 text-green-400" />
                          {expense.crop.name}
                        </span>
                      )}
                    </p>
                  )}
                  {!showFarm && expense.crop?.name && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <SproutIcon className="size-3 text-green-400" />
                      {expense.crop.name}
                    </p>
                  )}
                  {expense.note && (
                    <p className="text-xs text-gray-400 truncate">
                      {expense.note}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-0.5">
                    {fmtDate(expense.created_at)}
                  </p>
                </div>
                <span
                  className={`font-bold text-base shrink-0 ${
                    expense.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {expense.type === "income" ? "+" : "-"}
                  {fmt(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ExpenseList;
