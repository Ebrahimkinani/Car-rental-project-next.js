import 'package:flutter/material.dart';
import 'theme.dart';

class CarCategoryModel {
  final String id;
  final String name;
  final IconData icon;
  final VoidCallback onTap;

  const CarCategoryModel({
    required this.id,
    required this.name,
    required this.icon,
    required this.onTap,
  });
}

class CarCategoryCard extends StatelessWidget {
  final CarCategoryModel category;
  final bool isSelected;
  final double? width;
  final double? height;
  final double? borderRadius;
  final Color? backgroundColor;
  final Color? activeBorderColor;
  final double? activeBorderWidth;
  final Color? textColor;
  final Color? iconBackgroundColor;
  final Color? iconColor;
  final double? iconSize;
  final double? iconContainerSize;
  final double? iconContainerRadius;

  const CarCategoryCard({
    super.key,
    required this.category,
    required this.isSelected,
    this.width,
    this.height,
    this.borderRadius,
    this.backgroundColor,
    this.activeBorderColor,
    this.activeBorderWidth,
    this.textColor,
    this.iconBackgroundColor,
    this.iconColor,
    this.iconSize,
    this.iconContainerSize,
    this.iconContainerRadius,
  });

  @override
  Widget build(BuildContext context) {
    final width = this.width ?? HomeWidgetTheme.categoryCardWidth;
    final height = this.height ?? HomeWidgetTheme.categoryCardHeight;
    final borderRadius = this.borderRadius ?? HomeWidgetTheme.categoryCardRadius;
    final backgroundColor = this.backgroundColor ?? HomeWidgetTheme.categoryCardBackground;
    final activeBorderColor = this.activeBorderColor ?? HomeWidgetTheme.categoryCardActiveBorder;
    final activeBorderWidth = this.activeBorderWidth ?? HomeWidgetTheme.categoryActiveBorderWidth;
    final textColor = this.textColor ?? HomeWidgetTheme.categoryCardText;
    final iconBackgroundColor = this.iconBackgroundColor ?? HomeWidgetTheme.categoryIconBackground;
    final iconColor = this.iconColor ?? HomeWidgetTheme.categoryIconColor;
    final iconSize = this.iconSize ?? HomeWidgetTheme.categoryIconSize;
    final iconContainerSize = this.iconContainerSize ?? HomeWidgetTheme.categoryIconContainerSize;
    final iconContainerRadius = this.iconContainerRadius ?? HomeWidgetTheme.categoryIconContainerRadius;

    return GestureDetector(
      onTap: category.onTap,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(borderRadius),
          border: isSelected
              ? Border.all(
                  color: activeBorderColor,
                  width: activeBorderWidth,
                )
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: iconContainerSize,
              height: iconContainerSize,
              decoration: BoxDecoration(
                color: iconBackgroundColor,
                borderRadius: BorderRadius.circular(iconContainerRadius),
              ),
              child: Icon(
                category.icon,
                color: iconColor,
                size: iconSize,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              category.name,
              style: TextStyle(
                color: textColor,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}


