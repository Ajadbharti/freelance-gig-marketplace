"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Star } from "lucide-react";

const TOP_FREELANCERS = [
  {
    id: "f-1",
    name: "Priya Sharma",
    title: "Senior Full-Stack Engineer & Next.js Specialist",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    reviewsCount: 184,
    completedProjects: 142,
    skills: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
    hourlyRate: "₹2,500/hr",
  },
  {
    id: "f-2",
    name: "Elena Rostova",
    title: "Lead UI/UX Designer & Design Systems Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewsCount: 210,
    completedProjects: 168,
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Mobile UI"],
    hourlyRate: "₹2,200/hr",
  },
  {
    id: "f-3",
    name: "Marcus Vance",
    title: "AI & Machine Learning Solutions Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    reviewsCount: 92,
    completedProjects: 78,
    skills: ["Python", "OpenAI", "LangChain", "PyTorch", "Vector Search"],
    hourlyRate: "₹3,200/hr",
  },
  {
    id: "f-4",
    name: "Arjun Patel",
    title: "Cloud DevOps & Distributed Systems Architect",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    reviewsCount: 88,
    completedProjects: 95,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "PostgreSQL"],
    hourlyRate: "₹2,800/hr",
  },
];

export default function TopFreelancers() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-violet-600 tracking-wider uppercase bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Vetted Experts
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Top Freelancers
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 max-w-xl">
              Collaborate directly with top 1% certified talent with proven track records and verified deliverables.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition self-start sm:self-auto"
          >
            <span>Browse All Talent</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Freelancers 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_FREELANCERS.map((fl) => (
            <div
              key={fl.id}
              className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar with Status Dot */}
                <div className="relative mx-auto w-20 h-20 mb-4">
                  <img
                    src={fl.avatar}
                    alt={fl.name}
                    className="w-full h-full rounded-2xl object-cover border border-slate-200 shadow-xs"
                    loading="lazy"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white"
                    title="Verified Pro"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Name & Title */}
                <div className="text-center space-y-1">
                  <h3 className="font-headline text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {fl.name}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {fl.title}
                  </p>
                </div>

                {/* Rating & Completed Projects */}
                <div className="my-4 py-3 border-y border-slate-100 flex items-center justify-around text-center text-xs">
                  <div>
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{fl.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">({fl.reviewsCount} reviews)</span>
                  </div>

                  <div className="h-6 w-px bg-slate-200" />

                  <div>
                    <p className="font-bold text-slate-900">{fl.completedProjects}</p>
                    <p className="text-[10px] text-slate-400">Completed Projects</p>
                  </div>
                </div>

                {/* Skills Pills */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                  {fl.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {fl.skills.length > 3 && (
                    <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                      +{fl.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/explore"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-violet-600 hover:text-white hover:border-violet-600 transition shadow-2xs group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600"
              >
                <span>View Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
