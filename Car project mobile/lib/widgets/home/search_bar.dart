import 'package:flutter/material.dart';
import 'theme.dart';

class SearchBar extends StatelessWidget {
  final String? placeholder;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextEditingController? controller;
  final double? height;
  final double? borderRadius;
  final Color? backgroundColor;
  final Color? borderColor;
  final Color? textColor;
  final Color? hintColor;
  final Color? iconColor;
  final EdgeInsets? padding;
  final bool enabled;

  const SearchBar({
    super.key,
    this.placeholder,
    this.onChanged,
    this.onSubmitted,
    this.controller,
    this.height,
    this.borderRadius,
    this.backgroundColor,
    this.borderColor,
    this.textColor,
    this.hintColor,
    this.iconColor,
    this.padding,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final isRTL = Directionality.of(context) == TextDirection.rtl;
    final height = this.height ?? HomeWidgetTheme.searchBarHeight;
    final borderRadius = this.borderRadius ?? HomeWidgetTheme.searchBarRadius;
    final backgroundColor = this.backgroundColor ?? HomeWidgetTheme.searchBarBackground;
    final borderColor = this.borderColor ?? HomeWidgetTheme.searchBarBorder;
    final textColor = this.textColor ?? HomeWidgetTheme.searchBarText;
    final hintColor = this.hintColor ?? HomeWidgetTheme.searchBarHint;
    final iconColor = this.iconColor ?? HomeWidgetTheme.searchBarIcon;
    final padding = this.padding ?? const EdgeInsets.symmetric(
      horizontal: HomeWidgetTheme.searchBarPadding,
    );

    return Container(
      height: height,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: borderColor,
          width: 1,
        ),
      ),
      child: Row(
        textDirection: isRTL ? TextDirection.rtl : TextDirection.ltr,
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              enabled: enabled,
              textDirection: isRTL ? TextDirection.rtl : TextDirection.ltr,
              onChanged: onChanged,
              onSubmitted: onSubmitted,
              style: TextStyle(
                color: textColor,
                fontSize: 14,
              ),
              decoration: InputDecoration(
                hintText: placeholder,
                hintStyle: TextStyle(
                  color: hintColor,
                  fontSize: 14,
                ),
                border: InputBorder.none,
                contentPadding: padding,
                isDense: true,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.only(
              right: isRTL ? 0 : HomeWidgetTheme.searchBarPadding,
              left: isRTL ? HomeWidgetTheme.searchBarPadding : 0,
            ),
            child: Icon(
              Icons.search,
              color: iconColor,
              size: 24,
            ),
          ),
        ],
      ),
    );
  }
}


