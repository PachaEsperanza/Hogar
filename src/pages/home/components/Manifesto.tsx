import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const useCountUp = (target: number, active: boolean, duration = 1400) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
};

const CircleStat = ({
  val, prefix = '', suffix, label, maxVal, active,
}: {
  val: number; prefix?: string; suffix: string; label: string; maxVal: number; active: boolean;
}) => {
  const count = useCountUp(val, active);
  const size = 110;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = active ? Math.min(val / maxVal, 1) : 0;
  const dash = circ * progress;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-xl border border-cream/10"
        style={{ width: size + 24, height: size + 24, background: 'rgba(30,18,10,0.55)' }}
      >
        <svg
          width={size}
          height={size}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(201,169,110,0.15)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#c9a96e"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={circ - dash}
            style={{ transition: active ? 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' : 'none' }}
          />
        </svg>
        <span className="font-serif text-gold font-bold relative z-10" style={{ fontSize: '1.5rem' }}>
          {prefix}{count}{suffix}
        </span>
      </div>
      <p className="text-cream/55 font-sans text-[10px] tracking-widest uppercase text-center leading-tight max-w-[100px]">
        {label}
      </p>
    </div>
  );
};

const Manifesto = () => {
  const { t } = useTranslation();
  const [statsVisible, setStatsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // TODO: reemplazar con las fotos y textos reales de cada tarjeta
  const sintropicoCards = [
    { image: '/Hogar/images/imagen1.png', title: 'Título de la tarjeta 1', description: 'Descripción pendiente — pásame el texto y la foto real.' },
    { image: '/Hogar/images/imagen1.png', title: 'Título de la tarjeta 2', description: 'Descripción pendiente — pásame el texto y la foto real.' },
    { image: '/Hogar/images/imagen1.png', title: 'Título de la tarjeta 3', description: 'Descripción pendiente — pásame el texto y la foto real.' },
  ];

  const stats = [
    { val: 142, suffix: '', label: t('manifesto_stat_families'), maxVal: 200 },
    { val: 340, suffix: '', label: t('manifesto_stat_children'), maxVal: 400 },
    { val: 48, prefix: '', suffix: 'K€', label: t('manifesto_stat_donated'), maxVal: 60 },
    { val: 38, suffix: '', label: t('manifesto_stat_women'), maxVal: 50 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContentVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // useEffect(() => {
  //   const timer = setInterval(() => setActiveTab((p) => (p + 1) % tabs.length), 4500);
  //   return () => clearInterval(timer);
  // }, [tabs.length]);

  
  return (
    <section id="manifesto" ref={sectionRef} className="relative bg-coffee-900 py-16 px-6 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
        src="/Hogar/videos/fondo2.mp4"
      />
      <div className="absolute inset-0 bg-coffee-900/45 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Title */}
        <div className={`text-center mb-12 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="mb-2">
            <em
              style={{
                fontStyle: 'italic',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                textTransform: 'lowercase',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                background: 'linear-gradient(90deg,#FFD700,#FFEE00,#FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('manifesto_title')}
            </em>
          </h2>
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 100,
              letterSpacing: '0.55em',
              color: '#D9A441',
              textTransform: 'uppercase',
              fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)',
            }}
          >
            {t('manifesto_subtitle')}
          </p>
        </div>

        {/* Sintrópico cards carousel — liquid glass */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {sintropicoCards.map((card, i) => (
              <div
                key={i}
                className="snap-start flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden backdrop-blur-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
              >
                <div className="w-full h-[200px] overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-cream font-serif text-lg mb-2">{card.title}</h3>
                  <p className="text-cream/70 text-sm leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            onClick={() => carouselRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 items-center justify-center rounded-full text-cream cursor-pointer"
            style={{ background: 'rgba(20,10,5,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <button
            onClick={() => carouselRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 items-center justify-center rounded-full text-cream cursor-pointer"
            style={{ background: 'rgba(20,10,5,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
        </div>

      </div>
    </section>
  );
};

// shimmerSweep is defined globally in index.css — adding inline fallback
const _shimmerStyle = `
@keyframes shimmerSweep {
  0% { transform: translateX(-100%); }
  60% { transform: translateX(200%); }
  100% { transform: translateX(200%); }
}
@keyframes cacaoFloat {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('manifesto-shimmer')) {
  const s = document.createElement('style');
  s.id = 'manifesto-shimmer';
  s.textContent = _shimmerStyle;
  document.head.appendChild(s);
}

export default Manifesto;
