# Prompt — Mobile do Diagrama de Fluxo (baseado no desktop que já funciona)

---

## REGRA ABSOLUTA — LER ANTES DE TUDO

**NÃO alterar, remover ou sobrescrever NENHUMA linha de CSS ou JS já existente.**
**NÃO tocar em nada que afete o desktop.**
**NÃO reescrever arquivos inteiros.**
**APENAS adicionar código novo.**

Se tiveres dúvida se algo já existe — não mexa. Só adiciona.

---

## Contexto

O diagrama de fluxo do desktop já funciona perfeitamente:
- SVG com linhas calculadas dinamicamente via JS (`desenharLinhasFluxo`)
- Animações de raios e pontos funcionando
- Linhas conectando borda a borda dos ícones sem cobrir texto

O mobile deve fazer **exatamente a mesma coisa**, só que na vertical.
A lógica é idêntica — só muda o eixo: o que era horizontal vira vertical.

---

## O que fazer

### Passo 1 — Entender como funciona o desktop

Lê a função `desenharLinhasFluxo` no JS. O mobile vai usar a mesma lógica:
- Pega posições reais dos elementos via `getBoundingClientRect()`
- Calcula coordenadas relativas ao `.fluxo-diagrama`
- Desenha os paths do SVG dinamicamente
- A diferença: no mobile as linhas são verticais (eixo Y) em vez de horizontais (eixo X)

### Passo 2 — Adicionar SVG mobile no HTML

Dentro de `.fluxo-diagrama`, logo após o `</svg>` do `fluxo-svg` existente, adicionar:

```html
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

### Passo 3 — Adicionar CSS mobile no style-base.css

Adicionar ao final da seção de fluxo, sem tocar em nada acima:

```css
/* ===== FLUXO SVG MOBILE ===== */
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

/* Remove setas estáticas — SVG animado substitui */
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

### Passo 4 — Adicionar overrides no style-desktop.css

Dentro do `@media (min-width: 900px)` já existente, adicionar ao final:

```css
  /* Reverter mobile no desktop */
  .fluxo-svg-mobile  { display: none; }

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

### Passo 5 — Adicionar função mobile no JS

Copiar a lógica de `desenharLinhasFluxo` e adaptá-la para vertical.
Adicionar logo após o `window.addEventListener('resize', desenharLinhasFluxo)` já existente:

```javascript
/* ===== LINHAS SVG MOBILE — mesma lógica do desktop, eixo vertical ===== */
function desenharLinhasMobile() {
  const svg  = document.getElementById('fluxo-svg-mobile');
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
        r:      r.width  / 2,
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

    // Ponto de bifurcação vertical
    const forkY = I.bottom + (C.top - I.bottom) * 0.5;

    // Linhas verticais — borda inferior do ícone até borda superior do próximo
    setPath('m-trilha-sol-placa', `M ${S.cx} ${S.bottom} L ${P.cx} ${P.top}`);
    setPath('m-raio-1',           `M ${S.cx} ${S.bottom} L ${P.cx} ${P.top}`);
    setPath('m-trilha-placa-inv', `M ${P.cx} ${P.bottom} L ${I.cx} ${I.top}`);
    setPath('m-raio-2',           `M ${P.cx} ${P.bottom} L ${I.cx} ${I.top}`);
    setPath('m-trilha-inv-fork',  `M ${I.cx} ${I.bottom} L ${I.cx} ${forkY}`);
    setPath('m-raio-3',           `M ${I.cx} ${I.bottom} L ${I.cx} ${forkY}`);

    // Linha horizontal conectando os 3 destinos
    setPath('m-fork-horizontal', `M ${C.cx} ${forkY} L ${E.cx} ${forkY}`);

    // Linhas verticais do fork até cada destino
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

## Verificação obrigatória antes de entregar

- [ ] `desenharLinhasFluxo` está byte a byte igual ao original
- [ ] `initFluxo`, `animateRaios`, `initDestinTooltips` intactos
- [ ] `.fluxo-svg-connectors` no CSS base intacto
- [ ] Nenhum estilo de desktop foi alterado no style-base.css
- [ ] No desktop: layout horizontal, SVG desktop, animações — tudo igual antes
- [ ] No mobile: destinos lado a lado, linhas verticais animadas, sem setas estáticas
