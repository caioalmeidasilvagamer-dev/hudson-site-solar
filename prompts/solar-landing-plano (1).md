# Solar Landing Page — Plano de Desenvolvimento
> Template premium para instaladores de energia solar | Estilo Antigravity

---

## Visão Geral

Landing page de alto impacto visual para empresas instaladoras de energia solar.
Modelo 3D interativo da placa solar como hero centerpiece, animações scroll-driven,
design dark/dourado inspirado no Antigravity. Template replicável por cliente.

**Stack:** HTML + CSS + JS separados | `<model-viewer>` para o GLB | SVG animado para o fluxo de energia

---

## Estrutura de Arquivos

```
Site demo painel solar/
│
├── index.html                  # estrutura e marcação — só HTML, sem style ou script inline
├── style.css                   # todo o CSS do projeto (linkado no <head>)
├── main.js                     # todo o JS do projeto (linkado antes do </body>)
├── README.md                   # checklist de personalização por cliente
├── solar-landing-plano.md      # este documento
│
└── assets/
    ├── models/
    │   └── solar-panel.glb     # modelo 3D baixado do Sketchfab (AERO3D, CC BY 4.0)
    │
    ├── images/
    │   ├── logo.svg            # logo do cliente (substituir por entrega)
    │   ├── projeto-1.jpg       # fotos reais de instalações
    │   ├── projeto-2.jpg
    │   ├── projeto-3.jpg
    │   └── og-image.jpg        # thumbnail para WhatsApp/redes (1200×630px)
    │
    └── icons/                  # SVGs do diagrama de fluxo de energia
        ├── sol.svg
        ├── placa.svg
        ├── inversor.svg
        ├── casa.svg
        ├── predio.svg
        └── empresa.svg
```

**Convenção de links no index.html:**
```html
<link rel="stylesheet" href="style.css">
<!-- ... conteúdo ... -->
<script src="main.js"></script>
```

CSS e JS fora do HTML para facilitar edição, versionamento e debug sem conflito.

---

## Sistema de Design

| Elemento        | Definição                                         |
|-----------------|---------------------------------------------------|
| Background      | `#0a0a0a` — preto profundo                        |
| Accent primário | `#f0c040` — dourado solar (mesmo tom Antigravity) |
| Accent secundário | `#ff6a00` — laranja sol                         |
| Texto principal | `#f5f5f0` — off-white                             |
| Texto secundário | `#888880` — cinza quente                         |
| Display font    | Cormorant Garamond (já usada no Antigravity)      |
| Body font       | DM Sans                                           |

---

## Estrutura de Seções

### 1. Hero — 3D Solar Panel
- `<model-viewer>` com o GLB da placa solar centralizado
- Rotação automática lenta (auto-rotate)
- Iluminação environment que simula luz solar (HDR quente)
- Headline sobreposta: *"Transforme luz em lucro."*
- Subheadline com proposta de valor do cliente
- CTA primário → WhatsApp
- Partículas de luz dourada animadas em CSS no background

### 2. Fluxo de Energia — Animação SVG
- Diagrama animado horizontal: Sol → Placa → Inversor → Casa / Prédio / Empresa
- Raios elétricos percorrendo o caminho em loop
- Ícones minimalistas SVG para cada etapa
- Scroll-triggered: animação só começa quando a seção entra na viewport

### 3. Calculadora de Economia
- Input: valor da conta de luz atual (R$)
- Output animado: economia mensal estimada + retorno do investimento em meses
- Fórmula simples (redução de 85% na conta, payback médio 4 anos)
- Visual de contador animado ao calcular

### 4. Benefícios — Cards
- Grid de 3 cards: Economia / Valorização do imóvel / Sustentabilidade
- Hover com border dourado e leve glow
- Ícones SVG personalizados

### 5. Projetos Realizados — Galeria
- Grid de fotos de instalações (placeholders substituíveis por cliente)
- Lightbox simples ao clicar
- Contador animado: X projetos entregues / X kWh gerados / X famílias atendidas

### 6. Depoimentos
- Slider horizontal de 3 depoimentos
- Navegação por swipe no mobile
- Foto + nome + cidade do cliente

### 7. CTA Final + Contato
- Formulário: Nome / Telefone / Cidade / Valor da conta de luz
- Botão principal verde WhatsApp
- Texto de urgência sutil: *"Solicite seu orçamento gratuito"*

### 8. Rodapé
- Crédito obrigatório do modelo 3D (CC Attribution):
  `"Solar Panel" (https://skfb.ly/6RzK6) by AERO3D — CC BY 4.0`
- Links básicos + CNPJ/dados do cliente

---

## Performance

- `<model-viewer>` com `loading="lazy"` — só renderiza quando o usuário rola até o hero
- Imagens da galeria em lazy load nativo (`loading="lazy"`)
- Fontes via Google Fonts com `display=swap`
- Animações CSS puras (sem libraries pesadas)
- Meta alvo: LCP < 3s em 4G, arquivo único < 500KB sem o GLB

---

## Personalização por Cliente (checklist de entrega)

- [ ] Trocar logo no header
- [ ] Atualizar headline com nome da empresa
- [ ] Substituir número do WhatsApp no CTA
- [ ] Inserir fotos reais de projetos na galeria
- [ ] Ajustar cidade/região no texto
- [ ] Atualizar depoimentos reais
- [ ] Inserir CNPJ e dados no rodapé

---

## Fases de Desenvolvimento

| Fase | Entrega | Estimativa |
|------|---------|------------|
| 1 | Hero com model-viewer + sistema de design | 1 sessão |
| 2 | Animação SVG do fluxo de energia | 1 sessão |
| 3 | Calculadora de economia + cards de benefícios | 1 sessão |
| 4 | Galeria + depoimentos + CTA final | 1 sessão |
| 5 | Polish: animações scroll, mobile, performance | 1 sessão |

---

## Prompt de Desenvolvimento (Fase 1)

Cole este prompt para iniciar a Fase 1:

```
Estou construindo uma landing page premium para instaladores de energia solar,
no mesmo estilo visual do projeto Antigravity que desenvolvemos (dark, dourado,
Cormorant Garamond + DM Sans, scroll-driven animations).

O projeto tem três arquivos separados: index.html, style.css e main.js.
CSS linkado no <head>, JS linkado antes do </body>. Nada inline.

Estrutura de pastas:
Site demo painel solar/
├── index.html
├── style.css
├── main.js
└── assets/
    ├── models/solar-panel.glb
    ├── images/logo.svg
    └── icons/ (sol.svg, placa.svg, inversor.svg, casa.svg, predio.svg, empresa.svg)

Sistema de design:
- Background: #0a0a0a
- Accent dourado: #f0c040
- Accent laranja solar: #ff6a00
- Texto: #f5f5f0
- Display font: Cormorant Garamond (Google Fonts)
- Body font: DM Sans (Google Fonts)

Fase 1 — construa os três arquivos com apenas o HERO completo:

index.html:
- <!DOCTYPE html> limpo com <link> pro style.css no head
- Importa model-viewer via CDN no head:
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
- Header fixo: logo placeholder à esquerda, botão "Orçamento Grátis" à direita
  (verde #25d366, href="https://wa.me/SEUNUMERO")
- Hero section com <model-viewer> e textos sobrepostos
- <script src="main.js"></script> antes do </body>

style.css:
- CSS variables com o sistema de design completo no :root
- Reset básico
- Estilo do header fixo
- Hero: background #0a0a0a, partículas de luz dourada animadas em @keyframes
  (pequenos pontos flutuando, efeito luz solar difusa)
- model-viewer: altura 500px desktop / 320px mobile, skeleton shimmer dourado
- Headline Cormorant Garamond 72px sobre o model-viewer (z-index)
- Subheadline DM Sans 18px
- Dois botões: "Solicitar Orçamento" (dourado sólido) e "Ver Projetos" (outline)
- Scroll indicator chevron pulsante no bottom center
- Tudo responsivo mobile-first

main.js:
- Lógica das partículas se necessário
- Qualquer interação do hero

Entrega: os três arquivos completos e funcionais.
```

---

*Desenvolvido para o ecossistema MavenOS — template replicável por cliente*
