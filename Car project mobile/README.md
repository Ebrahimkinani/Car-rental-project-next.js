# Car Rental App - Flutter MVP

A production-quality Flutter car rental application with clean architecture, featuring onboarding, authentication, favorites, bookings, and a modern UI.

## Features

- ✅ **Onboarding Flow**: 3-page modern onboarding experience
- ✅ **Authentication**: Login and Register with mock authentication
- ✅ **Car Browsing**: Browse cars from dummy JSON API
- ✅ **Favorites**: Add/remove cars to favorites (requires login)
- ✅ **Search & Filter**: Search cars by name, brand, type, and price range
- ✅ **Car Details**: Detailed car information with image carousel
- ✅ **Booking System**: Book cars with date/time selection
- ✅ **My Bookings**: View all your bookings
- ✅ **Settings**: User profile, theme toggle, and app settings
- ✅ **Bottom Navigation**: 5-tab navigation (Home, Brands, Search, Favorites, Settings)

## Tech Stack

- **Flutter 3+** with null-safety
- **State Management**: Provider
- **Local Storage**: SharedPreferences
- **Network**: HTTP
- **Images**: Cached Network Image
- **Fonts**: Google Fonts (Cairo)
- **Icons**: Font Awesome Flutter
- **Design**: Material 3

## Project Structure

```
lib/
├── main.dart
├── core/
│   ├── theme/
│   └── constants/
├── models/
├── services/
├── providers/
├── screens/
└── widgets/
```

## Setup Instructions

1. **Install Flutter**: Ensure you have Flutter 3.0+ installed
   ```bash
   flutter --version
   ```

2. **Get Dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run the App**:
   ```bash
   flutter run
   ```

## App Flow

1. **First Launch**: Shows onboarding screens
2. **After Onboarding**: 
   - If not logged in → Login Screen
   - If logged in → Home Screen
3. **Main App**: Bottom navigation with 5 tabs
4. **Favorites**: Requires login to add/remove favorites
5. **Booking**: Requires login to book cars

## Data Source

The app uses dummy data from `https://dummyjson.com/products` API. The product data is mapped to car properties:
- `title` → car name
- `brand` → car brand
- `price` → daily rental price
- `thumbnail` → car thumbnail
- `images` → car images

## Authentication

Currently uses mock authentication:
- Any non-empty email/password will work
- User data is stored locally in SharedPreferences
- Can be easily replaced with real API calls

## Persistence

All data is persisted using SharedPreferences:
- User login status and user data
- Favorites list
- Bookings
- App settings (theme, language)

## Future Enhancements

- Real backend API integration
- Dark mode implementation
- Arabic language support (RTL ready)
- Push notifications
- Payment integration
- Car reviews and ratings

## Notes

- The app is RTL-ready for future Arabic support
- Dark mode structure is in place but not fully implemented
- All screens handle loading and error states
- Empty states are provided for better UX

