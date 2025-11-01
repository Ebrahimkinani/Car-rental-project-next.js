/**
 * Models Index
 * Central export for all Mongoose models
 * This ensures all models are registered before use
 */

import './Category';
import './Car';
import './Favorite';
import './Booking';
import './Expense';

// Re-export all models for convenience
export { Category } from './Category';
export { Car } from './Car';
export { Favorite } from './Favorite';
export { Booking } from './Booking';
export { Expense } from './Expense';
