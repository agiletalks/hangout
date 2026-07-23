/**
 * GOAL Product Framework - General Slide Navigation & Timer Engine
 * Zero dependencies, responsive, supports gestures and keyboard.
 */

const AppSlider = (function () {
    let currentSlide = 0;
    let slides = [];
    let wrapper = null;
    let prevBtn = null;
    let nextBtn = null;
    let slideCounter = null;
    let progressDots = null;
    let timerInterval = null;
    let remainingTime = 0;
    let activeTimerContainer = null;
    let wheelTimeout = null;

    /**
     * Initialize the slider for a page
     * @param {string} wrapperSelector - Selector for slides wrapper (.slides-wrapper)
     */
    function init(wrapperSelector) {
        wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;

        slides = wrapper.querySelectorAll('.slide-item');
        if (slides.length === 0) return;

        // Force slide-deck CSS layout on parent
        const deck = wrapper.parentElement;
        if (deck) {
            deck.classList.add('slide-deck');
        }

        // Initialize Controls
        setupControls();

        // Bind Navigation Events
        bindEvents();

        // Navigate to the saved or first slide
        goToSlide(0);
    }

    /**
     * Create or setup slide control buttons, dots and progress indicators
     */
    function setupControls() {
        // Try to find or create bottom control bar
        let controlsBar = document.querySelector('.slider-controls');
        if (!controlsBar) {
            controlsBar = document.createElement('div');
            controlsBar.className = 'slider-controls';
            controlsBar.innerHTML = `
                <div class="control-inner">
                    <button class="slide-nav-btn prev-slide-btn" aria-label="上一頁">◀</button>
                    <div class="slide-indicator">
                        <span class="slide-counter">1 / 1</span>
                        <div class="slide-dots"></div>
                    </div>
                    <button class="slide-nav-btn next-slide-btn" aria-label="下一頁">▶</button>
                </div>
            `;
            document.body.appendChild(controlsBar);
        }

        prevBtn = controlsBar.querySelector('.prev-slide-btn');
        nextBtn = controlsBar.querySelector('.next-slide-btn');
        slideCounter = controlsBar.querySelector('.slide-counter');
        progressDots = controlsBar.querySelector('.slide-dots');

        // Re-bind click event
        prevBtn.onclick = () => prev();
        nextBtn.onclick = () => next();

        // Render progress dots based on slide count
        progressDots.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = 'slide-dot';
            dot.onclick = () => goToSlide(idx);
            progressDots.appendChild(dot);
        });
    }

    /**
     * Switch to a specific slide by index
     * @param {number} index - target slide index
     */
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        // Clean up previous slide events
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active');
            stopTimer();
        }

        currentSlide = index;
        const currentSlideEl = slides[currentSlide];

        // Add active class
        currentSlideEl.classList.add('active');

        // Transform wrapper (horizontal slide)
        wrapper.style.transform = `translateX(-${currentSlide * 100}vw)`;

        // Update control states
        updateControlsState();

        // Initialize timer if required
        const timerDuration = currentSlideEl.getAttribute('data-timer');
        if (timerDuration) {
            startTimer(parseInt(timerDuration, 10), currentSlideEl);
        }

        // Auto focus inputs in active slide
        const firstInput = currentSlideEl.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 500);
        }
    }

    function next() {
        if (currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        } else {
            // If it is the last slide, check if there is a next module button
            const nextModuleBtn = slides[currentSlide].querySelector('.next-module-btn');
            if (nextModuleBtn) {
                nextModuleBtn.click();
            }
        }
    }

    function prev() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    /**
     * Update active states on buttons and progress indicators
     */
    function updateControlsState() {
        // Update Bottom Nav Counter
        if (slideCounter) {
            slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
        }

        // Update Dots
        if (progressDots) {
            const dots = progressDots.querySelectorAll('.slide-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Update Bottom Prev/Next button states
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
            prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        }
    }

    /**
     * Bind UI event listeners
     */
    function bindEvents() {
        // 1. Keyboard Controls
        document.onkeydown = function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return; // Don't slide while writing
            }
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                prev();
            }
        };

        // 2. Mouse Wheel Scroll (Throttled)
        window.addEventListener('wheel', (e) => {
            const activeCard = document.querySelector('.slide-item.active .slide-content');
            if (activeCard && activeCard.scrollHeight > activeCard.clientHeight) {
                // If cursor is inside a card that has overflow scroll, check if we're at boundary
                const isScrollingDown = e.deltaY > 0;
                const isScrollingUp = e.deltaY < 0;
                const scrollTop = activeCard.scrollTop;
                const scrollHeight = activeCard.scrollHeight;
                const clientHeight = activeCard.clientHeight;

                if (isScrollingDown && scrollTop + clientHeight < scrollHeight - 5) {
                    return; // Let user scroll card content down
                }
                if (isScrollingUp && scrollTop > 5) {
                    return; // Let user scroll card content up
                }
            }

            e.preventDefault();
            if (wheelTimeout) return;

            if (e.deltaY > 30) {
                next();
                triggerWheelLock();
            } else if (e.deltaY < -30) {
                prev();
                triggerWheelLock();
            }
        }, { passive: false });

        // 3. Touch Gestures (Swipe Left / Swipe Right)
        let touchStartX = 0;
        let touchStartY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Horizontal swipe must be larger than vertical shift to trigger
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
                if (diffX < 0) {
                    next();
                } else {
                    prev();
                }
            }
        }, { passive: true });
    }

    function triggerWheelLock() {
        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 800); // 800ms throttle to prevent double slide
    }

    /**
     * Start the countdown timer in active slide card
     * @param {number} minutes - time in minutes
     * @param {HTMLElement} container - container slide element
     */
    function startTimer(minutes, container) {
        stopTimer();

        timerSeconds = minutes * 60;
        remainingTime = timerSeconds;

        // Try to find/create timer element in current slide
        let timerWidget = container.querySelector('.slide-timer-widget');
        if (!timerWidget) {
            timerWidget = document.createElement('div');
            timerWidget.className = 'slide-timer-widget';
            // Insert after title or card header
            const header = container.querySelector('.card-header') || container.querySelector('h1, h2');
            if (header) {
                header.parentNode.insertBefore(timerWidget, header.nextSibling);
            } else {
                container.querySelector('.slide-content').prepend(timerWidget);
            }
        }

        activeTimerContainer = timerWidget;
        updateTimerUI();

        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerUI();

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                playTimerAlarm();
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (activeTimerContainer) {
            activeTimerContainer.classList.remove('finished');
        }
    }

    function updateTimerUI() {
        if (!activeTimerContainer) return;

        const m = Math.floor(remainingTime / 60);
        const s = remainingTime % 60;
        const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        const percent = (remainingTime / timerSeconds) * 100;

        activeTimerContainer.innerHTML = `
            <div class="timer-progress-bar" style="width: ${percent}%;"></div>
            <div class="timer-text-wrap">
                <span class="timer-icon">⏳</span>
                <span class="timer-label">實作倒數計時：</span>
                <span class="timer-digits">${timeStr}</span>
            </div>
        `;
    }

    function playTimerAlarm() {
        if (activeTimerContainer) {
            activeTimerContainer.classList.add('finished');
            activeTimerContainer.innerHTML = `
                <div class="timer-progress-bar finished" style="width: 100%;"></div>
                <div class="timer-text-wrap finished-text">
                    <span class="timer-icon">⏰</span>
                    <span class="timer-label" style="font-weight: bold;">時間到！請與同伴分享您的想法。</span>
                </div>
            `;
        }
    }

    return {
        init,
        goToSlide,
        next,
        prev,
        getCurrentIndex: () => currentSlide
    };
})();
