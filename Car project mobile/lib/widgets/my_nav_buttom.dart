import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import '../core/constants/app_strings.dart';

class MyBottomNavBar extends StatelessWidget {
  final void Function(int)? onTabChange;
  final int currentIndex;
  const MyBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTabChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            blurRadius: 20,
            color: Colors.black.withOpacity(0.1),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 8),
          child: GNav(
            selectedIndex: currentIndex,
            activeColor: const Color.fromARGB(255, 20, 20, 20),
            color: const Color.fromARGB(255, 99, 98, 98),
            tabActiveBorder: Border.all(
              color: const Color.fromARGB(255, 52, 52, 52),
              width: 0.5,
            ),
            tabBackgroundColor: Colors.grey.shade100,
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            tabBorderRadius: 100,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            gap: 8,
            onTabChange: (value) => onTabChange!(value),
            tabs: [
              GButton(
                icon: Icons.home,
                iconSize: 24,
                text: AppStrings.home,
              ),
              GButton(
                icon: Icons.category,
                iconSize: 24,
                text: AppStrings.brands,
              ),
              GButton(
                icon: Icons.search,
                iconSize: 24,
                text: AppStrings.search,
              ),
              GButton(
                icon: Icons.favorite,
                iconSize: 24,
                text: AppStrings.favorites,
              ),
              GButton(
                icon: Icons.settings,
                iconSize: 24,
                text: AppStrings.settings,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
