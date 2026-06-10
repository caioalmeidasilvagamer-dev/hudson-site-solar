# Prompt — Refatoração CSS Antigravity

---

## Contexto

Estás a refatorar o CSS completo do site **Antigravity** — um site premium de showcase de carros 3D. O site usa `<model-viewer>`, Cormorant Garamond/DM Sans, sistema de cores com variáveis CSS e gold accent (`--gold`).

O objetivo é eliminar gambiarras acumuladas (paddings absurdos, magic numbers, posicionamentos frágeis) e aplicar uma arquitetura CSS sólida com versões limpas para desktop e mobile.

---

## Problemas a resolver

### 1. Posicionamento absoluto dependente de padding
Qualquer elemento com `position: absolute` deve usar `top/right/bottom/left` limpos. **Nunca usar `padding-top: 60px` para simular posição vertical.** Se um elemento precisa de offset, usar `top` diretamente.

### 2. Centralização real em flex containers
Quando um flex container tem `justify-content: center` mas um elemento filho ocupa espaço lateral (ex: botão fechar), esse filho deve ter `position: absolute` e o pai deve ter `position: relative`. O conteúdo central não deve ser empurrado por elementos decorativos/utilitários.

### 3. flex-wrap sem controlo de altura
Quando `.offer-bar-inner` ou qualquer barra/header usa `flex-wrap: wrap`, a altura muda entre breakpoints e quebra qualquer cálculo de `top: 50%`. A regra é:
- Desktop: sem `flex-wrap`, tudo numa linha
- Mobile: `flex-wrap: wrap` permitido, mas elementos `position: absolute` devem usar `top` fixo (não percentual) nesse breakpoint

### 4. model-viewer sizing
O `model-viewer` não respeita `overflow: visible` — o canvas sempre corta no limite do elemento. Regras:
- Nunca usar `overflow: visible` no model-viewer
- Usar `min-height` em vez de `height` para o canvas crescer livremente
- Controlar tamanho aparente do modelo via `field-of-view` (atributo HTML), não via CSS
- Sombra cortada = canvas pequeno, aumentar `min-height`

### 5. Magic numbers e valores hardcoded
Substituir qualquer valor numérico solto por variáveis CSS ou valores relativos:
```css
/* ❌ Errado */
padding-top: 60px;
height: 380px;

/* ✅ Certo */
--close-btn-offset: 12px;
min-height: clamp(400px, 60vh, 700px);
```

---

## Arquitetura de breakpoints

Usar **mobile-first**: estilos base para mobile, `@media (min-width: ...)` para desktop. Nunca o contrário, para evitar sobreposições frágeis.

```css
/* Base (mobile) */
.componente { ... }

/* Desktop */
@media (min-width: 900px) {
  .componente { ... }
}
```

Breakpoints padrão do projeto:
- Mobile: < 600px
- Tablet: 600px – 900px
- Desktop: > 900px

---

## Regras gerais

- `position: absolute` sempre acompanhado de `position: relative` no pai
- Nunca usar `!important` exceto em overrides de third-party (ex: model-viewer internals)
- Preferir `gap` a `margin` entre filhos flex/grid
- `top: 50%; transform: translateY(-50%)` só funciona se o pai tiver altura definida — verificar sempre
- Elementos decorativos (glows, overlays, botões de fechar) fora do fluxo com `position: absolute`, nunca empurrando conteúdo principal
- Testar sempre em: 375px (iPhone SE), 430px (iPhone 14 Pro), 768px (tablet), 1280px (desktop), 1920px (wide)

---

## Output esperado

Entregar o CSS refatorado com:
1. Variáveis no `:root` para todos os valores reutilizáveis
2. Estilos base mobile-first
3. Blocos `@media (min-width: 900px)` para desktop
4. Zero magic numbers
5. Comentários de seção (`/* === OFFER BAR === */`)
