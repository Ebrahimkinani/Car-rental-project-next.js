import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../models/car.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/primary_button.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../auth/login_screen.dart';
import '../booking/booking_screen.dart';

class CarDetailsScreen extends StatefulWidget {
  final Car car;

  const CarDetailsScreen({
    super.key,
    required this.car,
  });

  @override
  State<CarDetailsScreen> createState() => _CarDetailsScreenState();
}

class _CarDetailsScreenState extends State<CarDetailsScreen> {
  final PageController _pageController = PageController();

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _handleFavoriteTap() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.pleaseLogin),
          duration: Duration(seconds: 2),
        ),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
      return;
    }
    
    final favoritesProvider = Provider.of<FavoritesProvider>(context, listen: false);
    favoritesProvider.toggleFavorite(widget.car);
  }

  void _handleBookCar() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please login to book a car'),
          duration: Duration(seconds: 2),
        ),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
      return;
    }
    
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BookingScreen(car: widget.car),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final images = widget.car.images.isNotEmpty
        ? widget.car.images
        : [widget.car.thumbnailUrl];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: images.length > 1
                  ? PageView.builder(
                      controller: _pageController,
                      itemCount: images.length,
                      onPageChanged: (_) {},
                      itemBuilder: (context, index) {
                        return CachedNetworkImage(
                          imageUrl: images[index],
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: AppColors.background,
                            child: const Center(child: CircularProgressIndicator()),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: AppColors.background,
                            child: const Icon(Icons.error_outline),
                          ),
                        );
                      },
                    )
                  : CachedNetworkImage(
                      imageUrl: images[0],
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: AppColors.background,
                        child: const Center(child: CircularProgressIndicator()),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: AppColors.background,
                        child: const Icon(Icons.error_outline),
                      ),
                    ),
            ),
            actions: [
              Consumer<FavoritesProvider>(
                builder: (context, favoritesProvider, _) {
                  final isFavorite = favoritesProvider.isFavorite(widget.car.id);
                  return IconButton(
                    icon: FaIcon(
                      isFavorite
                          ? FontAwesomeIcons.solidHeart
                          : FontAwesomeIcons.heart,
                      color: isFavorite ? AppColors.favorite : Colors.white,
                    ),
                    onPressed: _handleFavoriteTap,
                  );
                },
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSizes.paddingM),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.car.name,
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  const SizedBox(height: AppSizes.spacingXS),
                  Text(
                    widget.car.brand,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: AppSizes.spacingM),
                  Row(
                    children: [
                      Text(
                        '\$${widget.car.price.toStringAsFixed(0)}',
                        style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: AppSizes.spacingXS),
                      Text(
                        '/day',
                        style: Theme.of(context).textTheme.bodyLarge,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSizes.spacingL),
                  const Divider(),
                  const SizedBox(height: AppSizes.spacingM),
                  Text(
                    AppStrings.specifications,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: AppSizes.spacingM),
                  _buildSpecRow('Brand', widget.car.brand),
                  if (widget.car.model != null)
                    _buildSpecRow('Model', widget.car.model!),
                  if (widget.car.year != null)
                    _buildSpecRow('Year', widget.car.year.toString()),
                  if (widget.car.type != null)
                    _buildSpecRow('Type', widget.car.type!),
                  const SizedBox(height: AppSizes.spacingL),
                  if (widget.car.description != null) ...[
                    const Divider(),
                    const SizedBox(height: AppSizes.spacingM),
                    Text(
                      AppStrings.description,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: AppSizes.spacingM),
                    Text(
                      widget.car.description!,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                  if (widget.car.features.isNotEmpty) ...[
                    const SizedBox(height: AppSizes.spacingL),
                    const Divider(),
                    const SizedBox(height: AppSizes.spacingM),
                    Text(
                      AppStrings.features,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: AppSizes.spacingM),
                    Wrap(
                      spacing: AppSizes.spacingS,
                      runSpacing: AppSizes.spacingS,
                      children: widget.car.features.map((feature) {
                        return Chip(
                          label: Text(feature),
                          avatar: const FaIcon(
                            FontAwesomeIcons.check,
                            size: AppSizes.iconS,
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                  const SizedBox(height: AppSizes.spacingXL),
                  PrimaryButton(
                    text: AppStrings.bookThisCar,
                    onPressed: _handleBookCar,
                  ),
                  const SizedBox(height: AppSizes.spacingXL),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSizes.spacingXS),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

