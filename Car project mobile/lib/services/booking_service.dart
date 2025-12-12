import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/booking.dart';
import '../core/constants/storage_keys.dart';

class BookingService {
  Future<void> createBooking(Booking booking) async {
    final prefs = await SharedPreferences.getInstance();
    final bookingsJson = prefs.getString(StorageKeys.bookings);
    
    List<Booking> bookings = [];
    if (bookingsJson != null) {
      final List<dynamic> decoded = json.decode(bookingsJson);
      bookings = decoded.map((b) => Booking.fromJson(b as Map<String, dynamic>)).toList();
    }
    
    bookings.add(booking);
    
    final encoded = json.encode(bookings.map((b) => b.toJson()).toList());
    await prefs.setString(StorageKeys.bookings, encoded);
  }

  Future<List<Booking>> getBookings(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final bookingsJson = prefs.getString(StorageKeys.bookings);
    
    if (bookingsJson == null) {
      return [];
    }
    
    final List<dynamic> decoded = json.decode(bookingsJson);
    final List<Booking> bookings = decoded
        .map((b) => Booking.fromJson(b as Map<String, dynamic>))
        .toList();
    
    // Filter by user ID
    return bookings.where((b) => b.userId == userId).toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  Future<List<Booking>> getAllBookings() async {
    final prefs = await SharedPreferences.getInstance();
    final bookingsJson = prefs.getString(StorageKeys.bookings);
    
    if (bookingsJson == null) {
      return [];
    }
    
    final List<dynamic> decoded = json.decode(bookingsJson);
    return decoded
        .map((b) => Booking.fromJson(b as Map<String, dynamic>))
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }
}

