// ...existing code updated for unified heading + left margin...
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { SummarySection } from '@/components/Budget/SummarySection';
import { CategoriesSection } from '@/components/Budget/CategoriesSection';
import { AllocationDistributionSection } from '@/components/Budget/PieChart';
import { BudgetCategory } from '@/components/Budget/CategoryCard';

const STARTER_CATEGORIES: BudgetCategory[] = [
  { id: 1, name: 'Venue',         allocated: 0, actual: 0 },
  { id: 2, name: 'Catering',      allocated: 0, actual: 0 },
  { id: 3, name: 'Photography',   allocated: 0, actual: 0 },
  { id: 4, name: 'Florals',       allocated: 0, actual: 0 },
  { id: 5, name: 'Entertainment', allocated: 0, actual: 0 },
  { id: 6, name: 'Attire',        allocated: 0, actual: 0 },
  { id: 7, name: 'Misc',          allocated: 0, actual: 0 }
];

export default function BudgetAllocation() {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>(STARTER_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const b = localStorage.getItem('weddingBudget');
      const c = localStorage.getItem('weddingCategoriesV2');
      if (b) setTotalBudget(Number(b));
      if (c) setCategories(JSON.parse(c));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('weddingBudget', String(totalBudget));
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('weddingCategoriesV2', JSON.stringify(categories));
  }, [categories]);

  const totalAllocated = useMemo(() => categories.reduce((s, c) => s + c.allocated, 0), [categories]);
  const totalActual = useMemo(() => categories.reduce((s, c) => s + c.actual, 0), [categories]);
  const remainingBudget = totalBudget - totalAllocated;
  const utilizationPct = totalBudget ? (totalActual / totalBudget) * 100 : 0;
  const overBudgetAllocated = totalAllocated > totalBudget;
  const overBudgetActual = totalActual > totalBudget;

  const updateCategoryField = (id: number, field: keyof BudgetCategory, value: string) => {
    const num = Number(value);
    setCategories(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, [field]: field === 'name' ? value : (isNaN(num) || num < 0 ? 0 : num) }
          : c
      )
    );
  };

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return setError('Category name required');
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      return setError('Category already exists');
    }
    setCategories(prev => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1, name, allocated: 0, actual: 0 }
    ]);
    setNewCategoryName('');
    setError('');
  };

  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const autoDistributeRemaining = () => {
    if (totalBudget <= 0) return;
    const zeroCats = categories.filter(c => c.allocated === 0);
    if (!zeroCats.length) return;
    const available = totalBudget - totalAllocated;
    if (available <= 0) return;
    const share = Math.floor(available / zeroCats.length);
    setCategories(prev => prev.map(c => (c.allocated === 0 ? { ...c, allocated: share } : c)));
  };

  const resetAllocations = () => {
    if (!confirm('Reset all allocated amounts to 0?')) return;
    setCategories(prev => prev.map(c => ({ ...c, allocated: 0 })));
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
          </div>
          </div>
      </div>
    </CustomerMainLayout>
  );
}