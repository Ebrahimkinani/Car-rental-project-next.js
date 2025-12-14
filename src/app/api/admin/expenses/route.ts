import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { getDb } from '@/lib/db/mongo';

// Types for the API response
export interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  vendor: string;
  description: string;
  method: string;
  status: string;
  amount: number;
}

export interface DailyPoint {
  date: string;
  total: number;
}

export interface ExpensesKPIs {
  totalAllTime: number;
  totalThisMonth: number;
  avgPerDay: number;
  topCategory: string | null;
}

export interface ExpensesResponse {
  data: ExpenseRow[];
  total: number;
  page: number;
  pageCount: number;
  filteredTotal: number;
  trend: DailyPoint[];
  kpis: ExpensesKPIs;
}

// GET /api/admin/expenses - Get all expenses with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper admin authentication
    // For now, we'll allow access without authentication to match other admin routes
    // In production, you should implement proper admin role checking:
    // const authResult = await verifySession(request);
    // if (!authResult) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // if (!isAdminRole(authResult.mongoUser.role)) {
    //   return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    // }

    await dbConnect();
    const db = await getDb();
    const expensesCollection = db.collection('expenses');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'All';
    const category = searchParams.get('category') || 'All';
    const method = searchParams.get('method') || 'All';
    const vendor = searchParams.get('vendor') || 'All';
    const search = searchParams.get('search') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortDir = searchParams.get('sortDir') || 'desc';

    // Build MongoDB query
    const query: any = {};

    // Status filter
    if (status !== 'All' && status.trim()) {
      query.status = status;
    }

    // Category filter
    if (category !== 'All' && category.trim()) {
      query.category = category;
    }

    // Method filter
    if (method !== 'All' && method.trim()) {
      query.method = method;
    }

    // Vendor filter
    if (vendor !== 'All' && vendor.trim()) {
      query.vendor = { $regex: vendor, $options: 'i' };
    }

    // Date range filter
    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from);
      }
      if (to) {
        query.date.$lte = new Date(to);
      }
    }

    // Amount range filter
    if (min || max) {
      query.amount = {};
      if (min) {
        query.amount.$gte = parseFloat(min);
      }
      if (max) {
        query.amount.$lte = parseFloat(max);
      }
    }

    // Search filter (description or vendor)
    if (search.trim()) {
      query.$or = [
        { description: { $regex: search.trim(), $options: 'i' } },
        { vendor: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await expensesCollection.countDocuments(query);

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortDir === 'desc' ? -1 : 1;

    // Fetch expenses with pagination
    const expenses = await expensesCollection.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Transform data for frontend
    const data: ExpenseRow[] = expenses.map(expense => {
      try {
        return {
          id: expense._id.toString(),
          date: typeof expense.date === 'string' ? expense.date.split('T')[0] : expense.date.toISOString().split('T')[0],
          category: expense.category,
          vendor: expense.vendor,
          description: expense.description,
          method: expense.method,
          status: expense.status,
          amount: expense.amount
        };
      } catch (err) {
        console.error('Error transforming expense:', err, expense);
        throw err;
      }
    });

    // Calculate filtered total (sum of amounts for filtered results)
    let filteredTotal = 0;
    try {
      const filteredTotalResult = await expensesCollection.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      filteredTotal = filteredTotalResult.length > 0 ? filteredTotalResult[0].total : 0;
    } catch (err) {
      console.error('Error calculating filtered total:', err);
    }

    // Calculate KPIs
    const kpis: ExpensesKPIs = {
      totalAllTime: 0,
      totalThisMonth: 0,
      avgPerDay: 0,
      topCategory: null
    };

    try {
      // Calculate total all time
      const totalAllTimeResult = await expensesCollection.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      kpis.totalAllTime = totalAllTimeResult.length > 0 ? totalAllTimeResult[0].total : 0;

      // Calculate this month's total
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthResult = await expensesCollection.aggregate([
        { $match: { date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      kpis.totalThisMonth = thisMonthResult.length > 0 ? thisMonthResult[0].total : 0;

      // Calculate average per day for filtered data
      if (filteredTotal > 0) {
        const dateRange = await expensesCollection.aggregate([
          { $match: query },
          { $group: { _id: null, minDate: { $min: '$date' }, maxDate: { $max: '$date' } } }
        ]).toArray();
        
        if (dateRange.length > 0 && dateRange[0].minDate && dateRange[0].maxDate) {
          const daysDiff = Math.ceil((dateRange[0].maxDate - dateRange[0].minDate) / (1000 * 60 * 60 * 24)) + 1;
          kpis.avgPerDay = daysDiff > 0 ? filteredTotal / daysDiff : 0;
        }
      }

      // Find top category for filtered data
      const topCategoryResult = await expensesCollection.aggregate([
        { $match: query },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]).toArray();
      kpis.topCategory = topCategoryResult.length > 0 ? topCategoryResult[0]._id : null;

    } catch (err) {
      console.error('Error calculating KPIs:', err);
    }

    // Generate trend data - daily aggregation
    let trend: DailyPoint[] = [];
    
    try {
      // First, get the actual date range from the filtered data
      const dateRangeResult = await expensesCollection.aggregate([
        { $match: query },
        { $group: { _id: null, minDate: { $min: '$date' }, maxDate: { $max: '$date' } } }
      ]).toArray();
      
      let startDate: Date;
      let endDate: Date;
      
      if (dateRangeResult.length > 0 && dateRangeResult[0].minDate && dateRangeResult[0].maxDate) {
        // Use the actual data range
        startDate = dateRangeResult[0].minDate;
        endDate = dateRangeResult[0].maxDate;
      } else {
        // Fallback to last 30 days if no data
        endDate = new Date();
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Generate trend data with daily aggregation
      const trendResult = await expensesCollection.aggregate([
        { 
          $match: { 
            ...query,
            date: { 
              $gte: startDate, 
              $lte: endDate 
            } 
          } 
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray();

      // Convert to the expected format
      trend = trendResult.map(item => ({
        date: item._id,
        total: item.total
      }));

      // Fill in missing dates with 0 values
      const dateMap = new Map(trend.map(item => [item.date, item.total]));
      const allDates: string[] = [];
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        allDates.push(d.toISOString().split('T')[0]);
      }
      
      trend = allDates.map(date => ({
        date,
        total: dateMap.get(date) || 0
      }));

    } catch (err) {
      console.error('Error generating trend data:', err);
      trend = [];
    }

    const response: ExpensesResponse = {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
      filteredTotal,
      trend,
      kpis
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST /api/admin/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    // TODO: Add proper admin authentication
    // For now, we'll allow access without authentication to match other admin routes
    // In production, you should implement proper admin role checking:
    // const authResult = await verifySession(request);
    // if (!authResult) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // if (!isAdminRole(authResult.mongoUser.role)) {
    //   return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    // }

    await dbConnect();
    const db = await getDb();
    const expensesCollection = db.collection('expenses');

    const body = await request.json();
    const { date, category, vendor, description, method, status, amount } = body;

    // TODO: add input validation (zod) for creating expenses
    // Validate required fields
    if (!date || !category || !vendor || !description || !method || !status || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: date, category, vendor, description, method, status, amount' },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate enum values
    const validCategories = ['Fuel', 'Maintenance', 'Salaries', 'Rent', 'Utilities', 'Insurance', 'Other'];
    const validMethods = ['Card', 'Cash', 'Money Transfer', 'Wallet'];
    const validStatuses = ['Pending', 'Posted', 'Refunded'];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validMethods.includes(method)) {
      return NextResponse.json(
        { error: `Invalid method. Must be one of: ${validMethods.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new expense
    const expense = {
      date: new Date(date),
      category,
      vendor: vendor.trim(),
      description: description.trim(),
      method,
      status,
      amount,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await expensesCollection.insertOne(expense);
    const savedExpense = { ...expense, _id: result.insertedId };

    // Transform for response
    const dateStr = savedExpense.date.toISOString().split('T')[0];
    const expenseRow: ExpenseRow = {
      id: savedExpense._id.toString(),
      date: dateStr,
      category: savedExpense.category,
      vendor: savedExpense.vendor,
      description: savedExpense.description,
      method: savedExpense.method,
      status: savedExpense.status,
      amount: savedExpense.amount
    };

    return NextResponse.json(expenseRow, { status: 201 });

  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
