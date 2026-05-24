/* ==========================================================================
   O₂ SleepWell Laboratory Hub - Client-Side Intelligence Engine
   ========================================================================== */

// --- 1. STATE & GLOBAL CONFIGURATION ---
const CIRCADIAN_STATES = [
  { hourStart: 0, hourEnd: 6, label: "Deep Delta Sleep Trough", desc: "Suprachiasmatic nucleus triggers maximum melatonin secretion. Cognitive pathways are offline." },
  { hourStart: 6, hourEnd: 9, label: "Melatonin Cessation / Cortisol Rise", desc: "Melatonin secretion ceases. Core temperature rises as cortisol begins a sharp upward curve to establish morning waking arousal." },
  { hourStart: 9, hourEnd: 12, label: "Peak Executive Logic Focus", desc: "High-precision window. Analytical fluid reasoning, working memory, and logical execution reach their biological peaks." },
  { hourStart: 12, hourEnd: 15, label: "Post-Lunch Somnogen Dip", desc: "A natural transient decline in alertness driven by circadian sleep gates and initial homeostatic Somnogen accumulation." },
  { hourStart: 15, hourEnd: 18, label: "Cardio & Coordination Peak", desc: "Maximum muscle efficiency, aerobic capacity, and motor-coordination peak as core body temperature hits its daily high." },
  { hourStart: 18, hourEnd: 21, label: "Circadian Wind-Down Shift", desc: "Blood pressure and heart rate stabilize. Core temperature begins declining, signaling initial phase transition." },
  { hourStart: 21, hourEnd: 24, label: "Melatonin Secretion Onset", desc: "Melatonin rises rapidly as the brain prepares for sleep. Attentional vigilance declines progressively." }
];

// Chronotype profile definitions to synchronize across databases
const CHRONOTYPE_PROFILES = {
  "Morning Lark": {
    class: "state-lark",
    color: "var(--accent-morning)",
    colorRgb: "var(--accent-morning-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="5" />
             <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
           </svg>`,
    bed: "10:00 PM",
    wake: "06:00 AM",
    peakStartHour: 8,
    peakEndHour: 12,
    downStartHour: 21,
    downEndHour: 6
  },
  "Intermediate Bear": {
    class: "state-bear",
    color: "var(--accent-bear)",
    colorRgb: "var(--accent-bear-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
             <circle cx="12" cy="12" r="4" />
             <path d="M12 6c-3.3 0-6 2.7-6 6" />
           </svg>`,
    bed: "11:30 PM",
    wake: "07:30 AM",
    peakStartHour: 9.5,
    peakEndHour: 13,
    downStartHour: 22.5,
    downEndHour: 7.5
  },
  "Evening Owl": {
    class: "state-owl",
    color: "var(--accent-evening)",
    colorRgb: "var(--accent-evening-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
           </svg>`,
    bed: "01:30 AM",
    wake: "09:30 AM",
    peakStartHour: 17,
    peakEndHour: 22,
    downStartHour: 1,
    downEndHour: 9.5
  }
};

// --- 2. BILINGUAL TRANSLATION DICTIONARIES ---
const I18N_DICTS = {
  en: {
    brandTag: "Clinical Hub",
    heroBadge: "Sleep & Performance Integration",
    heroTitle: "Synchronize Your <span>Circadian Health</span>",
    heroDesc: "Welcome to your clinical gateway. This dashboard aggregates findings from your self-assessments and cognitive performance audits to map your alertness and biological sync in real-time.",
    dashboardTitle: "Aggregated Patient Analytics",
    dashboardActiveBadge: "Data Synced",
    launcherTitle: "Laboratory Diagnostic Applications",
    launcherDesc: "Launch your clinical assessment interfaces below. Data is securely collected in your browser storage.",
    roadmapTitle: "Future Diagnostics Roadmap",
    roadmapDesc: "Preview sleep-tracking utilities currently under clinical and technical engineering.",
    scienceTitle: "The Interaction of Circadian Phase & Vigilance",
    scienceP1: "Sleep pressure and cognitive vigilance are regulated by a highly complex two-process model of sleep regulation: Process C (Circadian rhythm) and Process S (Homeostatic sleep drive).",
    scienceP2: "Process C is an oscillatory alert drive driven by the brain's suprachiasmatic nucleus (SCN) that dictates when we are biologically primed to wake and sleep. Process S is the accumulation of somnogen (adenosine) in the synapses that grows lineally with every hour of wakefulness.",
    scienceP3: "Living out of sync with Process C leads to social jetlag. Combining rMEQ chronotyping and PVT-B millisecond speed audits gives clinicians a high-resolution view of your current neurological readiness, indicating when you are at peak flow state and when you are highly susceptible to critical lapses of attention.",
    
    // Circadian Phase states in header
    circadianStates: [
      "Deep Delta Sleep Trough",
      "Melatonin Cessation / Cortisol Rise",
      "Peak Executive Logic Focus",
      "Post-Lunch Somnogen Dip",
      "Cardio & Coordination Peak",
      "Circadian Wind-Down Shift",
      "Melatonin Secretion Onset"
    ],
    
    // Panel texts
    circadianPanelTitle: "Circadian Profile",
    circadianPendingTitle: "rMEQ Chronotype Pending",
    circadianPendingDesc: "Complete the biological sleep chronometer quiz to identify your circadian peak alignment.",
    circadianBtnTake: "Take Assessment",
    circadianScoreLabel: "Assessment Score: ",
    circadianSleepLabel: "Sleep Cycle: ",
    
    vigilancePanelTitle: "Attentional Vigilance",
    vigilancePendingTitle: "PVT Attention Audit Pending",
    vigilancePendingDesc: "Run a reaction speed test to calculate your current attentional stamina and sleep debt lapses.",
    vigilanceBtnTake: "Initialize Test",
    vigilanceMeanRT: "Mean RT",
    vigilanceLapses: "Lapses",
    
    flexibilityPanelTitle: "Cognitive Flexibility",
    flexibilityPendingTitle: "TMT Flexibility Pending",
    flexibilityPendingDesc: "Run a task alternation assessment to evaluate brain fog index and visual set-shifting response times.",
    flexibilityBtnTake: "Initialize Test",
    flexibilityRatio: "B/A Ratio",
    flexibilityPartB: "Part B Time",
    
    diagnosticsPanelTitle: "Clinical Alignment",
    diagnosticsPendingTitle: "Diagnostics Pending",
    diagnosticsPendingDesc: "Complete the sleep assessments and cognitive speed audits in this suite to compile patient diagnostics alignment.",
    diagnosticsPartialTitle: "Awaiting Assessment Sync",
    diagnosticsPartialDesc: "Hub requires clinical parameters from all tools. Please complete: <strong>{missing}</strong> to resolve diagnostics.",
    diagnosticsBedtimeLabel: "Target Bedtime: ",
    
    // Launcher cards texts
    launchRmeqBadge: "Circadian Rhythm",
    launchRmeqTitle: "Morningness-Eveningness (rMEQ)",
    launchRmeqDesc: "Identify your biological chronotype (Morning Lark, Evening Owl, or Intermediate Bear). Learn your ideal melatonin phases, core temperature cycles, and peak performance windows to eliminate social jetlag.",
    launchRmeqBtn: "Launch Assessment",
    
    launchPvtBadge: "Neuro-Alertness",
    launchPvtTitle: "Psychomotor Vigilance Task (PVT-B)",
    launchPvtDesc: "The aerospace and clinical gold standard for auditing cognitive fatigue and sustained attention stability. Measures response latency spikes and counts micro-sleep lapses due to sleep debt.",
    launchPvtBtn: "Initialize Test",
    
    launchTmtBadge: "Cognitive Executive",
    launchTmtTitle: "Cognitive Flexibility (TMT-A/B)",
    launchTmtDesc: "The clinical gold standard for auditing Obstructive Sleep Apnea (OSA) related brain fog, task-alternation latency, and set-shifting executive flexibility. Assesses your ability to alternate visual channels under pressure.",
    launchTmtBtn: "Initialize Test",
    
    // Specs columns labels
    specLabelMethodology: "Methodology",
    specLabelParameters: "Parameters",
    specLabelTimeAudit: "Time Audit",
    
    // Roadmap cards
    roadmapBeta: "Clinical Beta",
    roadmapApp1Title: "SomnoDiary & Sleep Debt Auditor",
    roadmapApp1Desc: "Interactive sleep diary and sleep latency logger. Aggregates sleep schedules over 14 days to compute accumulative sleep debt percentage and dynamically warn of chronic performance erosion.",
    roadmapApp1Date: "Beta Launch Q3",
    roadmapLab: "Research Lab",
    roadmapApp2Title: "LuxTherapy Circadian Light Simulator",
    roadmapApp2Desc: "Calculates optimal light intensity, lux thresholds, and spectrum timings (e.g. blue-light exposure vs orange sunsets) based on your chronotype to accelerate phase shifts and travel adaptation.",
    roadmapApp2Date: "Beta Launch Q4",
    
    // Dynamic diagnostic results
    diagnosticsStatusPerfect: "Perfect Peak Alignment",
    diagnosticsStatusHyper: "Hyper-Alert Arousal",
    diagnosticsStatusRested: "Highly Rested Status",
    diagnosticsStatusSluggish: "Circadian Sluggishness",
    diagnosticsStatusFatigued: "Chronic Fatigue & Obstructive Brain Fog",
    diagnosticsStatusDeSync: "Severe Circadian De-Sync & Fog",
    diagnosticsStatusTmtLag: "Cognitive Task-Switching Delay",
    diagnosticsStatusPvtLag: "Transient Focus Lapses",
    diagnosticsStatusSync: "Normal Clinical Sync",
    diagnosticsStatusNormal: "Normal Alertness Profile",
    diagnosticsStatusDecay: "Mild Circadian Decay"
  },
  zh: {
    brandTag: "临床数据中心",
    heroBadge: "睡眠与认知执行力整合中心",
    heroTitle: "同步您的 <span>昼夜生物钟节律</span>",
    heroDesc: "欢迎来到您的临床数字化中心。此仪表盘实时汇总了您的自我睡眠量表、神经反应速度与认知多线切换数据，深度解析您的大脑活跃度与昼夜生理节奏同步率。",
    dashboardTitle: "患者综合临床数据解析",
    dashboardActiveBadge: "数据实时同步",
    launcherTitle: "临床辅助实验室测评程序",
    launcherDesc: "请在下方启动相应的认知与昼夜节律测评。所有临床测评数据均安全储存在您的本地浏览器中。",
    roadmapTitle: "实验室未来诊断功能路线图",
    roadmapDesc: "预览当前正在临床和技术研发阶段的睡眠与节律筛查程序。",
    scienceTitle: "Process C 昼夜节律与 Process S 睡眠压力蓄积",
    scienceP1: "人类的睡眠驱动力与认知警觉度受到经典的 Process C（昼夜节律 Master Clock）与 Process S（Homeostatic 睡眠驱动力）双重系统调控。",
    scienceP2: "Process C 是由大脑下丘脑视交叉上核 (SCN) 驱动的 24小时周期Alerting信号，决定我们何时自然清醒和入睡。Process S 则是自清醒开始在脑内突触不断累积的腺苷酸 (adenosine) 睡眠压力，随着清醒时间延长而线性增加。",
    scienceP3: "生物钟长期紊乱会导致严重的 social jetlag（社交时差）。整合 rMEQ 睡眠型态量表与高灵敏 PVT-B 警觉度测试，可以高分辨率呈现患者当前的神经系统能量储备，精准判定何时处于巅峰高效状态，何时极易出现严重的注意力瞬间崩溃（微睡眠 lapses）。",
    
    // Circadian Phase states in header
    circadianStates: [
      "深度慢波 Delta 睡眠低谷",
      "褪黑素停止分泌 / 皮质醇快速爬升",
      "巅峰逻辑执行与 Fluid 思考窗口",
      "午后生理性 Adenosine 睡眠压力潮汐",
      "体温与运动协调能力日常高峰",
      "昼夜节律准备阶段 / 基础风向转变",
      "褪黑素开始急速分泌 / 睡眠闸门开启"
    ],
    
    // Panel texts
    circadianPanelTitle: "昼夜生物钟型态",
    circadianPendingTitle: "rMEQ 睡眠量表待测评",
    circadianPendingDesc: "请先完成 reduced Morningness-Eveningness Questionnaire 昼夜节律测评，以解析您的生物钟巅峰曲线。",
    circadianBtnTake: "开始量表测评",
    circadianScoreLabel: "测评得分：",
    circadianSleepLabel: "理想作息：",
    
    vigilancePanelTitle: "注意力警觉 Stamina",
    vigilancePendingTitle: "PVT 警觉性测评待测试",
    vigilancePendingDesc: "进行 1-3分钟的高敏视觉反应速度审计，测量您在大脑负荷下的微睡眠专注力流失。",
    vigilanceBtnTake: "开始神经反应测试",
    vigilanceMeanRT: "反应均值",
    vigilanceLapses: "注意力流失",
    
    flexibilityPanelTitle: "脑雾与多线切换力",
    flexibilityPendingTitle: "TMT 切换灵活性待测评",
    flexibilityPendingDesc: "运行 Trail Making Test 路径交替连线测验，诊断由睡眠缺氧或片段化导致的 Prefrontal 脑雾滞后指数。",
    flexibilityBtnTake: "开始多任务测验",
    flexibilityRatio: "切换比率 B/A",
    flexibilityPartB: "Part B 用时",
    
    diagnosticsPanelTitle: "昼夜临床同步诊断",
    diagnosticsPendingTitle: "诊断结论待解锁",
    diagnosticsPendingDesc: "系统正在等待您完成所有的认知与睡眠测评，完成后这里将呈现高保真的多维度综合临床同步报告。",
    diagnosticsPartialTitle: "等待关联测验数据",
    diagnosticsPartialDesc: "数字化中心需要汇总所有测验参数。请完成缺少的 <strong>{missing}</strong> 测试以激活诊断。",
    diagnosticsBedtimeLabel: "理想入睡时间：",
    
    // Launcher cards texts
    launchRmeqBadge: "昼夜生物钟",
    launchRmeqTitle: "清晨型与黄昏型诊断 (rMEQ)",
    launchRmeqDesc: "识别您的天然睡眠型态（清晨云雀 Lark、黄昏猫头鹰 Owl 或中间Bear型）。掌握您的褪黑素分泌曲线、核心体温周期与巅峰工作时段，彻底消除社交时差阻碍。",
    launchRmeqBtn: "启动生物钟测评",
    
    launchPvtBadge: "神经警觉度",
    launchPvtTitle: "精神运动警觉性测验 (PVT-B)",
    launchPvtDesc: "航空航天与临床金标准，用于精准审计神经疲劳与持续注意力稳定性。捕捉以毫秒为单位的反应卡顿，并计数由睡眠债务造成的微睡眠 lapses 次数。",
    launchPvtBtn: "启动反应速度测试",
    
    launchTmtBadge: "执行控制力",
    launchTmtTitle: "脑雾与执行切换测评 (TMT-A/B)",
    launchTmtDesc: "评估阻塞性睡眠呼吸暂停 (OSA) 相关的脑雾滞后、认知通路转换迟钝和前额叶执行灵活性的临床金标准。测试您在压力下交替寻找视觉目标的能力。",
    launchTmtBtn: "启动多任务测评",
    
    // Specs columns labels
    specLabelMethodology: "科学文献常模",
    specLabelParameters: "临床核心参数",
    specLabelTimeAudit: "测评用时",
    
    // Roadmap cards
    roadmapBeta: "临床内测 Beta",
    roadmapApp1Title: "SomnoDiary 睡眠日记与睡眠债审计",
    roadmapApp1Desc: "数字化睡眠日志记录系统。连续累积14天睡眠数据，动态计算您的累计睡眠负债率，并在认知执行力面临侵蚀风险前发出预警提示。",
    roadmapApp1Date: "计划 Q3 季度内测",
    roadmapLab: "实验室研发中",
    roadmapApp2Title: "LuxTherapy 智能照度仿真与光疗配方",
    roadmapApp2Desc: "根据您的 Chronotype，精准推荐每日日光和蓝光暴露的照度阈值、光谱温度及最佳时点（如利用日落橙光引导），帮助跨时区人群快速重塑昼夜节律。",
    roadmapApp2Date: "计划 Q4 季度发布",
    
    // Dynamic diagnostic results
    diagnosticsStatusPerfect: "完美昼夜同步",
    diagnosticsStatusHyper: "高亢神经代偿",
    diagnosticsStatusRested: "精力充沛状态",
    diagnosticsStatusSluggish: "生物钟低谷滞后",
    diagnosticsStatusFatigued: "慢性重度疲劳与阻塞性脑雾",
    diagnosticsStatusDeSync: "严重节律失调与深层脑雾",
    diagnosticsStatusTmtLag: "多任务任务切换明显滞后",
    diagnosticsStatusPvtLag: "注意力间歇性失焦",
    diagnosticsStatusSync: "健康节律同步",
    diagnosticsStatusNormal: "正常警觉状态",
    diagnosticsStatusDecay: "轻度疲劳阻滞"
  }
};

// --- 3. DOM ELEMENT REFERENCES ---
const hubBody = document.getElementById('hubBody');
const headerLiveTime = document.getElementById('headerLiveTime');
const headerPhaseState = document.getElementById('headerPhaseState');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

const circadianPanelContent = document.getElementById('circadianPanelContent');
const vigilancePanelContent = document.getElementById('vigilancePanelContent');
const flexibilityPanelContent = document.getElementById('flexibilityPanelContent');
const diagnosticsPanelContent = document.getElementById('diagnosticsPanelContent');

const rMeqTimeLabel = document.getElementById('rMeqTimeLabel');
const pvtTimeLabel = document.getElementById('pvtTimeLabel');
const tmtTimeLabel = document.getElementById('tmtTimeLabel');

let currentLanguage = 'en';

// --- 4. THEME & LANGUAGE MANAGEMENT SYSTEMS ---
function initTheme() {
  const savedTheme = localStorage.getItem('circaHub_theme') || localStorage.getItem('circaAlign_theme') || localStorage.getItem('pvt_theme') || localStorage.getItem('tmt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('circaHub_theme', newTheme);
  localStorage.setItem('circaAlign_theme', newTheme);
  localStorage.setItem('pvt_theme', newTheme);
  localStorage.setItem('tmt_theme', newTheme);
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

function initLanguage() {
  currentLanguage = localStorage.getItem('sleepwell_lang') || localStorage.getItem('tmt_lang') || 'en';
  setLanguage(currentLanguage);
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('sleepwell_lang', lang);
  
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.textContent = lang === 'en' ? '中文' : 'English';
  }
  
  const d = I18N_DICTS[lang];
  
  // Translate static UI elements
  document.getElementById('brand-tag').textContent = d.brandTag;
  
  const heroBadge = document.getElementById('hero-badge');
  if (heroBadge) {
    const svg = heroBadge.querySelector('svg').outerHTML;
    heroBadge.innerHTML = svg + " " + d.heroBadge;
  }
  
  document.getElementById('hero-title').innerHTML = d.heroTitle;
  document.getElementById('hero-desc').textContent = d.heroDesc;
  
  const dashboardTitle = document.getElementById('dashboard-title');
  if (dashboardTitle) {
    const svg = dashboardTitle.querySelector('svg').outerHTML;
    dashboardTitle.innerHTML = svg + " " + d.dashboardTitle;
  }
  document.getElementById('dashboardActiveBadge').textContent = d.dashboardActiveBadge;
  
  document.getElementById('launcher-title').textContent = d.launcherTitle;
  document.getElementById('launcher-desc').textContent = d.launcherDesc;
  
  document.getElementById('roadmap-title').textContent = d.roadmapTitle;
  document.getElementById('roadmap-desc').textContent = d.roadmapDesc;
  
  document.getElementById('roadmap-app1-badge').textContent = d.roadmapBeta;
  document.getElementById('roadmap-app1-date').textContent = d.roadmapApp1Date;
  document.getElementById('roadmap-app1-title').textContent = d.roadmapApp1Title;
  document.getElementById('roadmap-app1-desc').textContent = d.roadmapApp1Desc;
  
  document.getElementById('roadmap-app2-badge').textContent = d.roadmapLab;
  document.getElementById('roadmap-app2-date').textContent = d.roadmapApp2Date;
  document.getElementById('roadmap-app2-title').textContent = d.roadmapApp2Title;
  document.getElementById('roadmap-app2-desc').textContent = d.roadmapApp2Desc;
  
  document.getElementById('science-title').textContent = d.scienceTitle;
  document.getElementById('science-p1').innerHTML = d.scienceP1;
  document.getElementById('science-p2').innerHTML = d.scienceP2;
  document.getElementById('science-p3').innerHTML = d.scienceP3;
  
  const infoItems = document.querySelectorAll('.science-infographic .info-item');
  if (infoItems.length >= 2) {
    const div1 = infoItems[0].querySelector('div');
    div1.querySelector('h4').textContent = lang === 'en' ? "Process C (Circadian clock)" : "Process C (昼夜生物钟系统)";
    div1.querySelector('p').textContent = lang === 'en'
      ? "An internal 24.2-hour clock dictating hormonal alerting peaks. Peak performance aligns perfectly when challenging work occurs during your chronotype alert peaks."
      : "体内调控皮质醇等激素分泌的24.2小时生物钟。当下层工作处于您生物时钟的唤醒峰值时，高难度脑力劳动的效率最佳。";
      
    const div2 = infoItems[1].querySelector('div');
    div2.querySelector('h4').textContent = lang === 'en' ? "Process S (Sleep debt)" : "Process S (睡眠动力债务)";
    div2.querySelector('p').textContent = lang === 'en'
      ? "Homeostatic fatigue. The longer you go without high-quality delta sleep, the more severe PVT lapses (micro-sleeps) will spike, regardless of your circadian master alert drive."
      : "机体积累的睡眠压力。若缺乏高质的 delta 慢波睡眠，突触间腺苷酸不断累积，PVT专注于切换效率将出现无可阻阻挡的严重卡顿或瞬间微睡眠失焦。";
  }
  
  // Translate app launcher cards
  const rmeqCard = document.getElementById('rmeqCard');
  if (rmeqCard) {
    rmeqCard.querySelector('.card-info .badge').textContent = d.launchRmeqBadge;
    rmeqCard.querySelector('.card-info h3').textContent = d.launchRmeqTitle;
    rmeqCard.querySelector('.card-desc').textContent = d.launchRmeqDesc;
    rmeqCard.querySelector('#launchRmeqBtn').childNodes[0].textContent = d.launchRmeqBtn + " ";
    const specs = rmeqCard.querySelectorAll('.card-specs .spec-item');
    if (specs.length >= 3) {
      specs[0].querySelector('.spec-label').textContent = d.specLabelMethodology;
      specs[0].querySelector('.spec-val').textContent = "Adan & Almirall (1991)";
      specs[1].querySelector('.spec-label').textContent = d.specLabelParameters;
      specs[1].querySelector('.spec-val').textContent = lang === 'en' ? "5 Diagnostic Items" : "5项核心诊断量表";
      specs[2].querySelector('.spec-label').textContent = d.specLabelTimeAudit;
      specs[2].querySelector('.spec-val').textContent = lang === 'en' ? "< 2 Minutes" : "小于 2 分钟";
    }
  }
  
  const pvtCard = document.getElementById('pvtCard');
  if (pvtCard) {
    pvtCard.querySelector('.card-info .badge').textContent = d.launchPvtBadge;
    pvtCard.querySelector('.card-info h3').textContent = d.launchPvtTitle;
    pvtCard.querySelector('.card-desc').textContent = d.launchPvtDesc;
    pvtCard.querySelector('#launchPvtBtn').childNodes[0].textContent = d.launchPvtBtn + " ";
    const specs = pvtCard.querySelectorAll('.card-specs .spec-item');
    if (specs.length >= 3) {
      specs[0].querySelector('.spec-label').textContent = d.specLabelMethodology;
      specs[0].querySelector('.spec-val').textContent = "Basner & Dinges (2011)";
      specs[1].querySelector('.spec-label').textContent = d.specLabelParameters;
      specs[1].querySelector('.spec-val').textContent = lang === 'en' ? "Reaction ms & Lapses" : "反应毫秒数与断线次数";
      specs[2].querySelector('.spec-label').textContent = d.specLabelTimeAudit;
      specs[2].querySelector('.spec-val').textContent = lang === 'en' ? "1 - 3 Min Sessions" : "1至3分钟测试段";
    }
  }
  
  const tmtCard = document.getElementById('tmtCard');
  if (tmtCard) {
    tmtCard.querySelector('.card-info .badge').textContent = d.launchTmtBadge;
    tmtCard.querySelector('.card-info h3').textContent = d.launchTmtTitle;
    tmtCard.querySelector('.card-desc').textContent = d.launchTmtDesc;
    tmtCard.querySelector('#launchTmtBtn').childNodes[0].textContent = d.launchTmtBtn + " ";
    const specs = tmtCard.querySelectorAll('.card-specs .spec-item');
    if (specs.length >= 3) {
      specs[0].querySelector('.spec-label').textContent = d.specLabelMethodology;
      specs[0].querySelector('.spec-val').textContent = "Reitan TMT Norms (1958)";
      specs[1].querySelector('.spec-label').textContent = d.specLabelParameters;
      specs[1].querySelector('.spec-val').textContent = lang === 'en' ? "Alternation & Error Rates" : "通路切换与点击错误率";
      specs[2].querySelector('.spec-label').textContent = d.specLabelTimeAudit;
      specs[2].querySelector('.spec-val').textContent = lang === 'en' ? "< 3 Minutes" : "小于 3 分钟";
    }
  }
  
  renderDashboard();
}

// --- 5. LIVE CLINICAL CLOCK & PHASE STATE ENGINE ---
function startLiveClock() {
  const updateClock = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    // Format digital clock
    const ampm = currentHour >= 12 ? 'PM' : 'AM';
    const dispHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const dispMin = currentMin.toString().padStart(2, '0');
    
    headerLiveTime.textContent = `${dispHour}:${dispMin} ${ampm}`;
    
    // Resolve circadian phase matching current hour
    const activePhaseIdx = CIRCADIAN_STATES.findIndex(state => currentHour >= state.hourStart && currentHour < state.hourEnd);
    if (activePhaseIdx !== -1) {
      headerPhaseState.textContent = I18N_DICTS[currentLanguage].circadianStates[activePhaseIdx];
    }
  };
  
  updateClock();
  setInterval(updateClock, 15000); // refresh every 15 seconds
}

// --- 6. AGGREGATED LOCALSTORAGE GETTERS ---
function getCircAlignHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
    return history.length > 0 ? history[0] : null; // returns most recent record
  } catch (e) {
    console.error("Failed to parse circaAlign_history: ", e);
    return null;
  }
}

function getPvtHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
    return history.length > 0 ? history[0] : null; // returns most recent record
  } catch (e) {
    console.error("Failed to parse pvt_history: ", e);
    return null;
  }
}

function getTmtHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('tmt_history') || '[]');
    return history.length > 0 ? history[0] : null; // returns most recent TMT record
  } catch (e) {
    console.error("Failed to parse tmt_history: ", e);
    return null;
  }
}

// --- 7. DASHBOARD GENERATION & RENDERING ENGINE ---
function renderDashboard() {
  const meqData = getCircAlignHistory();
  const pvtData = getPvtHistory();
  const tmtData = getTmtHistory();
  
  const d = I18N_DICTS[currentLanguage];
  
  // 7.1 Render Panel A: Circadian Chronotype Profile
  const circPanel = document.getElementById('circadianPanel');
  if (circPanel) {
    circPanel.querySelector('.panel-title').childNodes[2].textContent = d.circadianPanelTitle;
  }
  
  if (meqData) {
    const profile = CHRONOTYPE_PROFILES[meqData.chronotype] || CHRONOTYPE_PROFILES["Intermediate Bear"];
    
    // Inject chronotype class in body to light up decorative atmospheric aura
    hubBody.className = profile.class;
    
    rMeqTimeLabel.textContent = meqData.date;
    rMeqTimeLabel.className = "badge chronotype-accent-bg chronotype-accent-color";
    
    // translate chronotype name
    let transName = meqData.chronotype;
    if (currentLanguage === 'zh') {
      if (meqData.chronotype === 'Morning Lark') transName = '清晨云雀';
      else if (meqData.chronotype === 'Intermediate Bear') transName = '中间性小熊';
      else if (meqData.chronotype === 'Evening Owl') transName = '黄昏猫头鹰';
    }
    
    circadianPanelContent.innerHTML = `
      <div class="panel-icon-center chronotype-accent-color" style="background: rgba(${profile.colorRgb}, 0.05); border-color: rgba(${profile.colorRgb}, 0.25);">
        ${profile.icon}
      </div>
      <h3 class="dash-chronotype-name chronotype-accent-color">${transName}</h3>
      <span class="dash-chronotype-score">${d.circadianScoreLabel}<strong>${meqData.score} / 25</strong></span>
      
      <div class="dash-chronotype-schedule">
        <span>${d.circadianSleepLabel}</span>
        <span class="chronotype-accent-color">${profile.bed} - ${profile.wake}</span>
      </div>
    `;
  } else {
    // Empty state rMEQ Quiz Pending
    circadianPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h4>${d.circadianPendingTitle}</h4>
        <p>${d.circadianPendingDesc}</p>
        <a href="../meq-app/index.html" class="btn btn-primary btn-sm">${d.circadianBtnTake}</a>
      </div>
    `;
  }
  
  // 7.2 Render Panel B: Attentional Vigilance Audit
  const vigPanel = document.getElementById('vigilancePanel');
  if (vigPanel) {
    vigPanel.querySelector('.panel-title').childNodes[2].textContent = d.vigilancePanelTitle;
  }
  
  if (pvtData) {
    pvtTimeLabel.textContent = pvtData.dateTime;
    
    const accuracy = parseFloat(pvtData.performanceScore);
    const strokeOffset = 264 - (264 * (accuracy / 100));
    
    // Performance coloring
    let colorVar = "var(--success)";
    if (accuracy < 70) colorVar = "var(--danger)";
    else if (accuracy < 90) colorVar = "var(--warning)";
    
    vigilancePanelContent.innerHTML = `
      <div class="accuracy-radial-box">
        <svg viewBox="0 0 100 100" class="circle-svg">
          <circle cx="50" cy="50" r="42" stroke="var(--card-border)" stroke-width="6.5" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="${colorVar}" stroke-width="7.5" stroke-dasharray="264" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" fill="none" class="gauge-fill-ring" />
        </svg>
        <div class="accuracy-inner-val">
          <span class="pct" style="color: ${colorVar}">${pvtData.performanceScore}%</span>
          <span class="lbl">${currentLanguage === 'en' ? 'Vigilance' : '注意力'}</span>
        </div>
      </div>
      
      <div class="vigilance-meta-row">
        <div class="vigilance-meta-item">
          <strong style="color: ${colorVar}">${pvtData.meanRT} ms</strong>
          <span>${d.vigilanceMeanRT}</span>
        </div>
        <div class="vigilance-meta-item">
          <strong style="color: ${pvtData.lapses > 0 ? 'var(--danger)' : 'var(--text-primary)'}">${pvtData.lapses}</strong>
          <span>${d.vigilanceLapses}</span>
        </div>
      </div>
    `;
  } else {
    // Empty state PVT-B Pending
    vigilancePanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h4>${d.vigilancePendingTitle}</h4>
        <p>${d.vigilancePendingDesc}</p>
        <a href="../pvt-app/index.html" class="btn btn-primary btn-sm" style="background: var(--brand-secondary); box-shadow: 0 4px 10px rgba(59, 130, 246, 0.25); border-color: transparent;">${d.vigilanceBtnTake}</a>
      </div>
    `;
  }

  // 7.3 Render Panel C: Cognitive Flexibility TMT
  const flexPanel = document.getElementById('flexibilityPanel');
  if (flexPanel) {
    flexPanel.querySelector('.panel-title').childNodes[2].textContent = d.flexibilityPanelTitle;
  }
  
  if (tmtData) {
    tmtTimeLabel.textContent = tmtData.dateTime;
    
    const pct = parseInt(tmtData.percentileB);
    const strokeOffset = 264 - (264 * (pct / 100));
    
    let isNormal = tmtData.clinicalStatus === 'NORMAL';
    let colorVar = isNormal ? "var(--success)" : "var(--danger)";
    
    flexibilityPanelContent.innerHTML = `
      <div class="accuracy-radial-box">
        <svg viewBox="0 0 100 100" class="circle-svg">
          <circle cx="50" cy="50" r="42" stroke="var(--card-border)" stroke-width="6.5" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="${colorVar}" stroke-width="7.5" stroke-dasharray="264" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" fill="none" class="gauge-fill-ring" />
        </svg>
        <div class="accuracy-inner-val">
          <span class="pct" style="color: ${colorVar}">${pct}th</span>
          <span class="lbl">${currentLanguage === 'en' ? 'Percentile' : '常模比率'}</span>
        </div>
      </div>
      
      <div class="vigilance-meta-row">
        <div class="vigilance-meta-item">
          <strong style="color: ${colorVar}">${tmtData.ratio.toFixed(2)}</strong>
          <span>${d.flexibilityRatio}</span>
        </div>
        <div class="vigilance-meta-item">
          <strong style="color: var(--text-primary)">${tmtData.durationB.toFixed(1)}s</strong>
          <span>${d.flexibilityPartB}</span>
        </div>
      </div>
    `;
  } else {
    // Empty state TMT Pending
    flexibilityPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
          <line x1="15" y1="3" x2="15" y2="21"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
        </svg>
        <h4>${d.flexibilityPendingTitle}</h4>
        <p>${d.flexibilityPendingDesc}</p>
        <a href="../tmt-app/index.html" class="btn btn-primary btn-sm" style="background: var(--success); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25); border-color: transparent;">${d.flexibilityBtnTake}</a>
      </div>
    `;
  }
  
  // 7.4 Render Panel D: High-Fidelity Combined Circadian Alignment
  const diagPanel = document.getElementById('diagnosticsPanel');
  if (diagPanel) {
    diagPanel.querySelector('.panel-title').childNodes[2].textContent = d.diagnosticsPanelTitle;
  }
  
  calculateCombinedDiagnostics(meqData, pvtData, tmtData);
}

// --- 8. HIGH-FIDELITY DIAGNOSTICS & ALIGNMENT CALCULATIONS ---
function calculateCombinedDiagnostics(meqData, pvtData, tmtData) {
  const d = I18N_DICTS[currentLanguage];

  if (!meqData && !pvtData && !tmtData) {
    // Completely missing history records
    diagnosticsPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h4>${d.diagnosticsPendingTitle}</h4>
        <p>${d.diagnosticsPendingDesc}</p>
      </div>
    `;
    return;
  }
  
  if (!meqData || !pvtData || !tmtData) {
    // Partial records completed
    let missingApp = [];
    if (!meqData) missingApp.push(currentLanguage === 'en' ? "rMEQ sleep type" : "rMEQ 节律量表");
    if (!pvtData) missingApp.push(currentLanguage === 'en' ? "PVT reaction" : "PVT 反应速度");
    if (!tmtData) missingApp.push(currentLanguage === 'en' ? "TMT flexibility" : "TMT 切换测验");
    
    diagnosticsPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <h4>${d.diagnosticsPartialTitle}</h4>
        <p>${d.diagnosticsPartialDesc.replace('{missing}', missingApp.join(', '))}</p>
      </div>
    `;
    return;
  }
  
  // All three assessments are complete! Fire up high-fidelity medical audit calculations
  const chronotypeName = meqData.chronotype;
  const meanRT = pvtData.meanRT;
  const lapses = pvtData.lapses;
  const pvtAccuracy = parseFloat(pvtData.performanceScore);
  
  const tmtRatio = tmtData.ratio;
  const tmtPct = parseInt(tmtData.percentileB);
  
  const now = new Date();
  const currentHour = now.getHours();
  
  const profile = CHRONOTYPE_PROFILES[chronotypeName] || CHRONOTYPE_PROFILES["Intermediate Bear"];
  
  // A. Determine if current hour falls in their circadian peak window or circadian down-phase
  let isPeakHour = false;
  let isDownHour = false;
  
  if (profile.peakStartHour < profile.peakEndHour) {
    isPeakHour = currentHour >= profile.peakStartHour && currentHour < profile.peakEndHour;
  } else {
    isPeakHour = currentHour >= profile.peakStartHour || currentHour < profile.peakEndHour;
  }
  
  if (profile.downStartHour < profile.downEndHour) {
    isDownHour = currentHour >= profile.downStartHour && currentHour < profile.downEndHour;
  } else {
    isDownHour = currentHour >= profile.downStartHour || currentHour < profile.downEndHour;
  }
  
  // B. Compute alignment sync percentage
  let focusWeight = pvtAccuracy * 0.4;
  let tmtWeight = tmtPct * 0.3;
  let clockWeight = isPeakHour ? 30 : (isDownHour ? 10 : 22);
  
  let alignmentScore = Math.round(focusWeight + tmtWeight + clockWeight);
  alignmentScore = Math.max(0, Math.min(100, alignmentScore));
  
  let diagnosticStatus = "";
  let diagnosticDesc = "";
  let statusColor = "var(--success)";
  
  // Sub-evaluate performance & coordination boundaries
  const isPvtFailing = meanRT >= 280 || lapses > 1;
  const isTmtFailing = tmtRatio >= 3.0;
  
  // Translate chronotype names in text
  let transName = chronotypeName;
  if (currentLanguage === 'zh') {
    if (chronotypeName === 'Morning Lark') transName = '清晨云雀';
    else if (chronotypeName === 'Intermediate Bear') transName = '中间性小熊';
    else if (chronotypeName === 'Evening Owl') transName = '黄昏猫头鹰';
  }
  
  if (!isPvtFailing && !isTmtFailing) {
    if (isPeakHour) {
      alignmentScore = Math.min(100, alignmentScore + 5);
      diagnosticStatus = d.diagnosticsStatusPerfect;
      statusColor = "var(--success)";
      diagnosticDesc = d.interpretPerfect.replace('${meanRT}', meanRT).replace('${ratio}', tmtRatio.toFixed(2)).replace('${chronotype}', transName);
    } else if (isDownHour) {
      diagnosticStatus = d.diagnosticsStatusHyper;
      statusColor = "var(--success)";
      diagnosticDesc = d.interpretHyper.replace('${meanRT}', meanRT).replace('${chronotype}', transName);
    } else {
      diagnosticStatus = d.diagnosticsStatusRested;
      statusColor = "var(--success)";
      diagnosticDesc = d.interpretRested.replace('${meanRT}', meanRT);
    }
  } else if (isPvtFailing && isTmtFailing) {
    statusColor = "var(--danger)";
    if (isDownHour) {
      alignmentScore = Math.max(30, alignmentScore - 15);
      diagnosticStatus = d.diagnosticsStatusDeSync;
      diagnosticDesc = d.interpretDeSync.replace('${meanRT}', meanRT).replace('${ratio}', tmtRatio.toFixed(2));
    } else {
      alignmentScore = Math.max(25, alignmentScore - 25);
      diagnosticStatus = d.diagnosticsStatusFatigued;
      diagnosticDesc = d.interpretFatigued.replace('${meanRT}', meanRT).replace('${chronotype}', transName);
    }
  } else if (isTmtFailing) {
    statusColor = "var(--warning)";
    alignmentScore = Math.max(45, alignmentScore - 10);
    diagnosticStatus = d.diagnosticsStatusTmtLag;
    diagnosticDesc = d.interpretTmtLag.replace('${ratio}', tmtRatio.toFixed(2));
  } else {
    statusColor = "var(--warning)";
    alignmentScore = Math.max(50, alignmentScore - 8);
    diagnosticStatus = d.diagnosticsStatusPvtLag;
    diagnosticDesc = d.interpretPvtLag.replace('${meanRT}', meanRT);
  }
  
  diagnosticsPanelContent.innerHTML = `
    <div class="cognitive-score-wrapper">
      <span class="cognitive-index-val" style="color: ${statusColor};">${alignmentScore}</span>
      <span class="cognitive-index-max">/100</span>
    </div>
    
    <div class="cognitive-status-title" style="color: ${statusColor};">${diagnosticStatus}</div>
    <p class="cognitive-status-desc">${diagnosticDesc}</p>
    
    <div class="cognitive-status-footer" style="color: ${profile.color}; border-color: rgba(${profile.colorRgb}, 0.2); background: rgba(${profile.colorRgb}, 0.05);">
      ${d.diagnosticsBedtimeLabel}<strong>${profile.bed}</strong>
    </div>
  `;
}

// --- 9. INITIALIZATION & BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  startLiveClock();
  
  // Language button click listener
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLanguage === 'en' ? 'zh' : 'en';
      setLanguage(nextLang);
    });
  }
  
  // Listen for localstorage changes across tabs (if user updates results in children)
  window.addEventListener('storage', (e) => {
    if (e.key === 'circaAlign_history' || e.key === 'pvt_history' || e.key === 'tmt_history') {
      renderDashboard();
    }
    if (e.key === 'sleepwell_lang') {
      setLanguage(e.newValue || 'en');
    }
  });
});
