/**
 * GOAL Product Framework - LocalStorage & State Manager
 */

const AppStorage = (function () {
    const STORAGE_KEY = 'HANG_PF_COURSE_STATE';
    const SESSION_KEY = 'HANG_PF_SESSION_TOKEN';

    const defaultState = {
        userProjectName: '',
        lastSavedAt: null,
        notes: {
            global: '',
            intro: '',
            ground: '',
            objectives: '',
            assumptions: '',
            learn: ''
        },
        groundData: {
            selectedBreakpoint: 'Collaboration',
            breakpointReason: ''
        },
        objectivesData: {
            businessObjective: 'Engagement',
            productOutput: '',
            targetUser: '',
            userPainPoint: '',
            productForm: '',
            desiredBehavior: '',
            productObjective: ''
        },
        assumptionsData: {
            valueAssumptions: '',
            usabilityAssumptions: '',
            feasibilityAssumptions: '',
            viabilityAssumptions: '',
            selectedKeyAssumption: '',
            validationMethod: 'Prototype',
            threshold: ''
        },
        learnData: {
            funnelAnalysis: '',
            decision: 'Improve',
            nextAction: ''
        }
    };

    /**
     * Load state from LocalStorage
     */
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...defaultState };
            const parsed = JSON.parse(raw);
            return { ...defaultState, ...parsed };
        } catch (e) {
            console.error('Failed to parse LocalStorage state', e);
            return { ...defaultState };
        }
    }

    /**
     * Save state to LocalStorage with timestamp
     */
    function saveState(state) {
        try {
            state.lastSavedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            showToast('已即時自動儲存至 LocalStorage');
        } catch (e) {
            console.error('Failed to save to LocalStorage', e);
        }
    }

    /**
     * Partial update helper
     */
    function updateState(partial) {
        const current = loadState();
        const updated = { ...current, ...partial };
        saveState(updated);
        return updated;
    }

    /**
     * Session Authentication Token
     */
    function isSessionAuthenticated() {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    }

    function setSessionAuthenticated(value = true) {
        if (value) {
            sessionStorage.setItem(SESSION_KEY, 'true');
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }

    /**
     * Show subtle auto-save toast notification
     */
    let toastTimeout;
    function showToast(message) {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'app-toast';
            toast.className = 'app-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = '✓ ' + message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    /**
     * Export state as JSON
     */
    function exportJSON() {
        const state = loadState();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `GOAL_Course_Workbook_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    /**
     * Export state as Markdown
     */
    function exportMarkdown() {
        const s = loadState();
        const md = `# 產品思維 (GOAL Framework) 學員個人實作與學習手冊

**專案名稱**：${s.userProjectName || '未填寫'}  
**紀錄時間**：${s.lastSavedAt ? new Date(s.lastSavedAt).toLocaleString('zh-TW') : '無'}

---

## 模組一｜Ground 產品工作診斷
* **選定痛點面向**：${s.groundData.selectedBreakpoint || '未填寫'}
* **診斷原因與影響**：${s.groundData.breakpointReason || '未填寫'}

---

## 模組二｜Objectives 成果導向產品目標
* **選定 Business Objective**：${s.objectivesData.businessObjective || '未填寫'}
* **我們提供 (Output)**：${s.objectivesData.productOutput || '未填寫'}
* **給 (目標使用者)**：${s.objectivesData.targetUser || '未填寫'}
* **解決的問題 (痛點)**：${s.objectivesData.userPainPoint || '未填寫'}
* **方案形態 (載體)**：${s.objectivesData.productForm || '未填寫'}
* **期望行為改變**：${s.objectivesData.desiredBehavior || '未填寫'}
* **產品目標與願景聲明 (兩段式)**：
  > ${s.objectivesData.productObjective || '未填寫'}

---

## 模組三｜Assumptions 關鍵假設與驗證卡
* **Value 假設**：${s.assumptionsData.valueAssumptions || '未填寫'}
* **Usability 假設**：${s.assumptionsData.usabilityAssumptions || '未填寫'}
* **Feasibility 假設**：${s.assumptionsData.feasibilityAssumptions || '未填寫'}
* **Viability 假設**：${s.assumptionsData.viabilityAssumptions || '未填寫'}
* **最優先關鍵假設**：${s.assumptionsData.selectedKeyAssumption || '未填寫'}
* **選用驗證方式**：${s.assumptionsData.validationMethod || '未填寫'}
* **判斷標準與門檻**：${s.assumptionsData.threshold || '未填寫'}

---

## 模組四｜Learn 學習循環與行動卡
* **漏斗觀察與洞察**：${s.learnData.funnelAnalysis || '未填寫'}
* **下一步產品決策**：${s.learnData.decision || '未填寫'}
* **未來兩週行動承諾**：
  > ${s.learnData.nextAction || '未填寫'}

---

## 個人學習筆記
${s.notes.global ? `### 全域通用筆記\n${s.notes.global}\n` : ''}
${s.notes.ground ? `### 模組一筆記\n${s.notes.ground}\n` : ''}
${s.notes.objectives ? `### 模組二筆記\n${s.notes.objectives}\n` : ''}
${s.notes.assumptions ? `### 模組三筆記\n${s.notes.assumptions}\n` : ''}
${s.notes.learn ? `### 模組四筆記\n${s.notes.learn}\n` : ''}
`;

        navigator.clipboard.writeText(md).then(() => {
            alert('已成功複製完整 Markdown 成果至剪貼簿！可直接貼入 Notion 或 Obsidian。');
        });
    }

    return {
        loadState,
        saveState,
        updateState,
        isSessionAuthenticated,
        setSessionAuthenticated,
        showToast,
        exportJSON,
        exportMarkdown
    };
})();
