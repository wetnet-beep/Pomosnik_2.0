// Список валидных ключей
const validKeys = [
    "SHK-A3B9-C2D8", "SHK-E5F7-G6H4", "SHK-J8K3-L9M2", "SHK-N4P6-Q7R5",
    "SHK-S9T2-U8V4", "SHK-W3X7-Y5Z6", "SHK-2A8B-4C9D", "SHK-6E3F-7G5H",
    "SHK-8J2K-9L3M", "SHK-5N7P-6Q4R", "SHK-3S8T-4U6V", "SHK-7W9X-2Y8Z",
    "SHK-B4C6-D8E2", "SHK-F9G3-H5J7", "SHK-K2L4-M6N8", "SHK-P7Q9-R3S5",
    "SHK-T8V2-W4X6", "SHK-Y7Z3-A5B9", "SHK-C8D4-E6F2", "SHK-G7H9-J3K5",
    "SHK-L6M8-N4P2", "SHK-Q5R7-S9T3", "SHK-V4W6-X8Y2", "SHK-Z5A7-B9C3",
    "SHK-D6E8-F4G2", "SHK-H7J9-K5L3", "SHK-M8N2-P6Q4", "SHK-R9S3-T5U7",
    "SHK-W4X6-Y8Z2", "SHK-A9B3-C5D7"
];

console.log('Скрипт загружен, валидные ключи:', validKeys);

// Проверка ключа при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, проверяем сохраненный ключ...');
    const savedKey = localStorage.getItem('userKey');
    console.log('Сохраненный ключ:', savedKey);
    
    if (savedKey && validKeys.includes(savedKey)) {
        console.log('Ключ валидный, показываем меню');
        showMainMenu();
    } else {
        console.log('Ключ не найден или невалидный, показываем экран ввода');
    }
});

function checkKey() {
    const keyInput = document.getElementById('keyInput');
    const keyMessage = document.getElementById('keyMessage');
    const key = keyInput.value.trim().toUpperCase();

    console.log('Проверяем ключ:', key);
    console.log('Валидные ключи:', validKeys);

    if (validKeys.includes(key)) {
        console.log('Ключ найден в списке!');
        // Сохраняем ключ в localStorage
        localStorage.setItem('userKey', key);
        keyMessage.textContent = "✅ Ключ активирован! Добро пожаловать!";
        keyMessage.style.color = "green";
        
        console.log('Ключ сохранен, переходим к меню через 1 секунду');
        
        // Показываем главное меню через секунду
        setTimeout(showMainMenu, 1000);
    } else {
        console.log('Ключ НЕ найден в списке!');
        keyMessage.textContent = "❌ Неверный ключ. Попробуйте другой или свяжитесь с нами.";
        keyMessage.style.color = "red";
    }
}

function showMainMenu() {
    console.log('Показываем главное меню...');
    document.getElementById('keyScreen').classList.remove('active');
    document.getElementById('mainMenu').classList.add('active');
    showSection('solver');
    loadDiary();
    loadNotes();
}

function logout() {
    console.log('Выход из системы...');
    localStorage.removeItem('userKey');
    localStorage.removeItem('grades');
    localStorage.removeItem('notes');
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('keyScreen').classList.add('active');
    document.getElementById('keyInput').value = '';
    document.getElementById('keyMessage').textContent = '';
}

function showSection(sectionName) {
    console.log('Переключаемся на секцию:', sectionName);
    
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    document.getElementById(sectionName).classList.add('active');
    
    // Активируем соответствующую кнопку
    event.target.classList.add('active');
}

// Решатель уравнений
function solveEquation() {
    const equation = document.getElementById('equationInput').value;
    const resultDiv = document.getElementById('solutionResult');
    
    console.log('Решаем уравнение:', equation);
    
    try {
        // Простой решатель линейных уравнений
        if (equation.includes('x')) {
            // Убираем пробелы и приводим к нижнему регистру
            let eq = equation.replace(/\s/g, '').toLowerCase();
            
            // Заменяем запятые на точки для десятичных чисел
            eq = eq.replace(/,/g, '.');
            
            // Простая логика для уравнений вида ax + b = c
            if (eq.includes('=')) {
                const sides = eq.split('=');
                let left = sides[0];
                let right = sides[1];
                
                let solution = "";
                
                // Простая логика решения
                if (left.includes('+')) {
                    const parts = left.split('+');
                    if (parts[0].includes('x')) {
                        const coeff = parseFloat(parts[0].replace('x', '')) || 1;
                        const constant = parseFloat(parts[1]) || 0;
                        const rightNum = parseFloat(right);
                        
                        if (!isNaN(coeff) && !isNaN(constant) && !isNaN(rightNum)) {
                            const xValue = (rightNum - constant) / coeff;
                            solution = `Решение: ${equation} → x = (${rightNum} - ${constant}) / ${coeff} = ${xValue.toFixed(2)}`;
                        } else {
                            solution = `Решение: ${equation} → x = ... (требуется ручное решение)`;
                        }
                    }
                } else if (left.includes('-')) {
                    const parts = left.split('-');
                    if (parts[0].includes('x')) {
                        const coeff = parseFloat(parts[0].replace('x', '')) || 1;
                        const constant = parseFloat(parts[1]) || 0;
                        const rightNum = parseFloat(right);
                        
                        if (!isNaN(coeff) && !isNaN(constant) && !isNaN(rightNum)) {
                            const xValue = (rightNum + constant) / coeff;
                            solution = `Решение: ${equation} → x = (${rightNum} + ${constant}) / ${coeff} = ${xValue.toFixed(2)}`;
                        } else {
                            solution = `Решение: ${equation} → x = ... (требуется ручное решение)`;
                        }
                    }
                } else {
                    // Простое уравнение вида ax = b
                    const coeff = parseFloat(left.replace('x', '')) || 1;
                    const rightNum = parseFloat(right);
                    
                    if (!isNaN(coeff) && !isNaN(rightNum)) {
                        const xValue = rightNum / coeff;
                        solution = `Решение: ${equation} → x = ${rightNum} / ${coeff} = ${xValue.toFixed(2)}`;
                    } else {
                        solution = `Решение: ${equation} → x = ... (требуется ручное решение)`;
                    }
                }
                
                resultDiv.innerHTML = `<div class="success">✅ ${solution}</div>`;
            } else {
                resultDiv.innerHTML = `<div class="error">❌ Уравнение должно содержать знак "="</div>`;
            }
        } else {
            resultDiv.innerHTML = `<div class="error">❌ Введите уравнение с переменной x</div>`;
        }
    } catch (error) {
        console.error('Ошибка при решении уравнения:', error);
        resultDiv.innerHTML = `<div class="error">❌ Ошибка при решении уравнения. Проверьте правильность ввода.</div>`;
    }
}

// Электронный дневник
let currentGradingSystem = '5';

function changeGradingSystem() {
    currentGradingSystem = document.getElementById('gradingSystem').value;
    const gradeInput = document.getElementById('gradeInput');
    
    console.log('Изменена система оценок на:', currentGradingSystem);
    
    if (currentGradingSystem === '5') {
        gradeInput.max = 5;
        gradeInput.placeholder = "Оценка (1-5)";
    } else {
        gradeInput.max = 10;
        gradeInput.placeholder = "Оценка (1-10)";
    }
    
    loadDiary();
}

function addGrade() {
    const subject = document.getElementById('subjectName').value.trim();
    const grade = document.getElementById('gradeInput').value;
    
    console.log('Добавляем оценку:', subject, grade);
    
    if (!subject || !grade) {
        alert('Введите название предмета и оценку');
        return;
    }
    
    const maxGrade = currentGradingSystem === '5' ? 5 : 10;
    if (grade < 1 || grade > maxGrade) {
        alert(`Оценка должна быть от 1 до ${maxGrade}`);
        return;
    }
    
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    grades.push({
        subject,
        grade: parseInt(grade),
        system: currentGradingSystem,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('grades', JSON.stringify(grades));
    console.log('Оценка сохранена, всего оценок:', grades.length);
    
    document.getElementById('subjectName').value = '';
    document.getElementById('gradeInput').value = '';
    
    loadDiary();
}

function loadDiary() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const gradesList = document.getElementById('gradesList');
    const averageGrade = document.getElementById('averageGrade');
    
    console.log('Загружаем дневник, оценок:', grades.length);
    
    gradesList.innerHTML = '';
    
    if (grades.length === 0) {
        gradesList.innerHTML = '<p>Оценок пока нет</p>';
        averageGrade.innerHTML = '';
        return;
    }
    
    const currentSystemGrades = grades.filter(g => g.system === currentGradingSystem);
    console.log('Оценок в текущей системе:', currentSystemGrades.length);
    
    if (currentSystemGrades.length === 0) {
        gradesList.innerHTML = '<p>Нет оценок для текущей системы</p>';
        averageGrade.innerHTML = '';
        return;
    }
    
    let total = 0;
    
    currentSystemGrades.forEach((gradeObj, index) => {
        total += gradeObj.grade;
        
        const gradeItem = document.createElement('div');
        gradeItem.className = 'grade-item';
        gradeItem.innerHTML = `
            <span>${gradeObj.subject}</span>
            <span>
                <strong>${gradeObj.grade}</strong>
                <button onclick="deleteGrade(${index})" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer;">🗑️</button>
            </span>
        `;
        gradesList.appendChild(gradeItem);
    });
    
    const average = (total / currentSystemGrades.length).toFixed(2);
    averageGrade.innerHTML = `Средний балл: <strong>${average}</strong>`;
    console.log('Средний балл:', average);
}

function deleteGrade(index) {
    console.log('Удаляем оценку с индексом:', index);
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    grades.splice(index, 1);
    localStorage.setItem('grades', JSON.stringify(grades));
    loadDiary();
}

// Памятки
function addNote() {
    const noteText = document.getElementById('noteText').value.trim();
    
    console.log('Добавляем памятку:', noteText);
    
    if (!noteText) {
        alert('Введите текст памятки');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({
        text: noteText,
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
    console.log('Памятка сохранена, всего памяток:', notes.length);
    
    document.getElementById('noteText').value = '';
    loadNotes();
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    
    console.log('Загружаем памятки, всего:', notes.length);
    
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p>Памяток пока нет</p>';
        return;
    }
    
    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <p>${note.text}</p>
            <small>${note.date}</small>
            <button onclick="deleteNote(${index})" style="float: right; color: red; border: none; background: none; cursor: pointer;">🗑️</button>
        `;
        notesList.appendChild(noteItem);
    });
}

function deleteNote(index) {
    console.log('Удаляем памятку с индексом:', index);
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// Добавляем обработчик Enter для поля ввода ключа
document.getElementById('keyInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkKey();
    }
});

// Добавляем обработчик Enter для поля уравнения
document.getElementById('equationInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        solveEquation();
    }
});

console.log('Скрипт полностью инициализирован');
