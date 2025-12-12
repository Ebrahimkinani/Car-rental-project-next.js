import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../providers/car_provider.dart';
import '../../widgets/home/home_app_bar.dart';
import '../../widgets/home/home_promo_section.dart';
import '../../widgets/home/home_category_section.dart';
import '../../widgets/home/home_car_section.dart';
import '../../widgets/home/promo_slider.dart';
import '../../widgets/home/car_category_card.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_sizes.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _selectedCategoryId;

  List<PromoSliderModel> _getMockPromoSliders() {
    return [
      PromoSliderModel(
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        ctaLabel: 'استكشف الآن',
        onCtaTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Promo 1 tapped')),
          );
        },
      ),
      PromoSliderModel(
        imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
        ctaLabel: 'احجز الآن',
        onCtaTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Promo 2 tapped')),
          );
        },
      ),
      PromoSliderModel(
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
        ctaLabel: 'عروض خاصة',
        onCtaTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Promo 3 tapped')),
          );
        },
      ),
    ];
  }

  List<CarCategoryModel> _getMockCategories() {
    return [
      CarCategoryModel(
        id: 'all',
        name: 'الكل',
        icon: FontAwesomeIcons.car,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'all';
          });
        },
      ),
      CarCategoryModel(
        id: 'sedan',
        name: 'سيدان',
        icon: FontAwesomeIcons.carSide,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'sedan';
          });
        },
      ),
      CarCategoryModel(
        id: 'suv',
        name: 'دفع رباعي',
        icon: FontAwesomeIcons.truck,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'suv';
          });
        },
      ),
      CarCategoryModel(
        id: 'sports',
        name: 'رياضية',
        icon: FontAwesomeIcons.gaugeHigh,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'sports';
          });
        },
      ),
      CarCategoryModel(
        id: 'luxury',
        name: 'فاخرة',
        icon: FontAwesomeIcons.gem,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'luxury';
          });
        },
      ),
      CarCategoryModel(
        id: 'economy',
        name: 'اقتصادية',
        icon: FontAwesomeIcons.circleDollarToSlot,
        onTap: () {
          setState(() {
            _selectedCategoryId = 'economy';
          });
        },
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: const HomeAppBar(),
        
        body: Consumer<CarProvider>(
          builder: (context, carProvider, _) {
            if (carProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (carProvider.errorMessage != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(carProvider.errorMessage!),
                    const SizedBox(height: AppSizes.spacingM),
                    ElevatedButton(
                      onPressed: () => carProvider.fetchCars(),
                      child: const Text(AppStrings.retry),
                    ),
                  ],
                ),
              );
            }

            final cars = carProvider.allCars;
            if (cars.isEmpty) {
              return const Center(child: Text('No cars available'));
            }

            final popularCars = cars.where((car) => car.type == 'Sedan').take(6).toList();
            final familyCars = cars.where((car) => car.type == 'SUV').take(6).toList();
            final suvCars = cars.where((car) => car.type == 'SUV').take(6).toList();

            return CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: AppSizes.spacingM),
                      HomePromoSection(
                        promoItems: _getMockPromoSliders(),
                      ),
                      const SizedBox(height: AppSizes.spacingL),
                      HomeCategorySection(
                        categories: _getMockCategories(),
                        selectedCategoryId: _selectedCategoryId,
                      ),
                      const SizedBox(height: AppSizes.spacingL),
                    ],
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate([
                    HomeCarSection(
                      cars: popularCars,
                      sectionTitle: AppStrings.popularCars,
                    ),
                    HomeCarSection(
                      cars: familyCars,
                      sectionTitle: AppStrings.familyCars,
                    ),
                    HomeCarSection(
                      cars: suvCars,
                      sectionTitle: AppStrings.suvCars,
                    ),
                    const SizedBox(height: AppSizes.spacingXL),
                  ]),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

