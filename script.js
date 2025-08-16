window.addEventListener('load', () => {
    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    gsap.to(preloader, {
        opacity: 0,
        duration: 1,
        delay: 1.5,
        onComplete: () => preloader.style.display = 'none'
    });

    // --- Main Initializations ---
    initThreeJS();
    initCursor();
    initMagneticElements();
    initScrollAnimations();
    initIntroAnimation();
});

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.querySelector('.cursor');
    let mouseX = 0, mouseY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: () => {
            gsap.set(cursor, {
                left: mouseX,
                top: mouseY,
            });
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// --- Magnetic Elements ---
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic');
    const cursor = document.querySelector('.cursor');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = parseFloat(this.dataset.magneticStrength) || 30;

            gsap.to(this, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.8,
                ease: 'power4.out'
            });
        });

        el.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });

        el.addEventListener('mouseenter', () => {
             gsap.to(cursor, {
                width: 50,
                height: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
             gsap.to(cursor, {
                width: 25,
                height: 25,
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });
}

// --- Three.js 3D Background ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    camera.position.z = 5;

    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        shape.rotation.x += 0.001;
        shape.rotation.y += 0.001;

        // Mouse interaction
        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GSAP Scroll Animations ---
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // About section text reveal
    gsap.to(".split-text", {
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".about-section",
            start: "top center",
            end: "bottom center",
            scrub: 1,
        }
    });

    // Horizontal scroll for projects
    const projectsContainer = document.querySelector('.projects-container');
    const projects = gsap.utils.toArray('.project-card');
    gsap.to(projectsContainer, {
        x: () => -(projectsContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top top",
            end: () => "+=" + (projectsContainer.scrollWidth - window.innerWidth),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        }
    });

    // 3D Tilt for project cards
    projects.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = gsap.utils.mapRange(0, rect.height, -10, 10, y);
            const rotateY = gsap.utils.mapRange(0, rect.width, 10, -10, x);
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// --- GSAP Intro Animation ---
function initIntroAnimation() {
    const tl = gsap.timeline({ delay: 1.6 });
    tl.to('.hero-title span', {
        y: 0,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.1
    }).to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out'
    }, "-=1");
}
