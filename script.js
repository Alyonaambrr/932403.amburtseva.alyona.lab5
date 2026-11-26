const userName = prompt("Введите ваше имя:");
const displayName = userName ? userName : "гость";
alert("Привет, " + displayName + "! Добро пожаловать на страницу предпринимателя.");

const revenues = [2500, 12000, 8000, 3000, 15000, 4500, 11000];
console.log("Массив выручки за неделю (₽):", revenues);

function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function filterHighRevenue(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 10000) {
            result.push(arr[i]);
        }
    }
    return result;
}

function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const totalRevenue = calculateSum(revenues);
const highRevenueDays = filterHighRevenue(revenues);
const highRevenueCount = highRevenueDays.length;
const maxRevenue = findMax(revenues);
const averageRevenue = Math.round(totalRevenue / revenues.length);

let lowRevenueCount = 0;
for (let i = 0; i < revenues.length; i++) {
    if (revenues[i] <= 3000) {
        lowRevenueCount++;
    }
}

const lowRevenueShare = Math.round((lowRevenueCount / revenues.length) * 100);

alert("Общая выручка – " + totalRevenue + " ₽, в " + highRevenueCount + " днях показатели были высокими.");

console.log("Дней с низкой выручкой (≤ 3 000 ₽): " + lowRevenueCount);
console.log("Доля дней с низкой выручкой: " + lowRevenueShare + "%");

if (averageRevenue < 5000) {
    console.log("Стоит проанализировать причины низкой выручки.");
} else {
    console.log("Средняя дневная выручка: " + averageRevenue + " ₽. Хороший результат!");
}

const STORAGE_KEY = 'entrepreneur_hypotheses_v1';
const THEME_KEY = 'entrepreneur_theme_v1';

const defaultHypotheses = [
    { text: 'Пользователи готовы платить за подписку на здоровое питание', status: 'checked' },
    { text: 'Геймификация повышает удержание в финансовом трекере', status: 'unchecked' },
    { text: 'Инвесторы доверяют прозрачному скорингу проектов', status: 'unchecked' },
    { text: 'Онлайн-курс с наставниками окупается за 3 месяца', status: 'checked' }
];

function loadHypotheses() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Ошибка чтения localStorage:', e);
    }
    return defaultHypotheses.slice();
}

function saveHypotheses(hypotheses) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hypotheses));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

function loadTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'theme-dark' || stored === 'theme-light') {
            return stored;
        }
    } catch (e) {
        console.error('Ошибка чтения темы:', e);
    }
    return 'theme-light';
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
        console.error('Ошибка сохранения темы:', e);
    }
}

function createHypothesisCard(hypothesis) {
    const card = document.createElement('article');
    card.className = 'hypothesis-card';
    card.dataset.status = hypothesis.status;

    const text = document.createElement('p');
    text.className = 'hypothesis-text';
    text.textContent = hypothesis.text;

    const status = document.createElement('span');
    status.className = 'hypothesis-status ' +
        (hypothesis.status === 'checked' ? 'status-checked' : 'status-unchecked');
    status.textContent = hypothesis.status === 'checked' ? 'Проверена' : 'Не проверена';

    const actions = document.createElement('div');
    actions.className = 'hypothesis-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-secondary';
    toggleBtn.textContent = 'Изменить статус';
    toggleBtn.addEventListener('click', function () {
        toggleStatus(card);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', function () {
        deleteHypothesis(card);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(text);
    card.appendChild(status);
    card.appendChild(actions);

    return card;
}

function renderHypotheses(hypotheses) {
    const container = document.getElementById('hypothesesContainer');
    if (!container) {
        console.error('Элемент не найден: #hypothesesContainer');
        return;
    }
    container.innerHTML = '';
    hypotheses.forEach(function (h) {
        container.appendChild(createHypothesisCard(h));
    });
}

function toggleStatus(card) {
    const statusSpan = card.querySelector('.hypothesis-status');
    if (!statusSpan) {
        console.error('Элемент не найден: .hypothesis-status');
        return;
    }
    const hypotheses = loadHypotheses();
    const text = card.querySelector('.hypothesis-text').textContent;
    const target = hypotheses.find(function (h) {
        return h.text === text;
    });
    if (!target) {
        console.error('Гипотеза не найдена в данных:', text);
        return;
    }
    target.status = target.status === 'checked' ? 'unchecked' : 'checked';
    saveHypotheses(hypotheses);
    card.dataset.status = target.status;
    statusSpan.classList.remove('status-checked', 'status-unchecked');
    statusSpan.classList.add(target.status === 'checked' ? 'status-checked' : 'status-unchecked');
    statusSpan.textContent = target.status === 'checked' ? 'Проверена' : 'Не проверена';
}

function deleteHypothesis(card) {
    const container = document.getElementById('hypothesesContainer');
    if (!container) {
        console.error('Элемент не найден: #hypothesesContainer');
        return;
    }
    const text = card.querySelector('.hypothesis-text').textContent;
    const hypotheses = loadHypotheses().filter(function (h) {
        return h.text !== text;
    });
    saveHypotheses(hypotheses);
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(function () {
        card.remove();
        const remaining = container.querySelectorAll('.hypothesis-card');
        console.log('Карточек в списке после удаления: ' + remaining.length);
    }, 300);
}

function addHypothesis() {
    const container = document.getElementById('hypothesesContainer');
    if (!container) {
        console.error('Элемент не найден: #hypothesesContainer');
        return;
    }
    const textInput = prompt('Введите формулировку гипотезы:');
    if (!textInput || !textInput.trim()) {
        alert('Формулировка не может быть пустой.');
        return;
    }
    const trimmed = textInput.trim();
    const existingTexts = container.querySelectorAll('.hypothesis-text');
    const isDuplicate = Array.prototype.some.call(existingTexts, function (el) {
        return el.textContent === trimmed;
    });
    if (isDuplicate) {
        alert('Такая гипотеза уже есть в списке.');
        return;
    }
    const hypotheses = loadHypotheses();
    hypotheses.push({ text: trimmed, status: 'unchecked' });
    saveHypotheses(hypotheses);
    renderHypotheses(hypotheses);
}

function toggleTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) {
        console.error('Элемент не найден: #themeToggleBtn');
        return;
    }
    const currentTheme = document.body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
    const newTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(newTheme);
    themeBtn.textContent = newTheme === 'theme-dark' ? 'Светлая тема' : 'Тёмная тема';
    saveTheme(newTheme);
}

function toggleHypothesesVisibility() {
    const section = document.getElementById('hypotheses');
    const toggleBtn = document.getElementById('toggleHypothesesBtn');
    if (!section) {
        console.error('Элемент не найден: #hypotheses');
        return;
    }
    if (!toggleBtn) {
        console.error('Элемент не найден: #toggleHypothesesBtn');
        return;
    }
    const isHidden = section.classList.contains('hidden');
    if (isHidden) {
        section.classList.remove('hidden');
        toggleBtn.textContent = 'Скрыть гипотезы';
    } else {
        section.classList.add('hidden');
        toggleBtn.textContent = 'Показать гипотезы';
    }
}

function init() {
    const addBtn = document.getElementById('addHypothesisBtn');
    const themeBtn = document.getElementById('themeToggleBtn');
    const toggleBtn = document.getElementById('toggleHypothesesBtn');

    if (!addBtn) console.error('Элемент не найден: #addHypothesisBtn');
    if (!themeBtn) console.error('Элемент не найден: #themeToggleBtn');
    if (!toggleBtn) console.error('Элемент не найден: #toggleHypothesesBtn');

    const savedTheme = loadTheme();
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(savedTheme);
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'theme-dark' ? 'Светлая тема' : 'Тёмная тема';
    }

    renderHypotheses(loadHypotheses());

    if (addBtn) addBtn.addEventListener('click', addHypothesis);
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleHypothesesVisibility);
}

document.addEventListener('DOMContentLoaded', init);