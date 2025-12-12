import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/car.dart';
import '../../models/booking.dart';
import '../../providers/booking_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/primary_button.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../my_bookings/my_bookings_screen.dart';

class BookingScreen extends StatefulWidget {
  final Car car;

  const BookingScreen({
    super.key,
    required this.car,
  });

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  DateTime? _pickupDate;
  TimeOfDay? _pickupTime;
  DateTime? _dropoffDate;
  TimeOfDay? _dropoffTime;

  double get _totalPrice {
    if (_pickupDate == null || _dropoffDate == null) return 0.0;
    final days = _dropoffDate!.difference(_pickupDate!).inDays;
    return days > 0 ? days * widget.car.price : widget.car.price;
  }

  int get _days {
    if (_pickupDate == null || _dropoffDate == null) return 0;
    final days = _dropoffDate!.difference(_pickupDate!).inDays;
    return days > 0 ? days : 1;
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
    }
  }

  Future<void> _selectPickupTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (time != null) {
      setState(() {
        _pickupTime = time;
      });
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
    }
  }

  Future<void> _selectDropoffTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (time != null) {
      setState(() {
        _dropoffTime = time;
      });
    }
  }

  Future<void> _confirmBooking() async {
    if (_pickupDate == null || _dropoffDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.selectDates),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_dropoffDate!.isBefore(_pickupDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Drop-off date must be after pickup date'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (authProvider.currentUser == null) {
      return;
    }

    // Combine date and time
    DateTime pickupDateTime = _pickupDate!;
    if (_pickupTime != null) {
      pickupDateTime = DateTime(
        _pickupDate!.year,
        _pickupDate!.month,
        _pickupDate!.day,
        _pickupTime!.hour,
        _pickupTime!.minute,
      );
    }

    DateTime dropoffDateTime = _dropoffDate!;
    if (_dropoffTime != null) {
      dropoffDateTime = DateTime(
        _dropoffDate!.year,
        _dropoffDate!.month,
        _dropoffDate!.day,
        _dropoffTime!.hour,
        _dropoffTime!.minute,
      );
    }

    final booking = Booking(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      carId: widget.car.id,
      userId: authProvider.currentUser!.id,
      pickupDate: pickupDateTime,
      dropoffDate: dropoffDateTime,
      totalPrice: _totalPrice,
      status: 'confirmed',
      createdAt: DateTime.now(),
    );

    final bookingProvider = Provider.of<BookingProvider>(context, listen: false);
    await bookingProvider.createBooking(booking);

    if (!mounted) return;

    if (bookingProvider.errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(bookingProvider.errorMessage!),
          backgroundColor: Colors.red,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(AppStrings.bookingSuccess),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MyBookingsScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.booking),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.paddingM),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Car Summary
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSizes.paddingM),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppSizes.radiusM),
                      child: CachedNetworkImage(
                        imageUrl: widget.car.thumbnailUrl,
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
                            widget.car.name,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: AppSizes.spacingXS),
                          Text(
                            widget.car.brand,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          const SizedBox(height: AppSizes.spacingS),
                          Text(
                            '\$${widget.car.price.toStringAsFixed(0)}/day',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSizes.spacingL),
            
            // Pickup Date & Time
            Text(
              AppStrings.pickupDate,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: AppSizes.spacingM),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.calendar_today),
                    label: Text(
                      _pickupDate == null
                          ? 'Select date'
                          : '${_pickupDate!.day}/${_pickupDate!.month}/${_pickupDate!.year}',
                    ),
                    onPressed: _selectPickupDate,
                  ),
                ),
                const SizedBox(width: AppSizes.spacingM),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.access_time),
                    label: Text(
                      _pickupTime == null
                          ? 'Select time'
                          : _pickupTime!.format(context),
                    ),
                    onPressed: _selectPickupTime,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.spacingL),
            
            // Drop-off Date & Time
            Text(
              AppStrings.dropoffDate,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: AppSizes.spacingM),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.calendar_today),
                    label: Text(
                      _dropoffDate == null
                          ? 'Select date'
                          : '${_dropoffDate!.day}/${_dropoffDate!.month}/${_dropoffDate!.year}',
                    ),
                    onPressed: _selectDropoffDate,
                  ),
                ),
                const SizedBox(width: AppSizes.spacingM),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.access_time),
                    label: Text(
                      _dropoffTime == null
                          ? 'Select time'
                          : _dropoffTime!.format(context),
                    ),
                    onPressed: _selectDropoffTime,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.spacingL),
            
            // Total Price
            if (_pickupDate != null && _dropoffDate != null) ...[
              Card(
                color: AppColors.primaryLight.withOpacity(0.1),
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.paddingM),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            AppStrings.totalPrice,
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          Text(
                            '$_days day${_days > 1 ? 's' : ''}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      Text(
                        '\$${_totalPrice.toStringAsFixed(2)}',
                        style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSizes.spacingL),
            ],
            
            // Confirm Button
            Consumer<BookingProvider>(
              builder: (context, bookingProvider, _) {
                return PrimaryButton(
                  text: AppStrings.confirmBooking,
                  onPressed: bookingProvider.isLoading ? null : _confirmBooking,
                  isLoading: bookingProvider.isLoading,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

