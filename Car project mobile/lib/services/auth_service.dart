import '../models/user.dart';

class AuthService {
  // Mock authentication - no real backend
  Future<User?> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Validate inputs
    if (email.isEmpty || password.isEmpty) {
      return null;
    }
    
    // Mock successful login - return a user
    return User(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: email.split('@')[0], // Use email prefix as name
      email: email,
      phone: '+1234567890',
    );
  }

  Future<User?> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Validate inputs
    if (name.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty) {
      return null;
    }
    
    // Mock successful registration - return a user
    return User(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      email: email,
      phone: phone,
    );
  }
}

