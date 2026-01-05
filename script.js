/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        const toggleIcon = () => toggle.querySelector('i')

        const updateToggleState = (isOpen) => {
            const icon = toggleIcon()
            if(icon){
                if(isOpen){
                    icon.classList.remove('bx-menu')
                    icon.classList.add('bx-x')
                    toggle.setAttribute('aria-label','Close menu')
                    toggle.setAttribute('aria-expanded','true')
                }else{
                    icon.classList.remove('bx-x')
                    icon.classList.add('bx-menu')
                    toggle.setAttribute('aria-label','Open menu')
                    toggle.setAttribute('aria-expanded','false')
                }
            }
        }

        toggle.addEventListener('click', ()=>{
            const isOpen = nav.classList.toggle('show')
            updateToggleState(isOpen)
        })

        // support keyboard activation (Enter / Space)
        toggle.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
                e.preventDefault()
                const isOpen = nav.classList.toggle('show')
                updateToggleState(isOpen)
            }
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
    // reset toggle icon and aria state when a link is clicked
    const toggle = document.getElementById('nav-toggle')
    if(toggle){
        const icon = toggle.querySelector('i')
        if(icon){
            icon.classList.remove('bx-x')
            icon.classList.add('bx-menu')
        }
        toggle.setAttribute('aria-expanded','false')
        toggle.setAttribute('aria-label','Open menu')
    }
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/* ==================== PINK 3D GALAXY BACKGROUND ==================== */
// Creates a full-screen canvas and animates a simple 3D starfield with pink hues.
(function createPinkGalaxy(){
    // Respect reduced motion preference
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const canvas = document.createElement('canvas')
    canvas.id = 'galaxy-canvas'
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    // get hue from CSS variable if available
    const rootStyles = getComputedStyle(document.documentElement)
    const hue = (rootStyles.getPropertyValue('--hue-color') || '340').trim()
    const starColor = `hsl(${hue}, 95%, 75%)`

    let w = 0, h = 0, cx = 0, cy = 0
    let particles = []
    const PARTICLE_COUNT = 140
    let mouseX = 0, mouseY = 0, mx = 0, my = 0

    function resize(){
        w = window.innerWidth
        h = window.innerHeight
        cx = w / 2
        cy = h / 2
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function rand(min, max){ return Math.random() * (max - min) + min }

    function initParticles(){
        particles = []
        for(let i=0;i<PARTICLE_COUNT;i++){
            // position in a 3D space centered around (0,0)
            const x = rand(-cx, cx)
            const y = rand(-cy, cy)
            const z = rand(0.2, 1)
            const speed = rand(0.0006, 0.0022)
            const size = rand(0.6, 3.2)
            particles.push({x,y,z,speed,size,twinkle:Math.random()*Math.PI*2})
        }
    }

    function draw(){
        // soft background wash (semi-transparent so page bg shows through)
        ctx.clearRect(0,0,w,h)

        // subtle gradient to add depth
        const g = ctx.createRadialGradient(cx, cy, Math.min(w,h)*0.05, cx, cy, Math.max(w,h)*0.9)
        g.addColorStop(0, 'rgba(255,240,250,0.12)')
        g.addColorStop(1, 'rgba(255,230,245,0.03)')
        ctx.fillStyle = g
        ctx.fillRect(0,0,w,h)

        // update mouse lerp
        mx += (mouseX - mx) * 0.05
        my += (mouseY - my) * 0.05

        for(let i=0;i<particles.length;i++){
            const p = particles[i]

            // move particle towards camera by reducing z
            p.z -= p.speed
            if(p.z <= 0.03){
                // reset to far
                p.x = rand(-cx, cx)
                p.y = rand(-cy, cy)
                p.z = 1
                p.speed = rand(0.0006, 0.0022)
                p.size = rand(0.6, 3.2)
            }

            // parallax offset from mouse
            const ox = (mx - cx) * (0.002 + (1 - p.z) * 0.02)
            const oy = (my - cy) * (0.002 + (1 - p.z) * 0.02)

            // project 3D to 2D
            const sx = cx + (p.x + ox) / p.z
            const sy = cy + (p.y + oy) / p.z

            // size scales with depth
            const radius = p.size * (1.2 - p.z) * 1.6

            // twinkle
            const alpha = 0.35 + 0.65 * (1 - p.z) * Math.abs(Math.cos(p.twinkle + performance.now()*0.001 + i))

            // draw glow
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius*4)
            grad.addColorStop(0, `hsla(${hue},95%,85%,${Math.min(1, alpha)})`)
            grad.addColorStop(0.4, `hsla(${hue},90%,70%,${Math.min(0.6, alpha*0.8)})`)
            grad.addColorStop(1, `rgba(255,255,255,0)`) 
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(sx, sy, radius*4, 0, Math.PI*2)
            ctx.fill()

            // small core
            ctx.fillStyle = `hsla(${hue},95%,85%,${Math.min(1, alpha)})`
            ctx.beginPath()
            ctx.arc(sx, sy, Math.max(0.4, radius*0.5), 0, Math.PI*2)
            ctx.fill()

            // slowly increase twinkle phase
            p.twinkle += 0.01 + (1 - p.z) * 0.02
        }

        requestAnimationFrame(draw)
    }

    function onMouse(e){
        mouseX = e.clientX
        mouseY = e.clientY
    }

    function onTouch(e){
        if(e.touches && e.touches[0]){
            mouseX = e.touches[0].clientX
            mouseY = e.touches[0].clientY
        }
    }

    function start(){
        resize()
        initParticles()
        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', onMouse)
        window.addEventListener('touchmove', onTouch, {passive:true})
        requestAnimationFrame(draw)
    }

    // defer start until DOM is ready
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', start)
    }else{
        start()
    }

})();