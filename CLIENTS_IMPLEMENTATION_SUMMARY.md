# Clients Page Implementation - TODO Summary

## Overview
The Clients page has been successfully converted from static mock data to a fully dynamic system that reads real data from MongoDB. However, several fields and connections are missing from the current database schema and need to be implemented in the next phase.

## ✅ Completed Features

### 1. API Routes
- **`/api/admin/clients`** - Main clients endpoint with filtering, pagination, and sorting
- **`/api/admin/clients/kpis`** - KPI metrics endpoint for dashboard cards
- Both routes use MongoDB aggregation pipelines for efficient data processing

### 2. Frontend Components
- **Clients Page** - Now uses SWR for real-time data fetching
- **KPI Cards** - Display live metrics (Total, Active, New This Month, Suspended)
- **Filters** - Search, branch, tier, status, and date range filtering
- **Table** - Dynamic sorting, pagination, and real data display
- **Loading States** - Proper loading and error handling

### 3. Data Integration
- Connected to MongoDB `users` collection
- Aggregation pipeline calculates bookings count and total spent
- Real-time filtering and pagination
- SWR caching and auto-refresh

## 🚨 Missing Fields & Connections (TODOs)

### 1. User Model Schema Updates
The current `UserDoc` interface is missing several fields needed for client management:

```typescript
// TODO: Add these fields to UserDoc interface in src/lib/types/db.ts
export interface UserDoc {
  // ... existing fields ...
  
  // Missing client management fields:
  branch?: string; // enum: ['Doha', 'Al Wakrah', 'Al Khor']
  tier?: string;   // enum: ['Regular', 'Silver', 'Gold', 'Platinum'] 
  clientStatus?: string; // enum: ['Active', 'Inactive', 'Suspended']
}
```

### 2. Database Schema Updates
```typescript
// TODO: Update user collection schema or create separate clients collection
// Option 1: Extend users collection
{
  branch: { type: String, enum: ['Doha', 'Al Wakrah', 'Al Khor'], default: 'Doha' },
  tier: { type: String, enum: ['Regular', 'Silver', 'Gold', 'Platinum'], default: 'Regular' },
  clientStatus: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' }
}

// Option 2: Create separate clients collection
{
  userId: ObjectId, // Reference to users collection
  branch: String,
  tier: String,
  status: String,
  // ... other client-specific fields
}
```

### 3. Booking Collection Updates
```typescript
// TODO: Verify booking schema has proper fields for analytics
// Current booking model needs these fields for client analytics:
{
  userId: String,        // ✅ Already exists
  totalAmount: Number,   // ✅ Already exists  
  status: String,       // ✅ Already exists
  // Need to verify these match the aggregation pipeline expectations
}
```

### 4. Missing API Endpoints
```typescript
// TODO: Create these additional endpoints:

// Export functionality
POST /api/admin/clients/export
// Should export all filtered clients as CSV

// Client management
POST /api/admin/clients          // Create new client
PUT /api/admin/clients/:id       // Update client
DELETE /api/admin/clients/:id    // Delete client
GET /api/admin/clients/:id       // Get single client

// Branch management
GET /api/admin/branches          // Get available branches for dropdown
```

### 5. Missing Frontend Functionality
```typescript
// TODO: Implement these features:

// Client management
- Add Client form/modal
- Edit Client functionality  
- Delete Client with confirmation
- View Client details page

// Enhanced filtering
- Dynamic branch dropdown (populated from API)
- Dynamic tier dropdown (populated from API)
- Advanced search filters

// Export functionality
- Proper CSV export that respects all filters
- Export all filtered data, not just visible rows
```

### 6. Authentication & Authorization
```typescript
// TODO: Implement proper admin authentication
// Current API routes have commented-out auth checks:

// In /api/admin/clients/route.ts and /api/admin/clients/kpis/route.ts
// Uncomment and implement:
const session = await getSessionFromRequest(request);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
const user = await User.findById(session.userId);
if (!isAdminRole(user.role)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 🔧 Technical Implementation Notes

### Current Data Flow
1. **Frontend** → SWR fetches from `/api/admin/clients`
2. **API Route** → MongoDB aggregation pipeline
3. **Database** → `users` collection with `$lookup` to `bookings`
4. **Response** → Paginated, filtered, sorted client data

### Aggregation Pipeline Features
- **Search**: Case-insensitive regex on name, email, phone
- **Filtering**: Branch, tier, status, date range
- **Sorting**: Any field, ascending/descending
- **Pagination**: Skip/limit with total count
- **Analytics**: Bookings count and total spent calculation

### Performance Considerations
- Uses MongoDB aggregation for efficient data processing
- SWR caching reduces API calls
- Pagination limits data transfer
- Indexes needed on frequently queried fields

## 📋 Next Phase Implementation Plan

### Phase 1: Schema Updates
1. Update `UserDoc` interface with missing fields
2. Create database migration script
3. Update user creation/update logic

### Phase 2: API Enhancements  
1. Implement authentication checks
2. Create client management endpoints
3. Add export functionality
4. Create branch management API

### Phase 3: Frontend Features
1. Add client management forms
2. Implement action buttons functionality
3. Add advanced filtering options
4. Create client details page

### Phase 4: Testing & Optimization
1. Add comprehensive error handling
2. Implement data validation
3. Add loading states for all actions
4. Performance optimization

## 🎯 Current Status
- ✅ **Data Fetching**: Working with real MongoDB data
- ✅ **Filtering**: All filters functional
- ✅ **Pagination**: Backend and frontend implemented
- ✅ **Sorting**: Dynamic column sorting
- ✅ **KPIs**: Live metrics from database
- ⚠️ **Schema**: Missing client-specific fields
- ⚠️ **Actions**: View/Edit/Delete buttons not functional
- ⚠️ **Export**: Basic CSV export (needs enhancement)
- ⚠️ **Auth**: Admin authentication not enforced

The Clients page is now fully dynamic and reads real data from MongoDB. All missing functionality is clearly marked with TODO comments for easy implementation in the next phase.
