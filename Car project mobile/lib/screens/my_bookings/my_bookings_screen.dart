import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/booking_provider.dart';
import '../../providers/car_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/empty_state_widget.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MyBookingsScreen extends StatelessWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.myBookings),
      ),
      body: Consumer3<BookingProvider, CarProvider, AuthProvider>(
        builder: (context, bookingProvider, carProvider, authProvider, _) {
          if (authProvider.currentUser == null) {
            return const Center(
              child: Text('Please login to view your bookings'),
            );
          }

          if (bookingProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final userBookings = bookingProvider.getBookingsByUserId(
            authProvider.currentUser!.id,
          );

          if (userBookings.isEmpty) {
            return EmptyStateWidget(
              icon: FontAwesomeIcons.calendar,
              message: AppStrings.noBookings,
              buttonText: AppStrings.browseCars,
              onButtonPressed: () {
                Navigator.pop(context);
              },
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppSizes.paddingM),
            itemCount: userBookings.length,
            itemBuilder: (context, index) {
              final booking = userBookings[index];
              final car = carProvider.getCarById(booking.carId);

              if (car == null) {
                return const SizedBox.shrink();
              }

              return Card(
                margin: const EdgeInsets.only(bottom: AppSizes.paddingM),
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.paddingM),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(AppSizes.radiusM),
                            child: CachedNetworkImage(
                              imageUrl: car.thumbnailUrl,
                              width: 100,
                              height: 100,
                              fit: BoxFit.cover,
                              errorWidget: (context, url, error) => Container(
                                width: 100,
                                height: 100,
                                color: AppColors.background,
                                child: const Icon(Icons.error_outline),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSizes.spacingM),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  car.name,
                                  style: Theme.of(context).textTheme.titleLarge,
                                ),
                                const SizedBox(height: AppSizes.spacingXS),
                                Text(
                                  car.brand,
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSizes.spacingM),
                      const Divider(),
                      const SizedBox(height: AppSizes.spacingM),
                      _buildBookingInfoRow(
                        context,
                        'Pickup',
                        '${booking.pickupDate.day}/${booking.pickupDate.month}/${booking.pickupDate.year} ${booking.pickupDate.hour}:${booking.pickupDate.minute.toString().padLeft(2, '0')}',
                      ),
                      const SizedBox(height: AppSizes.spacingS),
                      _buildBookingInfoRow(
                        context,
                        'Drop-off',
                        '${booking.dropoffDate.day}/${booking.dropoffDate.month}/${booking.dropoffDate.year} ${booking.dropoffDate.hour}:${booking.dropoffDate.minute.toString().padLeft(2, '0')}',
                      ),
                      const SizedBox(height: AppSizes.spacingS),
                      _buildBookingInfoRow(
                        context,
                        'Days',
                        '${booking.days}',
                      ),
                      const SizedBox(height: AppSizes.spacingM),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSizes.paddingS,
                              vertical: AppSizes.paddingXS,
                            ),
                            decoration: BoxDecoration(
                              color: _getStatusColor(booking.status).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(AppSizes.radiusS),
                            ),
                            child: Text(
                              booking.status.toUpperCase(),
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: _getStatusColor(booking.status),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Text(
                            '\$${booking.totalPrice.toStringAsFixed(2)}',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildBookingInfoRow(BuildContext context, String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'cancelled':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }
}

