# Prompt — Auditoria e Divisão do CSS Antigravity

---

Tens acesso ao arquivo `style.css` completo do projeto Antigravity. Vais fazer o seguinte trabalho em etapas, na ordem exata abaixo. Não pules etapas.

---

## Etapa 1 — Lê o arquivo inteiro

Abre e lê o `style.css` completo antes de fazer qualquer coisa. Não assumas nada sobre o conteúdo.

---

## Etapa 2 — Auditoria: lista todos os problemas encontrados

Percorre o CSS e lista **todos** os problemas encontrados, agrupados por categoria:

### Problemas a identificar:
- Magic numbers (valores hardcoded sem variável: `px`, `em`, `%` soltos)
- `position: absolute` sem `position: relative` no pai documentado
- `padding` usado para simular posição (ex: `padding-top: 60px` para empurrar elemento)
- `height` fixo onde deveria ser `min-height`
- `overflow: hidden` ou `overflow: visible` que cause clipping inesperado
- Media queries conflitantes ou redundantes (mesma propriedade definida em múltiplos breakpoints sem lógica clara)
- Falta de versão mobile para componentes que claramente quebram em telas pequenas
- `flex-wrap: wrap` sem tratamento dos filhos `position: absolute` no breakpoint correspondente
- `top: 50%; transform: translateY(-50%)` em pai sem altura definida
- `!important` desnecessário
- Seletores excessivamente específicos que dificultam override
- Variáveis CSS declaradas mas não usadas, ou valores hardcoded que deveriam ser variáveis

Apresenta a lista completa antes de alterar qualquer coisa.

---

## Etapa 3 — Divide o CSS em dois arquivos

Com base na auditoria, divide o `style.css` em:

### `style-base.css`
Contém:
- Variáveis CSS no `:root` (todas, incluindo as que não existiam e deveriam existir)
- Reset e estilos globais
- Tipografia base
- Estilos **mobile-first** de todos os componentes (base para telas até 600px)
- Sem nenhum `@media` de desktop aqui

### `style-desktop.css`
Contém apenas:
- `@media (min-width: 600px)` — tablet
- `@media (min-width: 900px)` — desktop
- `@media (min-width: 1280px)` — wide
- Somente as propriedades que **mudam** do mobile — não repetir o que já está no base

No HTML, o carregamento fica:
```html
<link rel="stylesheet" href="style-base.css">
<link rel="stylesheet" href="style-desktop.css">
```

---

## Etapa 4 — Aplica as correções dos problemas auditados

Para cada problema da lista da Etapa 2, aplica a correção correta:

| Problema | Correção |
|---|---|
| `padding-top: Xpx` para posicionar | Usar `top: Xpx` com `position: absolute` |
| `height` fixo em model-viewer | Trocar por `min-height` |
| Magic number solto | Criar variável CSS no `:root` |
| Centralização quebrada por elemento lateral | Elemento lateral com `position: absolute`, pai com `position: relative` |
| `flex-wrap: wrap` quebrando `top: 50%` | No breakpoint com wrap, usar `top` fixo nos filhos absolutos |
| Media queries redundantes | Consolidar num único bloco por breakpoint |

---

## Etapa 5 — Entrega

Entrega os dois arquivos completos:
1. `style-base.css` — mobile-first, sem media queries de desktop
2. `style-desktop.css` — só media queries, só o que muda

Depois lista um resumo das alterações feitas, agrupado por componente.

---

## Regras que não podem ser quebradas

- Nunca usar `!important` exceto em overrides de third-party (model-viewer shadow DOM)
- Nunca usar `padding` para simular `top/left/right/bottom`
- Todo `position: absolute` precisa de um pai com `position: relative`
- Testar mentalmente em: 375px / 430px / 768px / 1280px / 1920px
- `model-viewer` não respeita `overflow: visible` — nunca usar
- `field-of-view` do model-viewer só funciona como atributo HTML, não CSS
- Zero magic numbers no output final
