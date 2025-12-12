import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../providers/favorites_provider.dart';
import '../providers/auth_provider.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_sizes.dart';
import '../core/constants/app_strings.dart';
import '../screens/car_details/car_details_screen.dart';

class CarCard extends StatelessWidget {
  final Car car;

  const CarCard({
    super.key,
    required this.car,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<FavoritesProvider>(
      builder: (context, favoritesProvider, _) {
        final isFavorite = favoritesProvider.isFavorite(car.id);
        
        return Card(
          margin: const EdgeInsets.only(bottom: AppSizes.paddingM),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CarDetailsScreen(car: car),
                ),
              );
            },
            borderRadius: BorderRadius.circular(AppSizes.cardRadius),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(AppSizes.cardRadius),
                      ),
                      child: CachedNetworkImage(
                        imageUrl: car.thumbnailUrl,
                        height: AppSizes.imageHeightM,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          height: AppSizes.imageHeightM,
                          color: AppColors.background,
                          child: const Center(
                            child: CircularProgressIndicator(),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          height: AppSizes.imageHeightM,
                          color: AppColors.background,
                          child: const Icon(
                            Icons.error_outline,
                            size: AppSizes.iconXL,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      top: AppSizes.paddingS,
                      right: AppSizes.paddingS,
                      child: GestureDetector(
                        onTap: () => _handleFavoriteTap(context, favoritesProvider),
                        child: Container(
                          padding: const EdgeInsets.all(AppSizes.paddingS),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.9),
                            shape: BoxShape.circle,
                          ),
                          child: FaIcon(
                            isFavorite ? FontAwesomeIcons.solidHeart : FontAwesomeIcons.heart,
                            color: isFavorite ? AppColors.favorite : AppColors.textSecondary,
                            size: AppSizes.iconM,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(AppSizes.paddingM),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        car.name,
                        style: Theme.of(context).textTheme.titleLarge,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: AppSizes.spacingXS),
                      Text(
                        car.brand,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: AppSizes.spacingS),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '\$${car.price.toStringAsFixed(0)}/day',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (car.type != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: AppSizes.paddingS,
                                vertical: AppSizes.paddingXS,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primaryLight.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(AppSizes.radiusS),
                              ),
                              child: Text(
                                car.type!,
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleFavoriteTap(BuildContext context, FavoritesProvider favoritesProvider) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.pleaseLogin),
          duration: Duration(seconds: 2),
        ),
      );
      // Optionally navigate to login screen
      return;
    }
    
    favoritesProvider.toggleFavorite(car);
  }
}

