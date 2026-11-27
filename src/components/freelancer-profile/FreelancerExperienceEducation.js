"use client";

import { Award, Briefcase, Calendar, CheckCircle2, GraduationCap, MapPin } from "lucide-react";

const WORK_EXPERIENCE = [
  {
    role: "Senior Full-Stack Architect",
    company: "Apex Cloud Labs",
    location: "New York, USA",
    period: "2022 — Present",
    description: "Architecting high-scale Next.js SaaS platforms and distributed Node.js/Express microservices. Reduced page latency by 45% and established continuous deployment pipelines across multi-cloud infrastructure.",
  },
  {
    role: "Lead Frontend Engineer",
    company: "Starlight Interactive",
    location: "San Francisco, USA (Remote)",
    period: "2020 — 2022",
    description: "Led a remote engineering squad of 6 frontend developers creating component design systems in React, TypeScript, and Tailwind CSS. Successfully launched 8 enterprise web clients.",
  },
  {
    role: "Full-Stack Software Developer",
    company: "Veloce Software Systems",
    location: "Boston, USA",
    period: "2018 — 2020",
    description: "Engineered scalable RESTful API backends using Node.js and MongoDB. Built real-time customer data dashboards with WebSocket updates and secure JWT authentication.",
  },
];

const EDUCATION = [
  {
    degree: "B.S. in Computer Science & Software Engineering",
    institution: "New York University (NYU) Courant Institute",
    location: "New York, NY",
    year: "Graduated May 2018",
    honors: "Magna Cum Laude · Dean's Honors List",
  },
];

const CERTIFICATIONS = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "Issued 2023 · Valid",
    id: "AWS-SDA-88204",
  },
  {
    title: "MongoDB Certified Developer Associate",
    issuer: "MongoDB Inc.",
    year: "Issued 2022 · Verified",
    id: "MDB-DEV-91280",
  },
  {
    title: "Meta Certified Senior Frontend Developer",
    issuer: "Meta Systems",
    year: "Issued 2021 · Verified",
    id: "META-FED-3391",
  },
];

export default function FreelancerExperienceEducation() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Work Experience Timeline (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-1">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Career Journey
          </span>
          <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
            Work Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Over 7+ years of professional software engineering and product leadership.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {WORK_EXPERIENCE.map((exp, idx) => (
            <div key={exp.role} className="relative space-y-2">
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[29px] sm:-left-[37px] top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white border-2 border-violet-600 ring-4 ring-violet-100" />

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-2 hover:border-violet-200 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md w-fit">
                    {exp.period}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-slate-900">{exp.company}</span>
                  <span>·</span>
                  <span className="text-slate-400">{exp.location}</span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Education & Certifications (5 Cols) */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Education Block */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Academic Background
            </span>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
              Education
            </h2>
          </div>

          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-slate-900">
                    {edu.degree}
                  </h3>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100">
                <span className="font-mono font-medium text-slate-500">{edu.year}</span>
                <span className="font-semibold text-emerald-600">{edu.honors}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Block */}
        <div className="space-y-4">
          <h3 className="font-headline text-xl font-bold tracking-tight text-slate-900">
            Professional Certifications
          </h3>

          <div className="space-y-3">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.title}
                className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-violet-200 transition"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/70 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    {cert.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{cert.issuer}</span>
                    <span className="font-mono text-[11px] text-slate-400">{cert.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
