# Prompt — Mobile do Diagrama de Fluxo (APENAS ADIÇÕES)

---

## REGRA ABSOLUTA

**NÃO alterar, remover ou sobrescrever nenhuma linha de CSS ou JS já existente.**
Este prompt é 100% aditivo — só adiciona código novo. Se algo já existe, não toca.

---

## O que já existe e está funcionando (NÃO TOCAR)

### CSS já existente — NÃO ALTERAR:
- `.fluxo-section` e todos os seus estilos
- `.fluxo-svg-connectors` — já tem `top: 0`, `height: 100%`, `transform: none`, `display: none`
- `.fluxo-diagrama` — já tem `position: relative`, `flex-direction: column`
- `.fluxo-no`, `.fluxo-icone`, `.fluxo-no-label`, `.fluxo-no-desc`
- `.trilha`, `.raio`, `.raio-fork` e todas as animações `@keyframes`
- `.fluxo-destinos`, `.fluxo-destinos-grid`, `.fluxo-destino`
- `.fluxo-legenda` e seus filhos
- `.fluxo-reveal` e variantes

### JS já existente — NÃO ALTERAR:
- Função `desenharLinhasFluxo()` completa
- `window.addEventListener('load', desenharLinhasFluxo)`
- `window.addEventListener('resize', desenharLinhasFluxo)`
- Função `animateRaios()` completa
- Bloco `initFluxo()` completo
- Bloco `initDestinTooltips()` completo

---

## O que ADICIONAR

### 1. No HTML — adicionar SVG mobile

Dentro de `.fluxo-diagrama`, logo após a tag de fechamento do SVG desktop
(`</svg>` do `fluxo-svg`), adicionar:

```html
<!-- SVG conectores mobile (vertical) -->
<svg class="fluxo-svg-mobile" id="fluxo-svg-mobile" aria-hidden="true">
  <path id="m-trilha-sol-placa"   class="trilha" d=""/>
  <path id="m-trilha-placa-inv"   class="trilha" d=""/>
  <path id="m-trilha-inv-fork"    class="trilha" d=""/>
  <path id="m-fork-horizontal"    class="trilha trilha-fork" d=""/>
  <path id="m-fork-casa"          class="trilha trilha-fork" d=""/>
  <path id="m-fork-predio"        class="trilha trilha-fork" d=""/>
  <path id="m-fork-empresa"       class="trilha trilha-fork" d=""/>
  <path id="m-raio-1"             class="raio" d=""/>
  <path id="m-raio-2"             class="raio" d=""/>
  <path id="m-raio-3"             class="raio" d=""/>
  <path id="m-raio-fork-casa"     class="raio raio-fork" d=""/>
  <path id="m-raio-fork-predio"   class="raio raio-fork" d=""/>
  <path id="m-raio-fork-empresa"  class="raio raio-fork" d=""/>
</svg>
```

---

### 2. No style-base.css — adicionar bloco mobile ao final da seção fluxo

Adicionar após o último estilo da seção fluxo (após `.fluxo-reveal[data-delay="4"]`):

```css
/* ===== FLUXO — ADIÇÕES MOBILE ===== */

/* SVG mobile: visível só no mobile, cobre o diagrama inteiro */
.fluxo-svg-mobile {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;
  z-index: 0;
}

/* Ocultar setas estáticas — substituídas pelo SVG animado */
.fluxo-seta-mobile {
  display: none;
}

/* Destinos lado a lado no mobile */
.fluxo-destinos-grid {
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}

.fluxo-destino {
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.fluxo-destino span {
  font-size: 0.72rem;
  text-align: center;
  white-space: nowrap;
}

.fluxo-icone--destino {
  width: 52px;
  height: 52px;
  padding: 10px;
}
```

---

### 3. No style-desktop.css — adicionar overrides dentro do bloco @media (min-width: 900px) já existente

Dentro do bloco `@media (min-width: 900px)` que já existe, adicionar ao final dele:

```css
  /* Fluxo — reverter mobile no desktop */
  .fluxo-svg-mobile     { display: none; }

  .fluxo-destinos-grid {
    flex-direction: column;
    gap: 12px;
  }

  .fluxo-destino {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .fluxo-destino span {
    font-size: 0.88rem;
    white-space: nowrap;
    text-align: left;
  }

  .fluxo-icone--destino {
    width: 64px;
    height: 64px;
    padding: 13px;
  }
```

---

### 4. No JS — adicionar função mobile e atualizar listeners

Adicionar a função `desenharLinhasMobile` logo após o `window.addEventListener('resize', desenharLinhasFluxo)` já existente:

```javascript
/* ===== LINHAS SVG MOBILE — posicionamento dinâmico ===== */
function desenharLinhasMobile() {
  const svg = document.getElementById('fluxo-svg-mobile');
  const diag = document.getElementById('fluxo-diagrama');
  if (!svg || !diag) return;
  if (window.innerWidth >= 900) return;

  requestAnimationFrame(() => {
    const diagRect = diag.getBoundingClientRect();

    const rel = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        cx:     r.left + r.width  / 2 - diagRect.left,
        cy:     r.top  + r.height / 2 - diagRect.top,
        r:      r.width / 2,
        top:    r.top    - diagRect.top,
        bottom: r.bottom - diagRect.top
      };
    };

    const S  = rel('.fluxo-no--sol .fluxo-icone');
    const P  = rel('.fluxo-no--placa .fluxo-icone');
    const I  = rel('.fluxo-no--inversor .fluxo-icone');
    const C  = rel('#destino-casa .fluxo-icone');
    const PR = rel('#destino-predio .fluxo-icone');
    const E  = rel('#destino-empresa .fluxo-icone');

    if (!S || !P || !I || !C || !PR || !E) return;

    svg.setAttribute('viewBox', `0 0 ${diagRect.width} ${diagRect.height}`);

    const setPath = (id, d) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('d', d);
    };

    const forkY = I.bottom + (C.top - I.bottom) * 0.5;

    setPath('m-trilha-sol-placa', `M ${S.cx} ${S.bottom} L ${P.cx} ${P.top}`);
    setPath('m-raio-1',           `M ${S.cx} ${S.bottom} L ${P.cx} ${P.top}`);
    setPath('m-trilha-placa-inv', `M ${P.cx} ${P.bottom} L ${I.cx} ${I.top}`);
    setPath('m-raio-2',           `M ${P.cx} ${P.bottom} L ${I.cx} ${I.top}`);
    setPath('m-trilha-inv-fork',  `M ${I.cx} ${I.bottom} L ${I.cx} ${forkY}`);
    setPath('m-raio-3',           `M ${I.cx} ${I.bottom} L ${I.cx} ${forkY}`);

    setPath('m-fork-horizontal', `M ${C.cx} ${forkY} L ${E.cx} ${forkY}`);

    ['casa', 'predio', 'empresa'].forEach((dest, i) => {
      const D = [C, PR, E][i];
      const d = `M ${D.cx} ${forkY} L ${D.cx} ${D.top}`;
      setPath(`m-fork-${dest}`,      d);
      setPath(`m-raio-fork-${dest}`, d);
    });
  });
}

window.addEventListener('load',   desenharLinhasMobile);
window.addEventListener('resize', desenharLinhasMobile);
```

---

## Verificação final

Confirmar que após as mudanças:
- `desenharLinhasFluxo` está intacta e inalterada
- `initFluxo`, `animateRaios`, `initDestinTooltips` estão intactas
- No desktop (> 900px): layout horizontal e SVG desktop funcionando como antes
- No mobile (< 900px): destinos lado a lado, SVG mobile com linhas verticais animadas
