import { PricingCard } from "../../components/PricingCard";

const plans = [
  {
    name: "Basic",
    price: 0,
    period: "month",
    features: [
      "Track up to 50 exercises per month",
      "Basic AI form correction",
      "Workout history & progress tracking",
      "Community support",
      "Limited access to AI recommendations",
      "Cancel anytime",
    ],
  },
  {
    name: "Pro",
    price: 15,
    period: "month",
    featured: true,
    features: [
      "Track unlimited exercises",
      "Advanced AI form analysis & real-time feedback",
      "Custom workout plans based on fitness goals",
      "Integration with fitness wearables (Apple Watch, Fitbit, etc.)",
      "Priority customer support",
      "Everything in Basic Plan",
    ],
  },
  {
    name: "Elite",
    price: 99,
    period: "year",
    features: [
      "Personalized AI coaching with adaptive difficulty",
      "Full-body motion tracking using OpenCV & MediaPipe",
      "Detailed analytics & performance trends",
      "Nutrition & meal plan recommendations",
      "Exclusive community access",
      "Early access to new AI features",
      "Everything in Pro Plan",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 ">
      <div className="max-w-6xl mx-auto space-y-12 pt-32">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Simple pricing for advanced people
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our pricing is designed for advanced people who need more features
            and more flexibility.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
