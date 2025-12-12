import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/theme/app_theme.dart';
import 'core/constants/storage_keys.dart';
import 'providers/auth_provider.dart';
import 'providers/car_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/settings_provider.dart';
import 'providers/favorites_provider.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/main_navigation_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CarProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
        ChangeNotifierProvider(create: (_) => FavoritesProvider()),
      ],
      child: Consumer<SettingsProvider>(
        builder: (context, settingsProvider, _) {
          return MaterialApp(
            title: 'Car Rental App',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            // darkTheme: AppTheme.darkTheme, // Ready for future implementation
            // themeMode: settingsProvider.isDarkMode 
            //     ? ThemeMode.dark 
            //     : ThemeMode.light,
            home: const AppInitializer(),
            // RTL support ready
            // locale: Locale(settingsProvider.languageCode),
            // supportedLocales: const [
            //   Locale('en', ''),
            //   Locale('ar', ''),
            // ],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('en', ''),
              Locale('ar', ''),
            ],
          );
        },
      ),
    );
  }
}

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Initialize providers
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final favoritesProvider = Provider.of<FavoritesProvider>(context, listen: false);
      final bookingProvider = Provider.of<BookingProvider>(context, listen: false);
      final settingsProvider = Provider.of<SettingsProvider>(context, listen: false);
      final carProvider = Provider.of<CarProvider>(context, listen: false);
      
      // Load data from SharedPreferences
      await authProvider.loadUserFromPrefs();
      await favoritesProvider.loadFavoritesFromPrefs();
      await settingsProvider.loadSettings();
      
      // Load bookings if user is logged in
      if (authProvider.isLoggedIn && authProvider.currentUser != null) {
        await bookingProvider.loadBookings(authProvider.currentUser!.id);
      }
      
      // Fetch cars
      await carProvider.fetchCars();
      
      if (!mounted) return;
      
      // Check onboarding status
      final hasSeenOnboarding = prefs.getBool(StorageKeys.hasSeenOnboarding) ?? false;
      final isLoggedIn = prefs.getBool(StorageKeys.isLoggedIn) ?? false;
      
      // Navigate based on app state
      if (!hasSeenOnboarding) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const OnboardingScreen()),
        );
      } else if (!isLoggedIn) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainNavigationScreen()),
        );
      }
    } catch (e) {
      debugPrint('Error initializing app: $e');
      if (!mounted) return;
      // On error, show onboarding
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const OnboardingScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 24),
            Text(
              'Car Rental App',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
    );
  }
}

