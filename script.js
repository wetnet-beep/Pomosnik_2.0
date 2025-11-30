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

// Проверка при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const savedKey = localStorage.getItem('userKey');
    if (savedKey && validKeys.includes(savedKey)) {
        showMainMenu();
    }
});

function checkKey() {
    const keyInput = document.getElementById('keyInput');
    const keyMessage = document.getElementById('keyMessage');
    const key = keyInput.value.trim().toUpperCase();

    if (validKeys.includes(key)) {
        localStorage.setItem('userKey', key);
        keyMessage.textContent = "✅ Ключ активирован! Добро пожаловать!";
        keyMessage.style.color = "green";
        setTimeout(showMainMenu, 1000);
    } else {
        keyMessage.textContent = "❌ Неверный ключ. Попробуйте другой или свяжитесь с нами.";
        keyMessage.style.color = "red";
    }
}

function showMainMenu() {
    document.getElementById('keyScreen').classList.remove('active');
    document.getElementById('mainMenu').classList.add('active');
    showSection('solver');
    loadDiary();
    loadNotes();
}

function logout() {
    localStorage.removeItem('userKey');
    localStorage.removeItem('grades');
    localStorage.removeItem('notes');
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('keyScreen').classList.add('active');
    document.getElementById('keyInput').value = '';
    document.getElementById('keyMessage').textContent = '';
}

function showSection(sectionName) {
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

// Улучшенный решатель уравнений
function solveEquation() {
    const equation = document.getElementById('equationInput').value;
    const resultDiv = document.getElementById('solutionResult');
    
    if (!equation) {
        resultDiv.innerHTML = '<div class="error">❌ Введите уравнение</div>';
        return;
    }
    
    if (!equation.includes('=')) {
        resultDiv.innerHTML = '<div class="error">❌ Уравнение должно содержать знак "="</div>';
        return;
    }

    if (!equation.includes('x')) {
        resultDiv.innerHTML = '<div class="error">❌ Введите уравнение с переменной x</div>';
        return;
    }

    try {
        // Очищаем уравнение
        let eq = equation.replace(/\s/g, '').replace(/,/g, '.');
        
        // Разделяем на левую и правую части
        let [left, right] = eq.split('=');
        
        // Функция для вычисления выражения
        function evalSide(side) {
            // Временно заменяем x на 0 для вычисления констант
            let expr = side.replace(/x/g, '(0)');
            try {
                return eval(expr);
            } catch (e) {
                throw new Error('Неверный формат уравнения');
            }
        }
        
        // Функция для получения коэффициента при x
        function getXCoefficient(side) {
            let coeff = 0;
            let terms = side.match(/([+-]?[^-+]+)/g) || [side];
            
            for (let term of terms) {
                if (term.includes('x')) {
                    let cleanTerm = term.replace(/x/g, '');
                    if (cleanTerm === '' || cleanTerm === '+') {
                        coeff += 1;
                    } else if (cleanTerm === '-') {
                        coeff -= 1;
                    } else {
                        // Убираем * если есть
                        cleanTerm = cleanTerm.replace(/\*/g, '');
                        coeff += parseFloat(cleanTerm);
                    }
                }
            }
            return coeff;
        }
        
        // Вычисляем коэффициенты
        let leftXCoeff = getXCoefficient(left);
        let rightXCoeff = getXCoefficient(right);
        
        // Вычисляем константы
        let leftConst = evalSide(left.replace(/x/g, '0'));
        let rightConst = evalSide(right.replace(/x/g, '0'));
        
        // Переносим все x влево, константы вправо
        let totalXCoeff = leftXCoeff - rightXCoeff;
        let totalConst = rightConst - leftConst;
        
        if (totalXCoeff === 0) {
            if (totalConst === 0) {
                resultDiv.innerHTML = '<div class="success">✅ Уравнение имеет бесконечно много решений</div>';
            } else {
                resultDiv.innerHTML = '<div class="error">❌ Уравнение не имеет решений</div>';
            }
            return;
        }
        
        let solution = totalConst / totalXCoeff;
        
        // Форматируем вывод с шагами решения
        let steps = [];
        steps.push(`<strong>1. Исходное уравнение:</strong> ${equation}`);
        steps.push(`<strong>2. После преобразований:</strong> ${totalXCoeff}x = ${totalConst}`);
        steps.push(`<strong>3. Решение:</strong> x = ${totalConst} / ${totalXCoeff}`);
        steps.push(`<strong>4. Ответ:</strong> x = ${solution.toFixed(2)}`);
        
        resultDiv.innerHTML = `
            <div class="success">
                <h4>✅ Уравнение решено!</h4>
                <div class="solution-steps">
                    ${steps.map(step => `<p>${step}</p>`).join('')}
                </div>
            </div>
        `;
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// Дневник
let currentGradingSystem = '5';

function changeGradingSystem() {
    currentGradingSystem = document.getElementById('gradingSystem').value;
    const gradeInput = document.getElementById('gradeInput');
    
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
    
    document.getElementById('subjectName').value = '';
    document.getElementById('gradeInput').value = '';
    
    loadDiary();
}

function loadDiary() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const gradesList = document.getElementById('gradesList');
    const averageGrade = document.getElementById('averageGrade');
    
    gradesList.innerHTML = '';
    
    if (grades.length === 0) {
        gradesList.innerHTML = '<p>Оценок пока нет</p>';
        averageGrade.innerHTML = '';
        return;
    }
    
    const currentSystemGrades = grades.filter(g => g.system === currentGradingSystem);
    
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
}

function deleteGrade(index) {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    grades.splice(index, 1);
    localStorage.setItem('grades', JSON.stringify(grades));
    loadDiary();
}

// Памятки
function addNote() {
    const noteText = document.getElementById('noteText').value.trim();
    
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
    
    document.getElementById('noteText').value = '';
    loadNotes();
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');
    
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
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

// Обработчики Enter
document.getElementById('keyInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkKey();
});

document.getElementById('equationInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') solveEquation();
});

// Добавляем стили для решения уравнений
const style = document.createElement('style');
style.textContent = `
    .solution-steps {
        margin-top: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #48bb78;
    }
    .solution-steps p {
        margin: 8px 0;
        padding: 5px;
        border-bottom: 1px solid #e2e8f0;
    }
    .solution-steps p:last-child {
        border-bottom: none;
        font-weight: bold;
        color: #2d3748;
    }
    .success {
        color: #2d3748;
    }
    .error {
        color: #e53e3e;
    }
`;
document.head.appendChild(style);
