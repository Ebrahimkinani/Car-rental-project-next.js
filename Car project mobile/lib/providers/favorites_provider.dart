import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/car.dart';
import '../core/constants/storage_keys.dart';

class FavoritesProvider with ChangeNotifier {
  Set<String> _favoriteCarIds = {};

  Set<String> get favoriteCarIds => _favoriteCarIds;
  bool get hasFavorites => _favoriteCarIds.isNotEmpty;

  bool isFavorite(String carId) {
    return _favoriteCarIds.contains(carId);
  }

  void toggleFavorite(Car car) {
    if (_favoriteCarIds.contains(car.id)) {
      _favoriteCarIds.remove(car.id);
    } else {
      _favoriteCarIds.add(car.id);
    }
    saveFavoritesToPrefs();
    notifyListeners();
  }

  Future<void> loadFavoritesFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final favoritesJson = prefs.getString(StorageKeys.favorites);
      
      if (favoritesJson != null) {
        final List<dynamic> decoded = json.decode(favoritesJson);
        _favoriteCarIds = Set<String>.from(decoded);
      } else {
        _favoriteCarIds = {};
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading favorites from prefs: $e');
      _favoriteCarIds = {};
    }
  }

  Future<void> saveFavoritesToPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final favoritesJson = json.encode(_favoriteCarIds.toList());
      await prefs.setString(StorageKeys.favorites, favoritesJson);
    } catch (e) {
      debugPrint('Error saving favorites to prefs: $e');
    }
  }
}

