import 'package:flutter/material.dart';
import 'theme.dart';

class FilterButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final double? size;
  final double? borderRadius;
  final Color? backgroundColor;
  final Color? iconColor;
  final double? iconSize;

  const FilterButton({
    super.key,
    required this.icon,
    required this.onTap,
    this.size,
    this.borderRadius,
    this.backgroundColor,
    this.iconColor,
    this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    final size = this.size ?? HomeWidgetTheme.filterButtonSize;
    final borderRadius = this.borderRadius ?? HomeWidgetTheme.filterButtonRadius;
    final backgroundColor = this.backgroundColor ?? HomeWidgetTheme.filterButtonBackground;
    final iconColor = this.iconColor ?? HomeWidgetTheme.filterButtonIcon;
    final iconSize = this.iconSize ?? 24.0;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        child: Icon(
          icon,
          color: iconColor,
          size: iconSize,
        ),
      ),
    );
  }
}


