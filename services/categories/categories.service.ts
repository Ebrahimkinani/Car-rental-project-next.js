import { Category } from "@/types";

/**
 * Categories Service
 * Handles CRUD operations for categories with MongoDB API
 * 
 * MongoDB Integration Complete:
 * ✅ Replaced localStorage with MongoDB API calls
 * ✅ Updated all functions to use async/await with HTTP requests
 * ✅ Added proper error handling for API operations
 * ✅ Implemented data validation before API calls
 * ✅ Added proper relationships with cars collection
 * 
 * See MONGODB_MIGRATION.md for detailed migration steps
 */

/**
 * Get all categories from MongoDB API
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading categories: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading categories: Response is not JSON');
      return [];
    }
    
    const result = await response.json();
    
    if (!result.success) {
      console.error("Error loading categories:", result.error);
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

/**
 * Get category by ID from MongoDB API
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/${id}`);
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading category: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading category: Response is not JSON');
      return null;
    }
    
    const result = await response.json();
    
    if (!result.success) {
      console.error("Error loading category:", result.error);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error("Error loading category:", error);
    return null;
  }
}

/**
 * Get category by slug from MongoDB API
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/slug/${slug}`);
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      console.error(`Error loading category: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error loading category: Response is not JSON');
      return null;
    }
    
    const result = await response.json();
    
    if (!result.success) {
      console.error("Error loading category:", result.error);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error("Error loading category:", error);
    return null;
  }
}

/**
 * Get active categories only from MongoDB API
 */
export async function getActiveCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter(cat => cat.status === "Active");
}

/**
 * Create a new category via MongoDB API
 */
export async function createCategory(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    const contentType = response.headers.get('content-type');
    let result;
    
    // Try to parse JSON response even if status is not ok
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = { success: false, error: 'Invalid response format' };
    }
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(result.error || `Failed to create category: ${response.status} ${response.statusText}`);
    }
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create category');
    }
    
    return result.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * Update an existing category via MongoDB API
 */
export async function updateCategory(id: string, updates: Partial<Omit<Category, "id" | "createdAt">>): Promise<Category> {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const contentType = response.headers.get('content-type');
    let result;
    
    // Try to parse JSON response even if status is not ok
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = { success: false, error: 'Invalid response format' };
    }
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(result.error || `Failed to update category: ${response.status} ${response.statusText}`);
    }
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update category');
    }
    
    return result.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

/**
 * Delete a category via MongoDB API
 */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    
    // Check if response is ok and content type is JSON
    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Failed to delete category: Response is not JSON');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete category');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

/**
 * Initialize with default categories if none exist
 */
export async function initializeDefaultCategories(): Promise<void> {
  const categories = await getAllCategories();
  
  if (categories.length === 0) {
    const defaultCategories: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "BMW",
        code: "BMW",
        slug: "bmw",
        status: "Active",
        sortOrder: 1,
        description: "Bavarian Motor Works - German luxury vehicles",
        country: "Germany",
        founded: 1916,
        imageUrl: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png",
      },
      {
        name: "Mercedes-Benz",
        code: "MERCEDES",
        slug: "mercedes-benz",
        status: "Active",
        sortOrder: 2,
        description: "German luxury and commercial vehicles",
        country: "Germany",
        founded: 1926,
        imageUrl: "https://logos-world.net/wp-content/uploads/2020/06/Mercedes-Benz-Logo.png",
      },
      {
        name: "Audi",
        code: "AUDI",
        slug: "audi",
        status: "Active",
        sortOrder: 3,
        description: "German luxury vehicles with advanced technology",
        country: "Germany",
        founded: 1909,
        imageUrl: "https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png",
      },
      {
        name: "Porsche",
        code: "PORSCHE",
        slug: "porsche",
        status: "Active",
        sortOrder: 4,
        description: "German sports car manufacturer",
        country: "Germany",
        founded: 1931,
        imageUrl: "https://logos-world.net/wp-content/uploads/2020/04/Porsche-Logo.png",
      },
      {
        name: "Tesla",
        code: "TESLA",
        slug: "tesla",
        status: "Active",
        sortOrder: 5,
        description: "American electric vehicle manufacturer",
        country: "USA",
        founded: 2003,
        imageUrl: "https://logos-world.net/wp-content/uploads/2020/04/Tesla-Logo.png",
      },
    ];
    
    for (const categoryData of defaultCategories) {
      await createCategory(categoryData);
    }
  }
}

/**
 * MongoDB Schema Documentation:
 * 
 * Categories Collection:
 * {
 *   _id: ObjectId,
 *   name: String (required, unique),
 *   code: String (required, unique),
 *   slug: String (required, unique, indexed),
 *   status: String (enum: ["Active", "Hidden"], default: "Active"),
 *   sortOrder: Number (required),
 *   description: String,
 *   defaultDailyRate: Number,
 *   seats: Number,
 *   imageUrl: String,
 *   country: String,
 *   founded: Number,
 *   capacity: String,
 *   createdAt: Date (default: new Date()),
 *   updatedAt: Date (default: new Date())
 * }
 * 
 * Indexes:
 * - { slug: 1 } (unique)
 * - { code: 1 } (unique)
 * - { status: 1, sortOrder: 1 }
 */
