import { cn } from "@/lib/utils";
import { Car, BusFront, Gauge, BatteryCharging } from "lucide-react";

export function FleetJourney() {
  const fleetCategories = [
    {
      title: "City & Economy",
      description: "Fuel-efficient hatchbacks and sedans perfect for daily commutes and city exploration. Smart, compact, and environmentally conscious.",
      icon: <Gauge className="h-6 w-6" />,
      features: ["Unlimited mileage included", "Fuel-efficient models"],
      gradientFrom: "from-primary-500",
      gradientTo: "to-primary-600",
      bgGradientFrom: "from-primary-50",
      bgGradientTo: "to-transparent",
      dotColor: "bg-primary-500",
    },
    {
      title: "SUV & Family",
      description: "Spacious SUVs and family vehicles designed for comfort, safety, and group travel. Perfect for road trips and family adventures.",
      icon: <BusFront className="h-6 w-6" />,
      features: ["7+ passenger capacity", "Advanced safety features"],
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      bgGradientFrom: "from-green-50",
      bgGradientTo: "to-transparent",
      dotColor: "bg-green-500",
    },
    {
      title: "Executive & Luxury",
      description: "Premium sedans and luxury vehicles for business meetings, special occasions, and when you want to make a statement.",
      icon: <Car className="h-6 w-6" />,
      features: ["Premium amenities", "Concierge service"],
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
      bgGradientFrom: "from-purple-50",
      bgGradientTo: "to-transparent",
      dotColor: "bg-purple-500",
    },
    {
      title: "Electric & Hybrid",
      description: "Cutting-edge electric and hybrid vehicles for eco-conscious travelers. Zero emissions, maximum efficiency, and a greener future.",
      icon: <BatteryCharging className="h-6 w-6" />,
      features: ["Zero emissions driving", "Charging network access"],
      gradientFrom: "from-emerald-500",
      gradientTo: "to-emerald-600",
      bgGradientFrom: "from-emerald-50",
      bgGradientTo: "to-transparent",
      dotColor: "bg-emerald-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">A Fleet for Every Journey</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From city commutes to cross-country adventures, our diverse fleet ensures you have the perfect vehicle for every occasion
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
        {fleetCategories.map((category, index) => (
          <FleetCategory key={category.title} {...category} index={index} />
        ))}
      </div>

      {/* Fleet Stats */}
      <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="transform transition-transform duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-gray-900 mb-2">1,200+</div>
            <div className="text-sm text-gray-600">Active Vehicles</div>
          </div>
          <div className="transform transition-transform duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-sm text-gray-600">Vehicle Models</div>
          </div>
          <div className="transform transition-transform duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">*Policies may vary by city. See terms at checkout.</p>
    </div>
  );
}

const FleetCategory = ({
  title,
  description,
  icon,
  features,
  gradientFrom,
  gradientTo,
  bgGradientFrom,
  bgGradientTo,
  dotColor,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  dotColor: string;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r border-gray-100 py-10 relative group/feature",
        (index === 0 || index === 4) && "lg:border-l border-gray-100",
        index < 4 && "lg:border-b border-gray-100"
      )}
    >
      {index < 4 && (
        <div className={cn("opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t", bgGradientFrom, bgGradientTo, "pointer-events-none")} />
      )}
      {index >= 4 && (
        <div className={cn("opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b", bgGradientFrom, bgGradientTo, "pointer-events-none")} />
      )}
      
      <div className="mb-4 relative z-10 px-6">
        <div className={cn("inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r", gradientFrom, gradientTo, "text-white transition-transform group-hover/feature:scale-110")}>
          {icon}
        </div>
      </div>
      
      <div className="text-xl font-bold mb-2 relative z-10 px-6">
        <div className={cn("absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gradient-to-b", gradientFrom, gradientTo, "transition-all duration-200 origin-center")} />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-gray-900">
          {title}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 max-w-xs relative z-10 px-6 mb-4 leading-relaxed">
        {description}
      </p>
      
      <div className="space-y-2 text-xs text-gray-500 relative z-10 px-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center">
            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", dotColor)} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

