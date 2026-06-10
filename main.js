/* ============================================================
   SOLAR LANDING PAGE — main.js
   Fase 1: Partículas de luz dourada + interações do hero
   ============================================================ */

'use strict';

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

/* ===== ANO NO RODAPÉ ===== */
const anoEl = document.getElementById('ano');
if (anoEl) anoEl.textContent = new Date().getFullYear();

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

/* ===== PARTÍCULAS DE LUZ DOURADA ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Só inicializa partículas no desktop — mobile não precisa
  if (window.innerWidth >= 900) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;

    // Configurações
    const COUNT = 80;    // número de partículas
    const MAX_SIZE = 2.8;   // raio máximo em px
    const MIN_SPEED = 0.08;
    const MAX_SPEED = 0.28;
    const COLORS = [
      'rgba(240, 192, 64,',   // dourado
      'rgba(255, 200, 80,',   // dourado claro
      'rgba(255, 160, 40,',   // âmbar
      'rgba(255, 255, 200,',  // branco quente
    ];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randomParticle(forceY) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * W,
        y: forceY !== undefined ? forceY : Math.random() * H,
        r: Math.random() * MAX_SIZE + 0.4,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: -(Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED), // sobe
        alpha: Math.random() * 0.6 + 0.1,
        dAlpha: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        minA: 0.05,
        maxA: 0.75,
        color,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      };
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => randomParticle());
    }

    function update() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Alpha pulsante
        p.alpha += p.dAlpha;
        if (p.alpha >= p.maxA || p.alpha <= p.minA) p.dAlpha *= -1;

        // Reposicionar ao sair da tela pelo topo
        if (p.y < -10 || p.x < -10 || p.x > W + 10) {
          Object.assign(p, randomParticle(H + 10)); // reaparece na base
          p.y = H + 10;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Tamanho pulsante sutil
        const radius = p.r + Math.sin(p.pulse) * 0.3;
        const alpha = Math.max(0, Math.min(1, p.alpha));

        // Glow suave
        ctx.beginPath();
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
        grd.addColorStop(0, `${p.color}${alpha})`);
        grd.addColorStop(0.5, `${p.color}${alpha * 0.3})`);
        grd.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grd;
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo mais brilhante
        ctx.beginPath();
        ctx.fillStyle = `${p.color}${Math.min(1, alpha * 1.8)})`;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }

    // Parar animação quando fora da viewport (performance)
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!raf) loop();
      } else {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, { threshold: 0 });

    window.addEventListener('resize', () => {
      resize();
      // Não recriar partículas, apenas ajustar tela
    }, { passive: true });

    resize();
    initParticles();
    observer.observe(canvas);
    loop();
  }
})();

/* ===== COUNTERS ANIMADOS (hero stats) ===== */
function initCounters() {
  // SUBSTITUIR: valores reais do cliente
  const targets = {
    'stat-projetos': 150,
    'stat-kwh': 5,
    'stat-economias': 2,
  };

  let started = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounters() {
    if (started) return;
    started = true;

    const duration = 2200; // ms
    const start = performance.now();

    function formatNumber(id, value) {
      if (id === 'stat-projetos') return Math.round(value) + '+';
      if (id === 'stat-kwh') return Math.round(value) + 'M+';
      if (id === 'stat-economias') return Math.round(value) + 'M+';
      return Math.round(value).toLocaleString('pt-BR');
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);

      for (const id in targets) {
        const target = targets[id];
        const element = document.getElementById(id);
        if (!element) continue;

        const current = eased * target;
        element.textContent = formatNumber(id, current);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // Inicia quando a seção entrar na viewport
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 300); // Pequeno delay para melhor UX
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(heroSection);
}

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
window.addEventListener('load', desenharLinhasFluxo);
window.addEventListener('resize', desenharLinhasFluxo);
document.fonts.ready.then(() => {
  desenharLinhasFluxo();
});
setTimeout(() => {
  desenharLinhasFluxo();
}, 800);


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

function calcularSolar() {
  const uf = document.getElementById('uf').value;
  const conta = parseFloat(document.getElementById('conta').value);
  const ligacao = document.getElementById('ligacao').value;
  const cidade = document.getElementById('cidade') ? document.getElementById('cidade').value.trim() : '';

  if (!uf || !conta || conta <= 0) {
    alert('Preencha o estado e o valor da conta de energia.');
    return;
  }

  /* ---- 1. VARIÁVEIS BASE ---- */
  const hsp = HSP_UF[uf] || 5.0;
  const tarifa = TARIFA_UF[uf] || 0.95;
  const taxaDisp = TAXA_DISP[ligacao] || 30;

  /* ---- 2. CONSUMO (equivalente ao avgConsumption do Azume) ----
     avgConsumption = valor_conta / kwhPrice
     Desconta a taxa de disponibilidade para obter o consumo
     efetivamente compensável pelo sistema solar.                  */
  const consumo_kwh = conta / tarifa;                         // kWh/mês total faturado
  const consumo_util = Math.max(consumo_kwh - taxaDisp, 0);   // kWh/mês compensável

  /* ---- 3. DIMENSIONAMENTO DO SISTEMA ----
     kWp = consumo_kwh / (HSP × 30dias × PR)
     Equivalente ao dimensionamento interno do Azume para Grupo B  */
  const kwp = consumo_kwh / (hsp * 30 * PR);
  const geracao_mensal = Math.round(kwp * hsp * 30 * PR);     // kWh/mês gerado
  const paineis = Math.ceil((kwp * 1000) / PAINEL_W);  // quantidade de painéis

  /* ---- 4. PREÇO FINAL DO SISTEMA (equivalente a finalPrice) ---- */
  const finalPrice = Math.round(kwp * CUSTO_KWP);

  /* ---- 5. ECONOMIA MENSAL ----
     Azume: noSystemMonthlyPrice - systemMonthlyPrice
     noSystemMonthlyPrice = valor da conta atual
     systemMonthlyPrice   = taxa de disponibilidade × tarifa (o mínimo que ainda paga)
     Economia = consumo_util × tarifa                                 */
  const noSystemMonthlyPrice = Math.round(conta);
  const systemMonthlyPrice = Math.round(taxaDisp * tarifa);
  const economia_mensal = Math.round(consumo_util * tarifa);
  const economia_anual = economia_mensal * 12;

  /* ---- 6. PAYBACK (equivalente a paybackYears / paybackMonths) ----
     Azume calcula o ponto onde o cashFlow acumulado cruza zero.
     Aqui fazemos o mesmo com projeção de inflação.                   */
  let acumulado = -finalPrice;
  let paybackAnos = 0;
  let paybackMeses = 0;
  let economia_ano = economia_anual;

  for (let ano = 1; ano <= 25; ano++) {
    const anterior = acumulado;
    acumulado += economia_ano;
    if (anterior < 0 && acumulado >= 0 && paybackAnos === 0) {
      // interpolação para meses exatos
      paybackAnos = ano - 1;
      paybackMeses = Math.round((-anterior / economia_ano) * 12);
      if (paybackMeses === 12) { paybackAnos++; paybackMeses = 0; }
    }
    economia_ano = economia_ano * (1 + INFLACAO_ANUAL); // corrige pela inflação
  }

  /* ---- 7. CASH FLOW 25 ANOS (equivalente ao array cashFlow do Azume) ---- */
  const cashFlow = [];
  let fluxo = -finalPrice;
  let eco = economia_anual;
  for (let ano = 1; ano <= 25; ano++) {
    fluxo += eco;
    cashFlow.push(Math.round(fluxo));
    eco = eco * (1 + INFLACAO_ANUAL);
  }

  /* ---- 8. TOTAIS FINAIS ---- */
  const totalEconomy = cashFlow[24] + finalPrice; // economia bruta em 25 anos
  const roi = Math.round((cashFlow[24] / finalPrice / 25) * 100);
  const co2_evitado = Math.round(geracao_mensal * 12 * 25 * 0.000084); // toneladas CO₂

  /* ---- 9. FORMATAÇÃO ---- */
  const fmt = n => Math.round(n).toLocaleString('pt-BR');
  const fmtR$ = n => 'R$ ' + fmt(n);

  /* ---- 10. ATUALIZAR DOM — mesmos IDs do HTML original ---- */
  document.getElementById('res-economia').textContent = fmtR$(economia_mensal);
  document.getElementById('res-anual').textContent = fmtR$(economia_anual);
  document.getElementById('res-kwp').textContent = kwp.toFixed(2) + ' kWp';
  document.getElementById('res-paineis').textContent = paineis;
  document.getElementById('res-geracao').textContent = fmt(geracao_mensal) + ' kWh';
  document.getElementById('res-invest').textContent = fmtR$(finalPrice);

  // Payback
  const paybackStr = paybackAnos > 0
    ? paybackMeses > 0
      ? `${paybackAnos} anos e ${paybackMeses} meses`
      : `${paybackAnos} anos`
    : `${paybackMeses} meses`;
  document.getElementById('res-payback').textContent = paybackStr;
  document.getElementById('payback-bar').style.width =
    Math.min(((paybackAnos + paybackMeses / 12) / 20) * 100, 100) + '%';

  // Detalhes financeiros ampliados
  document.getElementById('res-economia-mensal').textContent = fmtR$(economia_mensal);
  document.getElementById('res-economia-total').textContent = fmtR$(Math.round(totalEconomy));
  document.getElementById('res-roi').textContent = roi + '%';
  document.getElementById('res-sem-solar').textContent = fmtR$(noSystemMonthlyPrice);
  document.getElementById('res-com-solar').textContent = fmtR$(systemMonthlyPrice);
  document.getElementById('res-co2').textContent = fmt(co2_evitado) + ' t';

  /* ---- 11. MOSTRAR RESULTADOS ---- */
  const results = document.getElementById('sim-results');
  results.classList.add('show');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
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

/* ===== 1. MODAL LIGHTBOX PARA PROJETOS ===== */
(function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll('.projeto-img-wrap');

  if (!modal || !modalImg || !closeBtn) return;

  function openLightbox(e) {
    const imgUrl = this.dataset.img;
    if (!imgUrl) return;

    modalImg.src = imgUrl;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Trava scroll da página
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Destrava scroll
    setTimeout(() => {
      modalImg.src = ''; // Limpa a imagem após transição para poupar RAM
    }, 350);
  }

  triggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
  closeBtn.addEventListener('click', closeLightbox);

  // Fecha clicando no fundo/overlay do modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Tecla ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
})();

/* ===== 2. SLIDER DE DEPOIMENTOS (Navegação & Swipe Mobile) ===== */
(function initDepoimentosSlider() {
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
  window.addEventListener('resize', () => {
    updateSlider();
  });

  updateSlider();
})();

/* ===== 3. FORMULÁRIO DE CONTATO (WhatsApp Integration) ===== */
(function initContatoForm() {
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

    const nome = document.getElementById('form-nome').value.trim();
    const tel = document.getElementById('form-telefone').value.trim();
    const cidade = document.getElementById('form-cidade').value.trim();
    const conta = document.getElementById('form-conta').value.trim();

    if (!nome || !tel || !cidade || !conta) {
      alert('Por favor, preencha todos os campos do formulário para prosseguir.');
      return;
    }

    // Número de WhatsApp de destino (placehoder substituível pelo cliente)
    // Usamos um número padrão internacional fictício ou limpo
    const whatsappNumero = "5511999999999";

    // Formatação da mensagem em formato URL-encoded
    const textoMensagem = `Olá! Vim pelo site da SolarTech e gostaria de solicitar um orçamento gratuito.\n\n` +
      `👤 Nome: ${nome}\n` +
      `📱 WhatsApp: ${tel}\n` +
      `📍 Localidade: ${cidade}\n` +
      `⚡ Valor Conta de Luz atual: R$ ${conta}`;

    const urlencodedText = encodeURIComponent(textoMensagem);
    const linkWhats = `https://wa.me/${whatsappNumero}?text=${urlencodedText}`;

    // Dispara pixel/track de analytics se houver futuramente
    // Abre a aba do WhatsApp
    window.open(linkWhats, '_blank', 'noopener,noreferrer');

    // Fase 6: Toast + Confetti em vez de alert()
    form.reset();
    // Reseta o visual do slider após o reset do form
    const sliderEl = document.getElementById('conta-slider');
    if (sliderEl) {
      sliderEl.dispatchEvent(new Event('input'));
    }
    showFormToast();
    launchConfetti();
  });
})();

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


/* ===== 5. CONFETTI DOURADO ===== */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#f0c040', '#ffd44a', '#fff8e7', '#ffb830', '#ff6a00', '#ffffff'];
  const COUNT = 110;
  const DURATION = 2800; // ms
  const start = performance.now();

  const pieces = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.5 - 10,
    w: Math.random() * 8 + 4,
    h: Math.random() * 14 + 6,
    r: Math.random() * Math.PI * 2,
    dr: (Math.random() - 0.5) * 0.18,
    vx: (Math.random() - 0.5) * 3.5,
    vy: Math.random() * 4 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
  }));

  function drawConfetti(now) {
    const elapsed = now - start;
    if (elapsed > DURATION) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fadeStart = DURATION * 0.65;
    const globalAlpha = elapsed > fadeStart
      ? 1 - (elapsed - fadeStart) / (DURATION - fadeStart)
      : 1;

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.dr;
      p.vy += 0.08; // gravidade suave

      ctx.save();
      ctx.globalAlpha = globalAlpha * p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    requestAnimationFrame(drawConfetti);
  }

  requestAnimationFrame(drawConfetti);
}


/* ===== 6. TOAST DE SUCESSO DO FORMULÁRIO ===== */
function showFormToast() {
  const toast = document.getElementById('form-toast');
  const closeBtn = document.getElementById('toast-close');
  if (!toast) return;

  toast.classList.add('show');

  // Auto-fechar após 5s
  const timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      toast.classList.remove('show');
    }, { once: true });
  }
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

  // Comportamento do botão voltar ao topo flutuante
  const floatBackToTopBtn = document.getElementById('back-to-top');
  if (floatBackToTopBtn) {
    floatBackToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Controla visibilidade com base no scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        floatBackToTopBtn.classList.add('visible');
      } else {
        floatBackToTopBtn.classList.remove('visible');
      }
    }, { passive: true });
  }
})();

/* ===== REVEAL OBSERVER PARA TODAS AS SEÇÕES ===== */
(function initAllReveals() {
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
      className.includes('calc-reveal') ||
      className.includes('historia-reveal');
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
  console.log(`[Reveal Observer] Observando ${revealsToObserve.length} elementos`);
})();

// ===== EXECUTAR MÓDULOS NÃO AUTOEXECUTÁVEIS QUANDO O DOM ESTIVER PRONTO =====
document.addEventListener('DOMContentLoaded', function () {
  // Inicializar contadores do hero
  initCounters();

  // Inicializar model viewer 3D
  initModelViewer();

  // Inicializar smooth scroll
  initSmoothScroll();

  // Inicializar fluxo de energia
  desenharLinhasFluxo();
  window.addEventListener('resize', desenharLinhasFluxo);

  // Inicializar slider de depoimentos
  initDepoimentosSlider();

  // Inicializar formulário de contato
  initContatoForm();

  // Inicializar todas as reveals
  initAllReveals();
});
