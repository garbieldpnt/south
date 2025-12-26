document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GESTION DE L'INTRO (OVERLAY)
    // ==========================================
    const overlay = document.getElementById('intro-overlay');
    
    if (overlay) {
        // On laisse l'animation tourner 2.5 secondes
        setTimeout(() => {
            // 1. On rend transparent
            overlay.style.opacity = '0';
            
            // 2. On retire du flux (display: none) après la transition CSS (0.5s)
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500); 
        }, 1500);
    }


    // ==========================================
    // 2. MENU BURGER & NAVIGATION
    // ==========================================
    const burger = document.getElementById('burger-trigger');
    const nav = document.getElementById('fullscreen-nav');
    const navItems = document.querySelectorAll('.nav-item');

    // Fonction pour ouvrir/fermer
    function toggleMenu() {
        if (!burger || !nav) return;

        burger.classList.toggle('active');
        nav.classList.toggle('open');
        
        // Bloquer le scroll du site quand le menu est ouvert
        if (nav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Clic sur le burger
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Clic sur un lien du menu (ferme le menu automatiquement)
    navItems.forEach(item => {
        item.addEventListener('click', toggleMenu);
    });


    // ==========================================
    // 3. BACKGROUND GÉNÉRATIF (CANVAS)
    // ==========================================
    const canvasContainer = document.getElementById('canvas-container');

    if (canvasContainer) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvasContainer.appendChild(canvas);

        let width, height;
        let particles = [];

        // CONFIGURATION DES PARTICULES
        const particleConfig = {
            count: 35,             // Nombre d'éléments
            color: '#db0d1e',      // Ta couleur rouge South Connexion
            minSize: 2,
            maxSize: 5,
            speed: 1.2             // Vitesse de défilement
        };

        // Redimensionnement du Canvas
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        // Classe Particule
        class Particle {
            constructor() {
                this.reset(true); // true = placement initial aléatoire sur tout l'écran
            }

            reset(initial = false) {
                // Si c'est le chargement initial, on les place partout
                // Sinon, on les replace juste en haut ou à gauche (hors champ)
                if (initial) {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                } else {
                    if (Math.random() > 0.5) {
                        this.x = Math.random() * width; // N'importe où en largeur
                        this.y = -50; // Au dessus de l'écran
                    } else {
                        this.x = -50; // À gauche de l'écran
                        this.y = Math.random() * height; // N'importe où en hauteur
                    }
                }
                
                this.size = Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize;
                this.speed = Math.random() * particleConfig.speed + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1; // Transparence variable
                
                // Longueur de la traînée (pour faire style "data flow")
                this.length = this.size * (Math.random() * 8 + 4); 
            }

            update() {
                // Mouvement diagonal (vers bas-droite)
                this.x += this.speed;
                this.y += this.speed;

                // Si la particule sort complètement de l'écran (bas ou droite), on la reset
                if (this.x > width + 50 || this.y > height + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 4); // Rotation 45 degrés
                
                ctx.fillStyle = particleConfig.color;
                ctx.globalAlpha = this.opacity;
                
                // Dessin du rectangle
                ctx.fillRect(0, 0, this.length, this.size);
                
                ctx.restore();
            }
        }

        // Initialisation des particules
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleConfig.count; i++) {
                particles.push(new Particle());
            }
        }

        // Boucle d'animation
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        }

        // Lancement
        window.addEventListener('resize', () => {
            resize();
            initParticles(); // On recrée les particules si on change la taille pour éviter les bugs
        });
        
        resize();
        initParticles();
        animate();
    }
});

// ==========================================
    // 4. COMPTE À REBOURS (COUNTDOWN)
    // ==========================================
    
    // --- CONFIGURATION : CHANGE LA DATE ICI ---
    // Format : "YYYY-MM-DDTHH:MM:00"
    const nextEventDate = new Date("2025-12-31T23:00:00").getTime(); 

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownContainer = document.getElementById("countdown-container");

    // Fonction qui ajoute un zéro devant les chiffres < 10 (ex: "05")
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    function updateCountdown() {
        if (!daysEl) return; // Sécurité si la section n'existe pas

        const now = new Date().getTime();
        const gap = nextEventDate - now;

        // Calculs mathématiques
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        if (gap > 0) {
            // Le calcul standard
            const d = Math.floor(gap / day);
            const h = Math.floor((gap % day) / hour);
            const m = Math.floor((gap % hour) / minute);
            const s = Math.floor((gap % minute) / second);

            // Mise à jour du HTML
            daysEl.innerText = formatTime(d);
            hoursEl.innerText = formatTime(h);
            minutesEl.innerText = formatTime(m);
            secondsEl.innerText = formatTime(s);
        } else {
            // SI L'ÉVÉNEMENT EST COMMENCÉ OU PASSÉ
            countdownContainer.innerHTML = "<h2 style='color:var(--accent-color); letter-spacing:5px;'>SYSTEM OVERLOADED <br> EVENT LIVE</h2>";
        }
    }

    // Lancer le timer si l'élément existe
    if (document.getElementById("timer")) {
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Appel immédiat pour éviter le délai d'une seconde
    }
