import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/car_provider.dart';
import '../../widgets/car_card.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_sizes.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  String? _selectedBrand;
  String? _selectedType;
  RangeValues _priceRange = const RangeValues(0, 1000);
  DateTime? _pickupDate;
  DateTime? _dropoffDate;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _applyFilters() {
    final carProvider = Provider.of<CarProvider>(context, listen: false);
    carProvider.filterCars(
      searchQuery: _searchController.text,
      brand: _selectedBrand,
      type: _selectedType,
      minPrice: _priceRange.start,
      maxPrice: _priceRange.end,
    );
  }

  Future<void> _selectPickupDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() {
        _pickupDate = date;
      });
      _applyFilters();
    }
  }

  Future<void> _selectDropoffDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _pickupDate ?? DateTime.now(),
      firstDate: _pickupDate ?? DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() {
        _dropoffDate = date;
      });
      _applyFilters();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CarProvider>(
      builder: (context, carProvider, _) {
        final cars = carProvider.filteredCars;
        final allCars = carProvider.allCars;
        final brands = allCars.map((c) => c.brand).toSet().toList()..sort();
        final types = allCars
            .where((c) => c.type != null)
            .map((c) => c.type!)
            .toSet()
            .toList()
          ..sort();

        return Scaffold(
          appBar: AppBar(
            title: const Text(AppStrings.search),
          ),
          body: Column(
            children: [
              // Search and filters
              Container(
                padding: const EdgeInsets.all(AppSizes.paddingM),
                color: Theme.of(context).colorScheme.surface,
                child: Column(
                  children: [
                    TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        hintText: AppStrings.searchHint,
                        prefixIcon: const Icon(Icons.search),
                        suffixIcon: _searchController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                  _applyFilters();
                                },
                              )
                            : null,
                      ),
                      onChanged: (_) => _applyFilters(),
                    ),
                    const SizedBox(height: AppSizes.spacingM),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedBrand,
                            decoration: const InputDecoration(
                              labelText: 'Brand',
                              isDense: true,
                            ),
                            items: [
                              const DropdownMenuItem(value: null, child: Text('All Brands')),
                              ...brands.map((brand) => DropdownMenuItem(
                                    value: brand,
                                    child: Text(brand),
                                  )),
                            ],
                            onChanged: (value) {
                              setState(() {
                                _selectedBrand = value;
                              });
                              _applyFilters();
                            },
                          ),
                        ),
                        const SizedBox(width: AppSizes.spacingM),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _selectedType,
                            decoration: const InputDecoration(
                              labelText: 'Type',
                              isDense: true,
                            ),
                            items: [
                              const DropdownMenuItem(value: null, child: Text('All Types')),
                              ...types.map((type) => DropdownMenuItem(
                                    value: type,
                                    child: Text(type),
                                  )),
                            ],
                            onChanged: (value) {
                              setState(() {
                                _selectedType = value;
                              });
                              _applyFilters();
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSizes.spacingM),
                    RangeSlider(
                      values: _priceRange,
                      min: 0,
                      max: 1000,
                      divisions: 20,
                      labels: RangeLabels(
                        '\$${_priceRange.start.toInt()}',
                        '\$${_priceRange.end.toInt()}',
                      ),
                      onChanged: (values) {
                        setState(() {
                          _priceRange = values;
                        });
                        _applyFilters();
                      },
                    ),
                    const SizedBox(height: AppSizes.spacingM),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.calendar_today),
                            label: Text(_pickupDate == null
                                ? AppStrings.pickupDate
                                : '${_pickupDate!.day}/${_pickupDate!.month}/${_pickupDate!.year}'),
                            onPressed: _selectPickupDate,
                          ),
                        ),
                        const SizedBox(width: AppSizes.spacingM),
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.calendar_today),
                            label: Text(_dropoffDate == null
                                ? AppStrings.dropoffDate
                                : '${_dropoffDate!.day}/${_dropoffDate!.month}/${_dropoffDate!.year}'),
                            onPressed: _selectDropoffDate,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Results
              Expanded(
                child: cars.isEmpty
                    ? const Center(child: Text('No cars found'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(AppSizes.paddingM),
                        itemCount: cars.length,
                        itemBuilder: (context, index) {
                          return CarCard(car: cars[index]);
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}

