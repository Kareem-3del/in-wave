'use client';

import { useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Icon } from '@iconify/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'motion/react';
import type { Locale, Service } from '@/lib/types/database';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesClientProps {
  services: Service[];
}

const defaultServices = [
  { key: 'architecturalDesign', icon: 'mdi:office-building-outline', color: 'amber' },
  { key: 'interiorDesign', icon: 'mdi:sofa-outline', color: 'emerald' },
  { key: 'visualization', icon: 'mdi:cube-scan', color: 'violet' },
  { key: 'supervision', icon: 'mdi:hard-hat', color: 'rose' },
  { key: 'consultation', icon: 'mdi:message-text-outline', color: 'cyan' },
  { key: 'landscaping', icon: 'mdi:tree-outline', color: 'lime' },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
  lime: { bg: 'bg-lime-500/10', text: 'text-lime-500', border: 'border-lime-500/30', glow: 'shadow-lime-500/20' },
};

// Smooth easing for all animations
const smoothEase = [0.22, 1, 0.36, 1] as const;

function SectionHeader({ title, subtitle, className = '' }: { title: string; subtitle: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: smoothEase }}
      className={`text-center mb-16 ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

function ServiceCard({
  title,
  description,
  icon,
  color,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorClasses[color] || colorClasses.amber;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: smoothEase }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className={`relative h-full p-6 md:p-8 rounded-2xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/10 hover:bg-neutral-900/80 ${isHovered ? `shadow-xl ${colors.glow}` : ''}`}>
        {/* Icon */}
        <div className={`w-14 h-14 mb-6 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
          <Icon icon={icon} className={`w-7 h-7 ${colors.text}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          {description}
        </p>

        {/* Learn more link */}
        <div className={`flex items-center gap-2 text-sm ${colors.text} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
          <span className="font-medium">Learn more</span>
          <Icon icon="mdi:arrow-right" className="w-4 h-4" />
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${colors.bg} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
      </div>
    </motion.div>
  );
}

function ProcessStep({
  number,
  title,
  description,
  icon,
  index,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  icon: string;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: smoothEase }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
      )}

      {/* Icon circle */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/30 group-hover:bg-amber-500/5">
          <Icon icon={icon} className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 transition-colors duration-300" />
        </div>
        {/* Number badge */}
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
          {number}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-neutral-500 leading-relaxed max-w-[200px]">{description}</p>
    </motion.div>
  );
}

function StatsCard({ value, label, icon, index }: { value: string; label: string; icon: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: smoothEase }}
      className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 group"
    >
      <Icon icon={icon} className="w-6 h-6 mx-auto mb-3 text-amber-500/70 group-hover:text-amber-500 transition-colors duration-300" />
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
      <p className="text-sm text-neutral-500">{label}</p>
    </motion.div>
  );
}

export function ServicesClient({ services }: ServicesClientProps) {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;
  const isRTL = locale === 'ar';

  const displayServices = services.length > 0
    ? services.map((service, index) => ({
        title: locale === 'ar' && service.name_ar ? service.name_ar : (service.name_en || service.name),
        description: '',
        icon: defaultServices[index % defaultServices.length].icon,
        color: defaultServices[index % defaultServices.length].color,
      }))
    : defaultServices.map((svc) => ({
        title: t(svc.key),
        description: t(`${svc.key}Desc`),
        icon: svc.icon,
        color: svc.color,
      }));

  const processSteps = [
    { icon: 'mdi:lightbulb-outline', title: isRTL ? 'الفكرة' : 'Concept', desc: isRTL ? 'نفهم رؤيتك' : 'Understanding your vision' },
    { icon: 'mdi:pencil-ruler', title: isRTL ? 'التصميم' : 'Design', desc: isRTL ? 'نصمم الحل المثالي' : 'Creating the perfect solution' },
    { icon: 'mdi:cube-outline', title: isRTL ? 'التطوير' : 'Develop', desc: isRTL ? 'نبني مشروعك' : 'Building your project' },
    { icon: 'mdi:check-circle-outline', title: isRTL ? 'التسليم' : 'Deliver', desc: isRTL ? 'نسلم النتيجة' : 'Delivering excellence' },
  ];

  const stats = [
    { value: '90+', label: isRTL ? 'مشروع مكتمل' : 'Projects', icon: 'mdi:briefcase-check-outline' },
    { value: '10+', label: isRTL ? 'دولة' : 'Countries', icon: 'mdi:earth' },
    { value: '8+', label: isRTL ? 'سنوات خبرة' : 'Years', icon: 'mdi:calendar-star' },
    { value: '100%', label: isRTL ? 'رضا العملاء' : 'Satisfaction', icon: 'mdi:heart-outline' },
  ];

  return (
    <div className="bg-neutral-950">
      {/* Services Grid Section */}
      <section id="services-grid" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHeader
            title={isRTL ? 'خدماتنا' : 'Our Services'}
            subtitle={isRTL
              ? 'نقدم مجموعة شاملة من خدمات التصميم المعماري والداخلي لتحويل رؤيتك إلى واقع'
              : 'We offer a comprehensive range of architectural and design services to transform your vision into reality'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                color={service.color}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Process Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <SectionHeader
            title={isRTL ? 'كيف نعمل' : 'Our Process'}
            subtitle={isRTL
              ? 'نتبع منهجية منظمة لضمان تحقيق أفضل النتائج لمشروعك'
              : 'We follow a structured methodology to ensure the best outcomes for your project'}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                number={index + 1}
                title={step.title}
                description={step.desc}
                icon={step.icon}
                index={index}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isRTL ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to Start Your Project?'}
            </h2>
            <p className="text-base text-neutral-400 mb-8 leading-relaxed">
              {isRTL
                ? 'دعنا نحول رؤيتك إلى واقع. تواصل معنا اليوم لمناقشة مشروعك.'
                : "Let's transform your vision into reality. Contact us today to discuss your project."}
            </p>
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-500 hover:scale-[1.02]"
            >
              <span>{isRTL ? 'تواصل معنا' : 'Get in Touch'}</span>
              <Icon icon={isRTL ? 'mdi:arrow-left' : 'mdi:arrow-right'} className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
