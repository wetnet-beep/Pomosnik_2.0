// Правильный решатель уравнений
function solveEquation() {
    const equation = document.getElementById('equationInput').value;
    const resultDiv = document.getElementById('solutionResult');
    
    console.log('Решаем уравнение:', equation);
    
    try {
        if (!equation.includes('=')) {
            resultDiv.innerHTML = '<div class="error">❌ Уравнение должно содержать знак "="</div>';
            return;
        }

        if (!equation.includes('x')) {
            resultDiv.innerHTML = '<div class="error">❌ Введите уравнение с переменной x</div>';
            return;
        }

        // Очищаем уравнение
        let eq = equation.replace(/\s/g, '').replace(/,/g, '.');
        
        // Разделяем на левую и правую части
        let [left, right] = eq.split('=');
        
        // Функция для ручного решения уравнения
        function solveManual(left, right) {
            let steps = [];
            steps.push(`<strong>1. Исходное уравнение:</strong> ${equation}`);
            
            // Вычисляем правую часть
            let rightValue = eval(right);
            steps.push(`<strong>2. Вычисляем правую часть:</strong> ${right} = ${rightValue}`);
            
            // Упрощаем левую часть шаг за шагом
            let currentLeft = left;
            let simplified = false;
            
            // Обрабатываем скобки
            if (currentLeft.includes('(') && currentLeft.includes(')')) {
                let beforeBracket = currentLeft.split('(')[0];
                let inBracket = currentLeft.match(/\(([^)]+)\)/)[1];
                let afterBracket = currentLeft.split(')')[1] || '';
                
                steps.push(`<strong>3. Раскрываем скобки:</strong> ${beforeBracket}(${inBracket})${afterBracket}`);
                
                // Если перед скобкой нет множителя, просто убираем скобки
                if (!beforeBracket || beforeBracket === '+' || beforeBracket === '-') {
                    currentLeft = beforeBracket + inBracket + afterBracket;
                } else {
                    // Если есть множитель, нужно распределить
                    currentLeft = beforeBracket + '*' + inBracket + afterBracket;
                }
                steps.push(`<strong>4. После раскрытия скобок:</strong> ${currentLeft}`);
            }
            
            // Вычисляем все числовые операции в левой части (кроме x)
            let leftWithoutX = currentLeft.replace(/x/g, '0');
            let leftConstant = eval(leftWithoutX);
            
            // Находим коэффициент при x
            let xCoefficient = 0;
            let xTerms = currentLeft.match(/([-+]?[\d.]*)x/g) || [];
            
            for (let term of xTerms) {
                let coeff = term.replace('x', '');
                if (coeff === '' || coeff === '+') xCoefficient += 1;
                else if (coeff === '-') xCoefficient -= 1;
                else xCoefficient += parseFloat(coeff);
            }
            
            steps.push(`<strong>5. Анализ левой части:</strong>`);
            steps.push(`&nbsp;&nbsp;- Коэффициент при x: ${xCoefficient}`);
            steps.push(`&nbsp;&nbsp;- Постоянная часть: ${leftConstant}`);
            
            // Уравнение: xCoefficient * x + leftConstant = rightValue
            // => xCoefficient * x = rightValue - leftConstant
            // => x = (rightValue - leftConstant) / xCoefficient
            
            let xValue = (rightValue - leftConstant) / xCoefficient;
            
            steps.push(`<strong>6. Решение:</strong> ${xCoefficient}x + ${leftConstant} = ${rightValue}`);
            steps.push(`&nbsp;&nbsp;=> ${xCoefficient}x = ${rightValue} - ${leftConstant}`);
            steps.push(`&nbsp;&nbsp;=> ${xCoefficient}x = ${rightValue - leftConstant}`);
            steps.push(`&nbsp;&nbsp;=> x = ${rightValue - leftConstant} / ${xCoefficient}`);
            steps.push(`<strong>7. Ответ:</strong> x = ${xValue}`);
            
            return { steps, solution: xValue };
        }
        
        let result = solveManual(left, right);
        
        resultDiv.innerHTML = `
            <div class="success">
                <h4>✅ Уравнение решено правильно!</h4>
                <div class="solution-steps">
                    ${result.steps.map(step => `<p>${step}</p>`).join('')}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Ошибка при решении уравнения:', error);
        resultDiv.innerHTML = '<div class="error">❌ Ошибка при решении уравнения. Проверьте правильность ввода.</div>';
    }
        }
