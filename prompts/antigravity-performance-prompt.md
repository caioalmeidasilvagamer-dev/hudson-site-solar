# Prompt — Otimização de Performance Antigravity

---

Lê o `index.html`, `style-base.css` e `style-desktop.css` completos antes de começar. Aplica todas as otimizações abaixo na ordem listada. Entrega os arquivos modificados completos.

---

## 1. Favicon — parar erro 404

No `<head>` do `index.html`, adicionar antes de fechar a tag:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☀️</text></svg>">
```

---

## 2. Fontes — preload e display swap

Substituir o bloco atual do Google Fonts por:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'" />
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" />
</noscript>
```

Isso carrega as fontes sem bloquear o render da página.

---

## 3. Model Viewer — defer e carregamento lazy

Substituir o script do model-viewer:

```html
<!-- Antes -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>

<!-- Depois -->
<script type="module" defer src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
```

---

## 4. Imagens — lazy loading e tamanhos explícitos

Para toda `<img>` no HTML que esteja **fora da hero section** (abaixo da dobra), adicionar:

```html
loading="lazy"
decoding="async"
```

Para as imagens **dentro da hero** (acima da dobra), usar:

```html
loading="eager"
fetchpriority="high"
```

Para todos os avatares da barra de prova social:

```html
loading="lazy"
decoding="async"
width="28"
height="28"
```

Garantir que toda `<img>` no projeto tem `width` e `height` explícitos para evitar layout shift (CLS).

---

## 5. CSS — remover `will-change` desnecessário

No `style-base.css`, o `will-change: transform, opacity` só deve existir em elementos que realmente animam continuamente. Verificar e remover de elementos estáticos.

Manter apenas em:
- `.model-viewer` / `#particles-canvas` (animação contínua)
- Elementos com `transition` que são acionados frequentemente (hover de cards principais)

Remover de:
- Elementos decorativos estáticos
- Pseudo-elementos `::before` / `::after` sem animação

---

## 6. Particles canvas — desativar no mobile

No JavaScript do `particles-canvas`, envolver a inicialização com:

```javascript
// Só inicializa partículas no desktop — mobile não precisa
if (window.innerWidth >= 900) {
  // código de inicialização do particles existente aqui
}
```

Isso elimina processamento desnecessário no mobile.

---

## 7. CSS — adicionar `content-visibility` nas seções off-screen

No `style-base.css`, para seções que ficam longe do viewport inicial, adicionar:

```css
.fluxo-section,
.beneficios-section,
.projetos-section,
.depoimentos-section,
.processo-section,
.contato-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 600px; /* estimativa da altura da seção */
}
```

Isso faz o browser pular o render dessas seções até o usuário rolar até elas.

---

## 8. Meta tags de performance no `<head>`

Adicionar após o `<meta name="viewport">`:

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#f0f2f5" media="(prefers-color-scheme: light)" />
```

---

## 9. Preload do modelo 3D

Adicionar no `<head>` para o browser começar a baixar o GLB antes do model-viewer inicializar:

```html
<link rel="preload" as="fetch" href="assets/models/solar-panel.glb" crossorigin>
```

---

## Regras

- Não alterar nenhuma lógica de JavaScript existente além do particles
- Não remover nenhum estilo — só adicionar os atributos e propriedades listados
- Não usar `!important`
- Entregar `index.html`, `style-base.css` modificados
- Listar no final quais alterações foram feitas em cada arquivo
