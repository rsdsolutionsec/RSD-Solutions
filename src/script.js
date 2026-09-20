/**
 * RSD Solutions — Scripts Principales
 * UI/UX B2B, Selector de Tema (Claro/Oscuro), Navegación Inteligente y Formulario
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // 0. CONTROLADOR DE TEMA (CLARO / OSCURO)
    // ==========================================
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('rsd-theme', theme);
        } catch (e) {
            // Manejo de restricciones de almacenamiento local
        }
        
        const themeBtns = document.querySelectorAll('.theme-toggle-btn');
        const isDark = theme === 'dark';
        themeBtns.forEach(btn => {
            btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
            btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        });
    };

    // Leer tema actual (por defecto 'light')
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('rsd-theme') || 'light';
    } catch (e) {
        savedTheme = 'light';
    }
    applyTheme(savedTheme);

    // Event listeners para todos los botones de toggle de tema (desktop y móvil)
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    });

    // ==========================================
    // 1. BARRA DE PROGRESO DE SCROLL
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ==========================================
    // 2. NAVBAR STICKY & EFECTO BLUR
    // ==========================================
    const navbar = document.querySelector('.navbar, #navbar');
    const handleNavbarScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ==========================================
    // 3. MENÚ MÓVIL (DRAWER & HAMBURGUESA)
    // ==========================================
    const menuToggles = document.querySelectorAll('#menu-toggle, #nav-toggle, .nav-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu') || document.getElementById('nav-links');

    if (menuToggles.length > 0 && mobileMenu) {
        menuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = mobileMenu.classList.toggle('open');
                mobileMenu.classList.toggle('hidden', !isOpen);
                toggle.classList.toggle('open', isOpen);
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
        });

        // Cerrar menú al hacer clic en cualquier enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú con ESC o clic exterior
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && ![...menuToggles].some(t => t.contains(e.target))) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // 4. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 5. EFECTO SPOTLIGHT / GLOW EN TARJETAS
    // ==========================================
    const cardsWithGlow = document.querySelectorAll('.glow-card, .service-card, .project-card');
    cardsWithGlow.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================
    // 6. INTERSECTION OBSERVER (REVEAL)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section, .reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 7. BOTÓN SCROLL-TO-TOP
    // ==========================================
    const scrollTopBtn = document.getElementById('scroll-top-btn') || document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.add('opacity-100', 'visible');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.remove('opacity-100', 'visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 8. MODAL DE ARQUITECTURA TÉCNICA (PORTAFOLIO)
    // ==========================================
    const modal = document.getElementById('portfolio-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalMetrics = document.getElementById('modal-metrics');
    const modalDemo = document.getElementById('modal-demo');

    // Base de datos de arquitectura técnica para proyectos
    const projectSpecs = {
        'restogestion': {
            title: "RestoGestión — Sistema Cloud POS & Gestión Restaurantes",
            desc: "Arquitectura integral de alta disponibilidad para restaurantes y cadenas gastronómicas. Diseñada con motor transaccional para pedidos concurrentes en barra, cocina y salones, sincronización de stock de insumos y módulo tributario de facturación electrónica directa con el SRI.",
            tech: "React, Node.js, Express, PostgreSQL, WebSockets, Docker, Redis",
            metrics: "⚡ +45% agilidad en despacho | ⏱️ 99.9% Uptime | 📊 Facturación SRI sin errores",
            demo: "https://restogestion.site/"
        },
        'ventas-crm': {
            title: "Plataforma Comercial & CRM Pipeline Automatizado",
            desc: "Sistema B2B de gestión y aceleración comercial para equipos de ventas. Automatiza el ciclo de prospectos, recordatorios vía WhatsApp/Email, métricas analíticas de conversión de embudo y control de roles comerciales.",
            tech: "Vue.js / React, Python Django / Node, PostgreSQL, Redis, APIs REST",
            metrics: "📈 3.2x seguimiento efectivo | 🤖 Cero tareas repetitivas en prospección",
            demo: "https://control-style.vercel.app/"
        },
        'erp-empresarial': {
            title: "ERP Empresarial Multi-Módulo para PYMES",
            desc: "Plataforma de planificación de recursos empresariales a medida. Conecta inventario general, tesorería, cuentas por cobrar, roles de usuario avanzados con permisos RBAC y reportes analíticos para juntas directivas.",
            tech: "Angular / React, Spring Boot / Node, PostgreSQL, Cloud Storage",
            metrics: "📦 Control total de existencias en tiempo real | 💼 Código 100% auditable",
            demo: "https://control-rest-v1-0.vercel.app/"
        },
        'don-pepe': {
            title: "Don Pepe Business Club — Plataforma de Membresías",
            desc: "Plataforma web corporativa y portal exclusivo de miembros para club de negocios de alto nivel. Gestión de credenciales digitales, agenda de eventos exclusivos y red privada de contactos.",
            tech: "Next.js, Tailwind CSS, Supabase / PostgreSQL, Vercel Edge",
            metrics: "💎 100% automatización de afiliaciones | 🔒 Acceso seguro cifrado",
            demo: "https://don-pepe-bussines-club.vercel.app/"
        },
        'premier-estates': {
            title: "Premier Estates — Portal Inmobiliario de Alto Ticket",
            desc: "Portal dinámico para bienes raíces de lujo con filtrado geo-espacial avanzado, galerías de alta resolución y captación directa de leads calificados por WhatsApp y CRM.",
            tech: "React, Node.js, CDN optimizada, PostgreSQL",
            metrics: "🏡 Carga en 0.8s | 📱 Experiencia ultra-optimizada para inversores",
            demo: "https://premier-estates.vercel.app/"
        },
        'tecnosfera': {
            title: "Tecnosfera — Portal Tecnológico de Alta Concurrencia",
            desc: "Portal de medios y noticias con arquitectura optimizada para tráfico masivo y Core Web Vitals de 98+. Indexación SEO automatizada y rendimiento óptimo bajo demanda.",
            tech: "React, Node.js, CDN Cloudflare, Redis Caching",
            metrics: "🚀 99+ Core Web Vitals en Google | ⚡ Cero latencia en visitas concurrentes",
            demo: "https://tecnosfera.space/"
        }
    };

    document.querySelectorAll('.open-spec-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const specKey = btn.getAttribute('data-spec');
            const data = projectSpecs[specKey];
            if (data && modal) {
                if (modalTitle) modalTitle.textContent = data.title;
                if (modalDesc) modalDesc.textContent = data.desc;
                if (modalTech) modalTech.textContent = data.tech;
                if (modalMetrics) modalMetrics.textContent = data.metrics;
                if (modalDemo) {
                    modalDemo.href = data.demo;
                    modalDemo.setAttribute('target', '_blank');
                }

                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    void modalContent.offsetWidth;
                    modalContent.classList.add('modal-enter-active');
                    modalContent.classList.remove('modal-enter');
                }
            }
        });
    });

    const closeModal = () => {
        if (!modal) return;
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('modal-enter-active');
            modalContent.classList.add('modal-exit-active');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
            if (modalContent) modalContent.classList.remove('modal-exit-active');
            document.body.style.overflow = '';
        }, 250);
    };

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // ==========================================
    // 9. FORMULARIO DE CONTACTO CON BACKEND API
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !phone || !message) {
                alert('Por favor, completa todos los campos requeridos para coordinar la consultoría.');
                return;
            }

            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico corporativo válido.');
                if (emailInput) emailInput.focus();
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn ? submitBtn.innerHTML : 'Enviar';
            if (submitBtn) {
                submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem;"><svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg> Procesando solicitud...</span>';
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, message }),
                });

                if (response.ok) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        formSuccess.classList.remove('hidden');
                        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    const data = await response.json().catch(() => ({}));
                    alert(data.error || 'Hubo un inconveniente al enviar el mensaje. Por favor contáctanos directamente a WhatsApp: +593 999 340 807.');
                }
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                alert('Error de conexión. Puedes escribirnos directamente por WhatsApp al +593 999 340 807.');
            } finally {
                if (submitBtn) {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});
