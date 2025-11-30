// Ключи доступа (действительны 10 дней)
const validKeys = [
    'KpLxQmRf', 'YwGvMvbN', 'hqZcAdjX', 'sFgHPrTk',
    'LwBqnVmz', 'JhSpRcWk', 'yDaXLmUi', 'ZvNoQsCj',
    'TdKgBpHe', 'FqMnVyIw', 'PuAxCbRl', 'SjYfGhWv'
];

// Проверка ключа
function checkKey() {
    const keyInput = document.getElementById('key-input');
    const key = keyInput.value.trim();
    
    if (validKeys.includes(key)) {
        // Сохраняем время активации
        const activationTime = new Date().getTime();
        localStorage.setItem('app_key', key);
        localStorage.setItem('activation_time', activationTime);
        
        showApp();
    } else {
        alert('❌ Ключ не работает. Напишите в поддержку Telegram @west_next');
        keyInput.value = '';
        keyInput.focus();
    }
}

// Проверка срока действия ключа
function checkKeyValidity() {
    const activationTime = localStorage.getItem('activation_time');
    if (!activationTime) return false;
    
    const currentTime = new Date().getTime();
    const tenDays = 10 * 24 * 60 * 60 * 1000; // 10 дней в миллисекундах
    
    return (currentTime - parseInt(activationTime)) < tenDays;
}

// Защита от смены даты
function setupDateProtection() {
    const installTime = localStorage.getItem('install_time');
    if (!installTime) {
        localStorage.setItem('install_time', new Date().getTime().toString());
    }
    
    // Проверяем, не откатывалось ли время назад
    const lastCheck = parseInt(localStorage.getItem('last_time_check') || Date.now());
    const currentTime = Date.now();
    
    if (currentTime < lastCheck) {
        // Время было откачено назад - блокируем приложение
        localStorage.removeItem('app_key');
        localStorage.removeItem('activation_time');
        showAuth();
        alert('⚠️ Обнаружена попытка обхода защиты! Приложение заблокировано.');
        return;
    }
    
    localStorage.setItem('last_time_check', currentTime.toString());
}

// Показ экрана авторизации
function showAuth() {
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('auth-screen').classList.remove('hidden');
    
    document.getElementById('app-screen').classList.remove('active');
    document.getElementById('app-screen').classList.add('hidden');
    
    // Очищаем поле ввода
    document.getElementById('key-input').value = '';
}

// Показ основного приложения
function showApp() {
    if (!checkKeyValidity()) {
        localStorage.removeItem('app_key');
        localStorage.removeItem('activation_time');
        showAuth();
        alert('⏰ Срок действия ключа истек! Купите новый ключ.');
        return;
    }
    
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('hidden');
    
    document.getElementById('app-screen').classList.add('active');
    document.getElementById('app-screen').classList.remove('hidden');
    
    // Загружаем данные
    loadDiary();
    loadNotes();
}

// Выход из приложения
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('app_key');
        localStorage.removeItem('activation_time');
        showAuth();
    }
}

// Переключение вкладок
function switchTab(tabName) {
    // Скрываем все вкладки и контент
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
    
    // Показываем выбранную вкладку
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Решение уравнений
function solveEquation() {
    const equationInput = document.getElementById('equation').value.trim();
    const solutionDiv = document.getElementById('solution');
    
    if (!equationInput) {
        solutionDiv.innerHTML = '<div class="error">Введите уравнение</div>';
        return;
    }
    
    try {
        let solution = '';
        
        if (equationInput.includes('x')) {
            const parts = equationInput.split('=');
            if (parts.length === 2) {
                const left = parts[0].trim();
                const right = parts[1].trim();
                
                if (left.includes('x')) {
                    let coeff = 1;
                    let constant = 0;
                    
                    // Простой парсинг уравнений
                    if (left.includes('+')) {
                        const leftParts = left.split('+');
                        coeff = parseFloat(leftParts[0].replace('x', '')) || 1;
                        constant = parseFloat(leftParts[1]) || 0;
                    } else if (left.includes('-')) {
                        const leftParts = left.split('-');
                        coeff = parseFloat(leftParts[0].replace('x', '')) || 1;
                        constant = -parseFloat(leftParts[1]) || 0;
                    } else {
                        coeff = parseFloat(left.replace('x', '')) || 1;
                    }
                    
                    const rightValue = parseFloat(right);
                    const xValue = (rightValue - constant) / coeff;
                    
                    solution = `
                        <div class="success">
                            <h4>✅ Уравнение решено!</h4>
                            <p><strong>Уравнение:</strong> ${equationInput}</p>
                            <p><strong>Шаг 1:</strong> ${coeff}x = ${rightValue} ${constant > 0 ? `- ${constant}` : `+ ${-constant}`}</p>
                            <p><strong>Шаг 2:</strong> ${coeff}x = ${rightValue - constant}</p>
                            <p><strong>Шаг 3:</strong> x = ${rightValue - constant} / ${coeff}</p>
                            <p><strong>Ответ: x = ${xValue}</strong></p>
                        </div>
                    `;
                }
            }
        }
        
        if (!solution) {
            solution = '<div class="error">❌ Не удалось решить уравнение. Проверьте формат (пример: 2x+5=13)</div>';
        }
        
        solutionDiv.innerHTML = solution;
    } catch (error) {
        solutionDiv.innerHTML = '<div class="error">❌ Ошибка при решении уравнения</div>';
    }
}

// Переключение отображения правил
function toggleRules(subject) {
    const rulesContent = document.getElementById(`${subject}-rules`);
    rulesContent.classList.toggle('active');
}

// Дневник оценок
function addGrade() {
    const subject = document.getElementById('subject-select').value;
    const grade = parseInt(document.getElementById('grade-input').value);
    
    if (!grade || grade < 2 || grade > 5) {
        alert('Введите корректную оценку (от 2 до 5)');
        return;
    }
    
    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    grades.push({
        subject,
        grade,
        date: new Date().toLocaleDateString('ru-RU')
    });
    
    localStorage.setItem('grades', JSON.stringify(grades));
    document.getElementById('grade-input').value = '';
    loadDiary();
}

function loadDiary() {
    const grades = JSON.parse(localStorage.getItem('grades') || '[]');
    const gradesList = document.getElementById('grades-list');
    const averageGrade = document.getElementById('average-grade');
    
    if (grades.length === 0) {
        gradesList.innerHTML = '<p>📚 Оценок пока нет. Добавьте первую оценку!</p>';
        averageGrade.textContent = '-';
        return;
    }
    
    let html = '';
    let total = 0;
    
    // Группируем оценки по предметам для красивого отображения
    const subjects = {};
    grades.forEach(item => {
        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }
        subjects[item.subject].push(item);
    });
    
    Object.keys(subjects).forEach(subject => {
        const subjectGrades = subjects[subject];
        const subjectTotal = subjectGrades.reduce((sum, item) => sum + item.grade, 0);
        const subjectAverage = (subjectTotal / subjectGrades.length).toFixed(2);
        
        html += `
            <div class="subject-grades">
                <h4>${getSubjectName(subject)} (средний: ${subjectAverage})</h4>
        `;
        
        subjectGrades.forEach((item, index) => {
            total += item.grade;
            const globalIndex = grades.findIndex(grade => 
                grade.subject === item.subject && 
                grade.grade === item.grade && 
                grade.date === item.date
            );
            
            html += `
                <div class="grade-item">
                    <span class="grade-badge grade-${item.grade}">${item.grade}</span>
                    <span>${item.date}</span>
                    <button onclick="removeGrade(${globalIndex})" class="delete-btn">🗑️</button>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    gradesList.innerHTML = html;
    averageGrade.textContent = (total / grades.length).toFixed(2);
}

function removeGrade(index) {
    if (confirm('Удалить эту оценку?')) {
        const grades = JSON.parse(localStorage.getItem('grades') || '[]');
        grades.splice(index, 1);
        localStorage.setItem('grades', JSON.stringify(grades));
        loadDiary();
    }
}

function getSubjectName(subject) {
    const subjects = {
        'math': '📐 Математика',
        'russian': '📖 Русский язык',
        'history': '📜 История',
        'science': '🔬 Естествознание',
        'literature': '📚 Литература',
        'english': '🔤 Английский язык'
    };
    return subjects[subject] || subject;
}

// Памятки
function addNote() {
    const noteText = document.getElementById('note-text').value.trim();
    
    if (!noteText) {
        alert('Введите текст памятки');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push({
        text: noteText,
        date: new Date().toLocaleString('ru-RU')
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('note-text').value = '';
    loadNotes();
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const notesList = document.getElementById('notes-list');
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p>📝 Памяток пока нет. Создайте первую!</p>';
        return;
    }
    
    let html = '';
    
    notes.forEach((note, index) => {
        html += `
            <div class="note-item">
                <div class="note-content">
                    <p>${note.text}</p>
                    <small>📅 ${note.date}</small>
                </div>
                <button onclick="removeNote(${index})" class="delete-btn">🗑️ Удалить</button>
            </div>
        `;
    });
    
    notesList.innerHTML = html;
}

function removeNote(index) {
    if (confirm('Удалить эту памятку?')) {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setupDateProtection();
    
    const savedKey = localStorage.getItem('app_key');
    if (savedKey && validKeys.includes(savedKey) && checkKeyValidity()) {
        showApp();
    } else {
        showAuth();
    }
    
    // Устанавливаем интервал для проверки времени
    setInterval(setupDateProtection, 60000); // Проверка каждую минуту
    
    // Добавляем обработчик Enter в поле ввода ключа
    document.getElementById('key-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkKey();
        }
    });
    
    // Регистрация Service Worker для PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker зарегистрирован'))
            .catch(err => console.log('Ошибка регистрации Service Worker'));
    }
});