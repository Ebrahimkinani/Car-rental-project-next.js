import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/storage_keys.dart';
import '../../core/constants/app_strings.dart';
import '../../widgets/onboarding_page_widget.dart';
import '../../widgets/primary_button.dart';
import '../auth/login_screen.dart';
import '../home/home_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _pages = [
    {
      'image': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      'title': AppStrings.onboardingTitle1,
      'subtitle': AppStrings.onboardingSubtitle1,
    },
    {
      'image': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      'title': AppStrings.onboardingTitle2,
      'subtitle': AppStrings.onboardingSubtitle2,
    },
    {
      'image': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      'title': AppStrings.onboardingTitle3,
      'subtitle': AppStrings.onboardingSubtitle3,
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentPage = index;
    });
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(StorageKeys.hasSeenOnboarding, true);
    
    if (!mounted) return;
    
    // Check if user is logged in
    final isLoggedIn = prefs.getBool(StorageKeys.isLoggedIn) ?? false;
    
    if (isLoggedIn) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  void _skipOnboarding() {
    _completeOnboarding();
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: _skipOnboarding,
                child: const Text(AppStrings.skip),
              ),
            ),
            
            // PageView
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: _onPageChanged,
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final page = _pages[index];
                  return OnboardingPageWidget(
                    imageUrl: page['image']!,
                    title: page['title']!,
                    subtitle: page['subtitle']!,
                  );
                },
              ),
            ),
            
            // Dots indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => _buildDot(index),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Next/Get Started button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: PrimaryButton(
                text: _currentPage == _pages.length - 1
                    ? AppStrings.getStarted
                    : AppStrings.next,
                onPressed: _nextPage,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4.0),
      width: _currentPage == index ? 24.0 : 8.0,
      height: 8.0,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4.0),
        color: _currentPage == index
            ? Theme.of(context).colorScheme.primary
            : Colors.grey.shade300,
      ),
    );
  }
}

