"use client";

import { Check, Code2, Cpu, Database, Layout, Sparkles, Terminal } from "lucide-react";

const PRIMARY_SKILLS = [
  { name: "React.js", category: "Frontend", level: "Expert", icon: Layout },
  { name: "Next.js", category: "Full-Stack", level: "Expert", icon: Sparkles },
  { name: "Node.js", category: "Backend", level: "Expert", icon: Terminal },
  { name: "Express.js", category: "Backend", level: "Advanced", icon: Code2 },
  { name: "MongoDB", category: "Database", level: "Expert", icon: Database },
  { name: "JavaScript", category: "Core", level: "Expert", icon: Code2 },
  { name: "Tailwind CSS", category: "Styling", level: "Expert", icon: Layout },
  { name: "TypeScript", category: "Language", level: "Advanced", icon: Code2 },
  { name: "PostgreSQL", category: "Database", level: "Advanced", icon: Database },
  { name: "REST APIs", category: "Architecture", level: "Expert", icon: Cpu },
  { name: "GraphQL", category: "API", level: "Intermediate", icon: Code2 },
  { name: "Docker", category: "DevOps", level: "Intermediate", icon: Cpu },
];

export default function FreelancerSkills() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
          Technical Stack
        </span>
        <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
          Skills &amp; Expertise
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Technologies, frameworks, and architecture tools Alex Morgan actively uses for client production systems.
        </p>
      </div>

      {/* Skills Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
        {PRIMARY_SKILLS.map((skill) => {
          const IconComponent = skill.icon;

          return (
            <div
              key={skill.name}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/10 transition-all duration-200"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {skill.name}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>{skill.category}</span>
                  <span>·</span>
                  <span className="text-violet-600 font-semibold">{skill.level}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
