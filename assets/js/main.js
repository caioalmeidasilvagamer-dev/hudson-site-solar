'use strict';

const WHATSAPP_NUMBER = '5533988845152';

function sanitize(str) {
  if (typeof str !== 'string') return '';
  const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
  return str.replace(/[<>"'&]/g, c => map[c]);
}

/* ============================================================
   SOLAR LANDING PAGE — main.js
   Fase 1: Partículas de luz dourada + interações do hero
   ============================================================ */

function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ============================================================
// RATE LIMITER — proteção contra spam e abuso
// ============================================================
const RateLimit = {
  _store: {},

  // Verifica se ação pode ser executada
  // key: identificador da ação | limit: máximo de tentativas | windowMs: janela de tempo em ms
  check(key, limit, windowMs) {
    const now = Date.now();
    if (!this._store[key]) this._store[key] = [];

    // Remove tentativas fora da janela de tempo
    this._store[key] = this._store[key].filter(t => now - t < windowMs);

    if (this._store[key].length >= limit) {
      return false; // bloqueado
    }

    this._store[key].push(now);
    return true; // permitido
  },

  // Retorna segundos restantes para próxima tentativa
  waitTime(key, windowMs) {
    const now = Date.now();
    if (!this._store[key] || !this._store[key].length) return 0;
    const oldest = Math.min(...this._store[key]);
    const wait = Math.ceil((windowMs - (now - oldest)) / 1000);
    return Math.max(0, wait);
  },

  // Bloqueia visualmente um botão com countdown
  blockButton(btn, seconds, originalText) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
    let remaining = seconds;
    const original = originalText || btn.textContent;
    btn.textContent = `Aguarde ${remaining}s...`;
    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
        btn.textContent = original;
      } else {
        btn.textContent = `Aguarde ${remaining}s...`;
      }
    }, 1000);
  }
};

/* ===== TEMA DIA/NOITE ===== */
(function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Aplica preferência salva (ou modo dia por padrão)
  if (localStorage.getItem('solarTheme') === 'dark') {
    document.documentElement.classList.add('dark');
  }

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('solarTheme', isDark ? 'dark' : 'light');
  });
})();

/* ===== HEADER: scroll effect ===== */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
})();

/* ===== HAMBURGER / MENU MOBILE ===== */
(function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });

  // Fechar ao clicar em um link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  });
})();

/* ===== COUNTERS ANIMADOS (hero stats) ===== */
function initModelViewer() {
  const mv = document.getElementById('solar-model');
  if (!mv) return;

  const whenReady = (window.customElements && customElements.whenDefined)
    ? customElements.whenDefined('model-viewer')
    : Promise.resolve();

  whenReady.then(() => {
    mv.addEventListener('load', () => {
      mv.classList.add('loaded');
      const scene = mv.scene;
      if (scene) {
        scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = false;
            obj.receiveShadow = false;
          }
        });
      }
    });

    if ('IntersectionObserver' in window) {
      const visObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mv.play();
            mv.autoRotate = true;
          } else {
            mv.pause();
            mv.autoRotate = false;
          }
        });
      }, { threshold: 0 });
      visObserver.observe(mv);
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72'
      );
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   FASE 2 — FLUXO DE ENERGIA
   ============================================================ */

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
      r: r.width / 2
    };
  };

  const S = rel('.fluxo-no--sol .fluxo-icone');
  const P = rel('.fluxo-no--placa .fluxo-icone');
  const I = rel('.fluxo-no--inversor .fluxo-icone');
  const C = rel('#destino-casa .fluxo-icone');
  const PR = rel('#destino-predio .fluxo-icone');
  const E = rel('#destino-empresa .fluxo-icone');

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
  setPath('trilha-sol-placa', `M ${S.cx + S.r} ${S.cy} L ${P.cx - P.r} ${P.cy}`);
  setPath('raio-1', `M ${S.cx + S.r} ${S.cy} L ${P.cx - P.r} ${P.cy}`);
  setPath('trilha-placa-inv', `M ${P.cx + P.r} ${P.cy} L ${I.cx - I.r} ${I.cy}`);
  setPath('raio-2', `M ${P.cx + P.r} ${P.cy} L ${I.cx - I.r} ${I.cy}`);
  setPath('trilha-inv-destinos', `M ${I.cx + I.r} ${I.cy} L ${forkX} ${I.cy}`);
  setPath('raio-3', `M ${I.cx + I.r} ${I.cy} L ${forkX} ${I.cy}`);

  // Fork — conecta exatamente nos ícones de destino
  ['casa', 'predio', 'empresa'].forEach((dest, i) => {
    const D = [C, PR, E][i];
    const d = `M ${forkX} ${I.cy} L ${forkX} ${D.cy} L ${D.cx - D.r} ${D.cy}`;
    setPath(`fork-${dest}`, d);
    setPath(`raio-fork-${dest}`, d);
  });
}
document.fonts.ready.then(() => {
  desenharLinhasFluxo();
});


/* ===== REVEAL + ATIVAÇÃO DO FLUXO (scroll trigger) ===== */
(function initFluxo() {
  const section = document.querySelector('.fluxo-section');
  const reveals = document.querySelectorAll('.fluxo-reveal');
  const svgAnim = document.getElementById('fluxo-anim');

  if (!section) return;

  let activated = false;

  function activate() {
    if (activated) return;
    activated = true;

    // 1. Ativa classe na seção (desencadeia CSS animations)
    section.classList.add('fluxo-active');

    // 2. Dispara o animateMotion dos pontos no SVG
    if (svgAnim) {
      try { svgAnim.beginElement(); } catch (e) { }
    }

    // 3. Anima os raios via CSS custom prop + stroke-dashoffset
    animateRaios();
  }

  // IntersectionObserver — 30% da seção visível já ativa
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      activate();
    }
  }, { threshold: 0.3 });

  io.observe(section);

  // Reveal individual dos nós (escalonado)
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));
})();

/* ===== ANIMAÇÃO DOS RAIOS (stroke-dashoffset via rAF) ===== */
function animateRaios() {
  // Seleciona raios de ambos os SVGs (desktop + mobile)
  const raios = document.querySelectorAll('.raio');
  if (!raios.length) return;

  // Calcula comprimento de cada path para animação fluida
  raios.forEach((path, i) => {
    const len = path.getTotalLength?.() ?? 200;
    const delay = i * 0.28; // segundos
    path.style.strokeDasharray = `${Math.min(len * 0.12, 22)} ${len}`;
    path.style.strokeDashoffset = '0';
    path.style.opacity = '1';
    path.style.animation = `raio-move ${1.8 + i * 0.15}s linear ${delay}s infinite`;
  });
}

/* ===== TOOLTIP NOS DESTINOS (hover) ===== */
(function initDestinTooltips() {
  const destinos = document.querySelectorAll('.fluxo-destino');

  destinos.forEach(destino => {
    const icone = destino.querySelector('.fluxo-icone');
    if (!icone) return;

    // Highlight sincronizado: ao hover num destino, escurece os outros
    destino.addEventListener('mouseenter', () => {
      destinos.forEach(d => {
        if (d !== destino) d.style.opacity = '0.45';
      });
    });

    destino.addEventListener('mouseleave', () => {
      destinos.forEach(d => { d.style.opacity = ''; });
    });
  });
})();

/* ===== CONTAGEM: totaliza energia ao ativar a seção ===== */
(function initFluxoStats() {
  const section = document.querySelector('.fluxo-section');
  if (!section) return;
})();

/* ============================================================
   FASE 3 — CALCULADORA DE ECONOMIA
   Lógica baseada na matemática do Azume CRM Solar
   ============================================================ */

/* ----------------------------------------------------------
   DADOS DE REFERÊNCIA
   ---------------------------------------------------------- */

// HSP (Horas de Sol Pleno) médias por estado — Atlas CRESESB
const HSP_UF = {
  AC: 4.7, AL: 5.9, AM: 4.8, AP: 4.8, BA: 5.9, CE: 6.0, DF: 5.5, ES: 5.1,
  GO: 5.5, MA: 5.8, MG: 5.2, MS: 5.4, MT: 5.5, PA: 4.9, PB: 6.0, PE: 5.9,
  PI: 6.1, PR: 4.6, RJ: 5.1, RN: 6.1, RO: 4.8, RR: 5.0, RS: 4.4, SC: 4.5,
  SE: 5.8, SP: 5.0, TO: 5.6
};

// Tarifa média kWh por estado (R$/kWh) — base ANEEL 2024/2025
// Equivalente ao kwhPrice retornado pelo Azume
const TARIFA_UF = {
  AC: 0.85, AL: 0.92, AM: 0.88, AP: 0.86, BA: 0.91, CE: 0.95, DF: 0.93, ES: 0.94,
  GO: 0.90, MA: 0.87, MG: 0.97, MS: 0.91, MT: 0.89, PA: 0.86, PB: 0.94, PE: 0.96,
  PI: 0.88, PR: 0.92, RJ: 1.02, RN: 0.93, RO: 0.87, RR: 0.85, RS: 0.95, SC: 0.91,
  SE: 0.90, SP: 1.05, TO: 0.89
};

// Taxa de disponibilidade (kWh mínimos faturados) por tipo de ligação
// Equivalente ao desconto de consumo mínimo que o Azume aplica
const TAXA_DISP = { mono: 30, bi: 50, tri: 100 };

// Custo médio de instalação por kWp (R$) — mercado Brasil 2025
const CUSTO_KWP = 4500;

// Potência do painel padrão (W)
const PAINEL_W = 550;

// Performance Ratio — eficiência real do sistema (perdas térmicas, cabeamento, inversores)
// O Azume usa internamente ~0.78
const PR = 0.78;

// Inflação anual estimada para projeção de fluxo de caixa (%)
// O Azume retorna inflation: 10
const INFLACAO_ANUAL = 0.10;

/* ----------------------------------------------------------
   FUNÇÃO PRINCIPAL
   ---------------------------------------------------------- */

/* ============================================================
   SIMULAÇÃO SOLAR — closures privadas (expõe apenas calcularSolar e enviarSimulacaoWhatsApp)
   ============================================================ */
const SimulacaoSolar = (function () {
  let _dados = null;

  function calcularSolar() {
    const tipo      = document.getElementById('tipo')?.value || 'residencial';
    const conta     = parseFloat(document.getElementById('conta')?.value) || 300;
    const ligacao   = document.getElementById('ligacao')?.value || 'bi';
    const telhado   = parseFloat(document.getElementById('telhado')?.value) || 1.00;
    const bandeira  = parseFloat(document.getElementById('bandeira')?.value) || 0;
    const cidade    = (document.getElementById('cidade')?.value || '').toLowerCase().trim();
    const nome      = document.getElementById('nome') ? sanitize(document.getElementById('nome').value.trim()) : '';
    const celular   = document.getElementById('celular') ? sanitize(document.getElementById('celular').value.trim()) : '';

    const tipoLabels = { residencial: 'Residencial', comercial: 'Comercial', rural: 'Rural / Industrial' };
    const tipoLabel = tipoLabels[tipo] || '';

    if (!conta || conta <= 0) {
      showErrorToast('Informe o valor da conta de energia.');
      return;
    }

    // Chama a função global que faz o cálculo completo
    calcularSolarCalc();

    _dados = {
      nome, celular, cidade, tipoLabel,
      tarifa: document.getElementById('tarifa-usada')?.textContent || '',
      economiaMensal: document.getElementById('res-economia-mensal')?.textContent || '',
      economiaAnual: document.getElementById('res-anual')?.textContent || '',
      kwp: document.getElementById('res-kwp')?.textContent || '',
      paineis: document.getElementById('res-paineis')?.textContent || '',
      payback: document.getElementById('res-payback')?.textContent || ''
    };
  }

  function enviarSimulacaoWhatsApp() {
    // Rate limit: máximo 5 aberturas de WhatsApp por 5 minutos
    if (!RateLimit.check('whatsapp_simulacao', 5, 300000)) {
      alert('Você já enviou muitas solicitações. Aguarde alguns minutos ou ligue diretamente: (33) 98884-5152');
      return;
    }

    if (!_dados) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da ProSol Energia Solar e gostaria de um orçamento gratuito.')}`, '_blank');
      return;
    }

    const localCompl = _dados.cidade ? ` em ${_dados.cidade}` : '';

    let texto = `Olá! Fiz a simulação de energia solar no site da ProSol e a economia estimada foi de ${_dados.economiaMensal} por mês.\n\n`;
    texto += `Gostaria de entender melhor como isso funcionaria na prática${_dados.tipoLabel ? ` no meu imóvel ${_dados.tipoLabel.toLowerCase()}` : ' no meu imóvel'}${localCompl}.\n\n`;
    texto += `Podem me ajudar com os próximos passos?`;

    if (_dados.nome) {
      texto += `\n\n_Nome: ${_dados.nome}`;
      if (_dados.celular) texto += ` | ${_dados.celular}`;
      texto += `_`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
  }

  // Expõe globalmente para onclick inline no HTML
  return { calcularSolar, enviarSimulacaoWhatsApp };
})();

function calcularSolar() { SimulacaoSolar.calcularSolar(); }
function enviarSimulacaoWhatsApp() { SimulacaoSolar.enviarSimulacaoWhatsApp(); }

/* ============================================================
   UTILITÁRIOS / MÁSCARAS
   ============================================================ */
function mascaraCelular(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 2) v = v.replace(/(\d{0,2})/, '($1');
  else if (v.length <= 7) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  input.value = v;
}

/* ============================================================
   FASE 4 — GALERIA LIGHTBOX, SLIDER & FORMULÁRIO DE CONTATO
   ============================================================ */

/* ===== 2. SLIDER DE DEPOIMENTOS (Navegação & Swipe Mobile) ===== */
function initDepoimentosSlider() {
  const slider = document.getElementById('depoimentos-slider');
  const cards = document.querySelectorAll('.depoimento-card');
  const dots = document.querySelectorAll('.depo-dot');
  const prevBtn = document.getElementById('depo-prev');
  const nextBtn = document.getElementById('depo-next');

  if (!slider || !cards.length) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Atualiza botões e indicadores de navegação
  function updateSlider() {
    // Só aplica transform se a tela for menor que 992px (Mobile/Tablet)
    if (window.innerWidth < 992) {
      const position = -currentIndex * 100;
      slider.style.transform = `translateX(${position}%)`;
    } else {
      slider.style.transform = 'none';
    }

    // Atualiza classes ativas
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Volta ao início
    }
    updateSlider();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Vai ao fim
    }
    updateSlider();
  }

  // Cliques nos botões de controle
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Cliques nos pontos (dots)
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateSlider();
    });
  });

  /* Lógica de Swipe Touch & Mouse Grab */
  function touchStart(index) {
    return function (e) {
      if (window.innerWidth >= 992) return; // Desativa em telas desktop
      isDragging = true;
      startX = getPositionX(e);
      slider.style.transition = 'none'; // Desativa transições durante o arrasto
    };
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;

    // Converte a diferença de pixels em porcentagem da largura do slider
    const containerWidth = slider.parentElement.offsetWidth;
    const dragPercent = (diff / containerWidth) * 100;
    const position = -currentIndex * 100 + dragPercent;

    slider.style.transform = `translateX(${position}%)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    slider.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';

    // Calcula se arrastou o suficiente para mudar de card (limiar de 15%)
    const containerWidth = slider.parentElement.offsetWidth;
    const currentTranslate = parseFloat(slider.style.transform.replace('translateX(', '').replace('%)', '')) || 0;
    const diffPercent = currentTranslate + currentIndex * 100;

    if (diffPercent < -15 && currentIndex < cards.length - 1) {
      currentIndex++;
    } else if (diffPercent > 15 && currentIndex > 0) {
      currentIndex--;
    }

    updateSlider();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Vincula eventos do toque e mouse
  cards.forEach((card, index) => {
    // Touch events
    card.addEventListener('touchstart', touchStart(index), { passive: true });
    card.addEventListener('touchmove', touchMove, { passive: true });
    card.addEventListener('touchend', touchEnd);

    // Mouse events
    card.addEventListener('mousedown', touchStart(index));
    card.addEventListener('mousemove', touchMove);
    card.addEventListener('mouseup', touchEnd);
    card.addEventListener('mouseleave', touchEnd);
  });

  // Atualiza slider em caso de redimensionamento de janela
  window.addEventListener('resize', throttle(() => {
    updateSlider();
  }, 150));

  updateSlider();
}

/* ===== 3. FORMULÁRIO DE CONTATO (WhatsApp Integration) ===== */
function initContatoForm() {
  const form = document.getElementById('contato-form-solar');
  const inputTel = document.getElementById('form-telefone');

  if (!form) return;

  // Máscara dinâmica de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (inputTel) {
    inputTel.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);

      // Formata em máscara
      if (!x[2]) {
        e.target.value = x[1];
      } else {
        e.target.value = `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : '');
      }
    });
  }

  // Intercepta e processa envio do form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Rate limit: máximo 3 envios por 10 minutos
    if (!RateLimit.check('form_contato', 3, 600000)) {
      const wait = RateLimit.waitTime('form_contato', 600000);
      showErrorToast(`Muitos envios em sequência. Aguarde ${Math.ceil(wait/60)} minuto(s) ou entre em contato diretamente pelo WhatsApp.`);
      return;
    }

    const nome = sanitize(document.getElementById('form-nome').value.trim());
    const tel = sanitize(document.getElementById('form-telefone').value.trim());
    const cidade = sanitize(document.getElementById('form-cidade').value.trim());
    const conta = sanitize(document.getElementById('form-conta').value.trim());

    if (!nome || !tel || !cidade || !conta) {
      showErrorToast('Por favor, preencha todos os campos do formulário para prosseguir.');
      return;
    }

    const telDigits = tel.replace(/\D/g, '');
    if (telDigits.length < 10 || telDigits.length > 11) {
      showErrorToast('Digite um número de WhatsApp válido com DDD. Ex: (33) 99999-0000');
      return;
    }

    // Número de WhatsApp do Hudson (ProSol Energia Solar) — já configurado, não é placeholder

    // Formatação da mensagem em formato URL-encoded
    const textoMensagem = `Olá! Vim pelo site da ProSol Energia Solar e gostaria de solicitar um orçamento gratuito.\n\n` +
      `*Nome:* ${nome}\n` +
      `*WhatsApp:* ${tel}\n` +
      `*Localidade:* ${cidade}\n` +
      `Valor Conta de Luz atual: R$ ${conta}`;

    const urlencodedText = encodeURIComponent(textoMensagem);
    const linkWhats = `https://wa.me/${WHATSAPP_NUMBER}?text=${urlencodedText}`;

    // Dispara pixel/track de analytics se houver futuramente
    // Abre a aba do WhatsApp
    window.open(linkWhats, '_blank', 'noopener,noreferrer');

    // Fase 6: Toast + Confetti em vez de alert()
    form.reset();
  });
}

/* ===== 4. POLISH: PROGRESS BAR, SCROLLSPY, BACK TO TOP & HERO CHEVRON FADE ===== */
(function initScrollPolish() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!progressBar && !backToTopBtn && !scrollIndicator && !navLinks.length) return;

  // Lógica principal de rolagem
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // A. Barra de Progresso
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // B. Fade Out do Indicador de Scroll do Hero
    if (scrollIndicator) {
      const opacity = Math.max(1 - scrollTop / 180, 0);
      scrollIndicator.style.opacity = opacity;
      scrollIndicator.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // C. Visibilidade do Botão Voltar ao Topo
    if (backToTopBtn) {
      if (scrollTop > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // D. Scrollspy: Destacar Link Ativo no Menu
    if (navLinks.length && sections.length) {
      let currentSectionId = '';

      // Ajuste de offset de cabeçalho
      const offset = 120;

      sections.forEach(sec => {
        const top = sec.offsetTop - offset;
        const bottom = top + sec.offsetHeight;

        if (scrollTop >= top && scrollTop < bottom) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      // Trata caso especial se chegar no final da página (para destacar contato ou rodapé)
      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 10) {
        currentSectionId = 'contato';
      }

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // Listener com passive: true para performance de scroll
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Executa para estado inicial

  // Evento de clique para Voltar ao Topo
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
})();


/* ============================================================
   FASE 6 — CONVERSÃO PREMIUM & EXPERIÊNCIA FINAL
   ============================================================ */




/* ===== 2. TIMELINE DO PROCESSO (scroll trigger) ===== */
(function initProcessoTimeline() {
  const section = document.querySelector('.processo-section');
  const linhaFill = document.getElementById('processo-linha-fill');
  const reveals = document.querySelectorAll('.processo-reveal');

  if (!section) return;

  // Ativa a linha conectora
  const lineObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (linhaFill) linhaFill.classList.add('active');
      lineObserver.disconnect();
    }
  }, { threshold: 0.3 });

  lineObserver.observe(section);

  // Revela os steps com delay escalonado
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0') * 120;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => stepObserver.observe(el));
})();


/* ===== 3. FAQ ACORDEÃO ===== */
(function initFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList) return;

  const items = faqList.querySelectorAll('.faq-item');
  const reveals = faqList.querySelectorAll('.faq-reveal');

  // Restringir seleção ao escopo da seção FAQ para não capturar .faq-reveal de outras seções
  const faqSection = document.querySelector('.faq-section');
  const faqHeader = faqSection ? faqSection.querySelector('.faq-reveal[data-delay="0"]') : null;

  // Reveal de scroll via IntersectionObserver
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0') * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  if (faqHeader) revealObs.observe(faqHeader);
  reveals.forEach(el => revealObs.observe(el));

  // Toggle do acordeão
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros
      items.forEach(other => {
        if (other !== item) {
          const otherBtn = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.setAttribute('hidden', '');
        }
      });

      // Alterna este
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      }
    });
  });
})();


/* ===== 4. BOTÃO CTA FLUTUANTE MOBILE ===== */
(function initMobileFloatCTA() {
  const cta = document.getElementById('mobile-cta-float');
  if (!cta) return;

  function updateVisibility() {
    if (window.scrollY > 300) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();


function showErrorToast(msg) {
  alert(msg);
}



/* ===== 7. PREMIUM FOOTER INTERACTIONS ===== */
(function initPremiumFooter() {
  // Ano dinâmico do rodapé
  const footerAnoEl = document.getElementById('footer-copy-ano');
  if (footerAnoEl) {
    footerAnoEl.textContent = new Date().getFullYear();
  }

  // Comportamento do botão voltar ao topo do rodapé
  const footerBackToTopBtn = document.getElementById('footer-btn-back-to-top');
  if (footerBackToTopBtn) {
    footerBackToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
})();

/* ===== REVEAL OBSERVER PARA TODAS AS SEÇÕES ===== */
function initAllReveals() {
  // Seleciona TODOS os elementos com classes que terminam em -reveal
  // Exceto aqueles que já têm observers específicos (fluxo-reveal, processo-reveal, faq-reveal)
  const allRevealElements = document.querySelectorAll('[class*="-reveal"]');

  // Filtra elementos que já têm observers específicos ou que já foram tratados
  const revealsToObserve = Array.from(allRevealElements).filter(el => {
    const className = el.className;
    // Não observa elementos que já têm observers específicos
    if (className.includes('fluxo-reveal') ||
      className.includes('processo-reveal') ||
      className.includes('faq-reveal')) {
      return false;
    }

    // Inclui apenas elementos com classes conhecidas de reveal
    return className.includes('projetos-reveal') ||
      className.includes('depoimentos-reveal') ||
      className.includes('depo-reveal') ||
      className.includes('contato-reveal') ||
      className.includes('beneficios-reveal') ||
      className.includes('reveal-left') ||
      className.includes('reveal-right') ||
      className.includes('calc-reveal');
  });

  if (revealsToObserve.length === 0) return;

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Aplica delay baseado no data-delay se existir
        const delay = parseInt(entry.target.dataset.delay || '0') * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealsToObserve.forEach(el => revealObserver.observe(el));

  // Para debug: mostra quantos elementos estão sendo observados

}

// ===== EXECUTAR MÓDULOS NÃO AUTOEXECUTÁVEIS QUANDO O DOM ESTIVER PRONTO =====
document.addEventListener('DOMContentLoaded', function () {
  // Inicializar model viewer 3D
  initModelViewer();

  // Inicializar smooth scroll
  initSmoothScroll();

  // Inicializar fluxo de energia
  desenharLinhasFluxo();
  window.addEventListener('resize', throttle(desenharLinhasFluxo, 150));

  // Inicializar slider de depoimentos
  initDepoimentosSlider();

  // Inicializar formulário de contato
  initContatoForm();

  // Inicializar todas as reveals
  initAllReveals();
});

(function () {
  const tracks = [
    { el: document.getElementById('proj-track-1'), dir: -1 },
    { el: document.getElementById('proj-track-2'), dir: 1 },
    { el: document.getElementById('proj-track-3'), dir: -1 },
  ];

  if (!tracks[0].el) return;

  const SPEED = 0.5; // px por frame

  const offsets = [0, 0, 0];

  // Inicializa offset do track 2 (direita) na metade pra parecer que já começou no meio
  offsets[1] = -(tracks[1].el.scrollWidth / 2);

  function tick() {
    tracks.forEach((t, i) => {
      const half = t.el.scrollWidth / 2;
      offsets[i] += SPEED * t.dir;

      // loop: quando passou metade, volta ao início
      if (offsets[i] <= -half) offsets[i] = 0;
      if (offsets[i] >= 0 && t.dir === 1) offsets[i] = -half;

      t.el.style.transform = `translateX(${offsets[i]}px)`;
    });
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

// === VIDEO PLAYER UNIFICADO — play/pause, seek, mute, fwd ===
document.querySelectorAll('[data-video-player]').forEach(wrap => {
  const video = wrap.querySelector('video');
  if (!video) return;

  const playBtn = wrap.querySelector('[data-ctrl="play"]');
  const muteBtn = wrap.querySelector('[data-ctrl="mute"]');
  const fwdBtn = wrap.querySelector('[data-ctrl="fwd"]');
  const seek = wrap.querySelector('.video-seek');
  const timeEl = wrap.querySelector('.video-time');

  function fmtTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updateIcons() {
    if (!playBtn) return;
    const ip = playBtn.querySelector('.icon-play');
    const ipa = playBtn.querySelector('.icon-pause');
    if (video.paused) {
      if (ip) ip.style.display = '';
      if (ipa) ipa.style.display = 'none';
    } else {
      if (ip) ip.style.display = 'none';
      if (ipa) ipa.style.display = '';
    }
  }

  function updateMuteIcons() {
    if (!muteBtn) return;
    const iu = muteBtn.querySelector('.icon-unmuted');
    const im = muteBtn.querySelector('.icon-muted');
    if (video.muted) {
      if (iu) iu.style.display = 'none';
      if (im) im.style.display = '';
      muteBtn.setAttribute('aria-label', 'Ativar som');
    } else {
      if (iu) iu.style.display = '';
      if (im) im.style.display = 'none';
      muteBtn.setAttribute('aria-label', 'Desativar som');
    }
  }

  // Play / Pause
  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updateIcons();
  }

  if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
  video.addEventListener('click', togglePlay);

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      updateMuteIcons();
    });
  }

  // Forward 10s
  if (fwdBtn) {
    fwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.currentTime + 10, video.duration || 0);
    });
  }

  // Seek bar
  if (seek) {
    video.addEventListener('timeupdate', () => {
      if (!seek.dataset.dragging && video.duration) {
        seek.value = (video.currentTime / video.duration) * 100;
      }
      if (timeEl) timeEl.textContent = fmtTime(video.currentTime);
    });
    seek.addEventListener('input', () => { seek.dataset.dragging = '1'; });
    seek.addEventListener('change', () => {
      if (video.duration) video.currentTime = (seek.value / 100) * video.duration;
      delete seek.dataset.dragging;
    });
  }

  // Atualiza duração total quando metadata carrega
  video.addEventListener('loadedmetadata', () => {
    if (timeEl) timeEl.textContent = fmtTime(video.currentTime);
  });

  // Estado inicial — mute controlado por tipo de vídeo
  // contato-video (localização sem fala): inicia muted
  // hero-preview e equipe (têm fala/som): iniciam com som
  const src = video.src || video.querySelector('source')?.src || '';
  const isSilentVideo = src.includes('contato-video');
  video.muted = isSilentVideo;
  updateIcons();
  updateMuteIcons();

  // Sincroniza ícones com eventos reais do vídeo
  video.addEventListener('play', updateIcons);
  video.addEventListener('pause', updateIcons);
});

// === AUTOPLAY AO ENTRAR NA VIEWPORT ===
function tryPlay(video) {
  if (video.paused && video.readyState >= 2) {
    video.play().catch(() => {
      // Autoplay bloqueado — aguarda primeira interação do usuário
      const handler = () => {
        video.play().catch(() => {});
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
      };
      document.addEventListener('click', handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
    });
  }
}

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('video');
    if (!video) return;
    if (entry.isIntersecting) {
      // Retry: espera readyState >= 2 (dados suficientes para playback)
      if (video.readyState >= 2) {
        tryPlay(video);
      } else {
        video.addEventListener('loadeddata', () => tryPlay(video), { once: true });
      }
    } else {
      video.pause();
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-video-player]').forEach(el => videoObserver.observe(el));

// === REVEAL DA SEÇÃO EQUIPE ===
(function() {
  const reveals = document.querySelectorAll('.equipe-reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => obs.observe(el));
})();

// === CONTADOR ANIMADO NOS STATS ===
(function () {
  function animateCounter(el, target, duration, suffix) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.countTarget;
      const suffix = el.dataset.countSuffix || '';
      if (!raw) return;
      animateCounter(el, parseFloat(raw), 1800, suffix);
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count-target]').forEach(el => statsObserver.observe(el));
})();

// === BALÃO WHATSAPP ===
(function () {
  const balloon = document.getElementById('float-balloon');
  if (!balloon) return;
  setTimeout(() => {
    balloon.classList.add('visible');
    setTimeout(() => balloon.classList.remove('visible'), 5000);
  }, 20000);
})();

/* ===== QUIZ WIZARD DA CALCULADORA ===== */
(function initQuizWizard() {
  const steps = document.querySelectorAll('.quiz-step');
  if (!steps.length) return;

  let currentStep = 1;

  function goToStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.quiz-step[data-step="${n}"]`);
    if (target) target.classList.add('active');
    currentStep = n;
    updateProgress();
  }

  function updateProgress() {
    document.querySelectorAll('.quiz-progress-step').forEach((el, i) => {
      const stepNum = i + 1;
      el.classList.toggle('active', stepNum === currentStep);
      el.classList.toggle('completed', stepNum < currentStep);
    });
  }

  // Passo 1 — cards de tipo de imóvel
  document.querySelectorAll('.quiz-card[data-target="tipo"]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.quiz-card[data-target="tipo"]').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('tipo').value = card.dataset.value;
      setTimeout(() => goToStep(2), 400);
    });
  });

  // Passo 2 — slider de conta
  const slider = document.getElementById('quiz-conta-slider');
  const display = document.getElementById('quiz-conta-display');
  const contaInput = document.getElementById('conta');
  const analiseConta = document.getElementById('quiz-analise-conta');

  const mensagensConta = [
    'Analisando perfil de consumo...',
    'Calculando irradiação solar para sua região...',
    'Estimando potência necessária...'
  ];

  let analiseIndex = 0;
  let analiseInterval = null;
  let analiseTimeout = null;

  if (slider) {
    // Sincroniza o valor inicial
    display.textContent = parseInt(slider.value).toLocaleString('pt-BR');
    contaInput.value = slider.value;

    slider.addEventListener('input', () => {
      const val = slider.value;
      display.textContent = parseInt(val).toLocaleString('pt-BR');
      contaInput.value = val;

      if (!analiseInterval) {
        analiseConta.classList.add('visible');
        analiseConta.textContent = mensagensConta[0];
        analiseIndex = 0;
        analiseInterval = setInterval(() => {
          analiseIndex = (analiseIndex + 1) % mensagensConta.length;
          analiseConta.textContent = mensagensConta[analiseIndex];
        }, 1200);
      }

      clearTimeout(analiseTimeout);
      analiseTimeout = setTimeout(() => {
        clearInterval(analiseInterval);
        analiseInterval = null;
        analiseConta.classList.remove('visible');
      }, 1500);
    });
  }

  // Passo 3 — cidade
  const cidadeInput = document.getElementById('cidade');
  const analiseCidade = document.getElementById('quiz-analise-cidade');
  let cidadeTimeout = null;

  if (cidadeInput) {
    cidadeInput.addEventListener('input', () => {
      clearTimeout(cidadeTimeout);
      const cidade = cidadeInput.value.trim();
      if (!cidade) {
        analiseCidade.classList.remove('visible');
        return;
      }
      cidadeTimeout = setTimeout(() => {
        analiseCidade.textContent = `Consultando índice solar de ${cidade}...`;
        analiseCidade.classList.add('visible');
        setTimeout(() => {
          if (cidadeInput.value.trim() === cidade) {
            analiseCidade.textContent = 'Região com ótima incidência solar ✓';
          }
          const irrInput = document.getElementById('param-irradiacao');
          const c = cidade.toLowerCase().trim();
          const IRR_MG = {almenara:5.80,jacinto:5.75,'salto da divisa':5.75,'pedra azul':5.70,'mata verde':5.72,'rio do prado':5.68,'santa maria do salto':5.65,joaima:5.70,bandeira:5.65,'curral de dentro':5.60,'virgem da lapa':5.55,araçuaí:5.60,itaobim:5.55,medina:5.58,jequitinhonha:5.50,'montes claros':5.45,januária:5.50,pirapora:5.40,'teófilo otoni':5.35,'governador valadares':5.20,ipatinga:5.10,uberlândia:5.30,uberaba:5.25,'belo horizonte':5.00,contagem:5.00,betim:5.05,'juiz de fora':4.90,'poços de caldas':4.80,varginha:4.85,lavras:4.90,'pouso alegre':4.85};
          if (irrInput && IRR_MG[c]) irrInput.value = IRR_MG[c];
        }, 1200);
      }, 600);
    });
  }

  const ligacaoSelect = document.getElementById('ligacao');
  const TAXA_DISP = {mono: 54, bi: 108, tri: 162};
  if (ligacaoSelect) {
    ligacaoSelect.addEventListener('change', () => {
      const taxaInput = document.getElementById('param-taxa-disp');
      if (taxaInput && TAXA_DISP[ligacaoSelect.value]) taxaInput.value = TAXA_DISP[ligacaoSelect.value];
    });
  }

  const tipoSelect = document.getElementById('tipo');
  const TARIFA_DEFAULT = {residencial: 1.13, comercial: 0.81, rural: 0.72};
  if (tipoSelect) {
    tipoSelect.addEventListener('change', () => {
      const kwhInput = document.getElementById('param-kwh');
      if (kwhInput && TARIFA_DEFAULT[tipoSelect.value]) kwhInput.value = TARIFA_DEFAULT[tipoSelect.value];
    });
  }

  // Botões "Continuar"
  document.querySelectorAll('.quiz-btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      // Rate limit: máximo 20 cliques de navegação por minuto (anti-bot)
      if (!RateLimit.check('quiz_nav', 20, 60000)) return;

      const next = parseInt(btn.dataset.next);
      goToStep(next);
    });
  });

  // Botões "Voltar" (sem resetar nenhum valor)
  document.querySelectorAll('.quiz-btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  // Botão finalizar (Passo 4 -> Passo 5 revelação)
  const btnFinish = document.getElementById('quiz-btn-finish');
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      const nome = document.getElementById('nome').value.trim();
      const celular = document.getElementById('celular').value.trim();

      if (!nome || !celular) {
        showErrorToast('Preencha seu nome e WhatsApp para ver o resultado.');
        return;
      }

      // Rate limit: máximo 3 simulações por 2 minutos
      if (!RateLimit.check('simulacao', 3, 120000)) {
        const wait = RateLimit.waitTime('simulacao', 120000);
        showErrorToast(`Muitas simulações em sequência. Aguarde ${wait} segundos ou entre em contato pelo WhatsApp.`);
        RateLimit.blockButton(btnFinish, wait, 'Ver minha economia →');
        return;
      }

      goToStep(5);
      iniciarRevelacao();
    });
  }

  // Tela de revelação
  function iniciarRevelacao() {
    const loadingEl = document.getElementById('quiz-revelacao-loading');
    const msgEl = document.getElementById('quiz-revelacao-msg');
    const resultsEl = document.getElementById('sim-results');

    const cidade = (document.getElementById('cidade') ? document.getElementById('cidade').value.trim() : '') || 'sua região';
    const uf = (document.getElementById('uf') ? document.getElementById('uf').value : '') || 'MG';

    const mensagensRevelacao = [
      'Processando dados do imóvel...',
      `Calculando irradiação solar para ${cidade}/${uf}...`,
      'Dimensionando sistema fotovoltaico ideal...',
      'Gerando relatório de economia...'
    ];

    resultsEl.classList.remove('show');
    loadingEl.style.display = 'flex';
    resultsEl.style.display = 'none';

    let idx = 0;
    msgEl.textContent = mensagensRevelacao[0];
    const revInterval = setInterval(() => {
      idx++;
      if (idx < mensagensRevelacao.length) {
        msgEl.textContent = mensagensRevelacao[idx];
      }
    }, 750);

    setTimeout(() => {
      clearInterval(revInterval);
      loadingEl.style.display = 'none';
      resultsEl.style.display = 'block';

      // Chama a função de cálculo existente — já popula os resultados
      calcularSolar();

      requestAnimationFrame(() => resultsEl.classList.add('show'));
    }, 3000);
  }

  // Inicializa
  goToStep(1);
})();

/* ============================================================
   CÁLCULO SOLAR STANDALONE — chamado pelo quiz e pelo painel de parâmetros
   ============================================================ */
function calcularSolarCalc() {
  const CONFIG = {
    tarifas: {
      residencial: 1.13,
      comercial:   0.81,
      rural:       0.72,
    },
    taxaMinima: {
      mono: 54.00,
      bi:   108.00,
      tri:  162.00,
    },
    irradiacaoMG: {
      default:          5.30,
      almenara:         5.80,
      jacinto:          5.75,
      'salto da divisa':5.75,
      'pedra azul':     5.70,
      'mata verde':     5.72,
      'rio do prado':   5.68,
      'santa maria do salto': 5.65,
      'joaima':         5.70,
      'bandeira':       5.65,
      'curral de dentro': 5.60,
      'virgem da lapa': 5.55,
      'araçuaí':        5.60,
      'itaobim':        5.55,
      'medina':         5.58,
      'jequitinhonha':  5.50,
      'montes claros':  5.45,
      'januária':       5.50,
      'pirapora':       5.40,
      'teófilo otoni':  5.35,
      'governador valadares': 5.20,
      'ipatinga':       5.10,
      'uberlândia':     5.30,
      'uberaba':        5.25,
      'belo horizonte': 5.00,
      'contagem':       5.00,
      'betim':          5.05,
      'juiz de fora':   4.90,
      'poços de caldas': 4.80,
      'varginha':       4.85,
      'lavras':         4.90,
      'pouso alegre':   4.85,
    },
    custoKwp: 5000,
    potenciaPainel: 550,
    performanceRatio: 0.78,
    inflacaoTarifa: 6.0,
    fatorCO2: 0.0289,
  };

  const tipo      = document.getElementById('tipo')?.value || 'residencial';
  const conta     = parseFloat(document.getElementById('conta')?.value) || 300;
  const ligacao   = document.getElementById('ligacao')?.value || 'bi';
  const telhado   = parseFloat(document.getElementById('telhado')?.value) || 1.00;
  const cidade    = (document.getElementById('cidade')?.value || '').toLowerCase().trim();

  const tarifaInput      = parseFloat(document.getElementById('param-kwh')?.value);
  const irradiacaoInput  = parseFloat(document.getElementById('param-irradiacao')?.value);
  const taxaDispInput    = parseFloat(document.getElementById('param-taxa-disp')?.value);
  const custoKwpInput    = parseFloat(document.getElementById('param-custo-kwp')?.value);
  const prInput          = parseFloat(document.getElementById('param-pr')?.value);
  const potPainelInput   = parseFloat(document.getElementById('param-pot-painel')?.value);
  const inflacaoInput    = parseFloat(document.getElementById('param-inflacao')?.value);

  const tarifa       = (!isNaN(tarifaInput) && tarifaInput > 0) ? tarifaInput : (CONFIG.tarifas[tipo] || CONFIG.tarifas.residencial);
  const taxaMin      = (!isNaN(taxaDispInput) && taxaDispInput > 0) ? taxaDispInput : (CONFIG.taxaMinima[ligacao] || CONFIG.taxaMinima.bi);
  const irradiacao   = (!isNaN(irradiacaoInput) && irradiacaoInput > 0) ? irradiacaoInput : (CONFIG.irradiacaoMG[cidade] || CONFIG.irradiacaoMG.default);
  const custoKwp     = (!isNaN(custoKwpInput) && custoKwpInput > 0) ? custoKwpInput : CONFIG.custoKwp;
  const pr           = (!isNaN(prInput) && prInput > 0) ? (prInput / 100) : CONFIG.performanceRatio;
  const potPainel    = (!isNaN(potPainelInput) && potPainelInput > 0) ? potPainelInput : CONFIG.potenciaPainel;
  const inflacao     = (!isNaN(inflacaoInput) && inflacaoInput >= 0) ? inflacaoInput : CONFIG.inflacaoTarifa;

  const consumoKwh = conta / tarifa;
  const kwp = consumoKwh / (irradiacao * 30 * pr * telhado);
  const paineis = Math.ceil(kwp / (potPainel / 1000));
  const geracaoMensal = kwp * irradiacao * 30 * pr * telhado;
  const contaComSolar = taxaMin;
  const economiaMensal = Math.max(0, conta - contaComSolar);
  const economiaAnual = economiaMensal * 12;
  const investimento = kwp * custoKwp;
  const paybackAnos = economiaMensal > 0 ? investimento / (economiaMensal * 12) : 0;

  let economia25anos = 0;
  let contaAnual = conta * 12;
  for (let ano = 0; ano < 25; ano++) {
    const economiaAno = Math.max(0, contaAnual - (taxaMin * 12));
    economia25anos += economiaAno;
    contaAnual *= (1 + inflacao / 100);
  }
  const roi = investimento > 0 ? ((economia25anos - investimento) / investimento * 100) : 0;
  const co2 = (geracaoMensal * 12 * 25) / 1000 * CONFIG.fatorCO2;

  const fmt = (v) => 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits: 0, maximumFractionDigits: 0});
  const fmtDec = (v, d=1) => v.toLocaleString('pt-BR', {minimumFractionDigits: d, maximumFractionDigits: d});

  document.getElementById('res-economia').textContent      = fmt(economiaMensal);
  document.getElementById('res-anual').textContent         = fmt(economiaAnual);
  document.getElementById('res-kwp').textContent           = fmtDec(kwp, 2) + ' kWp';
  document.getElementById('res-paineis').textContent       = paineis;
  document.getElementById('res-geracao').textContent       = fmtDec(geracaoMensal, 0) + ' kWh';
  document.getElementById('res-invest').textContent        = fmt(investimento);
  document.getElementById('res-payback').textContent       = fmtDec(paybackAnos, 1) + ' anos';
  document.getElementById('res-sem-solar').textContent     = fmt(conta);
  document.getElementById('res-com-solar').textContent     = fmt(contaComSolar);
  document.getElementById('res-economia-mensal').textContent = fmt(economiaMensal);
  document.getElementById('res-economia-total').textContent = fmt(economia25anos);
  document.getElementById('res-roi').textContent           = fmtDec(roi, 0) + '%';
  document.getElementById('res-co2').textContent           = fmtDec(co2, 1) + ' t';

  const barPct = Math.min((paybackAnos / 20) * 100, 100);
  document.getElementById('payback-bar').style.width = barPct + '%';

  const avisoEl = document.getElementById('aviso-regiao');
  if (avisoEl) {
    const cidadeConhecida = CONFIG.irradiacaoMG[cidade];
    if (cidade && cidadeConhecida) {
      avisoEl.style.display = 'block';
      avisoEl.innerHTML = '📍 Irradiação solar usada para <strong>' + cidade + '</strong>: <strong>' + fmtDec(irradiacao, 2) + ' kWh/m²/dia</strong> — dados do Atlas INPE/LABREN para MG.';
    } else if (cidade) {
      avisoEl.style.display = 'block';
      avisoEl.innerHTML = '📍 Cidade não encontrada na base. Usando irradiação média de MG: <strong>' + fmtDec(irradiacao, 2) + ' kWh/m²/dia</strong>. Para resultado mais preciso, solicite uma visita técnica.';
    } else {
      avisoEl.style.display = 'none';
    }
  }

  const tarifaEl = document.getElementById('tarifa-usada');
  if (tarifaEl) {
    const nomesTipo = {residencial: 'B1 Residencial', comercial: 'B3 Comercial', rural: 'B2 Rural'};
    const nomesLigacao = {mono: 'Monofásico', bi: 'Bifásico', tri: 'Trifásico'};
    const params = [
      '⚡ <strong>Base do cálculo:</strong>',
      'Tarifa CEMIG ' + (nomesTipo[tipo] || tipo) + ' — R$ ' + fmtDec(tarifa, 2) + '/kWh',
      nomesLigacao[ligacao],
      'Taxa mínima: ' + fmt(taxaMin) + '/mês',
      'Irradiação: ' + fmtDec(irradiacao, 2) + ' kWh/m²/dia',
      'Custo/kWp: ' + fmt(custoKwp),
      'PR: ' + fmtDec(pr * 100, 0) + '%',
      'Painel: ' + potPainel + ' Wp',
      'Inflação: ' + fmtDec(inflacao, 1) + '% a.a.'
    ];
    tarifaEl.innerHTML = params.join(' &nbsp;|&nbsp; ');
  }

  const results = document.getElementById('sim-results');
  if (results) {
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ============================================================
   TOOLTIPS DA CALCULADORA
   ============================================================ */
(function() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.quiz-tooltip-btn');
    if (btn) {
      e.stopPropagation();
      const tooltipId = btn.dataset.tooltip;
      const box = document.getElementById('tooltip-' + tooltipId);
      if (!box) return;
      const isVisible = box.classList.contains('visible');
      document.querySelectorAll('.quiz-tooltip-box.visible').forEach(el => {
        el.classList.remove('visible');
      });
      document.querySelectorAll('.quiz-tooltip-btn.active').forEach(el => {
        el.classList.remove('active');
      });
      if (!isVisible) {
        box.classList.add('visible');
        btn.classList.add('active');
      }
    } else if (!e.target.closest('.quiz-tooltip-box')) {
      document.querySelectorAll('.quiz-tooltip-box.visible').forEach(el => {
        el.classList.remove('visible');
      });
      document.querySelectorAll('.quiz-tooltip-btn.active').forEach(el => {
        el.classList.remove('active');
      });
    }
  });
})();

