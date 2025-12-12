import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/storage_keys.dart';

class SettingsProvider with ChangeNotifier {
  bool _isDarkMode = false;
  String _languageCode = 'en';

  bool get isDarkMode => _isDarkMode;
  String get languageCode => _languageCode;

  Future<void> loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isDarkMode = prefs.getBool(StorageKeys.isDarkMode) ?? false;
      _languageCode = prefs.getString(StorageKeys.languageCode) ?? 'en';
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading settings: $e');
    }
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    await _saveTheme();
    notifyListeners();
  }

  Future<void> setLanguage(String languageCode) async {
    _languageCode = languageCode;
    await _saveLanguage();
    notifyListeners();
  }

  Future<void> _saveTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(StorageKeys.isDarkMode, _isDarkMode);
    } catch (e) {
      debugPrint('Error saving theme: $e');
    }
  }

  Future<void> _saveLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(StorageKeys.languageCode, _languageCode);
    } catch (e) {
      debugPrint('Error saving language: $e');
    }
  }
}

