import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Mail, MapPin, Lock, Phone, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// PALETTE — Swiss Minimal × Korean Studio
// ─────────────────────────────────────────────────────────────
const C = {
  bg: '#FFFFFF',       // pure white
  bgAlt: '#F4F4F5',    // subtle gray (hover/alt)
  bgDeep: '#0A0A0A',   // true black for dark section
  ink: '#0A0A0A',      // near-black (primary text)
  inkSoft: '#525252',  // dark gray (secondary)
  inkMuted: '#A3A3A3', // mid gray (tertiary)
  accent: '#2563EB',   // royal blue (single accent)
  accentSoft: '#60A5FA',// light blue for dark mode
  line: '#E5E5E5',     // clean light divider
};

// ─────────────────────────────────────────────────────────────
// PROJECT DATA — Edit links / details here
// ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    n: '01',
    title: '라디오 방송 자동화 시스템',
    org: '극동방송',
    year: '2022',
    tags: ['Python', 'Audio Processing', 'Automation'],
    description:
      '라디오 방송에서 설교 부분만 자동 분리·저장하고, 방송 중 흐른 CCM을 자동 식별해 선곡표를 생성하는 시스템. 개발 복귀 직후의 한정된 역량 안에서, 편성국과의 알림음 통일 협의로 기술 난이도를 낮춘 뒤 ChatGPT·서적·라이브러리를 결합해 완성.',
    impact: '상시 운영을 위해 전용 컴퓨터 지원',
    locked: true,
  },
  {
    n: '02',
    title: 'Ownership AI',
    org: '정부지원사업 매칭 SaaS',
    year: '2025 – 현재',
    tags: ['Next.js', 'Supabase', 'AI Matching', 'SaaS'],
    description:
      '1인 컨설턴트를 위한 정부지원사업 자동 매칭 SaaS 플랫폼. 고객의 업종·지역·관심사를 기반으로 AI가 적합한 지원사업을 추천하고, 자동 알림·성과 분석·문서 관리까지 단일 시스템으로 통합. 사내 정책자금 컨설팅 도구로 출발해 외부 SaaS로 확장 운영 중.',
    impact: '베타 운영 중 · 테스터 100+ · 매칭 5,000+',
    link: 'https://ownership.ai.kr/',
  },
  {
    n: '03',
    title: 'LeadFlow — 광고 리드 관리 플랫폼',
    org: '기업 경영 컨설팅 회사',
    year: '2025',
    tags: ['Next.js', 'Supabase', 'Automation'],
    description:
      'Meta 광고 리드 수집 → 등급 분류 → 컨설턴트 자동 배분 → 성과 분석을 단일 플랫폼으로 통합. 기존의 Zapier + flow.team 조합을 자체 플랫폼으로 대체.',
    impact: '월 30~40만원 구독료 절감 · 리드 처리 시간 ¼로 단축',
    locked: true,
  },
  {
    n: '04',
    title: 'Naver 블로그 SEO 프롬프트 시스템',
    org: 'Personal',
    year: '2026',
    tags: ['AI Prompts', 'SEO', 'Automation'],
    description:
      'Naver의 6가지 알고리즘 전략(C랭크, 알콘, AEO, 홈피드, 인사이트 엣지, 정보성)에 각각 최적화된 AI 프롬프트 시스템. 알고리즘별 타겟을 분리하면서 글 작성을 자동화.',
    impact: '6개 알고리즘별 콘텐츠 자동 생성 체계',
    link: '#',
  },
  {
    n: '05',
    title: '카드뉴스 자동 생성기',
    org: 'Personal',
    year: '2026',
    tags: ['HTML', 'Templates', 'Content Automation'],
    description:
      'HTML 기반 1080×1080 카드뉴스 자동 생성 도구. 다양한 레이아웃과 테마를 지원하며 컨설팅 콘텐츠 발행에 활용 중.',
    impact: '주 단위 콘텐츠 생산 시간 대폭 단축',
    link: 'https://cardnews-hazel.vercel.app/',
  },
  {
    n: '06',
    title: 'AI 큐레이션 플랫폼 프로토타입',
    org: 'Personal',
    year: '2026',
    tags: ['Next.js', 'Supabase', 'Multi-AI'],
    description:
      '정부 자금 데모용으로 설계한 AI 기반 패션 큐레이션 플랫폼. 다중 AI 프로바이더를 결합해 사용자 맥락에 따른 큐레이션을 제공.',
    impact: '풀스택 시연용 프로토타입 완성',
    link: 'https://nicehue-style-ai.vercel.app/login',
  },
  {
    n: '07',
    title: '비즈니스헬퍼 설팀장',
    org: 'Naver Blog',
    year: '2024 – 2025',
    tags: ['Content', 'SEO'],
    description:
      '기업 경영 컨설팅 콘텐츠를 운영하는 Naver 블로그. 정책자금·공공조달·인증 관련 실무 콘텐츠를 SEO 기반으로 발행.',
    impact: '운영 중단',
    link: 'https://blog.naver.com/owners_5543',
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [revealed, setRevealed] = useState({});
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((r) => ({ ...r, [entry.target.dataset.reveal]: true }));
            if (entry.target.dataset.section) {
              setActiveSection(entry.target.dataset.section);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: '100vh' }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        html { overflow-x: hidden; }
        body {
          font-family: 'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif;
          background: ${C.bg};
          color: ${C.ink};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "ss03";
        }
        .display {
          font-family: 'Pretendard Variable', Pretendard, system-ui, sans-serif;
          letter-spacing: -0.04em;
          font-weight: 700;
        }
        .mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          letter-spacing: 0;
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-reveal].in {
          opacity: 1;
          transform: translateY(0);
        }

        .link-underline {
          background-image: linear-gradient(${C.ink}, ${C.ink});
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .link-underline:hover {
          background-size: 0% 1px;
          background-position: 100% 100%;
        }

        .project-card {
          transition: background 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.5s ease;
          position: relative;
        }
        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, ${C.bgAlt}80 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .project-card:hover::before {
          opacity: 1;
        }
        .project-card:hover .arrow-icon {
          transform: translate(6px, -6px);
        }
        .project-card:hover .project-title {
          color: ${C.accent};
        }
        .project-title {
          transition: color 0.4s ease;
        }
        .arrow-icon {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
        }

        .keyword-pill {
          transition: all 0.3s ease;
        }
        .keyword-pill:hover {
          background: ${C.ink};
          color: ${C.bg};
          border-color: ${C.ink};
          transform: translateY(-2px);
        }

        .contact-row {
          transition: padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-row:hover {
          padding-left: 12px;
        }
        .contact-row:hover .contact-arrow {
          transform: translate(4px, -4px);
          opacity: 1;
        }
        .contact-arrow {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          opacity: 0.5;
        }

        .nav-btn {
          position: relative;
          transition: color 0.3s;
        }
        .nav-btn::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          height: 1px;
          width: 100%;
          background: ${C.ink};
          transform-origin: right;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn:hover::after,
        .nav-btn.active::after {
          transform-origin: left;
          transform: scaleX(1);
        }

        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.04;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E");
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        .pulse-dot {
          animation: pulse-dot 2.4s ease-in-out infinite;
        }

        @keyframes float-blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        .float-blob {
          animation: float-blob 14s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>


      {/* ───────── TOP BAR ───────── */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: `${C.bg}D9`,
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          borderBottom: `1px solid ${C.line}80`,
        }}
      >
        <div style={{
          maxWidth: 1320, margin: '0 auto', padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: C.inkSoft,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} className="pulse-dot" />
            Lee Seol-hee · Portfolio
          </div>
          <nav style={{ display: 'flex', gap: 36 }}>
            {[['about', 'About'], ['projects', 'Work'], ['contact', 'Contact']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`mono nav-btn ${activeSection === id ? 'active' : ''}`}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase',
                  color: activeSection === id ? C.ink : C.inkSoft,
                  fontWeight: activeSection === id ? 600 : 400,
                  padding: 0,
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section
        id="hero"
        data-reveal="hero"
        data-section="hero"
        className={revealed.hero ? 'in' : ''}
        style={{
          minHeight: '100vh',
          maxWidth: 1320,
          margin: '0 auto',
          padding: '160px 32px 100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase',
            color: C.accent, marginBottom: 40,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent }} />
            Currently · Independent · Open to opportunities
          </div>

          <h1 className="display" style={{
            fontSize: 'clamp(56px, 9vw, 132px)',
            fontWeight: 400,
            lineHeight: 0.92,
            margin: 0,
            maxWidth: '14ch',
            letterSpacing: '-0.025em',
          }}>
            문제를<br />
            쥐고 있지 않고,<br />
            <span style={{ color: C.accent }}>
              빠르게<br />풀어내는
            </span>{' '}사람.
          </h1>

          <div style={{
            marginTop: 72,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 48,
            maxWidth: 920,
            paddingTop: 36,
            borderTop: `1px solid ${C.line}`,
          }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.inkMuted, marginBottom: 10 }}>
                Name
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>이설희 · Lee Seol-hee</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.inkMuted, marginBottom: 10 }}>
                Role
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>Problem Solver</div>
              <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 4 }}>Consulting × Development × AI</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: C.inkMuted, marginBottom: 10 }}>
                Based in
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.01em' }}>
                <MapPin size={15} strokeWidth={1.5} /> Seoul, Korea
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 48, left: 32,
          display: 'flex', alignItems: 'center', gap: 14,
          zIndex: 1,
        }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: 2.2, textTransform: 'uppercase', color: C.inkMuted }}>
            Scroll
          </div>
          <div style={{ width: 48, height: 1, background: C.line, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%', width: '40%',
              background: C.accent,
            }} />
          </div>
        </div>
      </section>

      {/* ───────── ABOUT ───────── */}
      <section
        id="about"
        data-reveal="about"
        data-section="about"
        className={revealed.about ? 'in' : ''}
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '140px 32px',
          borderTop: `1px solid ${C.line}`,
          position: 'relative',
        }}
      >
        <div className="about-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2.5fr',
          gap: 96,
          alignItems: 'start',
        }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <div className="mono" style={{
              fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase',
              color: C.accent, marginBottom: 20,
            }}>
              01 · About
            </div>
            <h2 className="display" style={{
              fontSize: 'clamp(36px, 4.2vw, 52px)',
              fontWeight: 400, lineHeight: 1.05, margin: 0,
              letterSpacing: '-0.025em',
            }}>
              사람을 돕는<br />
              <span style={{ color: C.accent }}>시스템</span>을<br />설계하는 일.
            </h2>
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.75, color: C.inkSoft, fontWeight: 400 }}>
            <p style={{ marginTop: 0 }}>
              사회 초년생 시절 약 4년간 개발자로 일했고, 이후 보험 영업과 방송사 재무관리를 거쳐
              다시 개발자로 돌아왔습니다. 지금은 기업 경영 컨설턴트로 일해온 경험을 토대로,
              컨설팅·개발·AI를 결합한 일을 개인 단위로 이어가고 있습니다.
            </p>
            <p>
              결과적으로 <span style={{ color: C.ink, fontWeight: 500 }}>기술·영업·재무·컨설팅을 한 사람이 직접 경험한 흔치 않은 조합</span>이 만들어졌습니다.
              그 조합이 가장 강력하게 쓰이는 지점은 분명합니다. 사업의 구조를 이해하면서 동시에
              직접 시스템을 만들 수 있는 사람이 AI를 만나면, 1인 단위로도 의미 있는 결과를
              만들어낼 수 있다는 것.
            </p>
            <p style={{ marginBottom: 0 }}>
              먼 목표는 <span style={{ color: C.ink, fontWeight: 500 }}>가난하거나 장애가 있는 아이들이 스스로 자립할 수 있는 시스템</span>을
              만드는 일입니다. 지금까지 해온 모든 일은 같은 줄기 위에 있습니다.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="stat-grid" style={{
          marginTop: 96,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: C.line,
          border: `1px solid ${C.line}`,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          {[
            { num: '4', unit: 'YRS', label: '개발 경력' },
            { num: '4', unit: 'FIELDS', label: '기술·영업·재무·컨설팅' },
            { num: '7+', unit: 'PROJECTS', label: '직접 운영' },
            { num: '1', unit: 'PERSON', label: '풀스택 + AI' },
          ].map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                background: C.bg,
                padding: '32px 28px',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <div className="display" style={{
                  fontSize: 56, lineHeight: 1, color: C.ink,
                  letterSpacing: '-0.03em',
                }}>
                  {s.num}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: C.accent }}>
                  {s.unit}
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Keywords strip */}
        <div style={{
          marginTop: 64,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          {['일단 해보겠습니다', '문제 재정의', '외부 자원 결합', '실행 → 결과', '1인 시스템', 'AI 자동화'].map((kw, i) => (
            <span
              key={i}
              className="mono keyword-pill"
              style={{
                fontSize: 11,
                padding: '9px 16px',
                border: `1px solid ${C.line}`,
                borderRadius: 999,
                color: C.inkSoft,
                background: C.bg,
                cursor: 'default',
                letterSpacing: 0.3,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </section>

      {/* ───────── PROJECTS ───────── */}
      <section
        id="projects"
        data-reveal="projects"
        data-section="projects"
        className={revealed.projects ? 'in' : ''}
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '140px 32px',
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 72,
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <div className="mono" style={{
              fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase',
              color: C.accent, marginBottom: 20,
            }}>
              02 · Selected Work
            </div>
            <h2 className="display" style={{
              fontSize: 'clamp(44px, 5.5vw, 76px)',
              fontWeight: 400, lineHeight: 0.98, margin: 0,
              letterSpacing: '-0.025em',
            }}>
              직접 만들어 <span style={{ color: C.accent }}>운영한</span><br />것들.
            </h2>
          </div>
          <div className="mono" style={{ fontSize: 12, color: C.inkSoft, letterSpacing: 0.5 }}>
            {PROJECTS.length.toString().padStart(2, '0')} Projects · 2022 — 2025
          </div>
        </div>

        <div>
          {PROJECTS.map((p, i) => (
            <div
              key={p.n}
              className="project-card"
              style={{
                borderTop: `1px solid ${C.line}`,
                borderBottom: i === PROJECTS.length - 1 ? `1px solid ${C.line}` : 'none',
                padding: '44px 28px',
                display: 'grid',
                gridTemplateColumns: '64px 1fr auto',
                gap: 36,
                alignItems: 'start',
                cursor: p.link ? 'pointer' : 'default',
              }}
              onClick={() => p.link && window.open(p.link, '_blank')}
            >
              <div className="mono" style={{
                fontSize: 11, color: C.inkMuted, paddingTop: 10,
                letterSpacing: 0.5,
              }}>
                {p.n} / {PROJECTS.length.toString().padStart(2, '0')}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  flexWrap: 'wrap', marginBottom: 10,
                }}>
                  <h3 className="display project-title" style={{
                    fontSize: 30, fontWeight: 400, margin: 0,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}>
                    {p.title}
                  </h3>
                  {p.locked && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 9, padding: '4px 9px',
                      borderRadius: 999,
                      background: C.bgAlt,
                      color: C.inkSoft,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      fontFamily: 'JetBrains Mono, monospace',
                      border: `1px solid ${C.line}`,
                    }}>
                      <Lock size={9} strokeWidth={2} />
                      Internal
                    </span>
                  )}
                </div>

                <div className="mono" style={{
                  fontSize: 11, color: C.inkMuted,
                  marginBottom: 20, letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                  {p.org} · {p.year}
                </div>

                <p style={{
                  margin: 0, marginBottom: 20,
                  fontSize: 15, lineHeight: 1.7,
                  color: C.inkSoft,
                  maxWidth: '62ch',
                }}>
                  {p.description}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 18, flexWrap: 'wrap',
                  paddingTop: 18,
                  borderTop: `1px dashed ${C.line}`,
                }}>
                  <div className="mono" style={{
                    fontSize: 11, color: C.accent,
                    letterSpacing: 0.5,
                    fontWeight: 500,
                  }}>
                    → {p.impact}
                  </div>
                  <div style={{
                    display: 'flex', gap: 8, flexWrap: 'wrap',
                  }}>
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: C.inkMuted,
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                          padding: '3px 0',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 8, position: 'relative', zIndex: 1 }}>
                {p.link ? (
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: '50%',
                    border: `1px solid ${C.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: C.bg,
                  }}>
                    <ArrowUpRight
                      className="arrow-icon"
                      size={20}
                      strokeWidth={1.5}
                      style={{ color: C.ink }}
                    />
                  </div>
                ) : (
                  <div className="mono" style={{
                    fontSize: 9,
                    color: C.inkMuted,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    textAlign: 'right',
                    paddingTop: 12,
                  }}>
                    Details on<br />request
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CONTACT ───────── */}
      <section
        id="contact"
        data-reveal="contact"
        data-section="contact"
        className={revealed.contact ? 'in' : ''}
        style={{
          background: C.bgDeep,
          color: C.bg,
          padding: '140px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Single editorial accent glow */}
        <div
          className="blob"
          style={{
            top: '-10%', right: '-5%',
            width: 600, height: 600,
            background: `radial-gradient(circle, ${C.accent}22, transparent 65%)`,
          }}
        />

        <div className="contact-grid" style={{
          maxWidth: 1320, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 96,
          alignItems: 'start',
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            <div className="mono" style={{
              fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase',
              color: C.accentSoft, marginBottom: 28,
            }}>
              03 · Contact
            </div>
            <h2 className="display" style={{
              fontSize: 'clamp(34px, 3.8vw, 60px)',
              fontWeight: 400, lineHeight: 1.05, margin: 0,
              letterSpacing: '-0.02em',
            }}>
              크리투스팀과<br />
              <span style={{ color: C.accentSoft }}>함께</span> 풀어가고 싶은<br />
              Problem Solver,<br />
              <span style={{ color: C.accentSoft }}>이설희</span>입니다.
            </h2>
            <p style={{
              marginTop: 36,
              fontSize: 17,
              lineHeight: 1.75,
              color: '#A3A3A3',
              maxWidth: '48ch',
            }}>
              제가 가진 경험이 도움이 될 만한 자리,<br />
              같은 방향을 보는 사람들과 일할 때 가장 좋은 결과가 나옵니다.
            </p>

            <div style={{
              marginTop: 48,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              borderRadius: 999,
              border: `1px solid ${C.accentSoft}40`,
              background: `${C.accent}15`,
            }}>
              <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.accentSoft }} />
              <span className="mono" style={{ fontSize: 11, letterSpacing: 1.5, color: C.accentSoft, textTransform: 'uppercase' }}>
                Available for new work
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ContactRow icon={<Mail size={18} strokeWidth={1.5} />} label="Email" value="geese3@naver.com" />
            <ContactRow icon={<Phone size={18} strokeWidth={1.5} />} label="Phone" value="+82 10-5540-5543" />
            <ContactRow icon={<ExternalLink size={18} strokeWidth={1.5} />} label="Blog" value="비즈니스헬퍼 설팀장" href="#" />
            <ContactRow icon={<MapPin size={18} strokeWidth={1.5} />} label="Location" value="Seoul, Korea" />
          </div>
        </div>

        <div style={{
          maxWidth: 1320, margin: '140px auto 0',
          paddingTop: 36,
          borderTop: '1px solid #262626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: 1.8,
            color: '#737373',
            textTransform: 'uppercase',
          }}>
            © 2026 Lee Seol-hee
          </div>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: 1.8,
            color: '#737373',
            textTransform: 'uppercase',
          }}>
            Designed & Built by Hand
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon, label, value, href }) {
  const content = (
    <div className="contact-row" style={{
      display: 'flex', alignItems: 'center', gap: 22,
      padding: '24px 0',
      borderBottom: '1px solid #262626',
    }}>
      <div style={{
        color: '#60A5FA', flexShrink: 0,
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1px solid #262626',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase',
          color: '#A3A3A3', marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{ fontSize: 18, color: '#FAFAFA', letterSpacing: '-0.01em' }}>{value}</div>
      </div>
      {href && (
        <ArrowUpRight
          className="contact-arrow"
          size={20}
          strokeWidth={1.5}
          style={{ color: '#60A5FA' }}
        />
      )}
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      {content}
    </a>
  ) : content;
}
