import React from "react";
import Link from "next/link";
import { 
  Code2, 
  Cloud, 
  Cpu, 
  Smartphone, 
  Palette, 
  Users2, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function CoreCapabilities() {
  const capabilities = [
    {
      icon: Code2,
      title: "Custom Software Development",
      desc: "Robust, scalable software solutions architected to streamline complex business workflows, replace legacy systems, and accelerate time-to-market.",
      tags: ["Go", "Node.js", "Python", "TypeScript", "Microservices"],
    },
    {
      icon: Cloud,
      title: "Enterprise Cloud & DevOps",
      desc: "High-availability multi-cloud infrastructure on AWS and Azure, automated CI/CD deployment pipelines, and zero-downtime Kubernetes management.",
      tags: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    },
    {
      icon: Cpu,
      title: "AI & Machine Learning",
      desc: "Pragmatic enterprise AI integration including autonomous workflow automation, intelligent document processing, and private LLM deployments.",
      tags: ["Machine Learning", "NLP", "LLM Integration", "Python", "RAG"],
    },
    {
      icon: Smartphone,
      title: "Web & Mobile Applications",
      desc: "High-density enterprise web applications and cross-platform mobile apps engineered with lightning-fast load times and seamless UX.",
      tags: ["React", "Next.js", "Flutter", "React Native", "iOS & Android"],
    },
    {
      icon: Palette,
      title: "UI/UX & Product Design",
      desc: "User-centric interface design, comprehensive design systems, interactive Figma prototypes, and research-backed user experiences.",
      tags: ["Design Systems", "Figma", "User Research", "Prototyping"],
    },
    {
      icon: Users2,
      title: "Dedicated Engineering Pods",
      desc: "Augment your internal technical capacity with self-managed pods of senior software engineers, QA leads, and cloud architects.",
      tags: ["Staff Augmentation", "Dedicated Teams", "Agile Pods", "Senior Talent"],
    },
  ];

  return (
    <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
            Comprehensive Digital Services <br />
            <span className="text-brand-600">Engineered for Growth</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We partner with businesses to deliver practical, high-quality digital solutions that eliminate operational friction and drive measurable enterprise value.
          </p>
        </div>

        {/* 6-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center p-3 text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-obsidian-950 transition-all">
                    <Icon className="w-full h-full" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors font-sans">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {item.desc}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200 mb-4">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 group-hover:text-brand-800 transition-colors font-sans"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
