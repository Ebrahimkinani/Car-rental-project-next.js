import 'package:flutter/material.dart';
import '../../models/car.dart';
import '../../widgets/car_card.dart';
import '../../widgets/section_header.dart';

class HomeCarSection extends StatelessWidget {
  final List<Car> cars;
  final String sectionTitle;

  const HomeCarSection({
    super.key,
    required this.cars,
    required this.sectionTitle,
  });

  @override
  Widget build(BuildContext context) {
    if (cars.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(title: sectionTitle),
        ...cars.map((car) => CarCard(car: car)),
      ],
    );
  }
}

