# Prompt — Corrigir Diagrama de Fluxo de Energia

---

Lê os arquivos `index.html`, `style-base.css`, `style-desktop.css` e o JavaScript do projeto antes de começar. Aplica as duas correções abaixo. Não alteres nada fora do escopo descrito.

---

## Problema

O diagrama da seção `.fluxo-section` tem dois bugs:

1. As linhas SVG passam por cima do texto e ícones dos nós
2. As três linhas do fork não chegam nas posições verticais corretas dos ícones de destino (Residência, Prédio, Empresa)

A causa raiz é que o SVG usa `viewBox="0 0 1000 120"` com coordenadas fixas que não correspondem às posições reais dos elementos no DOM.

---

## Correção 1 — CSS

No `style-base.css`, no bloco `.fluxo-svg-connectors`, alterar apenas estas três propriedades:

```css
.fluxo-svg-connectors {
  /* ... manter tudo que já existe, só mudar: */
  top: 0;           /* era: top: 50% */
  height: 100%;     /* era: height: 120px */
  transform: none;  /* era: transform: translateY(-50%) */
}
```

---

## Correção 2 — JavaScript

No arquivo JS do projeto, adicionar a função `desenharLinhasFluxo` **antes** do bloco `initFluxo`, e registrar os event listeners no final:

```javascript
/* ===== LINHAS SVG — posicionamento dinâmico ===== */
function desenharLinhasFluxo() {
  const svg = document.getElementById('fluxo-svg');
  const diag = document.getElementById('fluxo-diagrama');
  if (!svg || !diag) return;

  // Só executa no desktop (SVG só aparece acima de 900px)
  if (window.innerWidth < 900) return;

  const diagRect = diag.getBoundingClientRect();

  const rel = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      cx: r.left + r.width / 2 - diagRect.left,
      cy: r.top + r.height / 2 - diagRect.top,
      r:  r.width / 2
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
  svg.style.height = diagRect.height + 'px';
  svg.style.top = '0';
  svg.style.transform = 'none';

  const forkX = I.cx + (C.cx - I.cx) * 0.45;

  const setPath = (id, d) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('d', d);
  };

  // Linhas principais — borda a borda dos ícones (não passa por cima)
  setPath('trilha-sol-placa',    `M ${S.cx + S.r} ${S.cy} L ${P.cx - P.r} ${P.cy}`);
  setPath('raio-1',              `M ${S.cx + S.r} ${S.cy} L ${P.cx - P.r} ${P.cy}`);
  setPath('trilha-placa-inv',    `M ${P.cx + P.r} ${P.cy} L ${I.cx - I.r} ${I.cy}`);
  setPath('raio-2',              `M ${P.cx + P.r} ${P.cy} L ${I.cx - I.r} ${I.cy}`);
  setPath('trilha-inv-destinos', `M ${I.cx + I.r} ${I.cy} L ${forkX} ${I.cy}`);
  setPath('raio-3',              `M ${I.cx + I.r} ${I.cy} L ${forkX} ${I.cy}`);

  // Fork — conecta exatamente nos ícones de destino
  ['casa', 'predio', 'empresa'].forEach((dest, i) => {
    const D = [C, PR, E][i];
    const d = `M ${forkX} ${I.cy} L ${forkX} ${D.cy} L ${D.cx - D.r} ${D.cy}`;
    setPath(`fork-${dest}`,      d);
    setPath(`raio-fork-${dest}`, d);
  });
}

// Executa após load e em resize
window.addEventListener('load', desenharLinhasFluxo);
window.addEventListener('resize', desenharLinhasFluxo);
```

---

## O que NÃO alterar

- O HTML da seção `.fluxo-section` — nenhuma mudança
- Os IDs dos paths SVG (`trilha-sol-placa`, `raio-1`, `fork-casa`, etc.) — devem ser mantidos
- A lógica de `initFluxo`, `animateRaios` e `initDestinTooltips` — intocável
- Qualquer outro CSS fora do `.fluxo-svg-connectors`

---

## Verificação

Após aplicar, confirmar que:
- No desktop (> 900px) as linhas conectam borda a borda dos ícones sem cobrir o texto
- Os três forks chegam exatamente nos ícones de Residência, Prédio e Empresa
- No mobile (< 900px) o SVG continua oculto (`display: none`) e as setas verticais aparecem normalmente
- As animações de raio e pontos continuam funcionando
