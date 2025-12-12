import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/car_provider.dart';
import '../../widgets/car_card.dart';
import '../../widgets/empty_state_widget.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_sizes.dart';
import '../home/home_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.favorites),
      ),
      body: Consumer2<FavoritesProvider, CarProvider>(
        builder: (context, favoritesProvider, carProvider, _) {
          final favoriteIds = favoritesProvider.favoriteCarIds;
          
          if (favoriteIds.isEmpty) {
            return EmptyStateWidget(
              icon: FontAwesomeIcons.heart,
              message: AppStrings.noFavorites,
              buttonText: AppStrings.browseCars,
              onButtonPressed: () {
                // Navigate to home (first tab)
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                );
              },
            );
          }

          final favoriteCars = carProvider.allCars
              .where((car) => favoriteIds.contains(car.id))
              .toList();

          if (favoriteCars.isEmpty) {
            return EmptyStateWidget(
              icon: FontAwesomeIcons.heart,
              message: AppStrings.noFavorites,
              buttonText: AppStrings.browseCars,
              onButtonPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                );
              },
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSizes.paddingM),
            itemCount: favoriteCars.length,
            itemBuilder: (context, index) {
              return CarCard(car: favoriteCars[index]);
            },
          );
        },
      ),
    );
  }
}

