// Test script to verify booking functionality
const testBooking = async () => {
  try {
    console.log('Testing booking API...');
    
    // Test data
    const bookingData = {
      carId: '507f1f77bcf86cd799439011', // Replace with actual car ID
      pickupDate: '2024-02-01',
      returnDate: '2024-02-03',
      pickupLocation: 'Downtown Location',
      returnLocation: 'Downtown Location',
      pickupTime: '10:00',
      returnTime: '10:00',
      rentalDays: 2,
      dailyRate: 89,
      totalAmount: 178,
      notes: 'Test booking',
      driverAge: '25-29',
      additionalDriver: false,
      insurance: 'basic'
    };

    // Test creating a booking
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking created successfully:', result);
    } else {
      const error = await response.json();
      console.log('❌ Booking creation failed:', error);
    }

    // Test getting bookings
    const getResponse = await fetch('http://localhost:3000/api/bookings', {
      credentials: 'include'
    });

    if (getResponse.ok) {
      const bookings = await getResponse.json();
      console.log('✅ Bookings retrieved successfully:', bookings);
    } else {
      const error = await getResponse.json();
      console.log('❌ Failed to retrieve bookings:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testBooking();
