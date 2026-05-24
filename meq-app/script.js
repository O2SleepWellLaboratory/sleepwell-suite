/**
 * CircaAlign - Circadian Rhythm Alignment Tool
 * Scientifically validated reduced Morningness-Eveningness Questionnaire (rMEQ)
 */

// --- 1. QUESTION DATA ENGINE ---
const questions = [
  {
    id: 1,
    text: {
      en: "Considering only your own 'feeling best' rhythm, at what time would you get up if you were entirely free to plan your day?",
      zh: "仅考虑您自己“感觉最好”的生物钟节奏，如果您完全可以自由安排一天，您会在什么时间起床？"
    },
    options: [
      { text: { en: "05:00 AM - 06:30 AM", zh: "早上 05:00 - 06:30" }, points: 5 },
      { text: { en: "06:30 AM - 07:45 AM", zh: "早上 06:30 - 07:45" }, points: 4 },
      { text: { en: "07:45 AM - 09:45 AM", zh: "早上 07:45 - 09:45" }, points: 3 },
      { text: { en: "09:45 AM - 11:00 AM", zh: "上午 09:45 - 11:00" }, points: 2 },
      { text: { en: "11:00 AM - 12:00 PM (Noon)", zh: "上午 11:00 - 中午 12:00" }, points: 1 }
    ]
  },
  {
    id: 2,
    text: {
      en: "During the first half-hour after having awakened in the morning, how tired do you feel?",
      zh: "早晨起床后的前半小时内，您感觉有多疲倦？"
    },
    options: [
      { text: { en: "Very tired", zh: "非常疲倦" }, points: 1 },
      { text: { en: "Fairly tired", zh: "相当疲倦" }, points: 2 },
      { text: { en: "Fairly refreshed", zh: "相当清醒" }, points: 3 },
      { text: { en: "Very refreshed", zh: "非常清醒" }, points: 4 }
    ]
  },
  {
    id: 3,
    text: {
      en: "At what time in the evening, having no commitments, would you go to bed?",
      zh: "在晚上没有任何事务约束的情况下，您会在什么时间上床睡觉？"
    },
    options: [
      { text: { en: "08:00 PM - 09:00 PM", zh: "晚上 08:00 - 09:00" }, points: 5 },
      { text: { en: "09:00 PM - 10:15 PM", zh: "晚上 09:00 - 10:15" }, points: 4 },
      { text: { en: "10:15 PM - 12:30 AM (Midnight)", zh: "晚上 10:15 - 凌晨 12:30" }, points: 3 },
      { text: { en: "12:30 AM - 01:45 AM", zh: "凌晨 12:30 - 01:45" }, points: 2 },
      { text: { en: "01:45 AM - 03:00 AM", zh: "凌晨 01:45 - 03:00" }, points: 1 }
    ]
  },
  {
    id: 4,
    text: {
      en: "At what time of the day do you think that you reach your 'feeling best' peak?",
      zh: "在一天的哪一个时间段内，您觉得自己达到了“感觉最好”的巅峰状态？"
    },
    options: [
      { text: { en: "05:00 AM - 08:00 AM", zh: "早上 05:00 - 08:00" }, points: 5 },
      { text: { en: "08:00 AM - 10:00 AM", zh: "早上 08:00 - 10:00" }, points: 4 },
      { text: { en: "10:00 AM - 05:00 PM", zh: "上午 10:00 - 下午 05:00" }, points: 3 },
      { text: { en: "05:00 PM - 10:00 PM", zh: "下午 05:00 - 晚上 10:00" }, points: 2 },
      { text: { en: "10:00 PM - 05:00 AM", zh: "晚上 10:00 - 早上 05:00" }, points: 1 }
    ]
  },
  {
    id: 5,
    text: {
      en: "One hears about 'morning' and 'evening' types of people. Which one of these types do you consider yourself to be?",
      zh: "常听到人们分为“清晨型”和“黄昏型”两种类型。您认为自己属于其中的哪一种？"
    },
    options: [
      { text: { en: "Definitely a morning type", zh: "绝对是清晨型（早起鸟）" }, points: 6 },
      { text: { en: "More a morning than an evening type", zh: "清晨型多于黄昏型" }, points: 4 },
      { text: { en: "More an evening than a morning type", zh: "黄昏型多于清晨型" }, points: 2 },
      { text: { en: "Definitely an evening type", zh: "绝对是黄昏型（夜猫子）" }, points: 0 }
    ]
  }
];

// --- 2. STATE CONSTANTS & VARIABLES ---
let currentQuestionIdx = 0;
let answers = Array(questions.length).fill(null); // stores selected option index for each question
let lastCalculatedScore = null;

// Chronotype classifications metadata
const CHRONOTYPES = {
  LARK: {
    name: { en: "Morning Lark", zh: "清晨云雀" },
    scoreRange: "18 - 25",
    accentColor: "var(--accent-morning)",
    accentRgb: "var(--accent-morning-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>`,
    description: {
      en: "Morning types (Larks) typically experience high alertness and energy in the early hours. They wake up refreshed, reach their cognitive peak by mid-morning, and naturally wind down early in the evening. Waking early feels easy and biological schedules align well with traditional solar days.",
      zh: "清晨型（云雀）通常在清晨体验到极高的警觉度和能量。他们醒来时感到精力充沛，在上午十点左右达到认知巅峰，并在傍晚自然地进入放松状态。早起对他们而言非常轻松，其生理时钟与传统的太阳日作息完美契合。"
    },
    sleepSchedule: { bed: "10:00 PM", wake: "06:00 AM", bedH: 22.0, wakeH: 6.0 },
    recommendations: [
      {
        title: { en: "Cortisol & Sunlight Anchor", zh: "皮质醇与日光锚定" },
        time: { en: "06:00 AM", zh: "早上 06:00" },
        desc: {
          en: "Get 10 minutes of direct bright solar light immediately after rising. This triggers immediate cortisol release and puts a hard stop on melatonin production, cementing your early-phase schedule.",
          zh: "起床后立即接受 10 分钟的阳光直射。这会触发皮质醇的即刻释放，并终止褪黑素的分泌，从而巩固您的早起作息。"
        }
      },
      {
        title: { en: "Peak Cognitive Window", zh: "大脑认知巅峰期" },
        time: { en: "08:00 AM - 12:00 PM", zh: "上午 08:00 - 中午 12:00" },
        desc: {
          en: "Your logical capacity, high-focus planning, and analytical processing peak during these morning hours. Dedicate this block to intense mental projects, system design, or complex engineering tasks.",
          zh: "在这段上午的时间里，您的逻辑能力、高度专注规划和分析处理能力达到顶峰。请将此时间段用于处理高强度的脑力项目、系统设计或复杂的工程任务。"
        }
      },
      {
        title: { en: "Coordination & Cardio Peak", zh: "身体协调与有氧巅峰" },
        time: { en: "03:30 PM - 05:30 PM", zh: "下午 03:30 - 下午 05:30" },
        desc: {
          en: "Core body temperature and muscular efficiency peak around late afternoon, making this the safest and most efficient time for heavy muscle-building exercises or cardio workouts.",
          zh: "核心体温和肌肉效率在傍晚前达到顶峰，这使得该时间段成为进行大负荷肌肉锻炼或有氧运动最安全、最高效的时间。"
        }
      },
      {
        title: { en: "Circadian Wind-Down", zh: "生理时钟放松期" },
        time: { en: "08:30 PM - 10:00 PM", zh: "晚上 08:30 - 晚上 10:00" },
        desc: {
          en: "Dim all ambient screens and activate amber lighting. Melatonin begins natural secretion around 8:00 PM. A cool, dark room will help you glide into deep delta sleep by 10:00 PM.",
          zh: "调暗所有周围屏幕并使用琥珀色照明。褪黑素在晚上 8:00 左右开始自然分泌。凉爽且黑暗的房间将有助于您在晚上 10:00 前轻松滑入深层 Delta 睡眠。"
        }
      }
    ]
  },
  BEAR: {
    name: { en: "Intermediate Bear", zh: "中间性小熊" },
    scoreRange: "12 - 17",
    accentColor: "var(--accent-bear)",
    accentRgb: "var(--accent-bear-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 6c-3.3 0-6 2.7-6 6" />
              </svg>`,
    description: {
      en: "Intermediate types (Bears/Hummingbirds) follow the standard cycle of the sun. Alertness builds gradually through the morning, peaks mid-day, and declines in the late evening. Waking up requires a brief adjustment period, and they thrive on a stable 8-hour sleep/wake routine.",
      zh: "中间型（小熊）遵循太阳的标准循环。警觉度在整个上午逐渐建立，在中午达到顶峰，并在深夜下降。起床后需要简短的适应期，他们非常适合稳定的 8 小时睡眠/觉醒作息。"
    },
    sleepSchedule: { bed: "11:30 PM", wake: "07:30 AM", bedH: 23.5, wakeH: 7.5 },
    recommendations: [
      {
        title: { en: "Gradual Awakening & Hydration", zh: "渐进唤醒与水分补充" },
        time: { en: "07:30 AM", zh: "早上 07:30" },
        desc: {
          en: "Allow 20 minutes to shake off sleep inertia. Hydrate immediately with 500ml of water and seek natural ambient light to reset your circadian master clock.",
          zh: "给身体 20 分钟时间来摆脱睡眠惯性。立即饮用 500 毫升水，并寻求自然环境光线以重置您的生理主时钟。"
        }
      },
      {
        title: { en: "Primary analytical block", zh: "黄金分析时间段" },
        time: { en: "09:30 AM - 12:30 PM", zh: "上午 09:30 - 中午 12:30" },
        desc: {
          en: "Your highest level of mental precision and rapid reasoning occurs before lunch. Focus on critical code architectural work, writing, or strategic calls.",
          zh: "在午餐前，您的大脑精准度和快速推理能力达到最高水平。请专注于核心代码架构工作、撰写文档或重要的策略通话。"
        }
      },
      {
        title: { en: "Secondary Focus / Brainstorming", zh: "次级专注 / 脑力激荡" },
        time: { en: "02:30 PM - 04:30 PM", zh: "下午 02:30 - 下午 04:30" },
        desc: {
          en: "After the standard post-lunch physiological dip, alertness rebounds in a creative way. Great for collaborative brainstorming, design reviews, or lighter administrative work.",
          zh: "在午餐后的标准生理低谷之后，您的警觉度会以充满创造力的方式反弹。非常适合团队协作脑力激荡、设计评审或较轻松的行政事务。"
        }
      },
      {
        title: { en: "Evening Relaxation Cycle", zh: "晚间放松周期" },
        time: { en: "10:30 PM - 11:30 PM", zh: "晚上 10:30 - 晚上 11:30" },
        desc: {
          en: "Melatonin secretion rises. Wind down by turning off active computer screens, lowering light temperature, and cooling down your room to 18°C (65°F) for optimal sleep cycles.",
          zh: "褪黑素分泌上升。通过关闭所有正在使用的电脑屏幕、调低灯光色温并将室温降低至 18°C (65°F) 来进行放松，以获得最佳睡眠周期。"
        }
      }
    ]
  },
  OWL: {
    name: { en: "Evening Owl", zh: "黄昏猫头鹰" },
    scoreRange: "4 - 11",
    accentColor: "var(--accent-evening)",
    accentRgb: "var(--accent-evening-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>`,
    description: {
      en: "Evening types (Owls) experience a phase-delayed circadian rhythm. Alertness increases progressively throughout the day and peaks in the late afternoon and night. Early mornings are typically marked by grogginess (sleep inertia), whereas late-night hours offer profound focus, flow state, and creative energy.",
      zh: "黄昏型（猫头鹰）具有相位延迟的生理时钟。警觉度在一天中逐步攀升，并在傍晚和深夜达到顶峰。清晨通常伴随昏沉感（睡眠惯性），而深夜则能提供极深的专注力、心流状态和源源不断的创造力。"
    },
    sleepSchedule: { bed: "01:30 AM", wake: "09:30 AM", bedH: 1.5, wakeH: 9.5 },
    recommendations: [
      {
        title: { en: "Delayed Light exposure", zh: "延迟性光照激活" },
        time: { en: "09:30 AM", zh: "上午 09:30" },
        desc: {
          en: "Upon waking, flood your room with bright light (use a 10,000-lux lamp if solar light isn't fully available) to accelerate the clearance of residual sleep melatonin.",
          zh: "醒来后，让房间充满明亮的光线（如果自然阳光不足，可使用 10,000 勒克斯的光疗灯）以加速清除体内残留的褪黑素。"
        }
      },
      {
        title: { en: "Creative Alertness Peak", zh: "创造性警觉高峰" },
        time: { en: "05:00 PM - 09:00 PM", zh: "下午 05:00 - 晚上 09:00" },
        desc: {
          en: "Unlike Larks, your brain reaches maximum executive power, problem-solving, and cognitive fluid reasoning late in the day. Use this window for deep coding, engineering, or complex design work.",
          zh: "与清晨型不同，您的大脑执行力、问题解决能力和认知流体推理在较晚的时候达到峰值。请利用此窗口进行深度的编程、工程研发或复杂的设计工作。"
        }
      },
      {
        title: { en: "Late-Phase Physical Peak", zh: "晚期生理巅峰" },
        time: { en: "06:00 PM - 08:30 PM", zh: "晚上 06:00 - 晚上 08:30" },
        desc: {
          en: "Your coordination, cardiovascular capacity, and body temperature peak significantly later. Heavy weight training or high-intensity exercise is optimal and safe during these evening blocks.",
          zh: "您的身体协调能力、心血管耐力和体温峰值出现得明显较晚。在这段傍晚时间段进行重负荷力量训练或高强度有氧运动最为理想且安全。"
        }
      },
      {
        title: { en: "Deep Night Wind-down", zh: "深夜深度放松" },
        time: { en: "12:00 AM - 01:30 AM", zh: "凌晨 12:00 - 凌晨 01:30" },
        desc: {
          en: "As your peak winds down, signal sleep to your system. Ban blue screens entirely, utilize warm sunset orange lighting, and practice deep box breathing to lower your heart rate.",
          zh: "随着精力高峰逐渐减退，向您的身体系统发出准备睡眠的信号。完全禁用蓝色屏幕，使用温馨的夕阳橘灯光，并练习深度的箱式呼吸以降低心率。"
        }
      }
    ]
  }
};

// --- 2.5 LANGUAGES & TRANSLATIONS ENGINE ---
let currentLanguage = 'en';

const I18N_DICTS = {
  en: {
    langToggleBtn: "中文",
    heroBadge: "Science-Backed Chronology",
    heroTitle: "Discover Your <span>Circadian Rhythm</span>",
    heroDesc: "Find your peak productivity windows, optimize your sleep patterns, and align your schedule with your biology. Take the validated reduced Morningness-Eveningness Questionnaire (rMEQ) in under 2 minutes.",
    lblStartQuiz: "Start Assessment",
    lblViewHistoryQuick: "View History",
    
    // Quiz Screen
    stepsCounter: "Question",
    quitQuizBtn: "Quit Quiz",
    lblPrev: "Previous",
    lblNext: "Next",
    lblViewResults: "View Results",
    
    // Results Screen
    lblYourChronotype: "Your Chronotype",
    lblIdealSchedule: "Ideal Sleep Schedule",
    lblBedtime: "Optimal Bedtime",
    lblWakeTime: "Optimal Wake Time",
    lblScheduleTip: "Maintain these target sleep/wake boundaries even on weekends to preserve circadian synchronization and prevent 'social jetlag.'",
    lblAlertnessCycle: "Circadian Alertness Cycle",
    lblDailyRoutine: "Daily Routine Alignment Windows",
    lblRetake: "Retake Questionnaire",
    lblPrint: "Export/Print Report",
    
    // History Section
    lblHistoryTitle: "Chronotype History",
    clearHistoryBtn: "Clear Records",
    emptyHistoryText: "No assessment records yet. Take the rMEQ questionnaire to save your first result!",
    
    // Educational Section
    lblEduSectionTitle: "Understanding Chronobiology",
    lblEduCard1Title: "What is a Chronotype?",
    lblEduCard1Desc: "Your chronotype is the natural behavioral manifestation of your underlying circadian rhythm. It dictates your body's natural disposition towards sleep, wakefulness, alertness, and peak physiological performance at specific times of the solar day.",
    lblEduCard2Title: "The Science of rMEQ",
    lblEduCard2Desc: "The reduced Morningness-Eveningness Questionnaire (rMEQ) is a psychometric questionnaire developed by Adan and Almirall in 1991. Consisting of 5 core diagnostic items extracted from the full 19-item MEQ, it offers a quick yet scientifically rigorous measure of circadian phase alignment.",
    lblEduCard3Title: "Circadian Alignment",
    lblEduCard3Desc: "Living out of sync with your internal chronometer is linked to 'social jetlag,' which impacts mental health, focus, and metabolism. Aligning deep cognitive work, workouts, and sleep with your biological peaks dramatically enhances energy levels and focus.",
    
    // Footer & Citations
    scrollToTopLink: "Back to Top",
    footerCitation: "rMEQ scientific methodology based on: Adan, A., & Almirall, H. (1991). <em>Horne & Östberg Morningness-Eveningness Questionnaire: A reduced version</em>. <strong>Chronobiology International</strong>, 8(3), 233-243. Used with clinical validation.",
    
    // Browser Prompts
    quitQuizConfirm: "Are you sure you want to quit the assessment? Your progress will be lost.",
    clearHistoryConfirm: "Are you sure you want to clear all history records? This cannot be undone.",
    logoQuitConfirm: "Quit active questionnaire and visit O₂ Sleepwell Laboratory?",
    
    // Chart elements
    chartSleepWindow: "Sleep Window",
    chartTrough: "Alertness Trough",
    chartPeak: "Peak Alertness",
    chart12am: "12 AM",
    chart6am: "6 AM",
    chart12pm: "12 PM",
    chart6pm: "6 PM",
    
    // Alertness levels
    clockStateMelatoninCeases: "Melatonin Ceases",
    clockStatePeakAlertness: "Peak Alertness",
    clockStateCoordinationHigh: "Coordination High",
    clockStateBestCardioState: "Best Cardio State",
    clockStateMelatoninBegins: "Melatonin Begins",
    clockStateDeepestSleepTrough: "Deepest Sleep Trough"
  },
  zh: {
    langToggleBtn: "English",
    heroBadge: "科学实证生物节律测评",
    heroTitle: "探索您的<span>昼夜生理时钟节律</span>",
    heroDesc: "寻找您的黄金工作窗口、优化睡眠模式，并使您的日常生活与生物时钟完美对齐。在 2 分钟内完成经过临床验证的精简版晨昏型问卷 (rMEQ)。",
    lblStartQuiz: "开始测评",
    lblViewHistoryQuick: "查看历史记录",
    
    // Quiz Screen
    stepsCounter: "问题",
    quitQuizBtn: "退出测试",
    lblPrev: "上一题",
    lblNext: "下一题",
    lblViewResults: "查看报告",
    
    // Results Screen
    lblYourChronotype: "您的睡眠型态",
    lblIdealSchedule: "理想睡眠作息表",
    lblBedtime: "最佳入睡时间",
    lblWakeTime: "最佳起床时间",
    lblScheduleTip: "即使在周末也请保持这些目标睡眠/觉醒界限，以维持生理节律同步并防止“社交时差”。",
    lblAlertnessCycle: "昼夜警觉度变化曲线",
    lblDailyRoutine: "每日日常作息对齐窗口",
    lblRetake: "重新测评问卷",
    lblPrint: "导出/打印报告",
    
    // History Section
    lblHistoryTitle: "睡眠型态历史记录",
    clearHistoryBtn: "清除所有记录",
    emptyHistoryText: "暂无测评记录。完成 rMEQ 问卷以保存您的首次测评结果！",
    
    // Educational Section
    lblEduSectionTitle: "了解时间生物学",
    lblEduCard1Title: "什么是睡眠型态 (Chronotype)？",
    lblEduCard1Desc: "您的睡眠型态是您潜在昼夜节律的自然行为体现。它决定了您的身体在一天中对睡眠、觉醒、警觉度和巅峰生理表现的自然倾向。",
    lblEduCard2Title: "rMEQ 的科学依据",
    lblEduCard2Desc: "精简版晨昏型问卷 (rMEQ) 是 Adan 和 Almirall 于 1991 年开发的心理学测评工具。它由完整 19 项 MEQ 中提取的 5 个核心诊断项目组成，提供了快速且科学严谨的生理节律相位对齐测量方式。",
    lblEduCard3Title: "昼夜生理节律对齐",
    lblEduCard3Desc: "与内部生物钟不同步会导致“社交时差”，进而影响心理健康、专注力和新陈代谢。将深度脑力工作、健身和睡眠与您的生物巅峰对齐，能大幅提升精力水平和注意力。",
    
    // Footer & Citations
    scrollToTopLink: "返回顶部",
    footerCitation: "rMEQ 科学方法论基于：Adan, A., & Almirall, H. (1991). <em>Horne & Östberg Morningness-Eveningness Questionnaire: A reduced version</em>. <strong>Chronobiology International</strong>, 8(3), 233-243. 临床验证使用。",
    
    // Browser Prompts
    quitQuizConfirm: "您确定要退出测评吗？您的当前进度将会丢失。",
    clearHistoryConfirm: "您确定要清除所有历史记录吗？清除后将无法恢复。",
    logoQuitConfirm: "是否退出当前答题并访问 O₂ Sleepwell Laboratory 官方网站？",
    
    // Chart elements
    chartSleepWindow: "睡眠窗口",
    chartTrough: "警觉度谷值",
    chartPeak: "警觉度峰值",
    chart12am: "凌晨 12点",
    chart6am: "上午 6点",
    chart12pm: "中午 12点",
    chart6pm: "下午 6点",
    
    // Alertness levels
    clockStateMelatoninCeases: "褪黑素停止分泌",
    clockStatePeakAlertness: "警觉度峰值",
    clockStateCoordinationHigh: "身体协调度高",
    clockStateBestCardioState: "最佳有氧状态",
    clockStateMelatoninBegins: "褪黑素开始分泌",
    clockStateDeepestSleepTrough: "深层睡眠谷值"
  }
};

// --- 3. DOM ELEMENT REFERENCES ---
// Layout Containers
const heroSection = document.getElementById('heroSection');
const quizSection = document.getElementById('quizSection');
const resultsSection = document.getElementById('resultsSection');
const historySection = document.getElementById('historySection');

// Hero Interaction
const startQuizBtn = document.getElementById('startQuizBtn');
const viewHistoryQuickBtn = document.getElementById('viewHistoryQuickBtn');
const logoLink = document.getElementById('logoLink');
const scrollToTopLink = document.getElementById('scrollToTopLink');

// Quiz Elements
const currentQuestionNum = document.getElementById('currentQuestionNum');
const progressBarFill = document.getElementById('progressBarFill');
const quitQuizBtn = document.getElementById('quitQuizBtn');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');

// Dashboard Results Elements
const chronotypeScore = document.getElementById('chronotypeScore');
const chronotypeDesc = document.getElementById('chronotypeDesc');
const illustrationCard = document.getElementById('illustrationCard');
const illustrationIconWrapper = document.getElementById('illustrationIconWrapper');
const illustrationLabel = document.getElementById('illustrationLabel');
const optimalBedtime = document.getElementById('optimalBedtime');
const optimalWakeTime = document.getElementById('optimalWakeTime');
const circadianChart = document.getElementById('circadianChart');
const recommendationsList = document.getElementById('recommendationsList');
const retakeQuizBtn = document.getElementById('retakeQuizBtn');
const printReportBtn = document.getElementById('printReportBtn');

// History Elements
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');

// Theme Toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

// --- 4. THEME CONTROLLER ---
function initTheme() {
  const savedTheme = localStorage.getItem('circaAlign_theme') || 'dark';
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
  localStorage.setItem('circaAlign_theme', newTheme);
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

// --- 5. HERO DECORATIVE CLOCK ANIMATOR ---
const clockStates = [
  { 
    time: { en: '07:30 AM', zh: '早上 07:30' }, 
    text: { en: 'Melatonin Ceases', zh: '褪黑素停止分泌' }, 
    color: 'var(--accent-morning)',
    svg: `<circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />`
  },
  { 
    time: { en: '10:00 AM', zh: '上午 10:00' }, 
    text: { en: 'Peak Alertness', zh: '警觉度峰值' }, 
    color: 'var(--accent-bear)',
    svg: `<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2" />`
  },
  { 
    time: { en: '02:30 PM', zh: '下午 02:30' }, 
    text: { en: 'Coordination High', zh: '身体协调度高' }, 
    color: 'var(--brand-secondary)',
    svg: `<path d="M22 12h-4l-3 9L9 3l-3 9H2" />`
  },
  { 
    time: { en: '05:30 PM', zh: '下午 05:30' }, 
    text: { en: 'Best Cardio State', zh: '最佳有氧状态' }, 
    color: 'var(--accent-morning)',
    svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />`
  },
  { 
    time: { en: '09:00 PM', zh: '晚上 09:00' }, 
    text: { en: 'Melatonin Begins', zh: '褪黑素开始分泌' }, 
    color: 'var(--accent-evening)',
    svg: `<path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.3" />`
  },
  { 
    time: { en: '02:00 AM', zh: '凌晨 02:00' }, 
    text: { en: 'Deepest Sleep Trough', zh: '深层睡眠谷值' }, 
    color: 'var(--text-muted)',
    svg: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />`
  }
];

let currentClockStateIdx = 0;

function updateHeroClockUI() {
  const clockTimeEl = document.getElementById('heroTimeIndicator');
  const clockBadgeEl = document.getElementById('heroClockState');
  const clockSvgEl = document.querySelector('.clock-center-art svg');
  if (!clockTimeEl) return;
  
  const currentState = clockStates[currentClockStateIdx];
  const lang = currentLanguage;
  
  clockTimeEl.textContent = currentState.time[lang];
  clockTimeEl.style.color = currentState.color;
  
  if (clockBadgeEl) {
    clockBadgeEl.textContent = currentState.text[lang];
    clockBadgeEl.style.color = currentState.color;
    clockBadgeEl.style.borderColor = currentState.color.replace(')', ', 0.35)');
    clockBadgeEl.style.backgroundColor = currentState.color.replace(')', ', 0.08)');
  }
  
  if (clockSvgEl) {
    clockSvgEl.innerHTML = currentState.svg;
    clockSvgEl.setAttribute('stroke', currentState.color);
    clockSvgEl.style.filter = `drop-shadow(0 0 8px ${currentState.color.replace(')', ', 0.45)')})`;
  }
}

function initHeroClock() {
  updateHeroClockUI();
  
  setInterval(() => {
    currentClockStateIdx = (currentClockStateIdx + 1) % clockStates.length;
    updateHeroClockUI();
  }, 3500);
}

// --- 6. STATE TRANSITIONS & SCREEN SWITCHES ---
function showScreen(screen) {
  // Hide all screens
  heroSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  
  // Show target screen
  screen.classList.remove('hidden');
  
  // Ensure the history section is only visible when NOT in the active quiz
  if (screen === quizSection) {
    historySection.classList.add('hidden');
  } else {
    historySection.classList.remove('hidden');
    loadHistory(); // load history when going back to dashboards or home
  }
}

// --- 7. QUIZ STATE MACHINE ---
function startQuiz() {
  currentQuestionIdx = 0;
  answers = Array(questions.length).fill(null);
  showScreen(quizSection);
  renderQuestion();
}

function quitQuiz() {
  if (confirm(I18N_DICTS[currentLanguage].quitQuizConfirm)) {
    showScreen(heroSection);
  }
}

function renderQuestion() {
  const q = questions[currentQuestionIdx];
  const lang = currentLanguage;
  const d = I18N_DICTS[lang];
  
  // Update Steps & Progress Bar
  currentQuestionNum.textContent = currentQuestionIdx + 1;
  const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
  
  // Update Steps Counter label
  const stepsCounterEl = document.getElementById('stepsCounter');
  if (stepsCounterEl) {
    stepsCounterEl.innerHTML = `${d.stepsCounter} <span id="currentQuestionNum">${currentQuestionIdx + 1}</span><span>/5</span>`;
  }
  
  // Update Question Text
  questionText.textContent = q.text[lang];
  
  // Render Options
  optionsList.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option-item';
    if (answers[currentQuestionIdx] === idx) {
      optionEl.classList.add('selected');
    }
    
    optionEl.innerHTML = `
      <span class="option-label">${opt.text[lang]}</span>
      <span class="option-check">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    `;
    
    optionEl.addEventListener('click', () => selectOption(idx));
    optionsList.appendChild(optionEl);
  });
  
  // Update Navigation Buttons
  if (currentQuestionIdx === 0) {
    prevQuestionBtn.classList.add('hidden');
  } else {
    prevQuestionBtn.classList.remove('hidden');
  }
  
  // Check if option is selected
  const hasSelection = answers[currentQuestionIdx] !== null;
  nextQuestionBtn.disabled = !hasSelection;
  
  if (currentQuestionIdx === questions.length - 1) {
    nextQuestionBtn.innerHTML = `
      ${d.lblViewResults}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
  } else {
    nextQuestionBtn.innerHTML = `
      ${d.lblNext}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
  }
}

function selectOption(optIdx) {
  // Update answer in state
  answers[currentQuestionIdx] = optIdx;
  
  // Re-render options to show selection visual instantly
  const children = optionsList.children;
  for (let i = 0; i < children.length; i++) {
    if (i === optIdx) {
      children[i].classList.add('selected');
    } else {
      children[i].classList.remove('selected');
    }
  }
  
  // Enable next button
  nextQuestionBtn.disabled = false;
  
  // Auto-advance with a slight delay for rich tactile feedback
  setTimeout(() => {
    if (answers[currentQuestionIdx] === optIdx && currentQuestionIdx < questions.length - 1) {
      // only advance if the selected question state hasn't changed in between
      advanceQuestion();
    }
  }, 350);
}

function advanceQuestion() {
  if (currentQuestionIdx < questions.length - 1) {
    currentQuestionIdx++;
    renderQuestion();
  } else {
    calculateResults();
  }
}

function retreatQuestion() {
  if (currentQuestionIdx > 0) {
    currentQuestionIdx--;
    renderQuestion();
  }
}

// --- 8. RESULTS ENGINE ---
function calculateResults() {
  // Calculate raw score
  let totalScore = 0;
  questions.forEach((q, qIdx) => {
    const selectedOptIdx = answers[qIdx];
    if (selectedOptIdx !== null) {
      totalScore += q.options[selectedOptIdx].points;
    }
  });
  
  lastCalculatedScore = totalScore;
  
  // Determine Chronotype Key & Save
  let typeKey = "BEAR";
  if (totalScore >= 18) {
    typeKey = "LARK";
  } else if (totalScore <= 11) {
    typeKey = "OWL";
  }
  const chronotype = CHRONOTYPES[typeKey];
  
  // Save raw English name to preserve compatibility
  let rawName = "Intermediate Bear";
  if (typeKey === "LARK") rawName = "Morning Lark";
  else if (typeKey === "OWL") rawName = "Evening Owl";
  
  saveResultToHistory(rawName, totalScore, chronotype.accentColor);
  
  // Render results UI
  renderResultsView(totalScore);
  
  // Transition View
  showScreen(resultsSection);
  
  // Smooth scroll to top of dashboard
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderResultsView(score) {
  let typeKey = "BEAR";
  if (score >= 18) {
    typeKey = "LARK";
  } else if (score <= 11) {
    typeKey = "OWL";
  }
  
  const chronotype = CHRONOTYPES[typeKey];
  const lang = currentLanguage;
  const d = I18N_DICTS[lang];
  
  // Display Score
  chronotypeScore.textContent = score;
  
  // Set up header title and colors dynamically
  const resultTitleEl = document.querySelector('.chronotype-title');
  if (resultTitleEl) {
    resultTitleEl.innerHTML = `${lang === 'en' ? 'You are an' : '您是'} <span>${chronotype.name[lang]}</span>`;
    const titleSpan = resultTitleEl.querySelector('span');
    if (titleSpan) {
      titleSpan.style.background = `linear-gradient(135deg, ${chronotype.accentColor}, var(--text-primary))`;
      titleSpan.style.webkitBackgroundClip = 'text';
      titleSpan.style.webkitTextFillColor = 'transparent';
    }
  }
  
  chronotypeDesc.textContent = chronotype.description[lang];
  
  // Update illustration card styling variables dynamically
  illustrationCard.style.setProperty('--accent-color', chronotype.accentColor);
  illustrationCard.style.setProperty('--accent-rgb', chronotype.accentRgb);
  illustrationIconWrapper.innerHTML = `
    ${chronotype.svgIcon}
    <span class="illustration-label" style="color: ${chronotype.accentColor}">${chronotype.name[lang]}</span>
  `;
  
  // Set Bed and Wake Times
  optimalBedtime.textContent = translateTimeStr(chronotype.sleepSchedule.bed);
  optimalWakeTime.textContent = translateTimeStr(chronotype.sleepSchedule.wake);
  
  // Generate Core Alignment Recommendations list
  recommendationsList.innerHTML = '';
  chronotype.recommendations.forEach(rec => {
    const recEl = document.createElement('div');
    recEl.className = 'recommendation-item';
    recEl.style.borderLeftColor = chronotype.accentColor;
    
    recEl.innerHTML = `
      <div class="recommendation-heading">
        <h4 class="recommendation-title">${rec.title[lang]}</h4>
        <span class="recommendation-time" style="color: ${chronotype.accentColor}; background: ${chronotype.accentColor.replace(')', ', 0.12)')}">${rec.time[lang]}</span>
      </div>
      <p class="recommendation-desc">${rec.desc[lang]}</p>
    `;
    recommendationsList.appendChild(recEl);
  });
  
  // Render Dynamic Circadian Graph Wave
  renderCircadianChart(chronotype, score);
  
  // Also synchronize to the clinical hub by triggering standard localStorage event
  // Clinical hub listens to circaAlign_history changes, but let's write meq_latest or trigger storage event explicitly if needed
  localStorage.setItem('circaAlign_latest', JSON.stringify({
    score: score,
    chronotype: typeKey === "LARK" ? "Morning Lark" : (typeKey === "OWL" ? "Evening Owl" : "Intermediate Bear"),
    timestamp: Date.now()
  }));
}

// --- 9. CIRCADIAN WAVEFORM GRAPH GENERATOR ---
function renderCircadianChart(chronotype, score) {
  const lang = currentLanguage;
  const d = I18N_DICTS[lang];
  
  // Determine phase shift from score linear interpolation
  // Score 4 is full owl (peak hour 9:00 PM / 21h)
  // Score 25 is full lark (peak hour 8:00 AM / 8h)
  const fraction = (score - 4) / 21;
  const peakHour = 21.0 - fraction * 13.0; // scales from 21 to 8
  const troughHour = (peakHour + 12) % 24;
  
  const bedH = chronotype.sleepSchedule.bedH;
  const wakeH = chronotype.sleepSchedule.wakeH;
  
  // Helper to format hours in graph peak dots
  const formatGraphHour = (h) => {
    let hrs = Math.floor(h) % 24;
    let mins = Math.round((h % 1) * 60);
    let displayHrs = hrs % 12;
    displayHrs = displayHrs === 0 ? 12 : displayHrs;
    let displayMins = mins < 10 ? '0' + mins : mins;
    if (lang === 'zh') {
      let phase = '上午';
      if (hrs < 5 || hrs === 12) phase = '凌晨';
      else if (hrs < 12) phase = '上午';
      else if (hrs < 18) phase = '下午';
      else phase = '晚上';
      return `${phase} ${displayHrs}:${displayMins}`;
    } else {
      let am = hrs < 12 ? 'AM' : 'PM';
      return `${displayHrs}:${displayMins} ${am}`;
    }
  };

  // Generate sleep zone SVG rectangles
  let sleepZonesHtml = '';
  const sleepColor = "var(--accent-evening)";
  const sleepLabelText = d.chartSleepWindow;
  
  if (bedH > wakeH) {
    // Bedtime wraps midnight (e.g. Bed 11:30 PM (23.5h) to Wake 7:30 AM (7.5h))
    const rect1X = bedH * 25;
    const rect1W = (24 - bedH) * 25;
    const rect2X = 0;
    const rect2W = wakeH * 25;
    
    sleepZonesHtml = `
      <rect x="${rect1X}" y="20" width="${rect1W}" height="180" fill="url(#sleepGradient)" />
      <rect x="${rect2X}" y="20" width="${rect2W}" height="180" fill="url(#sleepGradient)" />
      <!-- Dotted separators for sleep start/end -->
      <line x1="${rect1X}" y1="20" x2="${rect1X}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="${rect2W}" y1="20" x2="${rect2W}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <text x="${rect1X - 8}" y="35" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end" opacity="0.8">${sleepLabelText}</text>
    `;
  } else {
    // Sleep window entirely inside one day (e.g. Owl sleep 1:30 AM (1.5) to 9:30 AM (9.5))
    const rectX = bedH * 25;
    const rectW = (wakeH - bedH) * 25;
    
    sleepZonesHtml = `
      <rect x="${rectX}" y="20" width="${rectW}" height="180" fill="url(#sleepGradient)" />
      <line x1="${rectX}" y1="20" x2="${rectX}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="${rectX + rectW}" y1="20" x2="${rectX + rectW}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <text x="${rectX + 8}" y="35" fill="var(--text-muted)" font-size="10" font-weight="600" opacity="0.8">${sleepLabelText}</text>
    `;
  }

  // Construct Alarm alertness wave path points
  let wavePoints = [];
  for (let h = 0; h <= 24; h += 0.15) {
    let x = h * 25;
    let y = 110 - 50 * Math.cos((2 * Math.PI * (h - peakHour)) / 24);
    wavePoints.push({ x, y });
  }

  let pathD = `M ${wavePoints[0].x} ${wavePoints[0].y}`;
  for (let i = 1; i < wavePoints.length; i++) {
    pathD += ` L ${wavePoints[i].x} ${wavePoints[i].y}`;
  }

  const fillD = pathD + " L 600 200 L 0 200 Z";
  
  // Calculate Peak and Trough coordinates
  const peakX = peakHour * 25;
  const peakY = 110 - 50 * Math.cos(0); // Y = 60
  
  const troughX = troughHour * 25;
  const troughY = 110 - 50 * Math.cos(Math.PI); // Y = 160

  const lbl12am = d.chart12am;
  const lbl6am = d.chart6am;
  const lbl12pm = d.chart12pm;
  const lbl6pm = d.chart6pm;

  circadianChart.innerHTML = `
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${chronotype.accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${chronotype.accentColor}" stop-opacity="0.0" />
      </linearGradient>
      <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-evening)" stop-opacity="0.12" />
        <stop offset="100%" stop-color="var(--accent-evening)" stop-opacity="0.02" />
      </linearGradient>
    </defs>

    <!-- Sleep zones -->
    ${sleepZonesHtml}

    <!-- Grid Horizontal Lines -->
    <line x1="0" y1="20" x2="600" y2="20" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="2 4" />
    <line x1="0" y1="110" x2="600" y2="110" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="4 8" />
    <line x1="0" y1="200" x2="600" y2="200" stroke="var(--card-border)" stroke-width="1.2" />

    <!-- Grid Vertical Lines for 6h periods -->
    <line x1="0" y1="20" x2="0" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="150" y1="20" x2="150" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="300" y1="20" x2="300" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="450" y1="20" x2="450" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="600" y1="20" x2="600" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />

    <!-- Grid Axis Labels -->
    <text x="5" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif">${lbl12am}</text>
    <text x="150" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">${lbl6am}</text>
    <text x="300" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">${lbl12pm}</text>
    <text x="450" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">${lbl6pm}</text>
    <text x="595" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="end">${lbl12am}</text>

    <!-- Wave Shaded Area -->
    <path d="${fillD}" fill="url(#waveGradient)" />

    <!-- Wave Line -->
    <path d="${pathD}" fill="none" stroke="${chronotype.accentColor}" stroke-width="3.5" stroke-linecap="round" />

    <!-- Trough Indicator -->
    <g transform="translate(${troughX}, ${troughY})">
      <circle r="4" fill="var(--text-muted)" stroke="var(--card-border)" stroke-width="1.5" />
      <text y="18" fill="var(--text-muted)" font-size="10" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">${d.chartTrough}</text>
    </g>

    <!-- Peak Alertness Indicator -->
    <g transform="translate(${peakX}, ${peakY})">
      <circle r="9" fill="${chronotype.accentColor}" opacity="0.3">
        <animate attributeName="r" values="7;13;7" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle r="4.5" fill="${chronotype.accentColor}" stroke="var(--text-primary)" stroke-width="1.5" />
      <text y="-14" fill="var(--text-primary)" font-size="11" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">${d.chartPeak} (${formatGraphHour(peakHour)})</text>
    </g>
  `;
}

// Helper to format/translate sleep hours
function translateTimeStr(timeStr) {
  if (currentLanguage !== 'zh') return timeStr;
  let parts = timeStr.split(' ');
  if (parts.length < 2) return timeStr;
  let timeVal = parts[0];
  let ampm = parts[1];
  let hour = parseInt(timeVal.split(':')[0]);
  let phase = '';
  if (ampm === 'AM') {
    if (hour < 5 || hour === 12) phase = '凌晨';
    else phase = '早上';
  } else {
    if (hour === 12 || hour < 6) phase = '下午';
    else phase = '晚上';
  }
  return `${phase} ${timeVal}`;
}

// --- 10. LOCAL STORAGE HISTORY ENGINE ---
function saveResultToHistory(chronotypeName, score, accentColor) {
  const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
  const record = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    chronotype: chronotypeName,
    score: score,
    color: accentColor
  };
  
  history.unshift(record); // Add to beginning
  localStorage.setItem('circaAlign_history', JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
  
  if (history.length === 0) {
    renderEmptyHistoryState();
    return;
  }
  
  historyList.innerHTML = '';
  history.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'history-item';
    
    itemEl.style.setProperty('--accent-color', item.color);
    
    // Localize Date
    const dateObj = new Date(item.id || Date.now());
    const displayDate = currentLanguage === 'zh'
      ? dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
    // Localize Chronotype name
    let displayName = item.chronotype;
    if (currentLanguage === 'zh') {
      if (item.chronotype === 'Morning Lark') displayName = '清晨云雀';
      else if (item.chronotype === 'Intermediate Bear') displayName = '中间性小熊';
      else if (item.chronotype === 'Evening Owl') displayName = '黄昏猫头鹰';
    }
    
    itemEl.innerHTML = `
      <div class="history-meta">
        <span class="history-date">${displayDate}</span>
        <span class="history-chronotype" style="color: ${item.color}">${displayName}</span>
      </div>
      <div class="history-score-display">
        <span class="history-score">${item.score}<span>/25</span></span>
      </div>
    `;
    
    historyList.appendChild(itemEl);
  });
}

function renderEmptyHistoryState() {
  const d = I18N_DICTS[currentLanguage];
  historyList.innerHTML = `
    <div class="empty-history-state">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <p>${d.emptyHistoryText}</p>
    </div>
  `;
}

function clearHistory() {
  if (confirm(I18N_DICTS[currentLanguage].clearHistoryConfirm)) {
    localStorage.removeItem('circaAlign_history');
    loadHistory();
  }
}

// --- 11. EVENT LISTENERS SETUP ---
startQuizBtn.addEventListener('click', startQuiz);

viewHistoryQuickBtn.addEventListener('click', () => {
  historySection.scrollIntoView({ behavior: 'smooth' });
});

quitQuizBtn.addEventListener('click', quitQuiz);

prevQuestionBtn.addEventListener('click', retreatQuestion);

nextQuestionBtn.addEventListener('click', () => {
  if (answers[currentQuestionIdx] !== null) {
    advanceQuestion();
  }
});

retakeQuizBtn.addEventListener('click', startQuiz);

printReportBtn.addEventListener('click', () => {
  window.print();
});

clearHistoryBtn.addEventListener('click', clearHistory);

// Smooth logo scroll
logoLink.addEventListener('click', (e) => {
  if (!quizSection.classList.contains('hidden')) {
    e.preventDefault();
    if (confirm(I18N_DICTS[currentLanguage].logoQuitConfirm)) {
      window.open(logoLink.href, '_blank');
      showScreen(heroSection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});

scrollToTopLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function initLanguage() {
  const savedLang = localStorage.getItem('sleepwell_lang') || 'en';
  currentLanguage = savedLang;
  updateLanguageUI();
}

// --- 12. INITIALIZATION ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initTheme();
  initHeroClock();
  loadHistory();
  
  // Watch for language changes from other sibling apps
  window.addEventListener('storage', (e) => {
    if (e.key === 'sleepwell_lang') {
      currentLanguage = e.newValue || 'en';
      updateLanguageUI();
    }
  });

  // Language selector button listener
  document.getElementById('langToggleBtn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('sleepwell_lang', currentLanguage);
    updateLanguageUI();
  });
  
  // Initially show Hero
  showScreen(heroSection);
});
