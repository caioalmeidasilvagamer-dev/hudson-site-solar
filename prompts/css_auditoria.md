# Auditoria CSS — style.css (3228 linhas)

---

## 🔴 Magic Numbers (valores hardcoded sem variável)

| Linha | Elemento | Valor | Deveria ser |
|---|---|---|---|
| 110 | `#particles-canvas` | `opacity: 0.55` | `--particles-opacity: 0.55` |
| 114 | `html:not(.dark) #particles-canvas` | `opacity: 0.12` | `--particles-opacity-day: 0.12` |
| 131 | `.site-header` | `rgba(247, 249, 252, 0)` | usar `--bg` com alpha |
| 138 | `.site-header.scrolled` | `rgba(247, 249, 252, 0.92)` | usar `--bg` com alpha |
| 195 | `.btn-header-cta` | `padding: 10px 20px` | `--btn-py` / `--btn-px` |
| 227 | `.hamburger` | `width: 36px; height: 36px` | `--hamburger-size: 36px` |
| 360 | `.hero-text-col` | `padding: 60px 48px 100px 60px` | `--hero-col-padding` |
| 367–377 | `.hero-model-col` / `model-viewer` | `min-height: 600px` (x2) | `--hero-model-h: 600px` |
| 400–401 | `.model-shimmer` | `width: 280px; height: 180px` | vars de shimmer |
| 601 | `.hero-stat-divider` | `height: 36px` | `--stat-divider-h` |
| 609 | `.scroll-indicator` | `bottom: 28px` | `--scroll-indicator-bottom` |
| 652 | `.site-footer` | `padding: 48px 0 120px` | `--footer-py` |
| 742–744 | `.float-whats` | `right: 18px; bottom: 18px; width: 60px; height: 60px` | `--float-btn-*` vars |
| 788 | `.fluxo-section` | `padding: 100px 0 80px` | `var(--section-py)` + var específica |
| 801–802 | `.fluxo-section::before` | `width: 800px; height: 600px` | hardcoded, decorativo |
| 957 | `.fluxo-no` | `width: 140px` | `--fluxo-no-w: 140px` |
| 963 | `.fluxo-icone` | `width: 88px; height: 88px` | `--fluxo-icone-size: 88px` |
| 1019 | `.fluxo-icone--destino` | `width: 64px; height: 64px` | `--fluxo-destino-icon-size` |
| 1148 | `.fluxo-no` (desktop) | `width: 160px` | `--fluxo-no-w-desktop: 160px` |
| 1203 | `.section-title` | `font-size: 2.5rem` | `--section-title-fs` |
| 1431–1437 | `.results-card` | múltiplos rgba hardcoded para dark glass | vars |
| 1444–1448 | `.results-card::before` | `bottom: -150px; right: -150px; width: 300px; height: 300px` | vars decorativas |
| 1588 | `.beneficio-card` | `padding: 44px 32px` | `--card-py / --card-px` |
| 1956 | `.depoimento-card` | `padding: 44px 32px` | igual ao `.beneficio-card` — consolidar |
| 2398 | `.back-to-top-btn` | `bottom: 96px` | `--back-top-bottom` |
| 2460 | `.offer-bar` | `padding: 10px 20px` | `--offer-bar-py / --offer-bar-px` |
| 2559 | `.offer-bar-close` | `right: 12px` | `--close-btn-offset: 12px` |
| 2595 | `.processo-section::before` | `width: 600px; height: 600px` | decorativo |
| 2614 | `.processo-linha` | `top: 52px` | hardcoded — calcular via step-circle size |
| 2653 | `.step-circle` | `width: 104px; height: 104px` | `--step-circle-size: 104px` |
| 2769 | `.cert-badge` | `width: 130px; height: 130px` | `--cert-badge-size: 130px` |
| 2810 | `.cert-inner` | `width: 106px; height: 106px` | `--cert-inner-size: 106px` |
| 3025 | `.form-toast` | `bottom: 32px` | `--toast-bottom` |

---

## 🔴 `!important` desnecessários (não third-party)

| Linha | Seletor | Propriedade |
|---|---|---|
| 295 | `.mobile-menu` (desktop @media) | `display: none !important` |
| 2091 | `.depoimentos-slider` (desktop) | `transform: none !important` |
| 2329–2335 | `.btn-submit-form` | background, color, border, box-shadow, transition (5×) |
| 2339–2343 | `.btn-submit-form:hover` | background, border-color, box-shadow (3×) |
| 3121–3150 | Bloco `.offer-bar` override (linhas 3121–3150) | 10+ `!important` — desnecessários pois os seletores são específicos o suficiente |
| 3223–3226 | `html:not(.dark) .site-header.scrolled` | background, border-color (2×) |

---

## 🔴 `position: absolute` sem `position: relative` documentado no pai

| Linha | Elemento absoluto | Pai esperado | Problema |
|---|---|---|---|
| 399 | `.model-shimmer` | `.model-poster` | `.model-poster` não tem `position: relative` declarado |
| 607–610 | `.scroll-indicator` | `.hero` | ✅ `.hero` tem `position: relative` — OK |
| 1877–1879 | `.lightbox-close` | `.lightbox-modal` | ✅ OK (fixed) |
| 2202–2204 | `.pulse-indicator` | `.consultor-avatar-wrap` | ✅ tem `position: relative` |
| 2376–2377 | `.scroll-progress-bar` | `.site-header` (fixed) | implícito — sem `relative` no header |
| 2613–2615 | `.processo-linha` | `.processo-timeline` | ✅ tem `position: relative` |

---

## 🟡 `height` fixo onde deveria ser `min-height`

| Linha | Seletor | Valor | Problema |
|---|---|---|---|
| 107 | `#particles-canvas` | `height: 100%` | ✅ OK (fixed, fill viewport) |
| 745 | `.float-whats` | `width/height: 60px` | botão circular, OK |
| 800–802 | `.fluxo-section::before` | `height: 600px` | decorativo, OK |
| 1861 | `.lightbox-modal` | `height: 100%` | modal fixed, OK |
| 2401 | `.back-to-top-btn` | `height: 48px` | botão circular, OK |

> Sem problemas críticos remanescentes aqui após correção anterior (model-viewer já usa `min-height`).

---

## 🟡 Media queries conflitantes ou redundantes

| Breakpoints | Seletor | Problema |
|---|---|---|
| `max-width: 900px` + `min-width: 900px` | Hero, nav, hamburger, fluxo | Mistura de abordagem max-first e min-first — criar conflito no breakpoint exato |
| `min-width: 768px` | `.section-title`, `.contato-headline`, `.beneficios-grid` | Breakpoint extra que não está nos padrões (600/900/1280) |
| `min-width: 992px` | `.calc-grid`, `.contato-grid`, `.depoimentos-slider`, `.beneficios-grid` | Breakpoint 992 não está no padrão do projeto |
| `min-width: 480px` | `.btn-calc-cta`, `.results-grid`, `.form-row-2` | Breakpoint 480 não está no padrão |
| `max-width: 640px` | `.offer-bar` texto | Inconsistente com os demais |
| `max-width: 430px` | `.offer-bar-close` | Consistente com o fix — OK |

**Resumo:** o projeto usa 6 breakpoints diferentes (430, 480, 600, 640, 768, 900, 992) quando o padrão definido é 3 (600, 900, 1280).

---

## 🟡 `padding` simulando posição

| Linha | Seletor | Problema |
|---|---|---|
| 332 | `.hero` | `padding-top: var(--header-h)` — correto para empurrar conteúdo abaixo do header fixo; este caso é legítimo |
| 652 | `.site-footer` | `padding: 48px 0 120px` — o `120px` de baixo compensa o `.mobile-cta-float` (height ~76px + safe area). Deveria ser `calc(76px + env(safe-area-inset-bottom))` ou uma variável |

---

## 🟡 `overflow: hidden` que pode causar clipping

| Linha | Seletor | Risco |
|---|---|---|
| 333 | `.hero` | `overflow: hidden` — pode cortar o `scroll-indicator` se `bottom` for insuficiente |
| 1439 | `.results-card` | `overflow: hidden` — pode cortar o `::before` pseudo decorativo |
| 1590 | `.beneficio-card` | `overflow: hidden` — pode cortar `.beneficio-card::before` |
| 1703 | `.projeto-card` | `overflow: hidden` — necessário para o zoom da imagem |
| 1936 | `.depoimentos-wrapper` | `overflow: hidden` — necessário para o slider |
| 2587 | `.processo-section` | `overflow: hidden` — pode cortar o `::before` decorativo |

---

## 🟡 `flex-wrap: wrap` sem tratamento dos filhos absolutos

| Linha | Seletor | Problema |
|---|---|---|
| 2479 | `.offer-bar-inner` | `flex-wrap: wrap` + filho absoluto `.offer-bar-close` — **já corrigido** com `@media (max-width: 430px)` usando `top: 8px` |
| 660–666 | `.footer-top` | `flex-wrap: wrap` — sem filhos absolutos, OK |
| 714 | `.footer-bottom` | `flex-wrap: wrap` — sem filhos absolutos, OK |

---

## 🟡 `top: 50%; transform: translateY(-50%)` em pai sem altura definida

| Linha | Seletor | Pai | Problema |
|---|---|---|---|
| 863–867 | `.fluxo-svg-connectors` | `.fluxo-diagrama` | `top: 50%` com `transform: translateY(-50%)` — `.fluxo-diagrama` tem `padding: 40px 0` mas não `height` fixo. Funciona se o pai tiver altura suficiente pelo conteúdo |

---

## 🟡 Variáveis declaradas mas não usadas / hardcoded que deveriam usar variáveis

| Situação | Detalhes |
|---|---|
| `--gap: 24px` declarada no `:root` | Usada em `.beneficios-grid`, `.projetos-grid`, `.depoimentos-slider` (desktop) — ✅ usada |
| `rgba(247, 249, 252, ...)` no header | Cor hardcoded que deveria ser `--bg` com alpha |
| `rgba(10, 10, 10, ...)` em múltiplos cards | Cor do dark mode hardcoded em vez de `var(--bg)` com alpha |
| `#0a0a0a` em `.offer-bar-cta` | Hardcoded — deveria ser `var(--bg)` (dark) |
| `#f0ece0` nos overrides `.offer-bar` (linha 3127) | Cor não declarada no `:root` |
| `#1c1600` em `.step-circle--last` (linha 2676) | Magic color não declarada |
| `#4aa8ff` nos cert-ring (linhas 2791–2822) | Cor não declarada no `:root` |

---

## 🟡 Blocos de override desnecessariamente redundantes (linhas 3113–3228)

O bloco final (linhas 3113–3228) foi adicionado como patch acumulado e:
- Redefine `background` de `.offer-bar` que já estava definido corretamente acima com `!important`
- Repete estilos de `.nav-link`, `.hero-sub`, `.stat-label` que já deveriam estar no `:root` via variáveis corretas
- Aumenta especificidade desnecessariamente com `html:not(.dark)` em seletores que poderiam funcionar com variáveis

---

## Resumo de Contagem

| Categoria | Ocorrências |
|---|---|
| Magic numbers | ~30 |
| `!important` desnecessários | ~20 |
| Breakpoints fora do padrão | 4 extras (480, 640, 768, 992) |
| `position: absolute` sem `relative` no pai | 2 |
| Cores hardcoded não declaradas no `:root` | 5 |
| Bloco de overrides acumulados | 1 (linhas 3113–3228) |
