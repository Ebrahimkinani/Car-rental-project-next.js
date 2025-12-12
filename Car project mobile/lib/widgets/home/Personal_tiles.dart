import 'package:flutter/material.dart';

class PersonalTitel extends StatelessWidget {
  const PersonalTitel({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      
      padding: const EdgeInsets.symmetric(horizontal: 20.0, ),
      child: Column(
  children: [
    const SizedBox(height: 10),
    Container(
      decoration: BoxDecoration(
        color: Colors.transparent, // ✅ removes any visible background
        borderRadius: BorderRadius.circular(100),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            ' Hi, G',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),

          // Avatar with black border
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.black,
                width: 2,
              ),
            ),
            child: const Padding(
              padding: EdgeInsets.all(6.0),
              child: CircleAvatar(
                radius: 20,
                backgroundImage: AssetImage('lib/images/avatar.png'),
              ),
            ),
          ),
        ],
      ),
    ),

    // Search bar container
    Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            // ignore: deprecated_member_use
            color: Colors.black.withOpacity(0.15),
            blurRadius: 100,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Padding(
        padding: EdgeInsets.only(left: 15, top: 5),
        child: TextField(
          decoration: InputDecoration(
            hintText: "Search cars...",
            hintStyle: TextStyle(color: Colors.grey, fontSize: 16),
            suffixIcon: Padding(
              
              padding: EdgeInsets.all(8.0),
              child: Icon(Icons.search, color: Color.fromARGB(255, 72, 71, 71)),
            ),
            border: InputBorder.none,
          ),
        ),
      ),
    ),
  ],
)

    );
  }
}
