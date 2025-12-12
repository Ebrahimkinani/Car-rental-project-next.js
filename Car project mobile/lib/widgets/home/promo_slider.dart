import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'theme.dart';

class PromoSliderModel {
  final String imageUrl;
  final String ctaLabel;
  final VoidCallback onCtaTap;

  const PromoSliderModel({
    required this.imageUrl,
    required this.ctaLabel,
    required this.onCtaTap,
  });
}

class PromoSlider extends StatefulWidget {
  final List<PromoSliderModel> items;
  final double? height;
  final double? borderRadius;
  final Color? ctaBackgroundColor;
  final Color? ctaTextColor;
  final EdgeInsets? ctaPadding;
  final double? ctaBorderRadius;
  final EdgeInsets? ctaMargin;
  final Alignment? ctaAlignment;

  const PromoSlider({
    super.key,
    required this.items,
    this.height,
    this.borderRadius,
    this.ctaBackgroundColor,
    this.ctaTextColor,
    this.ctaPadding,
    this.ctaBorderRadius,
    this.ctaMargin,
    this.ctaAlignment,
  });

  @override
  State<PromoSlider> createState() => _PromoSliderState();
}

class _PromoSliderState extends State<PromoSlider> {
  late final PageController _pageController;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.items.isEmpty) {
      return const SizedBox.shrink();
    }

    final height = widget.height ?? HomeWidgetTheme.promoSliderHeight;
    final borderRadius = widget.borderRadius ?? HomeWidgetTheme.promoSliderRadius;
    final ctaBackgroundColor = widget.ctaBackgroundColor ?? HomeWidgetTheme.ctaButtonBackground;
    final ctaTextColor = widget.ctaTextColor ?? HomeWidgetTheme.ctaButtonText;
    final ctaPadding = widget.ctaPadding ?? const EdgeInsets.symmetric(
      horizontal: HomeWidgetTheme.ctaButtonPadding,
      vertical: HomeWidgetTheme.ctaButtonPadding / 2,
    );
    final ctaBorderRadius = widget.ctaBorderRadius ?? HomeWidgetTheme.promoSliderRadius;
    final ctaMargin = widget.ctaMargin ?? const EdgeInsets.all(16.0);
    final ctaAlignment = widget.ctaAlignment ?? Alignment.bottomRight;

    return SizedBox(
      height: height,
      width: double.infinity,
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(borderRadius),
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                });
              },
              itemCount: widget.items.length,
              itemBuilder: (context, index) {
                final item = widget.items[index];
                return CachedNetworkImage(
                  imageUrl: item.imageUrl,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  height: height,
                  placeholder: (context, url) => Container(
                    color: HomeWidgetTheme.promoSliderBackground,
                    child: const Center(
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: HomeWidgetTheme.promoSliderBackground,
                    child: const Icon(
                      Icons.error_outline,
                      color: HomeWidgetTheme.dotIndicatorColor,
                    ),
                  ),
                );
              },
            ),
          ),
          if (widget.items.length > 1)
            Positioned(
              bottom: 16.0,
              left: 0,
              right: 0,
              child: Center(
                child: SmoothPageIndicator(
                  controller: _pageController,
                  count: widget.items.length,
                  effect: WormEffect(
                    dotHeight: HomeWidgetTheme.dotIndicatorSize,
                    dotWidth: HomeWidgetTheme.dotIndicatorSize,
                    spacing: HomeWidgetTheme.dotIndicatorSpacing,
                    dotColor: HomeWidgetTheme.dotIndicatorColor,
                    activeDotColor: HomeWidgetTheme.dotIndicatorActiveColor,
                  ),
                ),
              ),
            ),
          Positioned(
            bottom: ctaMargin.bottom,
            right: ctaAlignment == Alignment.bottomRight || ctaAlignment == Alignment.topRight
                ? ctaMargin.right
                : null,
            left: ctaAlignment == Alignment.bottomLeft || ctaAlignment == Alignment.topLeft
                ? ctaMargin.left
                : null,
            top: ctaAlignment == Alignment.topRight || ctaAlignment == Alignment.topLeft
                ? ctaMargin.top
                : null,
            child: GestureDetector(
              onTap: widget.items[_currentPage].onCtaTap,
              child: Container(
                padding: ctaPadding,
                decoration: BoxDecoration(
                  color: ctaBackgroundColor,
                  borderRadius: BorderRadius.circular(ctaBorderRadius),
                ),
                child: Text(
                  widget.items[_currentPage].ctaLabel,
                  style: TextStyle(
                    color: ctaTextColor,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

