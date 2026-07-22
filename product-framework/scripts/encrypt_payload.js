const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const COURSE_DATA = {
  courseTitle: "產品工作術：建立數位團隊的產品思維 (GOAL Framework)",
  subtitle: "4 小時精準轉型：從交付導向 (Output) 到成果導向 (Outcome)",
  passcodeHint: "預設密碼為 pf2026",
  
  // 課程開場
  intro: {
    title: "課程開場｜從完成工作到創造成果",
    duration: "15 分鐘",
    teachingPoints: [
      "準時完成，不代表產品成功。",
      "功能上線，不代表使用者行為改變。",
      "產品團隊需要從交付導向 (Output-Driven) 轉向成果導向 (Outcome-Driven)。",
      "GOAL Framework 是一套連結方向、決策、執行與學習的敏捷產品思維。"
    ],
    caseStudy: {
      title: "核心案例：某數位金融團隊的「信用卡優惠推薦功能」",
      context: "某數位團隊花費六個月、耗資數百萬，開發完成線上信用卡優惠推薦功能：最終如期上線、預算完全符合預期、原定 12 項功能全面交付通過測試驗收。",
      result: "上線三個月後數據：網頁/App 優惠專區使用率不足 3%、客戶依然頻繁打電話進客服詢問優惠、80% 以上客戶不知道該功能存在。業務單位要求繼續增加更多優惠分類與訊息推播發送。",
      question: "請思考：這個產品專案算成功了嗎？為什麼？"
    },
    comparisonTable: [
      { type: "交付標準 (Output-Driven)", focus: "完成任務", items: ["是否準時上線？", "是否符合專案預算？", "原定規格功能是否交付？", "技術 QA 是否通過驗收？"] },
      { type: "成果標準 (Outcome-Driven)", focus: "創造改變", items: ["目標使用者是否真正採用？", "使用者遇到的痛點是否被改善？", "使用者行為是否發生期望改變？", "商業效益與價值是否真正出現？"] }
    ],
    goldenQuote: "Output 告訴我們團隊完成了什麼 (What we built)；Outcome 告訴我們完成之後，使用者與商務發生了什麼改變 (What changed)."
  },

  // 模組一：Ground
  ground: {
    title: "模組一｜Ground：產品工作的全貌與常見斷點",
    duration: "35 分鐘",
    teachingPoints: [
      "產品工作不是單一部門的職責，也不是單向線性流水線，而是一個持續閉環的學習系統。",
      "團隊常見的困境不是完全缺少某個面向，而是面向與面向之間的『連結斷點』。",
      "跨職能協作的核心價值，是讓重要的專業判斷『提早發生』，而非後期的驗收把關。"
    ],
    dimensions: [
      { 
        name: "Direction (方向)", 
        keyQuestion: "我們為什麼做？支持什麼戰略？", 
        breakpoint: "只收到功能需求清單，團隊不知道背後的商業目的與使用者問題。",
        cure: "透過 Business Objective 將需求連結至組織戰略。" 
      },
      { 
        name: "Collaboration (協作)", 
        keyQuestion: "誰要一起做出關鍵判斷？", 
        breakpoint: "角色依序單向交接 (瀑布流)，技術與法遵/風控判斷太晚發生導致重工。",
        cure: "提早邀請跨職能角色共同進行可行性與風險討論。" 
      },
      { 
        name: "Execution (執行)", 
        keyQuestion: "如何把方向變成低風險行動？", 
        breakpoint: "需求提出後直接投入大專案開發，缺乏前期小步驗證機制。",
        cure: "拆解關鍵假設，以低成本實驗/MVP 取代一次性大上線。" 
      },
      { 
        name: "Outcome (成果)", 
        keyQuestion: "我們如何知道解法有效？", 
        breakpoint: "功能上線後只看系統主機是否正常升級，無人持續追蹤使用者行為改變。",
        cure: "建立成果學習循環，根據領先指標決定 Maintain/Improve/Scale/Stop。" 
      }
    ],
    rolesTable: [
      { role: "商務 (Business)", value: "回答「為何值得投入資源？預期商業回報是什麼？」" },
      { role: "產品 (Product)", value: "回答「現在最重要的是什麼？優先順序與目標如何取捨？」" },
      { role: "UX / 研究", value: "回答「使用者真正遇到的痛點與關鍵情境是什麼？」" },
      { role: "技術 (Engineering)", value: "回答「技術架構是否可行、具備擴充性且維護成本可控？」" },
      { role: "數據 (Data)", value: "回答「我們如何觀察行為改變？如何設定衡量指標？」" },
      { role: "營運 / 客服", value: "回答「真實情境下客戶會遇到什麼例外或操作障礙？」" },
      { role: "法遵 / 風控", value: "回答「有哪些法規、隱私或安全限制需要提早設計防護？」" }
    ],
    lifeCycle: ["1. 理解問題 (Problem)", "2. 設定目標 (Objective)", "3. 驗證解法 (Assumption)", "4. 建置交付 (Execution)", "5. 觀察成果 (Learning)"],
    checkpoints: [
      "我們是否清楚知道這項需求背後的『為什麼』？",
      "重要跨職能角色是否在早期共同參與判斷？",
      "團隊的工作方式是否能支持快速測試與學習？",
      "功能上線後，我們是否有機制觀察並回應真實成果？"
    ]
  },

  // 模組二：Objectives
  objectives: {
    title: "模組二｜Objectives：建立成果導向的產品目標",
    duration: "65 分鐘",
    teachingPoints: [
      "功能 (Feature) 只是眾多可能的解法之一；產品目標 (Objective) 描述的是我們希望促成的改變。",
      "學員需要具備「需求逆向推導」的能力：把老闆或客戶提出的功能，往回還原成使用者痛點與商務成果。",
      "避免追求『所有目標都重要』，每個需求必須聚焦在一項主要 Business Objective。"
    ],
    fourLevels: [
      { level: "Business Objective (商務目標)", question: "組織為何要投入資源？支持什麼成果？", example: "提升信用卡年活躍用戶數與刷卡交易額" },
      { level: "User Outcome (使用者成果)", question: "使用者獲得什麼價值的改變？", example: "準備消費時，能在 3 秒內清楚找到最優惠的刷卡卡片" },
      { level: "Product Objective (產品目標)", question: "產品要促成什麼關鍵行為改變？", example: "提高客戶在消費前進入 App 查詢與領取指定優惠的比例" },
      { level: "Product Output (產品交付物)", question: "團隊交付了什麼功能或元件？", example: "開發優惠推薦專區、個人化 AI 推薦引擎、自動到期提醒" }
    ],
    sevenObjectives: [
      { name: "Acquisition (取得)", desc: "吸引並取得全新客戶或新用戶。" },
      { name: "Activation (啟用)", desc: "促成新用戶完成首次成功體驗 (Aha Moment)。" },
      { name: "Engagement (互動)", desc: "增加既有用戶的使用頻率、停留時間與互動深度。" },
      { name: "Retention (留存)", desc: "提高用戶長期持續回訪與使用率，降低流失率。" },
      { name: "Revenue (收益)", desc: "增加客單價、交易轉換率、付費訂閱或整體營收。" },
      { name: "Efficiency (效率)", desc: "降低內部作業負擔、客服致電率或營運處理成本。" },
      { name: "Risk／Trust (信任)", desc: "降低風控法遵風險、提升系統資安與用戶信任度。" }
    ],
    formula: "我們希望協助【目標使用者】，在【關鍵情境】中，從【現狀行為或痛點】，改變為【期望產生的行為】，進而支持【商務目標】。",
    formulaExample: "我們希望協助【持有多張信用卡的客戶】，在【準備消費刷卡前】，從【隨機刷卡或頻繁致電客服詢問】，改變為【消費前進入 App 主動領取最佳優惠】，進而支持【Engagement 提高信用卡活躍度】。",
    quiz: [
      { text: "完成線上調額功能線上化", answer: "Output" },
      { text: "降低客戶致電人工客服申請調額的比例 30%", answer: "Outcome" },
      { text: "上線專屬優惠推薦輪播 Banner", answer: "Output" },
      { text: "提高指定優惠活動的使用率與刷卡金", answer: "Outcome" },
      { text: "完成新版刷臉登入流程開發", answer: "Output" },
      { text: "降低用戶登入失敗率與放棄率", answer: "Outcome" }
    ]
  },

  // 模組三：Assumptions
  assumptions: {
    title: "模組三｜Assumptions：建立實驗思維，驗證關鍵假設",
    duration: "65 分鐘",
    teachingPoints: [
      "需求文件上記筆的內容，本質上都只是「尚未被證明的假設 (Unproven Assumptions)」。",
      "與其爭辯解法好不好，不如問「我們正在假設什麼？哪一個假設錯了會致命？」",
      "MVP 不是功能削減的劣質品，而是「能以最低合理成本取得關鍵證據的產品形式」。"
    ],
    fourRisks: [
      { type: "Value (價值假設)", question: "使用者真的有這個痛點？真的需要或願意使用這個解法嗎？" },
      { type: "Usability (易用性假設)", question: "使用者能在不需引導下看懂、理解並順利完成操作嗎？" },
      { type: "Feasibility (可行性假設)", question: "現有的技術架構、資料庫與 API 能在效能預算內支援嗎？" },
      { type: "Viability (存續/商務假設)", question: "這個解法在法遵、風控、財務效益與營運流程上能成立嗎？" }
    ],
    matrixGuide: [
      { quadrant: "高影響 / 高不確定性 (High Impact, High Uncertainty)", action: "🔥 優先驗證區：必須在投入正式開發前取得證據！" },
      { quadrant: "高影響 / 低不確定性 (High Impact, Low Uncertainty)", action: "持續確認：已被驗證過，納入一般開發規劃。" },
      { quadrant: "低影響 / 高不確定性 (Low Impact, High Uncertainty)", action: "暫不投入：即使驗證成功對整體產品影響有限。" },
      { quadrant: "低影響 / 低不確定性 (Low Impact, Low Uncertainty)", action: "延後處理：效益低且無風險，有餘力再做。" }
    ],
    validationMethods: [
      { name: "Prototype (原型測試)", fit: "驗證 Value 與 Usability：使用 Figma 可點擊原型觀察受測者反應。" },
      { name: "MVP (最小可行產品)", fit: "驗證真實情境行為：建立極簡化功能放上線上觀察真實轉化。" },
      { name: "Spike (技術探針概念驗證)", fit: "驗證 Feasibility：工程師花 1-2 天寫 POC 測試 API 與演算法可行性。" },
      { name: "人工試行 (Wizard of Oz)", fit: "驗證 Viability 與需求：前端看似自動化，後端由人工手動為用戶服務。" },
      { name: "深度訪談 / 觀測測試", fit: "驗證問題真實性：1 對 1 觀察使用者現有解決方案與痛點。" },
      { name: "數據分析 (Data Mining)", fit: "驗證現狀行為：從現有數據庫探測行為關聯性與基期數字。" }
    ],
    experimentFormula: "我們相信【目標使用者】在【情境】中會【期望行為】。我們將透過【驗證方式】取得證據。當【觀察指標】達到【判斷標準】時，代表假設獲得初步支持。根據結果，我們將決定【擴大、調整、再次驗證或停止】。"
  },

  // 模組四：Learn
  learn: {
    title: "模組四｜Learn：建立產品學習循環",
    duration: "35 分鐘",
    teachingPoints: [
      "數據的價值不在於產出華麗的 Dashboard 報表，而在於驅動團隊做出「下一個產品決策」。",
      "單看落後指標 (如營收、留存) 太晚發現錯誤；單看領先指標 (如點擊率) 可能自嗨。團隊需建立指標連動。",
      "量化數據告訴你「發生了什麼 (What)」，質化資料告訴你「為什麼發生 (Why)」。兩者缺一不可。"
    ],
    fourMetricLevels: [
      { level: "Activity (團隊投入)", focus: "做了多少工作？", example: "完成了 15 場用戶訪談、寫了 50 支 API" },
      { level: "Output (產品交付)", focus: "交付了什麼功能？", example: "上線優惠推薦卡片專區" },
      { level: "Behavior Outcome (行為成果)", focus: "用戶行為如何改變？", example: "消費前查詢優惠的比例提升 25%" },
      { level: "Business Outcome (商務成果)", focus: "商業效益是否出現？", example: "信用卡月刷卡總金額提升 8%" }
    ],
    simulatorData: {
      impressions: 50000,
      clicks: 8000,
      detailsViewed: 4500,
      enrolled: 1200,
      completedTransactions: 350,
      csInquiryIncrease: "15%",
      qualitativeFeedback: "訪談 10 位放棄登錄的用戶，8 位反應「優惠適用條件過於複雜，不知道自己是否符合資格」；客服數據顯示專線諮詢中 40% 與條件規則計算有關。"
    },
    decisionTypes: [
      { name: "Maintain (維持)", condition: "成果完全符合或超越預期判斷標準，持續營運維護。" },
      { name: "Improve (改善優化)", condition: "整體方向正確且用戶有需求，但轉換出現關卡痛點，進行介面與體驗優化。" },
      { name: "Scale (擴大投入)", condition: "關鍵假設獲強烈證據支持，擴大客群範圍或投入更多資源開發全面功能。" },
      { name: "Stop／Pivot (停止或轉向)", condition: "核心假設未獲數據與質化支持，果斷停止投資或轉向其他更具價值的解法。" }
    ],
    learningLoop: [
      "1. Observe (觀察數據與質化數據)",
      "2. Interpret (解讀背後可能原因)",
      "3. Question (提出下一個待驗證問題)",
      "4. Experiment (設計低成本驗證小實驗)",
      "5. Decide (做出 Maintain/Improve/Scale/Stop 決策)",
      "6. Adapt (調整產品目標與規格)"
    ]
  }
};

function encrypt(text, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();
  
  const combined = Buffer.concat([Buffer.from(encrypted, 'base64'), tag]).toString('base64');

  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: combined
  };
}

const password = 'pf2026';
const encryptedPayload = encrypt(JSON.stringify(COURSE_DATA), password);

const jsContent = `// GOAL Product Framework - Encrypted Rich Courseware Payload (AES-GCM 256-bit)
// Decryptable via password: "${password}"
const ENCRYPTED_COURSE_PAYLOAD = ${JSON.stringify(encryptedPayload, null, 2)};
`;

const outputPath = path.join(__dirname, '../data/course-payload.js');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, jsContent, 'utf8');
console.log('Successfully re-encrypted rich course payload to data/course-payload.js');
