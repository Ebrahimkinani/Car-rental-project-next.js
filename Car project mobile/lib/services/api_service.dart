import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/car.dart';

class ApiService {
  static const String baseUrl = 'https://dummyjson.com';
  
  Future<List<Car>> fetchCars() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/products'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic> products = data['products'] as List<dynamic>;
        
        // Map products to cars
        return products.map((product) => Car.fromJson(product as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Failed to load cars: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching cars: $e');
    }
  }
}

