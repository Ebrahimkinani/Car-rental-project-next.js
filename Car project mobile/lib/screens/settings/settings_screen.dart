import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/settings_provider.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_sizes.dart';
import '../auth/login_screen.dart';
import '../my_bookings/my_bookings_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.settings),
      ),
      body: Consumer2<AuthProvider, SettingsProvider>(
        builder: (context, authProvider, settingsProvider, _) {
          return ListView(
            padding: const EdgeInsets.all(AppSizes.paddingM),
            children: [
              // User Profile Section
              if (authProvider.isLoggedIn && authProvider.currentUser != null) ...[
                Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Text(
                        authProvider.currentUser!.name[0].toUpperCase(),
                      ),
                    ),
                    title: Text(authProvider.currentUser!.name),
                    subtitle: Text(authProvider.currentUser!.email),
                  ),
                ),
                const SizedBox(height: AppSizes.spacingM),
              ] else ...[
                Card(
                  child: Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.person_outline),
                        title: const Text('Not logged in'),
                        subtitle: const Text('Login to access all features'),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(AppSizes.paddingM),
                        child: Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const LoginScreen(),
                                    ),
                                  );
                                },
                                child: const Text(AppStrings.login),
                              ),
                            ),
                            const SizedBox(width: AppSizes.spacingM),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const LoginScreen(),
                                    ),
                                  );
                                },
                                child: const Text(AppStrings.createAccount),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSizes.spacingM),
              ],

              // Settings Options
              Card(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.language),
                      title: const Text(AppStrings.language),
                      subtitle: const Text('English (Coming soon)'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        // Future: Language selection
                      },
                    ),
                    const Divider(),
                    SwitchListTile(
                      secondary: const Icon(Icons.dark_mode),
                      title: const Text(AppStrings.theme),
                      subtitle: Text(
                        settingsProvider.isDarkMode
                            ? AppStrings.darkMode
                            : AppStrings.lightMode,
                      ),
                      value: settingsProvider.isDarkMode,
                      onChanged: (value) {
                        settingsProvider.toggleTheme();
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSizes.spacingM),

              // My Bookings
              if (authProvider.isLoggedIn)
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.book_outlined),
                    title: const Text(AppStrings.myBookings),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MyBookingsScreen(),
                        ),
                      );
                    },
                  ),
                ),
              const SizedBox(height: AppSizes.spacingM),

              // About Section
              Card(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.info_outline),
                      title: const Text(AppStrings.about),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        showAboutDialog(
                          context: context,
                          applicationName: AppStrings.appName,
                          applicationVersion: AppStrings.version,
                        );
                      },
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.description_outlined),
                      title: const Text(AppStrings.terms),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        // Future: Terms screen
                      },
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.privacy_tip_outlined),
                      title: const Text(AppStrings.privacy),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        // Future: Privacy screen
                      },
                    ),
                  ],
                ),
              ),

              // Logout
              if (authProvider.isLoggedIn) ...[
                const SizedBox(height: AppSizes.spacingM),
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text(
                      AppStrings.logout,
                      style: TextStyle(color: Colors.red),
                    ),
                    onTap: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Logout'),
                          content: const Text('Are you sure you want to logout?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context, false),
                              child: const Text(AppStrings.cancel),
                            ),
                            TextButton(
                              onPressed: () => Navigator.pop(context, true),
                              child: const Text(AppStrings.logout),
                            ),
                          ],
                        ),
                      );
                      
                      if (confirm == true && context.mounted) {
                        await authProvider.logout();
                        if (context.mounted) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LoginScreen(),
                            ),
                          );
                        }
                      }
                    },
                  ),
                ),
              ],
            ],
          );
        },
      ),
    );
  }
}

