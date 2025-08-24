import React from 'react';
import { PlusCircle } from 'lucide-react';
import { CategoryCard, BudgetCategory } from './CategoryCard';
import DefaultButton from '../DefaultButton';

interface Props {
  categories: BudgetCategory[];
  totalBudget: number;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  error: string;
  addCategory: () => void;
  updateCategoryField: (id: number, field: keyof BudgetCategory, value: string) => void;
  deleteCategory: (id: number) => void;
}

export const CategoriesSection: React.FC<Props> = ({
  categories,
  totalBudget,
  newCategoryName,
  setNewCategoryName,
  error,
  addCategory,
  updateCategoryField,
  deleteCategory
}) => {
  return (
    <>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-block tracking-wide uppercase">
          Add Category
        </h2>
        {error && (
          <div className="text-xs bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Category name (e.g. Cake)"
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <DefaultButton
          btnLabel='Add'
            handleClick={addCategory}
            Icon={<PlusCircle size={16} />}
            className="!w-auto inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-block tracking-wide uppercase">
          Categories
        </h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              totalBudget={totalBudget}
              onUpdate={updateCategoryField}
              onDelete={deleteCategory}
            />
          ))}
        </div>
      </section>
    </>
  );
};