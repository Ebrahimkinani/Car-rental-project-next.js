import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/car_provider.dart';
import '../widgets/my_nav_buttom.dart';
import 'brands/brands_screen.dart';
import 'search/search_screen.dart';
import 'favorites/favorites_screen.dart';
import 'settings/settings_screen.dart';
import 'home/home_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const BrandsScreen(),
    const SearchScreen(),
    const FavoritesScreen(),
    const SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    // Fetch cars on app start
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CarProvider>(context, listen: false).fetchCars();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
    
      body: _screens[_currentIndex],
      bottomNavigationBar: MyBottomNavBar(
        currentIndex: _currentIndex,
        onTabChange: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}

