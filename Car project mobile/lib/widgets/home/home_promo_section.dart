import 'package:flutter/material.dart';
import 'promo_slider.dart';
import '../../core/constants/app_sizes.dart';

class HomePromoSection extends StatelessWidget {
  final List<PromoSliderModel> promoItems;

  const HomePromoSection({
    super.key,
    required this.promoItems,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.paddingM),
      child: PromoSlider(items: promoItems),
    );
  }
}


