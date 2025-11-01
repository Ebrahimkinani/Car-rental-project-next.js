import { Category } from "@/types";
import { 
  getAllCategories, 
  getCategoryById, 
  getCategoryBySlug, 
  getActiveCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../categories/categories.service";

/**
 * Categories API Client
 * Provides a consistent API interface for category operations
 * TODO: Replace localStorage calls with actual HTTP requests to MongoDB backend
 */

export const categoriesApi = {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    return await getAllCategories();
  },

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category | null> {
    return await getCategoryById(id);
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category | null> {
    return await getCategoryBySlug(slug);
  },

  /**
   * Get active categories only
   */
  async getActive(): Promise<Category[]> {
    return await getActiveCategories();
  },

  /**
   * Create a new category
   */
  async create(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    return await createCategory(categoryData);
  },

  /**
   * Update an existing category
   */
  async update(id: string, updates: Partial<Omit<Category, "id" | "createdAt">>): Promise<Category> {
    return await updateCategory(id, updates);
  },

  /**
   * Delete a category
   */
  async delete(id: string): Promise<boolean> {
    return await deleteCategory(id);
  },

  /**
   * Search categories by name or description
   */
  async search(query: string): Promise<Category[]> {
    const categories = await getAllCategories();
    const lowercaseQuery = query.toLowerCase();
    
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(lowercaseQuery) ||
      cat.description.toLowerCase().includes(lowercaseQuery) ||
      cat.code.toLowerCase().includes(lowercaseQuery)
    );
  },

  /**
   * Get categories by status
   */
  async getByStatus(status: "Active" | "Hidden"): Promise<Category[]> {
    const categories = await getAllCategories();
    return categories.filter(cat => cat.status === status);
  }
};

/**
 * TODO: MongoDB Integration
 * 
 * Replace the above service calls with actual HTTP requests:
 * 
 * Example implementation:
 * 
 * export const categoriesApi = {
 *   async getAll(): Promise<Category[]> {
 *     const response = await fetch('/api/categories');
 *     if (!response.ok) throw new Error('Failed to fetch categories');
 *     return response.json();
 *   },
 * 
 *   async getById(id: string): Promise<Category | null> {
 *     const response = await fetch(`/api/categories/${id}`);
 *     if (response.status === 404) return null;
 *     if (!response.ok) throw new Error('Failed to fetch category');
 *     return response.json();
 *   },
 * 
 *   async create(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
 *     const response = await fetch('/api/categories', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(categoryData)
 *     });
 *     if (!response.ok) throw new Error('Failed to create category');
 *     return response.json();
 *   },
 * 
 *   // ... other methods
 * };
 */
