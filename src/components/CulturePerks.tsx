import React from "react";
import { 
  HeartHandshake, 
  Dumbbell, 
  Utensils, 
  GraduationCap, 
  Laptop, 
  Compass,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function CulturePerks() {
  const perks = [
    {
      icon: HeartHandshake,
      title: "Employee & Parents Health Coverage",
      desc: "Full comprehensive medical, dental, and hospitalization coverage for you, your spouse, your children, and your parents. No exceptions.",
      badge: "Industry First",
    },
    {
      icon: Utensils,
      title: "Chef-Prepared Organic Dining",
      desc: "Daily gourmet buffet lunches, breakfast bars, and artisan espresso prepared by on-site culinary chefs in our technology centers.",
      badge: "On-Site Daily",
    },
    {
      icon: Dumbbell,
      title: "Fitness & Certified Nutritionist",
      desc: "Full on-site wellness facility with private personal trainers, certified sports nutritionists, and annual preventive health screenings.",
      badge: "Health-First",
    },
    {
      icon: GraduationCap,
      title: "$1,500 Annual Learning Stipend",
      desc: "Dedicated personal budget for AWS/GCP certifications, O'Reilly Safari subscriptions, book allowances, and overseas tech conferences.",
      badge: "Self-Directed",
    },
    {
      icon: Laptop,
      title: "Uncompromised Hardware Provision",
      desc: "Every engineer receives an Apple Silicon M3 Max or AMD Threadripper Linux workstation, paired with dual 4K displays and Herman Miller seating.",
      badge: "Day One",
    },
    {
      icon: Compass,
      title: "16-Week Parental & Sabbatical Leave",
      desc: "16 weeks fully paid maternity and paternity leave, plus a 1-month fully paid engineering sabbatical after every 4 years of tenure.",
      badge: "Tenure Reward",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-300 text-xs font-mono font-semibold text-brand-900 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>RADICAL PEOPLE-FIRST CULTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Elite Engineers. <br />
            <span className="text-brand-600">Guaranteed Care for Their Families.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Inspired by Arbisoft&apos;s legendary culture standards, Devatrix provides benefits designed to support lifelong engineering mastery and personal well-being.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center p-3 text-brand-600 group-hover:scale-105 group-hover:bg-brand-100 transition-all">
                      <Icon className="w-full h-full" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {perk.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 font-mono transition-colors mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
