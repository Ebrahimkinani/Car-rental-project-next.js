import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../core/constants/storage_keys.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isLoggedIn => _currentUser != null;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _authService.login(email, password);
      
      if (user != null) {
        _currentUser = user;
        await _saveUserToPrefs();
        await _saveLoginStatus(true);
        _errorMessage = null;
      } else {
        _errorMessage = 'Invalid email or password';
      }
    } catch (e) {
      _errorMessage = 'Login failed: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _authService.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
      );
      
      if (user != null) {
        _currentUser = user;
        await _saveUserToPrefs();
        await _saveLoginStatus(true);
        _errorMessage = null;
      } else {
        _errorMessage = 'Registration failed. Please fill all fields.';
      }
    } catch (e) {
      _errorMessage = 'Registration failed: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    _errorMessage = null;
    await _saveLoginStatus(false);
    await _clearUserFromPrefs();
    notifyListeners();
  }

  Future<void> loadUserFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isLoggedIn = prefs.getBool(StorageKeys.isLoggedIn) ?? false;
      
      if (isLoggedIn) {
        final userJson = prefs.getString(StorageKeys.user);
        if (userJson != null) {
          final Map<String, dynamic> decoded = json.decode(userJson);
          _currentUser = User.fromJson(decoded);
        }
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading user from prefs: $e');
    }
  }

  Future<void> _saveUserToPrefs() async {
    if (_currentUser == null) return;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = json.encode(_currentUser!.toJson());
      await prefs.setString(StorageKeys.user, userJson);
    } catch (e) {
      debugPrint('Error saving user to prefs: $e');
    }
  }

  Future<void> _saveLoginStatus(bool status) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(StorageKeys.isLoggedIn, status);
    } catch (e) {
      debugPrint('Error saving login status: $e');
    }
  }

  Future<void> _clearUserFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(StorageKeys.user);
    } catch (e) {
      debugPrint('Error clearing user from prefs: $e');
    }
  }
}

