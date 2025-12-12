class Booking {
  final String id;
  final String carId;
  final String userId;
  final DateTime pickupDate;
  final DateTime dropoffDate;
  final double totalPrice;
  final String status; // 'pending', 'confirmed', 'completed', 'cancelled'
  final DateTime createdAt;

  Booking({
    required this.id,
    required this.carId,
    required this.userId,
    required this.pickupDate,
    required this.dropoffDate,
    required this.totalPrice,
    this.status = 'confirmed',
    required this.createdAt,
  });

  int get days {
    return dropoffDate.difference(pickupDate).inDays;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'carId': carId,
      'userId': userId,
      'pickupDate': pickupDate.toIso8601String(),
      'dropoffDate': dropoffDate.toIso8601String(),
      'totalPrice': totalPrice,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String,
      carId: json['carId'] as String,
      userId: json['userId'] as String,
      pickupDate: DateTime.parse(json['pickupDate'] as String),
      dropoffDate: DateTime.parse(json['dropoffDate'] as String),
      totalPrice: (json['totalPrice'] as num).toDouble(),
      status: json['status'] as String? ?? 'confirmed',
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Booking copyWith({
    String? id,
    String? carId,
    String? userId,
    DateTime? pickupDate,
    DateTime? dropoffDate,
    double? totalPrice,
    String? status,
    DateTime? createdAt,
  }) {
    return Booking(
      id: id ?? this.id,
      carId: carId ?? this.carId,
      userId: userId ?? this.userId,
      pickupDate: pickupDate ?? this.pickupDate,
      dropoffDate: dropoffDate ?? this.dropoffDate,
      totalPrice: totalPrice ?? this.totalPrice,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

