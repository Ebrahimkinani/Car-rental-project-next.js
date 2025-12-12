import 'package:flutter/material.dart';
import 'car_category_list.dart';
import 'car_category_card.dart';
import '../../core/constants/app_sizes.dart';

class HomeCategorySection extends StatelessWidget {
  final List<CarCategoryModel> categories;
  final String? selectedCategoryId;

  const HomeCategorySection({
    super.key,
    required this.categories,
    this.selectedCategoryId,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.paddingM),
      child: CarCategoryList(
        categories: categories,
        selectedId: selectedCategoryId,
      ),
    );
  }
}

