import 'package:flutter/material.dart';
import 'car_category_card.dart';
import 'theme.dart';

class CarCategoryList extends StatelessWidget {
  final List<CarCategoryModel> categories;
  final String? selectedId;
  final double? spacing;
  final EdgeInsets? padding;
  final ScrollPhysics? physics;

  const CarCategoryList({
    super.key,
    required this.categories,
    this.selectedId,
    this.spacing,
    this.padding,
    this.physics,
  });

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) {
      return const SizedBox.shrink();
    }

    final spacing = this.spacing ?? 12.0;
    final padding = this.padding ?? const EdgeInsets.symmetric(
      horizontal: HomeWidgetTheme.searchBarPadding,
    );

    return SizedBox(
      height: HomeWidgetTheme.categoryCardHeight,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: physics ?? const BouncingScrollPhysics(),
        padding: padding,
        itemCount: categories.length,
        separatorBuilder: (context, index) => SizedBox(width: spacing),
        itemBuilder: (context, index) {
          final category = categories[index];
          return CarCategoryCard(
            category: category,
            isSelected: selectedId == category.id,
          );
        },
      ),
    );
  }
}


