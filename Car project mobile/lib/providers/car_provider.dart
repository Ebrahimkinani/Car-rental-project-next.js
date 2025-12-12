import 'package:flutter/foundation.dart';
import '../models/car.dart';
import '../services/car_service.dart';

class CarProvider with ChangeNotifier {
  final CarService _carService = CarService();
  
  List<Car> _allCars = [];
  List<Car> _filteredCars = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Car> get allCars => _allCars;
  List<Car> get filteredCars => _filteredCars.isEmpty ? _allCars : _filteredCars;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchCars() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _allCars = await _carService.fetchCars();
      _filteredCars = [];
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to load cars: $e';
      _allCars = [];
      _filteredCars = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void filterCars({
    String? searchQuery,
    String? brand,
    String? type,
    double? minPrice,
    double? maxPrice,
  }) {
    _filteredCars = _carService.filterCars(
      cars: _allCars,
      searchQuery: searchQuery,
      brand: brand,
      type: type,
      minPrice: minPrice,
      maxPrice: maxPrice,
    );
    notifyListeners();
  }

  void clearFilters() {
    _filteredCars = [];
    notifyListeners();
  }

  List<Car> getCarsByBrand(String brand) {
    return _carService.getCarsByBrand(_allCars, brand);
  }

  Car? getCarById(String id) {
    try {
      return _allCars.firstWhere((car) => car.id == id);
    } catch (e) {
      return null;
    }
  }
}

