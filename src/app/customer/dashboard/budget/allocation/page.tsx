"use client";

import React, { useEffect, useMemo, useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { SummarySection } from "@/components/Budget/SummarySection";
import { CategoriesSection } from "@/components/Budget/CategoriesSection";
import { AllocationDistributionSection } from "@/components/Budget/PieChart";
import { BudgetCategory } from "@/components/Budget/CategoryCard";
import DefaultButton from "@/components/DefaultButton";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type ApiCategory = {
  id?: number;
  categoryName: string;
  allocatedAmount: number;
  spentAmount: number;
  createdAt?: string;
  updatedAt?: string;
  budgetId?: number;
};

type BudgetDetailsResponse = {
  code: number;
  success: boolean;
  message: string;
  data?: {
    id?: number;
    eventId?: string;
    TotalBudget?: number;
    AllocatedBudget?: number;
    RemainingBudget?: number;
    SpentBudget?: number;
    createdAt?: string;
    updatedAt?: string;
    categories?: ApiCategory[];
  };
};

type SaveBudgetResponse = {
  code: number;
  success: boolean;
  message: string;
  data?: {
    budget?: {
      id?: number;
      eventId?: string;
      TotalBudget?: number;
      AllocatedBudget?: number;
      RemainingBudget?: number;
      SpentBudget?: number;
      createdAt?: string;
      updatedAt?: string;
    };
    categories?: ApiCategory[];
  };
};

export default function BudgetAllocation() {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");
  const [, setIsLoading] = useState(true);

  const totalAllocated = useMemo(() => (categories || []).reduce((s, c) => s + (c.allocated || 0), 0), [categories]);
  const totalActual = useMemo(() => (categories || []).reduce((s, c) => s + (c.actual || 0), 0), [categories]);
  const remainingBudget = totalBudget - totalAllocated;
  const utilizationPct = totalBudget ? (totalActual / totalBudget) * 100 : 0;
  const overBudgetAllocated = totalAllocated > totalBudget;
  const overBudgetActual = totalActual > totalBudget;

  const getEventId = (): string | null => {
    try {
      const raw = localStorage.getItem("wedeaseEvent");
      if (raw) {
        const ev = JSON.parse(raw);
        if (ev?.id) return String(ev.id);
        if (ev?.eventId) return String(ev.eventId);
      }
    } catch {}
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("eventId");
      if (q) return q;
    } catch {}
    return null;
  };

  const fetchBudgetDetails = async (): Promise<void> => {
    setIsLoading(true);
    const eventId = getEventId();
    if (!eventId) {
      toast.error("Please create an event first.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Missing authentication token. Please login.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/budget/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || `Failed to load budget (${res.status})`);
      }

      const json: BudgetDetailsResponse = await res.json().catch(() => ({} as BudgetDetailsResponse));
      if (!json?.success || !json?.data) {
        throw new Error(json?.message || "Invalid budget response from server");
      }

      // Use server values
      setTotalBudget(json.data.TotalBudget ?? 0);

      const serverCats = json.data.categories ?? [];
      setCategories(
        serverCats.map((c) => ({
          id: c.id ?? Math.floor(Math.random() * 1_000_000),
          name: c.categoryName,
          allocated: c.allocatedAmount,
          actual: c.spentAmount ?? 0,
        }))
      );

      toast.success("Budget details retrieved successfully");
    } catch (err: unknown) {
      console.error("Error loading budget details:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load budget details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBudgetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCategoryField = (id: number, field: keyof BudgetCategory, value: string) => {
    const num = Number(value);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: field === "name" ? value : (isNaN(num) || num < 0 ? 0 : num) } : c
      )
    );
  };

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return setError("Category name required");
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return setError("Category already exists");
    }
    setCategories((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1, name, allocated: 0, actual: 0 },
    ]);
    setNewCategoryName("");
    setError("");
  };

  // Integrate delete API - id is category id
  const deleteCategory = async (id: number) => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Missing authentication token. Please login.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/budget/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json: BudgetDetailsResponse = await res.json().catch(() => ({} as BudgetDetailsResponse));
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed to delete category (${res.status})`);
      }

      // Use server response 
      setTotalBudget(json.data?.TotalBudget ?? totalBudget);
      const serverCats = json.data?.categories ?? [];
      setCategories(
        serverCats.map((c) => ({
          id: c.id ?? Math.floor(Math.random() * 1_000_000),
          name: c.categoryName,
          allocated: c.allocatedAmount,
          actual: c.spentAmount ?? 0,
        }))
      );

      toast.success(json.message || "Category deleted successfully");
    } catch (err: unknown) {
      console.error("Error deleting category:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const autoDistributeRemaining = () => {
    if (totalBudget <= 0) return;
    const zeroCats = categories.filter((c) => c.allocated === 0);
    if (!zeroCats.length) return;
    const available = totalBudget - totalAllocated;
    if (available <= 0) return;
    const share = Math.floor(available / zeroCats.length);
    setCategories((prev) => prev.map((c) => (c.allocated === 0 ? { ...c, allocated: share } : c)));
  };

  const resetAllocations = () => {
    setCategories((prev) => prev.map((c) => ({ ...c, allocated: 0 })));
  };

  const handleSave = async () => {
    const eventId = getEventId();
    if (!eventId) {
      toast.error("Event id not found. Create an event before saving budget.");
      return;
    }

    if (!totalBudget || totalBudget <= 0) {
      toast.error("Total budget must be greater than zero.");
      return;
    }

    if (!categories || !categories.length) {
      toast.error("Add at least one category before saving.");
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      toast.error("Missing authentication token. Please login.");
      return;
    }

    try {
      const payload = {
        eventId,
        TotalBudget: Number(totalBudget),
        categories: categories.map((c) => ({
          categoryName: c.name,
          allocatedAmount: Number(c.allocated || 0),
          spentAmount: Number(c.actual || 0),
        })),
      };

      const res = await fetch(`${BASE_URL}/budget/save-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json: SaveBudgetResponse = await res.json().catch(() => ({} as SaveBudgetResponse));
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed to save budget (${res.status})`);
      }

      // Update UI from server response
      const respCats = json.data?.categories ?? [];
      setTotalBudget(json.data?.budget?.TotalBudget ?? totalBudget);
      setCategories(
        respCats.map((rc) => ({
          id: rc.id ?? Math.floor(Math.random() * 1_000_000),
          name: rc.categoryName,
          allocated: rc.allocatedAmount,
          actual: rc.spentAmount ?? 0,
        }))
      );

      toast.success(json.message || "Budget saved successfully");
    } catch (err: unknown) {
      console.error("Save budget error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save budget. Please try again.");
    } 
  };

  const exportCSV = () => {
    const now = new Date();
    const timestamp = now.toISOString();

    const meta: string[][] = [
      ["Report", "Wedding Budget Allocation"],
      ["Generated At (UTC)", timestamp],
      ["Total Budget (LKR)", totalBudget.toString()],
      ["Total Allocated (LKR)", totalAllocated.toString()],
      ["Total Actual (LKR)", totalActual.toString()],
      ["Remaining (LKR)", remainingBudget.toString()],
      ["Utilization % (Actual / Total Budget)", totalBudget ? ((totalActual / totalBudget) * 100).toFixed(2) + "%" : "0%"],
      ["Over Allocated?", totalAllocated > totalBudget ? "YES" : "NO"],
      ["Over Actual?", totalActual > totalBudget ? "YES" : "NO"],
      [],
    ];

    const header = [
      "Category",
      "Allocated (LKR)",
      "Actual (LKR)",
      "Variance (Actual-Allocated)",
      "Variance % (vs Alloc)",
      "Allocated % of Total",
      "Actual % of Total",
      "Category Utilization % (Actual / Allocated)",
    ];

    const body = categories.map((c) => {
      const variance = c.actual - c.allocated;
      const variancePct = c.allocated ? (variance / c.allocated) * 100 : 0;
      const allocPct = totalBudget ? (c.allocated / totalBudget) * 100 : 0;
      const actualPct = totalBudget ? (c.actual / totalBudget) * 100 : 0;
      const catUtilPct = c.allocated ? (c.actual / c.allocated) * 100 : 0;
      return [
        c.name,
        c.allocated.toString(),
        c.actual.toString(),
        variance.toString(),
        variancePct.toFixed(2) + "%",
        allocPct.toFixed(2) + "%",
        actualPct.toFixed(2) + "%",
        catUtilPct.toFixed(2) + "%",
      ];
    });

    body.push([
      "TOTAL",
      totalAllocated.toString(),
      totalActual.toString(),
      (totalActual - totalAllocated).toString(),
      totalAllocated ? (((totalActual - totalAllocated) / totalAllocated) * 100).toFixed(2) + "%" : "0%",
      "100%",
      totalBudget ? ((totalActual / totalBudget) * 100).toFixed(2) + "%" : "0%",
      totalAllocated ? ((totalActual / totalAllocated) * 100).toFixed(2) + "%" : "0%",
    ]);

    const rows = [...meta, header, ...body];

    const csv = rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget-allocation-detailed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CustomerMainLayout>
      <div>
        <div className="max-w-5xl pb-24">
          <SummarySection
            totalBudget={totalBudget}
            setTotalBudget={setTotalBudget}
            totalAllocated={totalAllocated}
            totalActual={totalActual}
            remaining={remainingBudget}
            utilizationPct={utilizationPct}
            overAllocated={overBudgetAllocated}
            overActual={overBudgetActual}
            onAutoDistribute={autoDistributeRemaining}
            onReset={resetAllocations}
          />

          <div className="mt-16 space-y-16">
            <CategoriesSection
              categories={categories}
              totalBudget={totalBudget}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              error={error}
              addCategory={addCategory}
              updateCategoryField={updateCategoryField}
              deleteCategory={deleteCategory}
            />
            <AllocationDistributionSection categories={categories} />

            {/* Action bar */}
            <div className="flex items-center gap-4 mt-6">
              <DefaultButton
                btnLabel="Export CSV"
                handleClick={exportCSV}
                className="!bg-white !text-purple-600 border border-purple-600 rounded-md hover:!bg-purple-50 flex items-center justify-center tracking-wide"
              />

              <DefaultButton btnLabel={"Save"} handleClick={handleSave}  />
            </div>
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}