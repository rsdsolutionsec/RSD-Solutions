document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navbar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('mobile-menu');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('hidden');
        });
    }

    // Smooth Scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if(nav && !nav.classList.contains('hidden')) {
                    nav.classList.add('hidden');
                }
            }
        });
    });

    // Buttons that should scroll to CTA
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });
            if(nav && !nav.classList.contains('hidden')) {
                nav.classList.add('hidden');
            }
        });
    });

    const portfolioBtns = document.querySelectorAll('.portfolio-btn');
    portfolioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('#portafolio').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Portfolio Modal
    const modal = document.getElementById('portfolio-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalDemo = document.getElementById('modal-demo');

    const projects = [
        {
            title: "Sistema de Gestión para Restaurantes",
            desc: "Plataforma integral para la gestión de pedidos, inventario y facturación en tiempo real. Permite a los restaurantes optimizar sus operaciones diarias.",
            tech: "React, Node.js, PostgreSQL",
            demo: "#"
        },
        {
            title: "Plataforma de Automatización de Ventas",
            desc: "CRM personalizado con flujos de trabajo automatizados para equipos comerciales. Incluye seguimiento de leads y reportes avanzados.",
            tech: "Vue.js, Python, Django",
            demo: "#"
        },
        {
            title: "Software de Gestión Empresarial",
            desc: "ERP a medida para PYMES con módulos de contabilidad, recursos humanos y logística. Interfaz intuitiva y reportes en tiempo real.",
            tech: "Angular, Java, Spring Boot",
            demo: "#"
        }
    ];

    document.querySelectorAll('.ver-proyecto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            const project = projects[index];
            if(project) {
                modalTitle.textContent = project.title;
                modalDesc.textContent = project.desc;
                modalTech.textContent = project.tech;
                modalDemo.href = project.demo;
                
                modal.classList.remove('hidden');
                // trigger reflow
                void modal.offsetWidth;
                modal.querySelector('.modal-content').classList.add('modal-enter-active');
                modal.querySelector('.modal-content').classList.remove('modal-enter');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.querySelector('.modal-content').classList.remove('modal-enter-active');
            modal.querySelector('.modal-content').classList.add('modal-enter');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('bg-slate-900/60')) {
                modalClose.click();
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !phone || !message) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }

            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Simulate API call
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.add('opacity-100');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.remove('opacity-100');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
