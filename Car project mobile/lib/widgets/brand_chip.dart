import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/brand.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_sizes.dart';

class BrandChip extends StatelessWidget {
  final Brand brand;
  final VoidCallback? onTap;

  const BrandChip({
    super.key,
    required this.brand,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSizes.radiusM),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSizes.paddingM,
          vertical: AppSizes.paddingS,
        ),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppSizes.radiusM),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (brand.logoUrl != null)
              Padding(
                padding: const EdgeInsets.only(right: AppSizes.paddingS),
                child: CachedNetworkImage(
                  imageUrl: brand.logoUrl!,
                  width: AppSizes.iconM,
                  height: AppSizes.iconM,
                  errorWidget: (context, url, error) => const SizedBox(
                    width: AppSizes.iconM,
                    height: AppSizes.iconM,
                  ),
                ),
              ),
            Text(
              brand.name,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

