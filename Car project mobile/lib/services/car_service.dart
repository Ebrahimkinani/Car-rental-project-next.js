import '../models/car.dart';
import '../models/brand.dart';
import 'api_service.dart';

class CarService {
  final ApiService _apiService = ApiService();

  Future<List<Car>> fetchCars() async {
    return await _apiService.fetchCars();
  }

  List<Car> filterCars({
    required List<Car> cars,
    String? searchQuery,
    String? brand,
    String? type,
    double? minPrice,
    double? maxPrice,
  }) {
    List<Car> filtered = cars;

    // Filter by search query
    if (searchQuery != null && searchQuery.isNotEmpty) {
      final query = searchQuery.toLowerCase();
      filtered = filtered.where((car) {
        return car.name.toLowerCase().contains(query) ||
            car.brand.toLowerCase().contains(query) ||
            (car.model?.toLowerCase().contains(query) ?? false) ||
            (car.description?.toLowerCase().contains(query) ?? false);
      }).toList();
    }

    // Filter by brand
    if (brand != null && brand.isNotEmpty) {
      filtered = filtered.where((car) => car.brand.toLowerCase() == brand.toLowerCase()).toList();
    }

    // Filter by type
    if (type != null && type.isNotEmpty) {
      filtered = filtered.where((car) => car.type?.toLowerCase() == type.toLowerCase()).toList();
    }

    // Filter by price range
    if (minPrice != null) {
      filtered = filtered.where((car) => car.price >= minPrice).toList();
    }
    if (maxPrice != null) {
      filtered = filtered.where((car) => car.price <= maxPrice).toList();
    }

    return filtered;
  }

  List<Car> getCarsByBrand(List<Car> cars, String brand) {
    return cars.where((car) => car.brand.toLowerCase() == brand.toLowerCase()).toList();
  }

  List<Brand> extractBrands(List<Car> cars) {
    final Map<String, Brand> brandsMap = {};
    
    for (var car in cars) {
      if (!brandsMap.containsKey(car.brand)) {
        brandsMap[car.brand] = Brand(
          id: car.brand.toLowerCase().replaceAll(' ', '_'),
          name: car.brand,
        );
      }
    }
    
    return brandsMap.values.toList()..sort((a, b) => a.name.compareTo(b.name));
  }

  List<String> getCarTypes(List<Car> cars) {
    final Set<String> types = {};
    for (var car in cars) {
      if (car.type != null && car.type!.isNotEmpty) {
        types.add(car.type!);
      }
    }
    return types.toList()..sort();
  }
}

