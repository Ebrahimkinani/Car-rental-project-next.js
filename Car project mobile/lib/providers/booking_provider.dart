import 'package:flutter/foundation.dart';
import '../models/booking.dart';
import '../services/booking_service.dart';

class BookingProvider with ChangeNotifier {
  final BookingService _bookingService = BookingService();
  
  List<Booking> _bookings = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Booking> get bookings => _bookings;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> createBooking(Booking booking) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _bookingService.createBooking(booking);
      await loadBookings(booking.userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to create booking: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadBookings(String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _bookings = await _bookingService.getBookings(userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to load bookings: $e';
      _bookings = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  List<Booking> getBookingsByUserId(String userId) {
    return _bookings.where((b) => b.userId == userId).toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }
}

