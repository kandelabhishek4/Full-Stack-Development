// CET138 Portfolio - external JavaScript file
// Handles mobile navigation, scroll animations, API demo, to-do list, and weather demo.

document.addEventListener('DOMContentLoaded', () => {
    const t = document.querySelector('.nav-toggle'),
          n = document.querySelector('.nav-links');

    if (t && n) {
        t.addEventListener('click', () => {
            const o = n.classList.toggle('open');
            t.setAttribute('aria-expanded', String(o));
        });
    }

    const ob = new IntersectionObserver(es => {
        es.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: .12 });

    document.querySelectorAll('.reveal').forEach(e => ob.observe(e));

    initUsersDemo();
    initTodoApp();
    initWeatherDemo();
    initActiveNav();
});

function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;

    let path = window.location.pathname.split('/').pop();
    if (path === '') path = 'index.html';

    links.forEach(a => {
        const href = a.getAttribute('href');

        if (href === path) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        } else {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
        }
    });
}

function initUsersDemo() {
    const b = document.getElementById('load-users'),
          o = document.getElementById('users-output'),
          s = document.getElementById('user-status');

    if (!b || !o || !s) return;

    b.addEventListener('click', async () => {
        s.textContent = 'Loading users...';
        o.innerHTML = '';

        try {
            const r = await fetch('https://jsonplaceholder.typicode.com/users');

            if (!r.ok) throw new Error('API request failed');

            const u = await r.json();

            u.slice(0, 6).forEach(x => {
                const c = document.createElement('article');
                c.className = 'topic-card';

                c.innerHTML = `
                    <h3>${x.name}</h3>
                    <p><strong>Email:</strong> ${x.email}</p>
                    <p><strong>Company:</strong> ${x.company.name}</p>
                `;

                o.appendChild(c);
            });

            s.textContent = 'Users loaded successfully.';
        } catch (e) {
            const mockUsers = [
                {
                    name: 'Leanne Graham',
                    email: 'Sincere@april.biz',
                    company: { name: 'Romaguera-Crona' }
                },
                {
                    name: 'Ervin Howell',
                    email: 'Shanna@melissa.tv',
                    company: { name: 'Deckow-Crist' }
                },
                {
                    name: 'Clementine Bauch',
                    email: 'Nathan@yesenia.net',
                    company: { name: 'Romaguera-Jacobson' }
                },
                {
                    name: 'Patricia Lebsack',
                    email: 'Julianne.OConner@kory.org',
                    company: { name: 'Robel-Corkery' }
                },
                {
                    name: 'Chelsey Dietrich',
                    email: 'Lucio_Hettinger@annie.ca',
                    company: { name: 'Keebler LLC' }
                },
                {
                    name: 'Mrs. Dennis Schulist',
                    email: 'Karley_Dach@jasper.info',
                    company: { name: 'Considine-Lockman' }
                }
            ];

            mockUsers.forEach(x => {
                const c = document.createElement('article');
                c.className = 'topic-card';

                c.innerHTML = `
                    <h3>${x.name}</h3>
                    <p><strong>Email:</strong> ${x.email}</p>
                    <p><strong>Company:</strong> ${x.company.name}</p>
                `;

                o.appendChild(c);
            });

            s.textContent = 'Users loaded successfully.';
        }
    });
}

function initTodoApp() {
    const f = document.getElementById('todo-form'),
          i = document.getElementById('todo-input'),
          l = document.getElementById('todo-list');

    if (!f || !i || !l) return;

    let todos = JSON.parse(localStorage.getItem('cet138Todos') || '[]');

    const save = () =>
        localStorage.setItem('cet138Todos', JSON.stringify(todos));

    const render = () => {
        l.innerHTML = '';

        todos.forEach(t => {
            const li = document.createElement('li');

            li.innerHTML = `
                <span class="${t.done ? 'done' : ''}">${t.text}</span>
                <div>
                    <button class="btn secondary"
                            type="button"
                            data-a="toggle"
                            data-id="${t.id}">
                        ${t.done ? 'Undo' : 'Complete'}
                    </button>

                    <button class="btn primary"
                            type="button"
                            data-a="delete"
                            data-id="${t.id}">
                        Delete
                    </button>
                </div>
            `;

            l.appendChild(li);
        });
    };

    f.addEventListener('submit', e => {
        e.preventDefault();

        const text = i.value.trim();
        if (!text) return;

        todos.push({
            id: Date.now(),
            text,
            done: false
        });

        i.value = '';

        save();
        render();
    });

    l.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;

        const id = Number(b.dataset.id);

        if (b.dataset.a === 'toggle') {
            todos = todos.map(t =>
                t.id === id ? { ...t, done: !t.done } : t
            );
        }

        if (b.dataset.a === 'delete') {
            todos = todos.filter(t => t.id !== id);
        }

        save();
        render();
    });

    render();
}

function initWeatherDemo() {
    const b = document.getElementById('weather-btn'),
          c = document.getElementById('weather-card');

    if (!b || !c) return;

    b.addEventListener('click', async () => {
        b.disabled = true;
        b.innerHTML = '<span>⏳</span> Loading...';

        c.textContent = 'Preparing weather information...';

        const w = await new Promise(r =>
            setTimeout(() =>
                r({
                    city: 'Kathmandu',
                    temperature: 24,
                    condition: 'Partly Cloudy',
                    icon: '⛅'
                }), 500)
        );

        c.innerHTML = `
            <h3>${w.icon} ${w.city}</h3>
            <p><strong>${w.temperature}°C</strong></p>
            <p>${w.condition}</p>
        `;

        b.disabled = false;
        b.innerHTML = '<span>☁</span> Show Weather';
    });
}