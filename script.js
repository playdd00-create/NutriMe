

document.addEventListener('DOMContentLoaded', () => {

    loadUserData();

    loadMeals();

    setTimeout(() => {
        const progressCircle = document.querySelector('.progress-fill');
        const progressText = document.getElementById('progressPercent');
        
        if (progressCircle && progressText) {

            const targetProgress = parseInt(progressCircle.getAttribute('data-target-progress')) || 0;

            animateProgress(targetProgress);
        }
    }, 600);

    const hydrationFill = document.querySelector('.hydration-fill');
    if (hydrationFill) {
        setTimeout(() => {
            hydrationFill.style.width = '72%';
        }, 500);
    }

    updateGreeting();

    initScrollFade();

    initScrollAnimations();
});

function updateGreeting() {
    const greetingElement = document.querySelector('.large-title');
    const hours = new Date().getHours();
    
    let greeting = 'Доброе утро';
    
    if (hours >= 12 && hours < 18) {
        greeting = 'Добрый день';
    } else if (hours >= 18 && hours < 24) {
        greeting = 'Добрый вечер';
    } else if (hours >= 0 && hours < 6) {
        greeting = 'Доброй ночи';
    }
    
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

function initScrollFade() {
    const gradientFade = document.getElementById('gradientFade');
    
    window.addEventListener('scroll', () => {

        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 50) {
            if (gradientFade) gradientFade.classList.add('hidden');
        } else {
            if (gradientFade) gradientFade.classList.remove('hidden');
        }
    });
}

function initScrollAnimations() {

    const sections = document.querySelectorAll('.progress-card-large, .calories-card, .hydration-card, .activity-section, .quick-actions, .recent-meals, .activity-card, .action-button, .meal-item, .scanner-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('fade-in-visible')) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);
    
    sections.forEach((section, index) => {
        section.classList.add('fade-in-on-scroll');

        const rect = section.getBoundingClientRect();
        const isVisible = (
            rect.top < window.innerHeight && 
            rect.bottom >= 0
        );
        
        if (isVisible) {

            setTimeout(() => {
                section.classList.add('fade-in-visible');
            }, index * 60);
        } else {

            observer.observe(section);
        }
    });
}

const actionButtons = document.querySelectorAll('.action-button');
actionButtons.forEach(button => {
    button.addEventListener('click', function() {

        if (this.hasAttribute('onclick')) {
            return;
        }
        
        const action = this.querySelector('.action-text').textContent;
        handleQuickAction(action);
    });
});

function handleQuickAction(action) {

    console.log(`Действие: ${action}`);

    switch(action) {
        case 'Сканировать еду':
            openScanner();
            break;
        case 'Добавить блюдо':
            addMeal();
            break;
        case 'Добавить воду':
            addWater();
            break;
        case 'Добавить активность':
            addActivity();
            break;
    }
}

function openScanner() {
    alert('Функция сканера будет добавлена позже');

}

function addMeal() {
    openMealModal();
}

function addWater() {

    const hydrationText = document.querySelector('.hydration-text');
    const hydrationFill = document.querySelector('.hydration-fill');
    
    if (hydrationText && hydrationFill) {
        let currentValue = parseFloat(hydrationText.textContent);
        currentValue += 0.25;
        
        if (currentValue <= 2.5) {
            hydrationText.textContent = `${currentValue.toFixed(1)} л`;
            const percentage = (currentValue / 2.5) * 100;
            hydrationFill.style.width = `${percentage}%`;
        }
    }
}

function addActivity() {
    alert('Функция добавления активности будет добавлена позже');
}

const cameraButton = document.querySelector('.primary-button');
if (cameraButton) {
    cameraButton.addEventListener('click', openScanner);
}

function openWeightModal() {
    const modal = document.getElementById('weightModal');

    modal.style.display = 'flex';

    modal.offsetHeight;

    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    document.body.style.overflow = 'hidden';

    const startWeight = localStorage.getItem('startWeight') || 85;
    const currentWeight = parseInt(document.getElementById('currentWeight').textContent) || 82;
    const goalWeightText = document.getElementById('goalWeight').textContent;
    const goalWeight = parseInt(goalWeightText.replace('Цель: ', '').replace(' кг', '')) || 75;
    
    document.getElementById('inputStartWeight').value = startWeight;
    document.getElementById('inputCurrentWeight').value = currentWeight;
    document.getElementById('inputGoalWeight').value = goalWeight;
}

function closeWeightModal() {
    const modal = document.getElementById('weightModal');
    modal.classList.remove('active');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 350);
    
    document.body.style.overflow = '';
}

function saveWeight() {
    const startWeight = document.getElementById('inputStartWeight').value;
    const currentWeight = document.getElementById('inputCurrentWeight').value;
    const goalWeight = document.getElementById('inputGoalWeight').value;
    
    if (!startWeight || !currentWeight || !goalWeight) {
        showToast('Пожалуйста, заполните все поля');
        return;
    }
    
    const start = parseFloat(startWeight);
    const current = parseFloat(currentWeight);
    const goal = parseFloat(goalWeight);

    document.getElementById('currentWeight').textContent = current;
    document.getElementById('goalWeight').textContent = `Цель: ${goal} кг`;

    let displayProgress = 0;
    
    if (start > goal) {

        const totalToLose = start - goal;
        const alreadyLost = start - current;
        displayProgress = Math.round((alreadyLost / totalToLose) * 100);
        displayProgress = Math.max(0, Math.min(100, displayProgress));
        
        const remaining = current - goal;
        const remainingText = document.querySelector('.remaining-large');
        if (remainingText) {
            const remainingValue = Math.abs(remaining);
            const displayValue = remainingValue < 1 ? remainingValue.toFixed(1) : Math.round(remainingValue);
            remainingText.textContent = `До цели осталось ${displayValue} кг`;
        }
    } else {

        const totalToGain = goal - start;
        const alreadyGained = current - start;
        displayProgress = Math.round((alreadyGained / totalToGain) * 100);
        displayProgress = Math.max(0, Math.min(100, displayProgress));
        
        const remaining = goal - current;
        const remainingText = document.querySelector('.remaining-large');
        if (remainingText) {
            const remainingValue = Math.abs(remaining);
            const displayValue = remainingValue < 1 ? remainingValue.toFixed(1) : Math.round(remainingValue);
            remainingText.textContent = `До цели осталось ${displayValue} кг`;
        }
    }

    animateProgress(displayProgress);

    localStorage.setItem('startWeight', startWeight);
    localStorage.setItem('currentWeight', currentWeight);
    localStorage.setItem('goalWeight', goalWeight);
    
    closeWeightModal();
}

function animateProgress(targetProgress) {
    const progressCircle = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressPercent');
    const remainingText = document.querySelector('.remaining-large');
    
    if (!progressCircle || !progressText) return;
    
    const currentProgress = parseInt(progressText.textContent) || 0;

    progressCircle.style.setProperty('--progress', targetProgress);
    progressCircle.style.strokeDashoffset = 
        `calc(276.46 - (276.46 * ${targetProgress}) / 100)`;

    const savedStartWeight = parseFloat(localStorage.getItem('startWeight'));
    const savedCurrentWeight = parseFloat(localStorage.getItem('currentWeight'));
    const savedGoalWeight = parseFloat(localStorage.getItem('goalWeight'));
    
    let targetRemaining = 0;
    if (savedStartWeight && savedCurrentWeight && savedGoalWeight) {
        targetRemaining = Math.abs(savedCurrentWeight - savedGoalWeight);
    }

    const duration = 800;
    const steps = 40;
    const difference = targetProgress - currentProgress;
    const increment = difference / steps;
    const stepDuration = duration / steps;

    const remainingIncrement = targetRemaining / steps;
    let currentRemaining = 0;
    
    let progress = currentProgress;
    
    const counter = setInterval(() => {
        progress += increment;
        currentRemaining += remainingIncrement;
        
        if ((increment > 0 && progress >= targetProgress) || 
            (increment < 0 && progress <= targetProgress)) {
            progress = targetProgress;
            currentRemaining = targetRemaining;
            clearInterval(counter);

            if (targetProgress >= 100) {
                setTimeout(() => {
                    progressText.style.transition = 'opacity 0.5s ease-out';
                    progressText.style.opacity = '0';

                    const goalText = document.getElementById('goalWeight');
                    if (goalText) {
                        goalText.style.transition = 'opacity 0.5s ease-out';
                        goalText.style.opacity = '0';
                    }
                    if (remainingText) {
                        remainingText.style.transition = 'opacity 0.5s ease-out';
                        remainingText.style.opacity = '0';
                    }
                    
                    setTimeout(() => {
                        progressText.style.fontSize = '12px';
                        progressText.textContent = 'Достигнуто';
                        progressText.style.opacity = '1';
                    }, 500);
                }, 2000);
            } else {

                progressText.style.fontSize = '22px';
                const goalText = document.getElementById('goalWeight');
                if (goalText) {
                    goalText.style.opacity = '1';
                }
                if (remainingText) {
                    remainingText.style.opacity = '1';
                }
            }
        }
        
        progressText.textContent = Math.round(progress) + '%';

        if (remainingText && targetRemaining > 0) {
            const displayValue = currentRemaining < 1 ? currentRemaining.toFixed(1) : Math.round(currentRemaining);
            remainingText.textContent = `До цели осталось ${displayValue} кг`;
        }
    }, stepDuration);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');

        setTimeout(() => {
            e.target.style.display = 'none';
        }, 350);
        
        document.body.style.overflow = '';
    }
});

function loadUserData() {
    const savedStartWeight = localStorage.getItem('startWeight');
    const savedCurrentWeight = localStorage.getItem('currentWeight');
    const savedGoalWeight = localStorage.getItem('goalWeight');
    
    if (savedCurrentWeight) document.getElementById('currentWeight').textContent = savedCurrentWeight;
    if (savedGoalWeight) document.getElementById('goalWeight').textContent = `Цель: ${savedGoalWeight} кг`;

    const remainingText = document.querySelector('.remaining-large');
    if (remainingText) {
        remainingText.textContent = 'До цели осталось 0 кг';
    }

    if (savedStartWeight && savedCurrentWeight && savedGoalWeight) {
        const start = parseFloat(savedStartWeight);
        const current = parseFloat(savedCurrentWeight);
        const goal = parseFloat(savedGoalWeight);
        
        let displayProgress = 0;
        
        if (start > goal) {

            const totalToLose = start - goal;
            const alreadyLost = start - current;
            displayProgress = Math.round((alreadyLost / totalToLose) * 100);
            displayProgress = Math.max(0, Math.min(100, displayProgress));
        } else {

            const totalToGain = goal - start;
            const alreadyGained = current - start;
            displayProgress = Math.round((alreadyGained / totalToGain) * 100);
            displayProgress = Math.max(0, Math.min(100, displayProgress));
        }

        const progressCircle = document.querySelector('.progress-fill');
        if (progressCircle) {
            progressCircle.setAttribute('data-target-progress', displayProgress);
        }
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const mealItems = document.querySelectorAll('.meal-item');
mealItems.forEach(meal => {
    meal.addEventListener('click', function() {
        const mealName = this.querySelector('.body').textContent;
        console.log(`Открыть детали: ${mealName}`);

    });
});

function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', triggerHaptic);
});

function showToast(message) {

    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

function openMealModal() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'flex';
    modal.offsetHeight;
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    document.body.style.overflow = 'hidden';

    document.getElementById('inputMealName').value = '';
    document.getElementById('inputMealCalories').value = '';
    document.getElementById('inputMealPhoto').value = '';

    const photoPreview = document.getElementById('photoPreview');
    photoPreview.classList.remove('has-image');
    photoPreview.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 10V22M10 16H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="photo-upload-text">Добавить фото</span>
    `;
}

function previewMealPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoPreview = document.getElementById('photoPreview');
            photoPreview.classList.add('has-image');
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function closeMealModal() {
    const modal = document.getElementById('mealModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 350);
    document.body.style.overflow = '';
}

function saveMeal() {
    const mealName = document.getElementById('inputMealName').value.trim();
    const mealCalories = document.getElementById('inputMealCalories').value;
    const photoInput = document.getElementById('inputMealPhoto');
    
    if (!mealName || !mealCalories) {
        showToast('Пожалуйста, заполните все поля');
        return;
    }

    const calories = parseInt(mealCalories);
    if (isNaN(calories) || calories <= 0 || mealCalories.startsWith('0') || mealCalories.startsWith('-')) {
        showToast('Введите корректное количество калорий');
        return;
    }

    let photoDataUrl = null;
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoDataUrl = e.target.result;
            createAndSaveMeal(mealName, mealCalories, photoDataUrl);
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        createAndSaveMeal(mealName, mealCalories, null);
    }
}

function createAndSaveMeal(mealName, mealCalories, photoUrl) {

    const mealsList = document.getElementById('mealsList');
    const mealsListWrapper = document.getElementById('mealsListWrapper');
    const firstLetter = mealName.charAt(0).toUpperCase();
    
    const mealItem = document.createElement('div');
    mealItem.className = 'meal-item';

    const photoHTML = photoUrl 
        ? `<div class="meal-photo"><img src="${photoUrl}" alt="${mealName}"></div>`
        : `<div class="meal-photo">${firstLetter}</div>`;
    
    mealItem.innerHTML = `
        ${photoHTML}
        <div class="meal-info">
            <p class="body">${mealName}</p>
            <p class="caption">${mealCalories} ккал</p>
        </div>
    `;

    mealItem.addEventListener('click', function() {
        deleteMeal(this, 0);
    });

    mealsList.insertBefore(mealItem, mealsList.firstChild);

    saveMealToStorage(mealName, mealCalories, photoUrl);

    const allMealItems = document.querySelectorAll('.meal-item');
    const showMoreButton = document.getElementById('showMoreMeals');
    if (allMealItems.length > 3 && showMoreButton) {
        showMoreButton.style.display = 'block';

        if (mealsListWrapper.classList.contains('collapsed')) {
            let collapsedHeight = 0;
            for (let i = 0; i < Math.min(3, allMealItems.length); i++) {
                collapsedHeight += allMealItems[i].offsetHeight + 12;
            }
            mealsListWrapper.style.maxHeight = collapsedHeight + 'px';
        }
    }

    updateTotalCalories();
    
    closeMealModal();
}

function saveMealToStorage(name, calories, photoUrl) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    meals.unshift({ name, calories, photoUrl, date: new Date().toISOString() });

    if (meals.length > 10) {
        meals = meals.slice(0, 10);
    }
    
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMeals() {

    if (localStorage.getItem('meals') === null) {
        const demoMeals = [
            { name: 'Куриная грудка с овощами', calories: '450', photoUrl: null, date: new Date().toISOString() },
            { name: 'Овсянка с ягодами', calories: '320', photoUrl: null, date: new Date().toISOString() }
        ];
        localStorage.setItem('meals', JSON.stringify(demoMeals));
    }
    
    const meals = JSON.parse(localStorage.getItem('meals')) || [];
    const mealsList = document.getElementById('mealsList');
    const mealsListWrapper = document.getElementById('mealsListWrapper');
    
    if (meals.length === 0) return;

    mealsList.innerHTML = '';
    
    meals.forEach((meal, index) => {
        const firstLetter = meal.name.charAt(0).toUpperCase();
        const mealItem = document.createElement('div');
        mealItem.className = 'meal-item';
        mealItem.setAttribute('data-meal-index', index);

        const photoHTML = meal.photoUrl 
            ? `<div class="meal-photo"><img src="${meal.photoUrl}" alt="${meal.name}"></div>`
            : `<div class="meal-photo">${firstLetter}</div>`;
        
        mealItem.innerHTML = `
            ${photoHTML}
            <div class="meal-info">
                <p class="body">${meal.name}</p>
                <p class="caption">${meal.calories} ккал</p>
            </div>
        `;

        mealItem.addEventListener('click', function() {
            deleteMeal(this, index);
        });
        
        mealsList.appendChild(mealItem);
    });

    const showMoreButton = document.getElementById('showMoreMeals');
    if (meals.length > 3 && showMoreButton) {
        showMoreButton.style.display = 'block';

        mealsListWrapper.classList.add('collapsed');

        const mealItems = document.querySelectorAll('.meal-item');
        let collapsedHeight = 0;
        for (let i = 0; i < Math.min(3, mealItems.length); i++) {
            collapsedHeight += mealItems[i].offsetHeight + 12;
        }
        mealsListWrapper.style.maxHeight = collapsedHeight + 'px';
    }

    updateTotalCalories();
}

function toggleMealsList() {
    const mealItems = document.querySelectorAll('.meal-item');
    const showMoreButton = document.getElementById('showMoreMeals');
    const mealsListWrapper = document.getElementById('mealsListWrapper');
    
    if (mealsListWrapper.classList.contains('collapsed')) {

        showMoreButton.style.pointerEvents = 'none';

        mealsListWrapper.classList.remove('collapsed');
        mealsListWrapper.classList.add('expanded');

        const fullHeight = Array.from(mealItems).reduce((total, item) => {
            return total + item.offsetHeight + 12;
        }, 0);

        mealsListWrapper.style.maxHeight = fullHeight + 'px';

        showMoreButton.classList.add('expanded');
        
        setTimeout(() => {
            showMoreButton.style.pointerEvents = 'auto';
            mealsListWrapper.style.maxHeight = 'none';
        }, 600);
        
    } else {

        showMoreButton.style.pointerEvents = 'none';

        let collapsedHeight = 0;
        for (let i = 0; i < Math.min(3, mealItems.length); i++) {
            collapsedHeight += mealItems[i].offsetHeight + 12;
        }

        const currentHeight = mealsListWrapper.scrollHeight;
        mealsListWrapper.style.maxHeight = currentHeight + 'px';

        mealsListWrapper.offsetHeight;

        requestAnimationFrame(() => {
            mealsListWrapper.style.maxHeight = collapsedHeight + 'px';
        });

        mealsListWrapper.classList.remove('expanded');
        mealsListWrapper.classList.add('collapsed');

        showMoreButton.classList.remove('expanded');
        
        setTimeout(() => {
            showMoreButton.style.pointerEvents = 'auto';
        }, 600);
    }
}

function deleteMeal(mealElement, mealIndex) {

    if (mealElement.classList.contains('deleting')) return;
    
    mealElement.classList.add('deleting');
    
    const mealPhoto = mealElement.querySelector('.meal-photo');
    const hasImage = mealPhoto.querySelector('img');
    
    if (hasImage) {

        const img = mealPhoto.querySelector('img');

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'var(--accent)';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.35s ease-out';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '2';

        const checkmark = document.createElement('span');
        checkmark.style.display = 'inline-flex';
        checkmark.style.alignItems = 'center';
        checkmark.style.justifyContent = 'center';
        checkmark.style.transform = 'scale(0)';
        checkmark.style.opacity = '0';
        checkmark.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        checkmark.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: block;">
                <path d="M5 13L9 17L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        overlay.appendChild(checkmark);
        mealPhoto.appendChild(overlay);

        overlay.offsetHeight;

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        setTimeout(() => {
            checkmark.style.transform = 'scale(1)';
            checkmark.style.opacity = '1';
        }, 300);
        
    } else {

        const originalLetter = mealPhoto.textContent;
        
        const letterSpan = document.createElement('span');
        letterSpan.textContent = originalLetter;
        letterSpan.style.display = 'inline-block';
        letterSpan.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        mealPhoto.textContent = '';
        mealPhoto.appendChild(letterSpan);
        letterSpan.offsetHeight;
        
        letterSpan.style.transform = 'scale(0)';
        letterSpan.style.opacity = '0';
        
        setTimeout(() => {
            letterSpan.remove();
            const checkmark = document.createElement('span');
            checkmark.style.display = 'inline-flex';
            checkmark.style.alignItems = 'center';
            checkmark.style.justifyContent = 'center';
            checkmark.style.transform = 'scale(0)';
            checkmark.style.opacity = '0';
            checkmark.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            checkmark.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: block;">
                    <path d="M5 13L9 17L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            mealPhoto.appendChild(checkmark);
            checkmark.offsetHeight;
            
            requestAnimationFrame(() => {
                checkmark.style.transform = 'scale(1)';
                checkmark.style.opacity = '1';
            });
        }, 300);
    }

    setTimeout(() => {

        mealElement.style.maxHeight = mealElement.offsetHeight + 'px';
        mealElement.style.overflow = 'hidden';
        mealElement.style.transition = 'max-height 0.4s ease-out, opacity 0.4s ease-out, margin-bottom 0.4s ease-out, padding 0.4s ease-out';
        
        mealElement.offsetHeight;
        
        requestAnimationFrame(() => {
            mealElement.style.maxHeight = '0';
            mealElement.style.opacity = '0';
            mealElement.style.marginBottom = '0';
            mealElement.style.paddingTop = '0';
            mealElement.style.paddingBottom = '0';
        });

        setTimeout(() => {

            let meals = JSON.parse(localStorage.getItem('meals')) || [];
            meals.splice(mealIndex, 1);
            localStorage.setItem('meals', JSON.stringify(meals));

            mealElement.remove();

            updateTotalCalories();

            const remainingItems = document.querySelectorAll('.meal-item');
            const showMoreButton = document.getElementById('showMoreMeals');
            const mealsListWrapper = document.getElementById('mealsListWrapper');
            
            if (remainingItems.length <= 3 && showMoreButton) {
                showMoreButton.style.display = 'none';
                mealsListWrapper.classList.remove('collapsed', 'expanded');
                mealsListWrapper.style.maxHeight = 'none';
            } else if (mealsListWrapper.classList.contains('collapsed')) {

                let collapsedHeight = 0;
                for (let i = 0; i < Math.min(3, remainingItems.length); i++) {
                    collapsedHeight += remainingItems[i].offsetHeight + 12;
                }
                mealsListWrapper.style.maxHeight = collapsedHeight + 'px';
            }

            showToast('Блюдо удалено');
        }, 400);
    }, 800);
}

function updateTotalCalories() {
    const meals = JSON.parse(localStorage.getItem('meals')) || [];

    const today = new Date().toDateString();

    let totalCalories = 0;
    meals.forEach(meal => {
        const mealDate = new Date(meal.date).toDateString();
        if (mealDate === today) {
            totalCalories += parseInt(meal.calories);
        }
    });

    const caloriesNumber = document.querySelector('.big-number');
    if (caloriesNumber) {
        caloriesNumber.textContent = totalCalories;
    }

    const caloriesGoal = 2200;
    const caloriesProgressFill = document.querySelector('.calories-progress-fill');
    if (caloriesProgressFill) {
        const percentage = Math.min((totalCalories / caloriesGoal) * 100, 100);
        caloriesProgressFill.style.width = `${percentage}%`;
    }

    localStorage.setItem('totalCalories', totalCalories);
}

const navButtons = document.querySelectorAll('.nav-button');
const mainPage = document.getElementById('mainPage');
const settingsPage = document.getElementById('settingsPage');

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const page = this.getAttribute('data-page');

        navButtons.forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');

        if (page === 'main') {

            settingsPage.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            settingsPage.classList.remove('page-visible');
            settingsPage.classList.add('page-hidden');
            
            setTimeout(() => {
                settingsPage.style.display = 'none';
                mainPage.style.display = 'flex';
                mainPage.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

                reinitScrollAnimations();
                
                mainPage.classList.remove('page-hidden');
                mainPage.classList.add('page-visible');
            }, 300);
            
        } else if (page === 'settings') {

            mainPage.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            mainPage.classList.remove('page-visible');
            mainPage.classList.add('page-hidden');
            
            setTimeout(() => {
                mainPage.style.display = 'none';
                settingsPage.style.display = 'flex';

                const title = settingsPage.querySelector('.title');
                const cards = settingsPage.querySelectorAll('.settings-card');
                const sections = [title, ...cards].filter(el => el);
                
                sections.forEach(section => {
                    section.classList.remove('fade-in-visible');
                    section.classList.add('fade-in-on-scroll');
                });

                settingsPage.offsetHeight;

                settingsPage.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                settingsPage.classList.remove('page-hidden');
                settingsPage.classList.add('page-visible');

                sections.forEach((section, index) => {
                    setTimeout(() => {
                        section.classList.add('fade-in-visible');
                    }, index * 60);
                });
            }, 300);
            
        } else if (page === 'progress') {
            showToast('Страница "In progress" в разработке');
        }
    });
});

function reinitScrollAnimations() {

    const sections = mainPage.querySelectorAll('.progress-card-large, .calories-card, .hydration-card, .activity-section, .quick-actions, .recent-meals, .activity-card, .scanner-card');

    sections.forEach(section => {
        section.classList.remove('fade-in-visible');
        section.classList.add('fade-in-on-scroll');
    });

    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('fade-in-visible');
        }, index * 60);
    });
}

function reinitSettingsAnimations() {

    const title = settingsPage.querySelector('.title');
    const cards = settingsPage.querySelectorAll('.settings-card');
    
    const sections = [title, ...cards].filter(el => el);

    sections.forEach(section => {
        section.classList.remove('fade-in-visible');
        section.classList.add('fade-in-on-scroll');

        section.offsetHeight;
    });

    setTimeout(() => {

        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('fade-in-visible');
            }, index * 60);
        });
    }, 50);
}

const languageCustomSelect = document.getElementById('languageCustomSelect');
if (languageCustomSelect) {
    const trigger = languageCustomSelect.querySelector('.custom-select-trigger');
    const valueEl = languageCustomSelect.querySelector('.custom-select-value');
    const options = languageCustomSelect.querySelectorAll('.custom-select-option');

    const savedLanguage = localStorage.getItem('language') || 'ru';
    const savedOption = Array.from(options).find(opt => opt.dataset.value === savedLanguage);
    if (savedOption) {
        valueEl.textContent = savedOption.textContent;
        options.forEach(opt => opt.classList.remove('selected'));
        savedOption.classList.add('selected');
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        languageCustomSelect.classList.toggle('open');

        document.getElementById('themeCustomSelect')?.classList.remove('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;
            
            valueEl.textContent = text;
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            languageCustomSelect.classList.remove('open');

            applyLanguageWithFade(value);
        });
    });
}

const themeCustomSelect = document.getElementById('themeCustomSelect');
if (themeCustomSelect) {
    const trigger = themeCustomSelect.querySelector('.custom-select-trigger');
    const valueEl = themeCustomSelect.querySelector('.custom-select-value');
    const options = themeCustomSelect.querySelectorAll('.custom-select-option');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedOption = Array.from(options).find(opt => opt.dataset.value === savedTheme);
    if (savedOption) {
        valueEl.textContent = savedOption.textContent;
        options.forEach(opt => opt.classList.remove('selected'));
        savedOption.classList.add('selected');
    }
    applyTheme(savedTheme);

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        themeCustomSelect.classList.toggle('open');

        document.getElementById('languageCustomSelect')?.classList.remove('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;
            
            valueEl.textContent = text;
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            themeCustomSelect.classList.remove('open');
            
            localStorage.setItem('theme', value);
            applyTheme(value);

            const currentLang = localStorage.getItem('language') || 'ru';
            const message = currentLang === 'ru' ? 'Тема изменена' : 'Theme changed';
            showToast(message);
        });
    });
}

document.addEventListener('click', () => {
    document.getElementById('languageCustomSelect')?.classList.remove('open');
    document.getElementById('themeCustomSelect')?.classList.remove('open');
});

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.style.setProperty('--bg-primary', '#000000');
        document.documentElement.style.setProperty('--bg-card', '#1C1C1E');
        document.documentElement.style.setProperty('--text-primary', '#F5F5F7');
        document.documentElement.style.setProperty('--text-secondary', '#98989D');
        document.documentElement.style.setProperty('--divider', '#38383A');
        document.documentElement.style.setProperty('--nav-bg', 'rgba(0, 0, 0, 0.4)');
        document.documentElement.style.setProperty('--shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.3)');
        document.documentElement.style.setProperty('--shadow-md', '0 4px 16px rgba(0, 0, 0, 0.5)');
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#F5F5F7');
        document.documentElement.style.setProperty('--bg-card', '#FFFFFF');
        document.documentElement.style.setProperty('--text-primary', '#1D1D1F');
        document.documentElement.style.setProperty('--text-secondary', '#86868B');
        document.documentElement.style.setProperty('--divider', '#D2D2D7');
        document.documentElement.style.setProperty('--nav-bg', 'rgba(255, 255, 255, 0.7)');
        document.documentElement.style.setProperty('--shadow-sm', '0 2px 8px rgba(0, 0, 0, 0.04)');
        document.documentElement.style.setProperty('--shadow-md', '0 4px 16px rgba(0, 0, 0, 0.08)');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('language') || 'ru';
    applyLanguage(currentLang);
});

function applyLanguageWithFade(lang) {
    const app = document.querySelector('.app');
    if (!app) return;

    app.style.transition = 'opacity 0.3s ease-out';
    app.style.opacity = '0';

    setTimeout(() => {
        localStorage.setItem('language', lang);
        applyLanguage(lang);

        app.style.opacity = '1';

        setTimeout(() => {
            const message = lang === 'ru' ? 'Язык изменен' : 'Language changed';
            showToast(message);
        }, 300);
    }, 300);
}

function applyLanguage(lang) {
    const translations = {
        ru: {
            greeting: getGreetingRu(),
            subtitle: 'Сегодня вы на шаг ближе к цели',
            progress: 'ПРОГРЕСС',
            goal: 'Цель',
            remaining: 'До цели осталось',
            calories: 'Калории',
            from: 'из',
            kcal: 'ккал',
            hydration: 'Гидратация',
            activity: 'Активность',
            steps: 'Шаги',
            caloriesActivity: 'Калории',
            minutes: 'Минуты активности',
            min: 'мин',
            quickActions: 'Быстрые действия',
            scanFood: 'Сканировать еду',
            addMeal: 'Добавить блюдо',
            addWater: 'Добавить воду',
            addActivity: 'Добавить активность',
            recentMeals: 'Последние блюда',
            showMore: 'Показать еще',
            hide: 'Скрыть',
            scanTitle: 'Сканируйте еду',
            openCamera: 'Открыть камеру',
            navProgress: 'В процессе',
            navMain: 'Главная',
            navSettings: 'Настройки',
            settings: 'Настройки',
            language: 'Язык',
            languageDesc: 'Выберите язык интерфейса',
            theme: 'Тема',
            themeDesc: 'Выберите тему оформления',
            themeLight: 'Светлая',
            themeDark: 'Темная',
            auto: 'Авто',
            about: 'О приложении',
            appVersion: 'NutriMe v1.0'
        },
        en: {
            greeting: getGreetingEn(),
            subtitle: 'Today you are one step closer to your goal',
            progress: 'PROGRESS',
            goal: 'Goal',
            remaining: 'Remaining',
            calories: 'Calories',
            from: 'of',
            kcal: 'kcal',
            hydration: 'Hydration',
            activity: 'Activity',
            steps: 'Steps',
            caloriesActivity: 'Calories',
            minutes: 'Active minutes',
            min: 'min',
            quickActions: 'Quick Actions',
            scanFood: 'Scan food',
            addMeal: 'Add meal',
            addWater: 'Add water',
            addActivity: 'Add activity',
            recentMeals: 'Recent meals',
            showMore: 'Show more',
            hide: 'Hide',
            scanTitle: 'Scan your food',
            openCamera: 'Open camera',
            navProgress: 'In progress',
            navMain: 'Main',
            navSettings: 'Settings',
            settings: 'Settings',
            language: 'Language',
            languageDesc: 'Choose interface language',
            theme: 'Theme',
            themeDesc: 'Choose theme',
            themeLight: 'Light',
            themeDark: 'Dark',
            auto: 'Auto',
            about: 'About app',
            appVersion: 'NutriMe v1.0'
        }
    };
    
    const t = translations[lang] || translations.ru;

    const elements = {
        '.large-title': t.greeting,
        '.subtitle': t.subtitle,
        '.progress-card-large .card-label': t.progress,
        '.calories-card .headline': t.calories,
        '.hydration-card .headline': t.hydration,
        '.activity-section .title': t.activity,
        '.quick-actions .title': t.quickActions,
        '.recent-meals .title': t.recentMeals,
        '.scanner-card .headline': t.scanTitle,
        '.scanner-card .primary-button': t.openCamera,
        '#settingsPage .title': t.settings
    };
    
    for (const [selector, text] of Object.entries(elements)) {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    const actionButtons = document.querySelectorAll('.action-button .action-text');
    const actionTexts = [t.scanFood, t.addMeal, t.addWater, t.addActivity];
    actionButtons.forEach((btn, i) => {
        if (btn && actionTexts[i]) btn.textContent = actionTexts[i];
    });

    const activityCards = document.querySelectorAll('.activity-card .caption');
    const activityTexts = [t.steps, t.caloriesActivity, t.minutes];
    activityCards.forEach((card, i) => {
        if (card && activityTexts[i]) card.textContent = activityTexts[i];
    });

    const settingHeadlines = document.querySelectorAll('.setting-info .headline');
    const settingCaptions = document.querySelectorAll('.setting-info .caption');
    if (settingHeadlines[0]) settingHeadlines[0].textContent = t.language;
    if (settingCaptions[0]) settingCaptions[0].textContent = t.languageDesc;
    if (settingHeadlines[1]) settingHeadlines[1].textContent = t.theme;
    if (settingCaptions[1]) settingCaptions[1].textContent = t.themeDesc;
    if (settingHeadlines[2]) settingHeadlines[2].textContent = t.about;
    if (settingCaptions[2]) settingCaptions[2].textContent = t.appVersion;
    
    const themeIndicator = document.querySelector('.theme-indicator .caption');
    if (themeIndicator) themeIndicator.textContent = t.auto;

    const navButtons = document.querySelectorAll('.nav-button .nav-text');
    const navTexts = [t.navProgress, t.navMain, t.navSettings];
    navButtons.forEach((btn, i) => {
        if (btn && navTexts[i]) btn.textContent = navTexts[i];
    });
}

function getGreetingRu() {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) return 'Доброе утро';
    if (hours >= 12 && hours < 18) return 'Добрый день';
    if (hours >= 18 && hours < 23) return 'Добрый вечер';
    return 'Доброй ночи';
}

function getGreetingEn() {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) return 'Good morning';
    if (hours >= 12 && hours < 18) return 'Good afternoon';
    if (hours >= 18 && hours < 23) return 'Good evening';
    return 'Good night';
}
