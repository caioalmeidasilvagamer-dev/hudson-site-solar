# Prompt — Substituir Emojis por SVGs

---

Lê o `index.html` e o CSS antes de começar. Aplica as duas substituições abaixo. Não alterar nada fora do escopo descrito.

---

## Substituição 1 — Favicon

Localizar no `<head>` a linha atual do favicon (com emoji de sol):
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☀️</text></svg>">
```

Substituir por um SVG limpo com o símbolo do sol em linhas:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='5' fill='none' stroke='%23f97316' stroke-width='2'/><line x1='16' y1='2' x2='16' y2='7' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='16' y1='25' x2='16' y2='30' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='2' y1='16' x2='7' y2='16' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='25' y1='16' x2='30' y2='16' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='6' y1='6' x2='9.5' y2='9.5' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='22.5' y1='22.5' x2='26' y2='26' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='26' y1='6' x2='22.5' y2='9.5' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/><line x1='9.5' y1='22.5' x2='6' y2='26' stroke='%23f97316' stroke-width='2' stroke-linecap='round'/></svg>">
```

---

## Substituição 2 — Botão de tema (sol/lua)

Localizar no HTML o botão de troca de tema — deve conter emojis `☀️` e/ou `🌙` dentro de spans ou diretamente no botão.

Substituir o conteúdo interno do botão por dois SVGs inline que alternam via CSS/JS:

```html
<button class="theme-toggle" id="theme-toggle" aria-label="Alternar tema">
  <!-- Ícone sol — visível no modo escuro (clicar para ir ao claro) -->
  <svg class="theme-icon theme-icon--sun" xmlns="http://www.w3.org/2000/svg"
       width="20" height="20" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2"  x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2"  y1="12" x2="5"  y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="19.78" y1="4.22"  x2="17.66" y2="6.34"/>
    <line x1="6.34"  y1="17.66" x2="4.22"  y2="19.78"/>
  </svg>

  <!-- Ícone lua — visível no modo claro (clicar para ir ao escuro) -->
  <svg class="theme-icon theme-icon--moon" xmlns="http://www.w3.org/2000/svg"
       width="20" height="20" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
```

Adicionar no `style-base.css` ao final do bloco do header:

```css
/* Botão de tema — SVG icons */
.theme-icon {
  display: block;
  transition: opacity 0.2s, transform 0.3s var(--ease);
}

/* Modo escuro: mostra sol, esconde lua */
html.dark .theme-icon--sun  { display: block; }
html.dark .theme-icon--moon { display: none;  }

/* Modo claro: mostra lua, esconde sol */
html:not(.dark) .theme-icon--sun  { display: none;  }
html:not(.dark) .theme-icon--moon { display: block; }
```

---

## Regras

- Não alterar o JS do tema — só o HTML e CSS do botão
- Manter o `id="theme-toggle"` e a `class="theme-toggle"` intactos
- Não alterar nenhum outro elemento do header
- Verificar que o botão continua funcionando após a mudança
