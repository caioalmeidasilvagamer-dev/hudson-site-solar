# Prompt — Substituir Offer Bar por Barra de Prova Social

---

## Contexto

O site Antigravity é um landing page de energia solar em HTML/CSS/JS puro — **sem React, sem shadcn, sem Tailwind**. O componente de Avatar abaixo é uma referência visual de como deve funcionar o grupo de avatares empilhados, mas precisa ser implementado em HTML e CSS puro, não em React.

---

## O que fazer

Substituir o `<div class="offer-bar">` atual por uma nova barra de prova social no topo do site.

### Remover completamente:
- O HTML do `offer-bar` atual (com contador regressivo e botão "Aproveitar Agora")
- Todo o JavaScript relacionado ao countdown (`countdown-h`, `countdown-m`, `countdown-s`, lógica de timer)
- Os estilos do `offer-bar` no `style-base.css` e `style-desktop.css`

---

## Novo componente — Barra de Prova Social

### HTML a criar

```html
<!-- ========== BARRA DE PROVA SOCIAL ========== -->
<div class="social-proof-bar" role="region" aria-label="Prova social">
  <div class="social-proof-inner">

    <!-- Grupo de avatares empilhados -->
    <div class="avatar-stack" aria-hidden="true">
      <img class="avatar-img" src="assets/avatars/avatar-1.jpg" alt="" width="28" height="28" />
      <img class="avatar-img" src="assets/avatars/avatar-2.jpg" alt="" width="28" height="28" />
      <img class="avatar-img" src="assets/avatars/avatar-3.jpg" alt="" width="28" height="28" />
      <img class="avatar-img" src="assets/avatars/avatar-4.jpg" alt="" width="28" height="28" />
    </div>

    <!-- Texto de prova social -->
    <p class="social-proof-text">
      <strong class="social-proof-number">312+</strong> famílias já reduziram até
      <strong class="social-proof-highlight">95% da conta de luz</strong>
      — <span class="social-proof-cta-text">Orçamento grátis e sem compromisso</span>
    </p>

    <!-- CTA -->
    <a
      href="https://wa.me/NUMEROCLIENTE?text=Ol%C3%A1%2C%20quero%20meu%20or%C3%A7amento%20gratuito"
      class="social-proof-cta"
      id="social-proof-cta"
      aria-label="Solicitar orçamento pelo WhatsApp"
    >
      Solicitar Agora
    </a>

    <!-- Botão fechar -->
    <button
      class="social-proof-close"
      id="social-proof-close"
      aria-label="Fechar aviso"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

  </div>
</div>
```

> Para as imagens dos avatares: usar fotos reais de clientes se disponíveis, ou imagens do Unsplash com rostos de pessoas reais. Tamanho: 28×28px, formato quadrado, bordas arredondadas aplicadas via CSS.

---

## CSS a criar no `style-base.css`

Adicionar na seção `/* ===== SOCIAL PROOF BAR ===== */`:

```css
/* ===== SOCIAL PROOF BAR ===== */
--social-bar-py: 9px;
--social-bar-px: 20px;
--avatar-size: 28px;
--avatar-overlap: -8px;
--social-bar-close-offset: 12px;

.social-proof-bar {
  position: sticky;
  top: var(--header-h);
  z-index: 98;
  background: linear-gradient(90deg, #1a1200 0%, #0f0c00 40%, #1a1200 100%);
  border-bottom: 1px solid rgba(240, 192, 64, 0.25);
  padding: var(--social-bar-py) var(--social-bar-px);
  transition: transform 0.4s var(--ease), opacity 0.4s var(--ease);
}

.social-proof-inner {
  position: relative;
  max-width: var(--container-w);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* Grupo de avatares empilhados */
.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-img {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  border: 2px solid #0f0c00;
  object-fit: cover;
  margin-left: var(--avatar-overlap);
}

.avatar-img:first-child {
  margin-left: 0;
}

/* Texto */
.social-proof-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  text-align: center;
}

.social-proof-number {
  color: var(--gold);
  font-weight: 700;
}

.social-proof-highlight {
  color: #fff;
  font-weight: 600;
}

/* CTA */
.social-proof-cta {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: var(--gold);
  color: #0a0a0a;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.82rem;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s var(--ease);
}

.social-proof-cta:hover {
  opacity: 0.88;
}

/* Botão fechar */
.social-proof-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
  position: absolute;
  right: var(--social-bar-close-offset);
  top: 50%;
  transform: translateY(-50%);
}

.social-proof-close:hover {
  color: #fff;
}

/* Mobile: barra quebra linha */
@media (max-width: 430px) {
  .social-proof-close {
    top: 8px;
    transform: none;
  }
  .social-proof-text {
    font-size: 0.78rem;
  }
  .social-proof-cta {
    font-size: 0.78rem;
    padding: 5px 12px;
  }
  .social-proof-cta-text {
    display: none; /* remove a parte menos essencial no mobile pequeno */
  }
}
```

---

## JavaScript a criar

Substituir o JS do countdown pelo comportamento de fechar a barra:

```javascript
// ===== SOCIAL PROOF BAR — fechar =====
const socialBar = document.getElementById('social-proof-bar'); // adicionar id no HTML
const socialClose = document.getElementById('social-proof-close');

if (socialClose && socialBar) {
  socialClose.addEventListener('click', () => {
    socialBar.style.transform = 'translateY(-100%)';
    socialBar.style.opacity = '0';
    socialBar.style.pointerEvents = 'none';
    // Guarda preferência na sessão para não reaparecer
    sessionStorage.setItem('socialBarClosed', 'true');
  });

  // Não mostra se já foi fechado nessa sessão
  if (sessionStorage.getItem('socialBarClosed') === 'true') {
    socialBar.style.display = 'none';
  }
}
```

> Adicionar `id="social-proof-bar"` na div principal do componente.

---

## Regras

- Não usar React, JSX, Tailwind ou shadcn — o projeto é HTML/CSS/JS puro
- O componente de Avatar em React é apenas referência visual do comportamento de avatares empilhados
- Manter a mesma paleta de cores do projeto (`--gold`, `--text-muted`, `--bg`, etc.)
- Não usar `!important`
- Não usar magic numbers — tudo em variáveis CSS
- Testar mentalmente em 375px, 430px, 768px e 1280px
