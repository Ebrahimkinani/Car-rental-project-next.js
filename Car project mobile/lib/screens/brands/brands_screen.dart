import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/car_provider.dart';
import '../../services/car_service.dart';
import '../../widgets/brand_chip.dart';
import '../../widgets/car_card.dart';
import '../../core/constants/app_sizes.dart';

class BrandsScreen extends StatefulWidget {
  const BrandsScreen({super.key});

  @override
  State<BrandsScreen> createState() => _BrandsScreenState();
}

class _BrandsScreenState extends State<BrandsScreen> {
  String? _selectedBrand;
  final CarService _carService = CarService();

  @override
  Widget build(BuildContext context) {
    return Consumer<CarProvider>(
      builder: (context, carProvider, _) {
        if (carProvider.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final cars = carProvider.allCars;
        if (cars.isEmpty) {
          return const Scaffold(
            body: Center(child: Text('No cars available')),
          );
        }

        final brands = _carService.extractBrands(cars);
        final filteredCars = _selectedBrand == null
            ? []
            : carProvider.getCarsByBrand(_selectedBrand!);

        return Scaffold(
          appBar: AppBar(
            title: const Text('Brands'),
          ),
          body: _selectedBrand == null
              ? _buildBrandsList(brands)
              : _buildCarsList(filteredCars),
        );
      },
    );
  }

  Widget _buildBrandsList(List brands) {
    return Padding(
      padding: const EdgeInsets.all(AppSizes.paddingM),
      child: Wrap(
        spacing: AppSizes.spacingM,
        runSpacing: AppSizes.spacingM,
        children: brands.map((brand) {
          return BrandChip(
            brand: brand,
            onTap: () {
              setState(() {
                _selectedBrand = brand.name;
              });
            },
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCarsList(List cars) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(AppSizes.paddingM),
          color: Theme.of(context).colorScheme.surface,
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  setState(() {
                    _selectedBrand = null;
                  });
                },
              ),
              Expanded(
                child: Text(
                  _selectedBrand!,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: cars.isEmpty
              ? const Center(child: Text('No cars found for this brand'))
              : ListView.builder(
                  padding: const EdgeInsets.all(AppSizes.paddingM),
                  itemCount: cars.length,
                  itemBuilder: (context, index) {
                    return CarCard(car: cars[index]);
                  },
                ),
        ),
      ],
    );
  }
}

