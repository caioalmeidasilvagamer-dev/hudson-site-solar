# Solar Landing Page — Template Premium
> Desenvolvido para o ecossistema MavenOS — template replicável por cliente

---

## 🚀 Como Usar Este Template

Abra o arquivo `index.html` no navegador para visualizar a landing page.  
Para editar, use um editor de código (VS Code, etc.) e modifique os 3 arquivos principais:

```
index.html   →  estrutura e conteúdo
style.css    →  visual e animações
main.js      →  lógica interativa
```

---

## ✅ Checklist de Personalização por Cliente

### 🔴 Obrigatório (antes de entregar)

- [ ] **Logo**: Substituir o SVG placeholder no `<header>` pelo logo real do cliente
- [ ] **Número do WhatsApp**: Trocar `SEUNUMERO` por `55` + DDD + número (ex: `5511999990000`) em **todos** os links `wa.me/` do arquivo `index.html`
- [ ] **Headline principal**: Personalizar o `<h1>` do Hero com o slogan do cliente
- [ ] **Subtítulo do Hero**: Personalizar cidade/proposta do cliente (busque `SUBSTITUIR` nos comentários)
- [ ] **Fotos de projetos**: Substituir `assets/images/projeto-1.jpg`, `projeto-2.jpg`, `projeto-3.jpg` por fotos reais
- [ ] **Depoimentos**: Atualizar os 3 cards com depoimentos reais (nomes, cidades, textos)
- [ ] **CNPJ e nome da empresa**: Atualizar no rodapé (`SolarTech Instalações`, `00.000.000/0001-00`)
- [ ] **Modelo 3D**: Baixar `solar-panel.glb` do Sketchfab (AERO3D, CC BY 4.0) e colocar em `assets/models/`

### 🟡 Recomendado

- [ ] **Estatísticas do Hero**: Atualizar os valores em `main.js` → `initCounters()` (projetos, MWh, famílias)
- [ ] **Estatísticas da galeria**: Atualizar a strip de stats na seção de projetos (instalações, potência, redução)
- [ ] **Cidade nas seções**: Buscar menções a "São Paulo", "Campinas" etc. e substituir pela região do cliente
- [ ] **Nome do consultor**: Atualizar "Henrique Silva" no card da seção de contato
- [ ] **Número do WhatsApp no formulário**: Alterar `whatsappNumero` em `main.js` → `initContatoForm()`
- [ ] **OG Image**: Criar `assets/images/og-image.jpg` (1200×630px) para compartilhamento no WhatsApp/redes
- [ ] **Meta description**: Personalizar a `<meta name="description">` no `<head>`

### 🟢 Opcional

- [ ] **Contadores do banner de oferta**: O countdown é diário (reinicia à meia-noite) — já funciona por padrão
- [ ] **Parceiros/marcas**: Substituir ou adicionar marcas na seção de Parceiros se o cliente tiver contratos exclusivos
- [ ] **FAQ**: Adaptar as perguntas ao contexto regional do cliente (financiamento local, concessionária, etc.)
- [ ] **Google Analytics**: Adicionar script GA4 no `<head>` para rastreamento de conversões

---

## 📁 Estrutura de Arquivos

```
Site demo painel solar/
│
├── index.html                  # estrutura principal
├── style.css                   # todo o CSS
├── main.js                     # toda a lógica JS
├── README.md                   # este arquivo
├── solar-landing-plano.md      # documento de planejamento
│
└── assets/
    ├── models/
    │   └── solar-panel.glb     # modelo 3D (baixar do Sketchfab)
    │
    └── images/
        ├── projeto-1.jpg       # instalação residencial
        ├── projeto-2.jpg       # instalação comercial/industrial
        └── projeto-3.jpg       # carport solar / outro tipo
```

---

## 🎨 Sistema de Design

| Token | Valor |
|-------|-------|
| Background | `#0a0a0a` |
| Accent Dourado | `#f0c040` |
| Accent Laranja | `#ff6a00` |
| Texto principal | `#f5f5f0` |
| Texto secundário | `#888880` |
| Font Display | Cormorant Garamond |
| Font Body | DM Sans |

---

## 📋 Seções da Página (ordem)

| # | Seção | ID | Descrição |
|---|-------|----|-----------|
| 1 | Banner de Oferta | `#offer-bar` | Countdown diário + CTA de urgência |
| 2 | Hero | `#hero` | Modelo 3D + headline + stats |
| 3 | Fluxo de Energia | `#fluxo` | Diagrama SVG animado Sol→Casa |
| 4 | Calculadora | `#calculadora` | Simulador de economia interativo |
| 5 | Processo | `#processo` | Timeline 4 etapas de instalação |
| 6 | Benefícios | `#beneficios` | 3 cards de vantagens |
| 7 | Projetos | `#projetos` | Galeria com lightbox + estatísticas |
| 8 | Parceiros | `#parceiros` | Certificações + logos de marcas |
| 9 | Depoimentos | `#depoimentos` | Slider de 3 depoimentos |
| 10 | FAQ | `#faq` | 6 perguntas em acordeão |
| 11 | Contato | `#contato` | Formulário → WhatsApp |
| 12 | Rodapé | `footer` | Dados da empresa + attribution |

---

## ⚡ Features Implementadas

- ✅ Modelo 3D interativo com parallax de mouse (model-viewer)
- ✅ Partículas de luz dourada animadas (canvas 2D)
- ✅ Diagrama SVG de fluxo de energia com pontos animados
- ✅ Calculadora de economia com slider interativo
- ✅ Lightbox para galeria de projetos
- ✅ Slider de depoimentos com swipe mobile
- ✅ Formulário integrado ao WhatsApp via URL
- ✅ Barra de progresso de scroll no header
- ✅ Scrollspy (link ativo no menu conforme seção visível)
- ✅ Botão Voltar ao Topo
- ✅ Banner com contador regressivo diário
- ✅ Timeline do processo de instalação animada
- ✅ Seção de certificações com badges pulsantes
- ✅ FAQ em acordeão com animação suave
- ✅ Botão CTA flutuante mobile (barra verde WhatsApp)
- ✅ Toast glassmorphism + confetti dourado no envio do formulário
- ✅ Menu hamburger mobile
- ✅ Lazy loading de imagens
- ✅ Hardware acceleration (will-change)
- ✅ SEO básico (meta tags, OG, headings semânticos)

---

## 📝 Crédito Obrigatório (CC Attribution)

O modelo 3D utilizado nesta página requer a seguinte atribuição:

> "Solar Panel" (https://skfb.ly/6RzK6) by **AERO3D** — Licensed under **Creative Commons Attribution 4.0** (http://creativecommons.org/licenses/by/4.0/)

O crédito já está incluído no rodapé do `index.html`. **Não remover.**

---

*Template Solar Landing Page — MavenOS | Desenvolvido com Antigravity IDE*
