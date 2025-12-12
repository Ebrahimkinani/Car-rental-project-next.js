class Car {
  final String id;
  final String name;
  final String brand;
  final String? model;
  final int? year;
  final double price;
  final List<String> images;
  final String thumbnailUrl;
  final String? description;
  final String? type;
  final List<String> features;

  Car({
    required this.id,
    required this.name,
    required this.brand,
    this.model,
    this.year,
    required this.price,
    required this.images,
    required this.thumbnailUrl,
    this.description,
    this.type,
    this.features = const [],
  });

  // Map from dummyjson.com/products structure
  factory Car.fromJson(Map<String, dynamic> json) {
    // Extract images - handle both single image and array
    List<String> images = [];
    if (json['images'] != null) {
      if (json['images'] is List) {
        images = List<String>.from(json['images']);
      } else if (json['images'] is String) {
        images = [json['images']];
      }
    }
    
    // Use thumbnail as fallback if no images
    if (images.isEmpty && json['thumbnail'] != null) {
      images = [json['thumbnail'] as String];
    }

    // Extract features from description or create default
    List<String> features = [];
    if (json['features'] != null && json['features'] is List) {
      features = List<String>.from(json['features']);
    } else {
      // Default features based on car type
      features = ['Air Conditioning', 'GPS Navigation', 'Bluetooth'];
    }

    return Car(
      id: json['id'].toString(),
      name: json['title'] as String? ?? json['name'] as String? ?? 'Unknown Car',
      brand: json['brand'] as String? ?? 'Unknown Brand',
      model: json['model'] as String?,
      year: json['year'] as int?,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      images: images,
      thumbnailUrl: json['thumbnail'] as String? ?? '',
      description: json['description'] as String?,
      type: _extractCarType(json),
      features: features,
    );
  }

  static String? _extractCarType(Map<String, dynamic> json) {
    // Try to extract type from category or title
    String? category = json['category'] as String?;
    String? title = json['title'] as String?;
    
    if (category != null) {
      if (category.toLowerCase().contains('suv')) return 'SUV';
      if (category.toLowerCase().contains('sedan')) return 'Sedan';
      if (category.toLowerCase().contains('hatchback')) return 'Hatchback';
      if (category.toLowerCase().contains('sports')) return 'Sports';
    }
    
    if (title != null) {
      String lowerTitle = title.toLowerCase();
      if (lowerTitle.contains('suv')) return 'SUV';
      if (lowerTitle.contains('sedan')) return 'Sedan';
      if (lowerTitle.contains('hatchback')) return 'Hatchback';
      if (lowerTitle.contains('sports')) return 'Sports';
    }
    
    return 'Sedan'; // Default
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'model': model,
      'year': year,
      'price': price,
      'images': images,
      'thumbnailUrl': thumbnailUrl,
      'description': description,
      'type': type,
      'features': features,
    };
  }

  Car copyWith({
    String? id,
    String? name,
    String? brand,
    String? model,
    int? year,
    double? price,
    List<String>? images,
    String? thumbnailUrl,
    String? description,
    String? type,
    List<String>? features,
  }) {
    return Car(
      id: id ?? this.id,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      model: model ?? this.model,
      year: year ?? this.year,
      price: price ?? this.price,
      images: images ?? this.images,
      thumbnailUrl: thumbnailUrl ?? this.thumbnailUrl,
      description: description ?? this.description,
      type: type ?? this.type,
      features: features ?? this.features,
    );
  }
}

