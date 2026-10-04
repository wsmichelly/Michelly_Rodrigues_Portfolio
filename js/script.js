document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAccordions();
  initPhysicsCanvas();
});

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl = document.documentElement;

  if (!themeToggleBtn || !themeIcon) return;

  themeToggleBtn.addEventListener('click', () => {
    const isDark = htmlEl.classList.contains('dark');
    
    if (isDark) {
      htmlEl.classList.remove('dark');
      htmlEl.classList.add('light');
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      htmlEl.classList.remove('light');
      htmlEl.classList.add('dark');
      themeIcon.className = 'fa-solid fa-moon';
    }
  });
}

function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha todos os itens abertos
      accordionItems.forEach(el => el.classList.remove('active'));
      
      // Alterna o estado do item clicado
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

function initPhysicsCanvas() {
  const container = document.getElementById('physicsContainer');
  if (!container || typeof Matter === 'undefined') return;

  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Criando o motor físico
  const engine = Engine.create();
  engine.world.gravity.y = 0.8;

  // Configurando o renderizador do canvas
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: 'transparent'
    }
  });

  // Criando barreiras de colisão (chão e paredes laterais)
  const ground = Bodies.rectangle(width / 2, height + 20, width * 2, 40, { isStatic: true });
  const leftWall = Bodies.rectangle(-20, height / 2, 40, height * 2, { isStatic: true });
  const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height * 2, { isStatic: true });

  Composite.add(engine.world, [ground, leftWall, rightWall]);

  // Lista de tags de tecnologias
  const techTags = [
    'Python', 'JavaScript', 'SQL', 'Java', 'Diagramas UML', 
    'TOTVS', 'SAP', 'Scrum', 'HTML5', 'CSS3', 'Git', 'PostgreSQL'
  ];

  // Adicionando cada tecnologia como um corpo físico interativo
  techTags.forEach((tech, index) => {
    const x = Math.random() * Math.max(100, width - 100) + 50;
    const y = -index * 40 - 20;
    
    const tagBox = Bodies.rectangle(x, y, 110, 36, {
      chamfer: { radius: 18 },
      restitution: 0.6,
      friction: 0.1,
      render: {
        fillStyle: index % 2 === 0 ? '#8b5cf6' : '#3b82f6',
        text: {
          content: tech,
          color: '#ffffff',
          size: 13,
          family: 'Plus Jakarta Sans'
        }
      }
    });

    Composite.add(engine.world, tagBox);
  });

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Adicionando interação por arraste de mouse / toque
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // Renderizando os rótulos de texto centralizados nas tags físicas
  Events.on(render, 'afterRender', () => {
    const context = render.context;
    const bodies = Composite.allBodies(engine.world);

    bodies.forEach(body => {
      if (body.render && body.render.text) {
        const { content, color, size, family } = body.render.text;
        context.font = `600 ${size}px ${family}`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(content, body.position.x, body.position.y);
      }
    });
  });
}