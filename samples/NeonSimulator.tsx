'use client'

import { useState } from 'react'

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string, userData?: { phone_number: string }) => boolean
  }
}

const NEON_COLORS: Record<string, { glow: string; swatch: string; bg: string }> = {
  'Branco Quente': { glow: '#ffcc55', swatch: '#fff3c0', bg: 'rgba(255,220,100,0.95)' },
  'Branco Frio':   { glow: '#9fd4ff', swatch: '#ddeeff', bg: 'rgba(200,230,255,0.95)' },
  Azul:            { glow: '#00c3ff', swatch: '#00c3ff', bg: 'rgba(0,195,255,0.9)' },
  Ciano:           { glow: '#00ffe0', swatch: '#00ffe0', bg: 'rgba(0,255,224,0.9)' },
  Laranja:         { glow: '#ff7a00', swatch: '#ff7a00', bg: 'rgba(255,122,0,0.9)' },
  Vermelho:        { glow: '#ff2244', swatch: '#ff2244', bg: 'rgba(255,34,68,0.9)' },
  Amarelo:         { glow: '#ffe84a', swatch: '#ffe84a', bg: 'rgba(255,232,74,0.9)' },
  Rosa:            { glow: '#ff2d9b', swatch: '#ff2d9b', bg: 'rgba(255,45,155,0.9)' },
}

export default function NeonSimulator() {
  const [activeColor, setActiveColor] = useState('Branco Quente')
  const col = NEON_COLORS[activeColor]
  const filterId = `neon-glow-${activeColor.replace(/\s/g, '_')}`

  const svgStyle = `
    .neon-svg-paths path, .neon-svg-paths line {
      fill: none;
      stroke: #ffffff;
      stroke-width: 55;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: url(#${filterId});
      transition: filter 0.45s ease, stroke 0.45s ease;
    }
    .neon-svg-paths .fil1 { fill: none; }
    @media (max-width: 768px) {
      .neon-svg-paths path, .neon-svg-paths line {
        stroke: ${col.glow};
        filter: drop-shadow(0 0 6px ${col.glow}) drop-shadow(0 0 22px ${col.glow}80);
      }
    }
  `

  return (
    <div className="neon-simulator">
      <div className="neon-scene">
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${col.glow}14 0%, transparent 68%)`,
          transition: 'background 0.45s', borderRadius: '24px 24px 0 0',
        }} />

        <style>{svgStyle}</style>
        <div className="neon-svg-wrap" style={{ width: '92%', maxWidth: 860, position: 'relative', zIndex: 2 }}>
          <svg
            className="neon-svg-paths"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-600 -480 9824.2 5515.46"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="acrylic-body" x1="0%" y1="0%" x2="30%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.82" />
                <stop offset="50%" stopColor="#0d0d18" stopOpacity="0.90" />
                <stop offset="100%" stopColor="#080810" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="acrylic-gloss" x1="0%" y1="0%" x2="55%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="18%" stopColor="#ffffff" stopOpacity="0.10" />
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="acrylic-edge-top" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="15%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="85%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="acrylic-edge-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="acrylic-edge-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#aaaacc" stopOpacity="0.0" />
                <stop offset="20%" stopColor="#aaaacc" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#aaaacc" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#aaaacc" stopOpacity="0.0" />
              </linearGradient>
              <radialGradient id="acrylic-neon-wash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={col.glow} stopOpacity="0.12" />
                <stop offset="100%" stopColor={col.glow} stopOpacity="0.00" />
              </radialGradient>
              <filter id="panel-shadow" x="-15%" y="-15%" width="130%" height="150%">
                <feDropShadow dx="0" dy="40" stdDeviation="60" floodColor="#000000" floodOpacity="0.85" />
                <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#000000" floodOpacity="0.6" />
              </filter>
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="coreBlur" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                <feFlood floodColor={col.glow} floodOpacity="1" result="c2" />
                <feComposite in="c2" in2="blur2" operator="in" result="halo2" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="38" result="blur3" />
                <feFlood floodColor={col.glow} floodOpacity="0.75" result="c3" />
                <feComposite in="c3" in2="blur3" operator="in" result="halo3" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="90" result="blur4" />
                <feFlood floodColor={col.glow} floodOpacity="0.35" result="c4" />
                <feComposite in="c4" in2="blur4" operator="in" result="halo4" />
                <feMerge>
                  <feMergeNode in="halo4" />
                  <feMergeNode in="halo3" />
                  <feMergeNode in="halo2" />
                  <feMergeNode in="coreBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Acrylic panel */}
            <rect x="-480" y="-380" width="9584.2" height="5315.46" rx="520" ry="520"
              fill="transparent" filter="url(#panel-shadow)" />
            <rect x="-480" y="-380" width="9584.2" height="5315.46" rx="520" ry="520"
              fill="url(#acrylic-body)" />
            <rect x="-480" y="-380" width="9584.2" height="5315.46" rx="520" ry="520"
              fill="url(#acrylic-neon-wash)" style={{ transition: 'fill 0.4s' }} />
            <rect x="-480" y="-380" width="9584.2" height="5315.46" rx="520" ry="520"
              fill="url(#acrylic-gloss)" />
            <rect x="-480" y="-380" width="9584.2" height="5315.46" rx="520" ry="520"
              fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="18" />
            <rect x="-420" y="-320" width="9464.2" height="5195.46" rx="500" ry="500"
              fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
            <rect x="100" y="-388" width="8400" height="36" rx="18" fill="url(#acrylic-edge-top)" />
            <rect x="-488" y="100" width="36" height="4355.46" rx="18" fill="url(#acrylic-edge-left)" />
            <rect x="200" y="4895" width="8200" height="24" rx="12" fill="url(#acrylic-edge-bottom)" />

            <g>
              <path className="fil0 str0" d="M2088.27 1014.27c762.49,-844.83 544.34,-1119.26 -389.63,-977.35 -821.19,241.59 -2647.53,1366.96 -865.17,1366.96 272.02,0 550.02,-56.7 816.07,0 2224.02,473.97 -2645.9,2383.65 -1460.7,1035.57 484.25,-550.79 1946.21,-917.32 2673.11,-1049.74 291.49,-19.76 430.53,-102.42 460.63,-211.52 39.75,-144.08 -126.16,-357.51 -311.87,-128.13 -350.72,433.26 -259.62,1088.4 450.44,231.1" />
              <path className="fil0 str0" d="M3652.08 1098.71c-188,479.22 -411.16,934.99 -712.73,1338.47 -228.96,306.37 -810.86,329.73 -652.75,-121.17 164.06,-467.66 834.1,-633.5 2024.8,-488.66" />
              <path className="fil0 str0" d="M4215.24 1055.43c-204.81,-90.88 -429.91,22.02 -491.17,357.02 -75.78,414.35 289.69,216.18 424.49,-5.14l236.41 -360.2c-504.87,814.57 -182.6,815.67 295.12,119.56" />
              <line className="fil0 str0" x1="3860.74" y1="574.04" x2="3718.51" y2="930.68" />
              <path className="fil0 str0" d="M6946.68 1055.43c-158.14,-111.61 -370.33,-4.45 -491.17,357.02 -133.55,399.48 326.52,225.41 461.32,4.09l3.75 -6.93 195.84 -362.5 -202.98 377.42c-186.59,346.96 141.58,283.9 498.1,-257.86" />
              <path className="fil0 str0" d="M6066.68 975.16c-194.27,346.92 -216.77,549.12 -162.96,619.08 53.8,69.96 183.94,7.68 294.94,-174.33l202.1 -383.93 -202.1 383.93c-1.72,3.27 -2.68,6.86 -3.97,10.23 -112.99,294.57 7.42,332.34 236.76,105.23" />
              <path className="fil0 str0" d="M5664.48 777.86c-366.52,125.56 -516.58,279.88 -229.28,492.31 390.36,288.53 2.89,685.67 -269.78,738.17 -248.6,47.87 -87.69,-275.76 88.1,-410.1 239.75,-183.22 484.16,-299.67 733.61,-469.48" />
              <path className="fil0 str0" d="M179.96 4308.23c8.53,-36.9 114.54,-248 237.59,-441.94 178.42,-281.2 221.45,-57.76 184.58,130.55 -13.15,67.11 -19.66,140.09 -41.06,200.7l-70.34 199.24 70.34 -199.24c0.63,-1.79 -0.65,1.75 0,0 24.67,-66.43 75.41,-128.52 125.28,-195.89 197.77,-267.17 352.88,-359.71 268.58,-56.33 -107.04,385.28 -429.49,864.58 149.85,211.86" />
              <path className="fil0 str0" d="M1101.32 4157.45c262.76,-19.76 409.92,-153.33 437.03,-262.41 35.82,-144.06 -96.01,-330.44 -263.4,-101.08 -316.16,433.24 -263.43,1098.71 376.68,241.42" />
              <path className="fil0 str0" d="M2052.76 4070.12c-685.13,1026.57 -472.27,179.95 -309.76,-342.92 297.37,-1396.23 1092.91,-1259.98 0,0" />
              <path className="fil0 str0" d="M1972.48 4494.49c-1.68,-159.09 100.41,-507.55 181.14,-767.29 297.37,-1396.23 1092.91,-1259.98 0,0" />
              <path className="fil0 str0" d="M2665.47 4065.37c-246.46,316.59 -409,428.52 -301.61,16.91 54.25,-188.26 113.88,-656.16 -116.05,-261.17 -112.93,193.91 -199.75,425.51 -275.33,673.38" />
              <path className="fil0 str0" d="M3069.21 3757.58c-161.07,-352.72 -350.29,-0.14 -403.74,307.79 -55.36,318.89 30.09,594.38 316.73,-145.59" />
              <path className="fil0 str0" d="M2912.96 3809.29c94.09,219.53 240.66,206.76 442.71,-51.71 484.08,-619.26 -167.62,-668.32 0,0 78.46,73.73 94.66,179.44 60.6,272.99 -286.23,786.07 335.73,237.37 396.4,-235.03" />
              <path className="fil0 str0" d="M330.06 3740.34c0,17.24 -199.68,750.56 -199.68,750.56" />
              <path className="fil0 str0" d="M6492.59 2897.51c-142.22,-111.61 -301.76,-9.93 -410.42,351.54 -120.11,399.48 262.35,230.88 383.57,9.56l3.38 -6.93 176.12 -362.5 -182.55 377.42c-167.8,346.94 17.06,323.18 337.69,-218.59" />
              <path className="fil0 str0" d="M7166.56 2895.35c-161.08,-352.72 -350.29,-0.14 -403.74,307.79 -55.36,318.89 30.09,594.38 316.73,-145.59" />
              <path className="fil0 str0" d="M7010.31 2947.06c91.57,213.65 232.85,207.28 426.58,-31.44" />
              <path className="fil0 str0" d="M6314.33 2555.7c-57.12,-70.69 129.71,-163.04 218.81,-52.64 89.1,110.4 171.69,63.76 250.99,-61.93" />
              <path className="fil0 str0" d="M5209.83 2950.82c484.08,-619.25 -167.62,-668.32 0,0 78.46,73.73 94.66,179.45 60.6,272.99 -286.22,786.07 324.23,205.1 384.9,-267.31" />
              <path className="fil0 str0" d="M6021.3 2586.87c-380.88,125.56 -536.84,279.91 -238.27,492.31 405.63,288.55 41.94,706.75 -241.41,759.24 -258.34,47.86 -130.05,-296.84 52.61,-431.17 249.13,-183.2 295.16,-165.49 554.38,-335.3" />
              <path className="fil0 str0" d="M4605.12 3288.59c262.76,-19.76 397.52,-152.3 424.64,-261.38 35.81,-144.06 -96.01,-330.44 -263.4,-101.07 -316.16,433.23 -244.23,1260.89 443.47,24.68" />
              <path className="fil0 str0" d="M4142.91 2786.96c-32.43,200.09 -64.86,400.18 -97.29,600.27 -62.96,519.09 256.15,7.49 395.63,-270.08 428.2,-852.06 -479.79,-531.74 225.91,-16.53" />
              <path className="fil1 str0" d="M7987.22 1844.79c79.44,-158.87 158.87,-238.31 317.75,-238.31 175.39,0 317.74,142.35 317.74,317.74 0,317.75 -317.74,635.49 -635.49,953.24 -317.75,-317.74 -635.49,-635.49 -635.49,-953.24 0,-175.39 142.35,-317.74 317.74,-317.74 158.87,0 238.31,79.44 317.75,238.31z" />
            </g>
          </svg>
        </div>
      </div>

      <div className="neon-controls">
        <p style={{ color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Escolha a cor do seu neon
        </p>
        <div className="color-palette">
          {Object.entries(NEON_COLORS).map(([name, c]) => (
            <button key={name} className="color-btn" onClick={() => setActiveColor(name)}>
              <div
                className={`color-swatch ${activeColor === name ? 'active' : ''}`}
                style={{
                  background: c.swatch,
                  boxShadow: activeColor === name
                    ? `0 0 0 2px white, 0 0 20px ${c.glow}cc`
                    : `0 0 10px ${c.glow}55`,
                }}
              />
              <span className="color-name">{name}</span>
            </button>
          ))}
        </div>
        <button
          className="btn-neon-cta"
          style={{ background: col.bg, ['--cta-glow' as string]: col.glow + '88' }}
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag_report_conversion) {
              window.gtag_report_conversion()
            }
            window.open(
              `https://wa.me/5545999367000?text=${encodeURIComponent('Olá! Estava testando as cores no site e gostaria de um orçamento para um LED Neon.')}`,
              '_blank'
            )
          }}
        >
          Pedir esse neon no WhatsApp →
        </button>
      </div>
    </div>
  )
}
