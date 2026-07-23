/**
 * GOAL Product Framework - Shared UI Components & Decryption Router
 */

const AppComponents = (function () {
    let decryptedPayload = null;

    /**
     * Initialize Header Navigation and Progress Bar
     */
    function renderHeader(currentModuleKey) {
        const header = document.getElementById('global-header');
        if (!header) return;

        const modules = [
            { key: 'intro', label: '開場', path: './index.html', percent: 0 },
            { key: 'ground', label: '1. Ground 產品全貌', path: './ground.html', percent: 25 },
            { key: 'objectives', label: '2. Objectives 成果目標', path: './objectives.html', percent: 50 },
            { key: 'assumptions', label: '3. Assumptions 驗證假設', path: './assumptions.html', percent: 75 },
            { key: 'learn', label: '4. Learn 產品閉環', path: './learn.html', percent: 100 }
        ];

        const activeModule = modules.find(m => m.key === currentModuleKey) || modules[0];

        header.innerHTML = `
            <div class="header-inner" style="height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px;">
                <div class="brand-title" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; color: var(--accent-blue); font-size: 1.15rem; letter-spacing: -0.01em;">GOAL Product Mindset</span>
                    <span class="brand-badge" style="background: var(--accent-blue); color: #FFF; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-left: 6px;">互動講義</span>
                </div>
                <button class="hamburger-btn" aria-label="打開目錄" style="background: transparent; border: none; font-size: 1.6rem; color: var(--accent-blue); cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); transition: background 0.2s;">
                    ☰
                </button>
            </div>
            <div class="progress-bar-wrap" style="height: 3px; background: rgba(0,0,0,0.05); width: 100%;">
                <div class="progress-bar-fill" style="height: 100%; background: var(--accent-blue); transition: width 0.3s ease; width: ${activeModule.percent}%;"></div>
            </div>
        `;

        // Render Menu Drawer Backdrop overlay
        let menuOverlay = document.getElementById('menu-drawer-overlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.id = 'menu-drawer-overlay';
            menuOverlay.className = 'menu-overlay-backdrop';
            menuOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.25); backdrop-filter: blur(2px); z-index: 1999; display: none;';
            document.body.appendChild(menuOverlay);
        }

        // Render Menu Drawer Sidebar
        let drawer = document.getElementById('menu-drawer');
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'menu-drawer';
            drawer.className = 'menu-drawer';
            document.body.appendChild(drawer);
        }

        drawer.innerHTML = `
            <div class="menu-drawer-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                <h3 style="color: var(--accent-indigo); font-size: 1.15rem; margin: 0; font-weight: 700;">📚 課程講義目錄</h3>
                <button class="menu-drawer-close" style="background: transparent; border: none; color: var(--text-muted); font-size: 1.8rem; cursor: pointer; line-height: 1; padding: 4px;">&times;</button>
            </div>
            <nav class="menu-nav" style="display: flex; flex-direction: column; gap: 8px;">
                ${modules.map(m => `
                    <a href="${m.path}" class="menu-nav-item ${m.key === currentModuleKey ? 'active' : ''}">
                        <span>${m.label}</span>
                        ${m.key === currentModuleKey ? '<span style="font-size: 0.95rem;">👉</span>' : ''}
                    </a>
                `).join('')}
                <div style="border-top: 1px dashed var(--border-color); margin-top: 16px; padding-top: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <a href="./export.html" class="menu-nav-item" style="background: rgba(0, 130, 64, 0.05); color: var(--accent-blue); display: flex; justify-content: space-between; align-items: center;">
                        <span>📊 學習成果與 PDF 匯出</span>
                        <span>➔</span>
                    </a>
                    <button id="download-all-slides-btn" class="menu-nav-item" style="width: 100%; border: 1px solid var(--border-color); font-family: inherit; font-size: 0.95rem; font-weight: 600; text-align: left; background: rgba(56, 189, 248, 0.05); color: var(--accent-indigo); display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-sizing: border-box; padding: 12px 16px;">
                        <span>📥 下載完整講義內容 (Markdown)</span>
                        <span>➔</span>
                    </button>
                    <a href="./handout.html" target="_blank" class="menu-nav-item" style="background: rgba(56, 189, 248, 0.05); color: var(--accent-indigo); display: flex; justify-content: space-between; align-items: center; text-decoration: none;">
                        <span>📥 下載完整講義內容 (PDF)</span>
                        <span>➔</span>
                    </a>
                </div>
            </nav>
        `;

        // Toggle logic
        const hamburgerBtn = header.querySelector('.hamburger-btn');
        const closeBtn = drawer.querySelector('.menu-drawer-close');

        function openMenu() {
            drawer.classList.add('open');
            menuOverlay.style.display = 'block';
        }

        function closeMenu() {
            drawer.classList.remove('open');
            menuOverlay.style.display = 'none';
        }

        hamburgerBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        const downloadBtn = drawer.querySelector('#download-all-slides-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadAllSlides);
        }
    }

    /**
     * Render Passcode Modal
     */
    function renderPasscodeModal(onSuccessCallback) {
        let overlay = document.getElementById('passcode-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'passcode-overlay';
            overlay.className = 'passcode-modal-overlay';
            overlay.innerHTML = `
                <div class="passcode-card">
                    <div class="passcode-icon">🔐</div>
                    <h2 class="passcode-title">請輸入課程解密密碼</h2>
                    <p class="passcode-desc">本課程講義已使用 AES-GCM 256-bit 加密保護。請輸入講師提供的上課密碼以解密內容。</p>
                    <div class="form-group">
                        <input type="password" id="passcode-input" class="form-control" placeholder="請輸入密碼 (預設 pf2026)" style="text-align: center; font-size: 1.1rem; letter-spacing: 2px;">
                        <div id="passcode-error-msg" class="passcode-error">密碼錯誤，請重新輸入</div>
                    </div>
                    <button id="passcode-submit-btn" class="btn btn-primary" style="width: 100%; justify-content: center;">
                        解密並進入講義 (Unlock)
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const input = document.getElementById('passcode-input');
        const submitBtn = document.getElementById('passcode-submit-btn');
        const errorMsg = document.getElementById('passcode-error-msg');

        async function handleUnlock() {
            const pwd = input.value.trim();
            if (!pwd) return;

            submitBtn.textContent = '⏳ 正在進行 AES-GCM 解密...';
            submitBtn.disabled = true;
            errorMsg.style.display = 'none';

            try {
                if (typeof ENCRYPTED_COURSE_PAYLOAD === 'undefined') {
                    throw new Error('未找不到加密講義數據庫。');
                }

                decryptedPayload = await AppCrypto.decryptObject(ENCRYPTED_COURSE_PAYLOAD, pwd);
                AppStorage.setSessionAuthenticated(true);
                sessionStorage.setItem('HANG_PF_PASSWORD', pwd); // Cache key for session
                overlay.style.display = 'none';
                
                if (typeof onSuccessCallback === 'function') {
                    onSuccessCallback(decryptedPayload);
                }
            } catch (err) {
                errorMsg.style.display = 'block';
                submitBtn.textContent = '解密並進入講義 (Unlock)';
                submitBtn.disabled = false;
            }
        }

        submitBtn.addEventListener('click', handleUnlock);
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleUnlock();
        });
    }

    /**
     * Require Session Password Verification & Render Page
     */
    async function initPage(moduleKey, pageRenderCallback) {
        renderHeader(moduleKey);
        initFloatingNotebook(moduleKey);

        const isAuth = AppStorage.isSessionAuthenticated();
        const cachedPwd = sessionStorage.getItem('HANG_PF_PASSWORD');

        if (isAuth && cachedPwd && typeof ENCRYPTED_COURSE_PAYLOAD !== 'undefined') {
            try {
                decryptedPayload = await AppCrypto.decryptObject(ENCRYPTED_COURSE_PAYLOAD, cachedPwd);
                pageRenderCallback(decryptedPayload);
                return;
            } catch (e) {
                AppStorage.setSessionAuthenticated(false);
            }
        }

        // Prompt Passcode Modal if not cached
        renderPasscodeModal((payload) => {
            pageRenderCallback(payload);
        });
    }

    /**
     * Floating Notebook Drawer Setup
     */
    function initFloatingNotebook(currentModuleKey) {
        let btn = document.getElementById('floating-note-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'floating-note-btn';
            btn.className = 'floating-note-btn';
            btn.innerHTML = `✏️ 隨手筆記`;
            document.body.appendChild(btn);
        }

        let drawer = document.getElementById('note-drawer');
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'note-drawer';
            drawer.className = 'note-drawer';
            drawer.innerHTML = `
                <div class="drawer-header">
                    <h3>📝 學員隨手筆記本</h3>
                    <button class="drawer-close" id="drawer-close-btn">&times;</button>
                </div>
                <div class="drawer-body">
                    <p style="font-size: 0.85rem; margin-bottom: 8px;">以下內容將自動同步儲存至 LocalStorage：</p>
                    <textarea id="drawer-note-input" class="drawer-textarea" placeholder="在這裡記錄上課觀點、疑問或討論收穫..."></textarea>
                </div>
            `;
            document.body.appendChild(drawer);
        }

        const noteInput = document.getElementById('drawer-note-input');
        const state = AppStorage.loadState();
        
        // Load note for current module or global
        noteInput.value = state.notes[currentModuleKey] || state.notes.global || '';

        // Auto save note debounced
        let saveTimeout;
        noteInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const s = AppStorage.loadState();
                s.notes[currentModuleKey] = noteInput.value;
                s.notes.global = noteInput.value;
                AppStorage.saveState(s);
            }, 600);
        });

        btn.addEventListener('click', () => drawer.classList.add('open'));
        document.getElementById('drawer-close-btn').addEventListener('click', () => drawer.classList.remove('open'));
    }

    /**
     * Download Markdown Handout of All slides
     */
    function downloadAllSlides() {
        if (!decryptedPayload) {
            alert('講義尚未解密，請先解密內容。');
            return;
        }

        let md = `# ${decryptedPayload.courseTitle || 'GOAL Product Framework'}\n`;
        md += `## ${decryptedPayload.subtitle || ''}\n\n`;
        md += `> ${decryptedPayload.passcodeHint || ''}\n\n---\n\n`;

        // 1. Intro
        if (decryptedPayload.intro) {
            const intro = decryptedPayload.intro;
            md += `## 📚 ${intro.title} (${intro.duration})\n\n`;
            md += `### 💡 核心學習點\n`;
            intro.teachingPoints.forEach(p => {
                md += `- ${p}\n`;
            });
            md += `\n`;
            if (intro.caseStudy) {
                md += `### 📝 核心案例：${intro.caseStudy.title}\n`;
                md += `**情境背景**:\n${intro.caseStudy.context}\n\n`;
                md += `**實際結果**:\n${intro.caseStudy.result}\n\n`;
                md += `**思考問題**:\n> ${intro.caseStudy.question}\n\n`;
            }
            if (intro.comparisonTable) {
                md += `### 📊 交付導向 vs 成果導向\n\n`;
                intro.comparisonTable.forEach(t => {
                    md += `#### ${t.type} (${t.focus})\n`;
                    t.items.forEach(item => {
                        md += `- ${item}\n`;
                    });
                    md += `\n`;
                });
            }
            md += `**📌 經典名言**:\n> *${intro.goldenQuote}*\n\n---\n\n`;
        }

        // 2. Ground
        if (decryptedPayload.ground) {
            const ground = decryptedPayload.ground;
            md += `## 📚 ${ground.title} (${ground.duration})\n\n`;
            md += `### 💡 核心學習點\n`;
            ground.teachingPoints.forEach(p => {
                md += `- ${p}\n`;
            });
            md += `\n`;
            if (ground.apom) {
                const ap = ground.apom;
                md += `### 🎯 APOM 組織評估系統\n`;
                md += `- **Strategy (戰略/價值)**: ${ap.strategy.join(', ')}\n`;
                md += `- **People (人才與文化)**: ${ap.people.join(', ')}\n`;
                md += `- **Structure (結構與流程)**: ${ap.structure.join(', ')}\n`;
                md += `- **Value Cycle (價值環)**: ${ap.valueCycle.join(', ')}\n`;
                md += `- **Approach**: ${ap.evidenceBased}\n\n`;
            }
            if (ground.productCanvas) {
                const pc = ground.productCanvas;
                md += `### 🚗 Product Canvas 實戰範例: ${pc.productName}\n`;
                md += `- **產品願景與目標**: ${pc.goal}\n`;
                md += `- **關鍵指標**: ${pc.metrics.join(', ')}\n`;
                md += `- **目標客群**: ${pc.targetGroup.join(', ')}\n`;
                md += `- **大圖景 (User Journey)**:\n  ${pc.bigPicture.map((x, i) => `${i+1}. ${x}`).join('\n  ')}\n`;
                md += `- **產品細節 (Features)**:\n  ${pc.productDetails.map(x => `  - ${x}`).join('\n')}\n\n`;
            }
            if (ground.impactMap) {
                const im = ground.impactMap;
                md += `### 🗺️ Impact Map 影響地圖範例\n`;
                md += `- **Why (核心目標)**: ${im.why}\n`;
                md += `- **Who (影響對象)**: ${im.who.join(', ')}\n`;
                md += `- **How (行為改變)**:\n`;
                for (const actor in im.how) {
                    md += `  - **${actor}**:\n`;
                    im.how[actor].forEach(h => {
                        md += `    - ${h}\n`;
                    });
                }
                md += `- **What (具體解法)**:\n`;
                for (const change in im.what) {
                    md += `  - **${change}**: ${im.what[change].join(', ')}\n`;
                }
                md += `\n`;
            }
            md += `---\n\n`;
        }

        // 3. Objectives
        if (decryptedPayload.objectives) {
            const obj = decryptedPayload.objectives;
            md += `## 📚 ${obj.title} (${obj.duration})\n\n`;
            md += `### 💡 核心學習點\n`;
            obj.teachingPoints.forEach(p => {
                md += `- ${p}\n`;
            });
            md += `\n`;
            if (obj.fourLevels) {
                md += `### 🎯 產品目標的四個層級\n\n`;
                md += `| 層級 | 核心問題 | 具體範例 |\n`;
                md += `| --- | --- | --- |\n`;
                obj.fourLevels.forEach(l => {
                    md += `| **${l.level}** | ${l.question} | ${l.example} |\n`;
                });
                md += `\n`;
            }
            if (obj.sevenObjectives) {
                md += `### 💎 七大商務目標 (Business Objectives)\n\n`;
                obj.sevenObjectives.forEach(o => {
                    md += `- **${o.name}**: ${o.desc}\n`;
                });
                md += `\n`;
            }
            md += `### 📝 成果導向目標公式與範例\n`;
            md += `**公式結構**:\n> ${obj.formula ? obj.formula.replace(/\\n/g, '\n> ') : ''}\n\n`;
            md += `**填寫範例**:\n> ${obj.formulaExample ? obj.formulaExample.replace(/\\n/g, '\n> ') : ''}\n\n`;
            if (obj.quiz) {
                md += `### 🧠 觀念挑戰：Output 還是 Outcome？\n\n`;
                md += `| 題目敘述 | 正確分類 |\n`;
                md += `| --- | --- |\n`;
                obj.quiz.forEach(q => {
                    md += `| ${q.text} | ${q.answer} |\n`;
                });
                md += `\n`;
            }
            md += `---\n\n`;
        }

        // 4. Assumptions
        if (decryptedPayload.assumptions) {
            const ass = decryptedPayload.assumptions;
            md += `## 📚 ${ass.title} (${ass.duration})\n\n`;
            md += `### 💡 核心學習點\n`;
            ass.teachingPoints.forEach(p => {
                md += `- ${p}\n`;
            });
            md += `\n`;
            if (ass.fourRisks) {
                md += `### ⚠️ 產品開發的四大關鍵風險\n\n`;
                ass.fourRisks.forEach(r => {
                    md += `- **${r.type}**: ${r.question}\n`;
                });
                md += `\n`;
            }
            if (ass.matrixGuide) {
                md += `### 🎯 2x2 假設評估象限指南\n\n`;
                ass.matrixGuide.forEach(m => {
                    md += `- **${m.quadrant}**:\n  ${m.action}\n`;
                });
                md += `\n`;
            }
            if (ass.validationMethods) {
                md += `### 🛠️ 關鍵假設驗證方法\n\n`;
                ass.validationMethods.forEach(v => {
                    md += `- **${v.name}**: ${v.fit}\n`;
                });
                md += `\n`;
            }
            md += `### 📝 實驗設計公式\n`;
            md += `> ${ass.experimentFormula || ''}\n\n`;
            md += `---\n\n`;
        }

        // 5. Learn
        if (decryptedPayload.learn) {
            const learn = decryptedPayload.learn;
            md += `## 📚 ${learn.title} (${learn.duration})\n\n`;
            md += `### 💡 核心學習點\n`;
            learn.teachingPoints.forEach(p => {
                md += `- ${p}\n`;
            });
            md += `\n`;
            if (learn.fourMetricLevels) {
                md += `### 📊 產品指標的四個層級\n\n`;
                md += `| 指標層級 | 關注焦點 | 具體範例 |\n`;
                md += `| --- | --- | --- |\n`;
                learn.fourMetricLevels.forEach(m => {
                    md += `| **${m.level}** | ${m.focus} | ${m.example} |\n`;
                });
                md += `\n`;
            }
            if (learn.simulatorData) {
                const sd = learn.simulatorData;
                md += `### 📈 數據模擬與學習案例\n`;
                md += `- **曝光數 (Impressions)**: ${sd.impressions}\n`;
                md += `- **點擊數 (Clicks)**: ${sd.clicks}\n`;
                md += `- **細節查看數 (Details Viewed)**: ${sd.detailsViewed}\n`;
                md += `- **註冊數 (Enrolled)**: ${sd.enrolled}\n`;
                md += `- **完成交易數 (Completed Transactions)**: ${sd.completedTransactions}\n`;
                md += `- **客服諮詢增長 (CS Inquiry Increase)**: ${sd.csInquiryIncrease}\n`;
                md += `- **質化訪談反饋**:\n  > ${sd.qualitativeFeedback}\n\n`;
            }
            if (learn.decisionTypes) {
                md += `### 🧭 四大後續產品決策\n\n`;
                learn.decisionTypes.forEach(d => {
                    md += `- **${d.name} (決策)**: ${d.condition}\n`;
                });
                md += `\n`;
            }
            if (learn.learningLoop) {
                md += `### 🔄 產品學習循環步驟\n\n`;
                learn.learningLoop.forEach(step => {
                    md += `- ${step}\n`;
                });
                md += `\n`;
            }
        }

        downloadMarkdown('GOAL-Framework-All-Slides.md', md);
    }

    function downloadMarkdown(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return {
        initPage
    };
})();
