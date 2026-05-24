/**
 * O2 SleepWell Laboratory
 * Scientific Standalone Psychomotor Vigilance Task (PVT-B)
 */

// --- 1. LABORATORY CONSTANTS ---
const MIN_ISI = 2000; // Minimum delay before stimulus (2s)
const MAX_ISI = 5000; // Maximum delay before stimulus (5s)
const LAPSE_THRESHOLD = 500; // Attention lapse boundary (500ms)
const FALSE_START_THRESHOLD = 100; // Premature response boundary (100ms)

// --- 2. LABORATORY STATE ENGINE ---
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

let config = {
  duration: 60000,   // default: 1 minute (60,000ms)
  inputType: isTouchDevice ? 'tap' : 'space', // default: Tap on touch screens, Space on desktops
  audioEnabled: true // default: Web Audio chimes active
};

let activeSession = {
  screen: 'config',  // 'config', 'arena', 'results'
  phase: 'idle',      // 'waiting', 'counting', 'feedback'
  trials: [],         // array of { rt, type, timestamp }
  timeLeft: 0,
  startTime: null,
  trialStartTime: null,
  currentRT: 0,
  
  // Timers and anim frames
  globalTimerId: null,
  isiTimeoutId: null,
  countingAnimFrameId: null,
  feedbackTimeoutId: null
};

// --- 2.5 LANGUAGES & TRANSLATIONS ENGINE ---
let currentLanguage = 'en';

const I18N_DICTS = {
  en: {
    langBtn: '中文',
    goldBadge: 'Gold Standard Assessment',
    heroTitle: 'Measure Your <span>Attentional Alertness</span>',
    heroDesc: 'The Psychomotor Vigilance Task (PVT-B) is the scientific gold standard utilized by sleep research laboratories and aerospace industries to measure sustained attention, fatigue levels, and cognitive deficits resulting from sleep deprivation.',
    instrHeader: 'Task Instructions:',
    instr1: 'A red target box will appear on screen. Wait silently. <strong>Do not anticipate or click early.</strong>',
    instr2: 'As soon as a millisecond counter flashes inside the box, <strong>press the SPACEBAR or CLICK/TAP the screen as fast as possible.</strong>',
    instr3: 'Your reaction time (RT) will display. Reaction speeds slower than 500ms represent **lapses of attention** (micro-sleeps).',
    configTitle: 'Laboratory Settings',
    configSubtitle: 'Configure the vigilance testing parameters before launching.',
    lblDuration: 'Session Duration',
    durClinical: 'Clinical',
    durClinicalSub: '3 min',
    durSprint: 'Sprint',
    durSprintSub: '1 min',
    durDemo: 'Demo',
    durDemoSub: '30 sec',
    tipDuration: '3-min standard is optimal for identifying moderate sleep pressure.',
    lblTrigger: 'Trigger Interface',
    trigSpace: 'Spacebar',
    trigSpaceSub: 'Keyboard',
    trigTap: 'Click/Tap',
    trigTapSub: 'Anywhere',
    tipTrigger: 'Spacebar triggers ensure the absolute lowest hardware latency.',
    lblAudio: 'Auditory Feedback',
    audEnabled: 'Enabled',
    audEnabledSub: 'Chimes/Tones',
    audDisabled: 'Disabled',
    audDisabledSub: 'Silent Lab',
    tipAudio: 'Generates Web Audio chimes for successes, lapses, and false starts.',
    startText: 'Initialize Vigilance Test',
    hudRemaining: 'Time Remaining',
    hudTrials: 'Trials Run',
    hudLapses: 'Lapses (>500ms)',
    hudFalseStarts: 'False Starts',
    quitBtn: 'Quit Test',
    resultsBadge: 'Vigilance Grade',
    qsMeanUnit: 'Mean ms',
    qsLapsesLabel: 'Total Lapses',
    scLblMeanRT: 'Mean Reaction Time',
    scUnitMeanRT: 'ms',
    scLblLapses: 'Attentional Lapses',
    scLblFalseStarts: 'False Starts',
    scLblReciprocal: 'Reciprocal RT (1/RT)',
    scCompReciprocal: 'Vigilance speed index (s⁻¹)',
    scLblPerfScore: 'Vigilance Performance Score',
    chartTitle: 'Attention Vigilance Timeline',
    chartDesc: 'Reaction time per trial chronological sequence',
    diagTitle: 'Clinical Diagnostics & Fatigue Assessment',
    histTitle: 'O2 SleepWell Laboratory History',
    clearBtn: 'Clear Records',
    thDate: 'Date & Time',
    thDuration: 'Duration',
    thMean: 'Mean RT',
    thLapses: 'Lapses',
    thFalseStarts: 'False Starts',
    thScore: 'Score',
    lblRetry: 'Retake Assessment',
    lblPrint: 'Export Lab Report',
    backToSetup: 'Exit to Configuration',
    footerCitation: 'PVT-B scientific methodology: Basner, M., & Dinges, D. F. (2011). <em>Maximizing sensitivity of the Psychomotor Vigilance Test (PVT-B) to sleep loss</em>. <strong>Sleep</strong>, 34(5), 581-591. Used for clinical fatigue auditing.',
    waitTarget: 'WAITING FOR TARGET',
    waitRedBox: 'WAIT FOR RED BOX',
    tapSpacePrompt: 'Press SPACEBAR when the red box turns neon and numbers count',
    tapScreenPrompt: 'TAP OR CLICK screen when the red box turns neon and numbers count',
    optimal: 'OPTIMAL',
    lapse: 'LAPSE',
    tooEarly: 'TOO EARLY',
    falseStart: 'FALSE START',
    clearHistoryConfirm: 'Are you sure you want to delete all historical clinical vigilance records? This cannot be undone.',
    quitActiveConfirm: 'Are you sure you want to quit this active vigilance run? Your session results will not be saved.',
    historyEmptyState: 'No clinical logs committed yet. Complete a vigilance assessment to record your first run!',
    optimalAlertnessBadge: 'OPTIMAL ALERTNESS',
    criticalDecayBadge: 'CRITICAL DECAY',
    moderateFatigueBadge: 'MODERATE FATIGUE',
    excellentStatusBadge: 'EXCELLENT STATUS',
    eliteTitle: 'Elite Attention Profile',
    eliteDesc: 'Your reaction times are exceptionally fast, showing zero cognitive lag, high focus resilience, and excellent circadian arousal.',
    severeTitle: 'Severe Attention Deficit',
    severeDesc: 'Significant lapses of concentration and slow reaction averages suggest high fatigue or acute sleep pressure. Micro-sleep susceptibility is high.',
    sluggishTitle: 'Sluggish Vigilance Curve',
    sluggishDesc: 'Attentional deficits and sluggish speeds observed. Consistent with mild biological sleep pressure, chronic sleep debt, or testing during circadian down-phases.',
    optimalExecTitle: 'Optimal Executive Performance',
    optimalExecDesc: 'Response speeds are consistent with high executive function, optimal neurological rest, and complete absence of sleep debt.',
    compMeanOptimal: 'Optimal (< 250ms)',
    compMeanAcceptable: 'Acceptable Speed',
    compMeanSluggish: 'Sluggish Performance',
    compLapsesNone: 'No lapses observed',
    compLapsesMinor: 'Minor lapses (fatigue threshold)',
    compLapsesCritical: 'Critical attention slips',
    compFalseNone: 'Optimal anticipation',
    compFalseMinor: 'Minor anticipations',
    compFalseCritical: 'High impulsivity',
    compPerfOptimal: 'Sustained attentional accuracy',
    compPerfUnstable: 'Unstable attention profile',
    compPerfCompromised: 'Compromised focus capacity',
    lapseThresholdLabel: 'Lapse Threshold (500ms)',
    noTrialsLabel: 'No trials recorded in session'
  },
  zh: {
    langBtn: 'English',
    goldBadge: '金标准测评体系',
    heroTitle: '测量您的<span>持续注意力</span>',
    heroDesc: '精神运动警觉度任务 (PVT-B) 是睡眠研究实验室和航空航天工业中使用的科学金标准，用以评估因睡眠剥夺引起的持续注意力、疲劳程度和认知缺陷。',
    instrHeader: '测试说明：',
    instr1: '屏幕上会出现一个红框。请静静等待。<strong>切勿预测或提早点击。</strong>',
    instr2: '当红框内数字开始以毫秒闪烁时，<strong>请以最快速度按空格键或点击屏幕。</strong>',
    instr3: '测试会显示您的反应时间 (RT)。反应速度慢于 500 毫秒代表<strong>注意力流失（微睡眠）</strong>。',
    configTitle: '实验室设置',
    configSubtitle: '在启动前配置警觉度测试参数。',
    lblDuration: '测试时长',
    durClinical: '临床模式',
    durClinicalSub: '3分钟',
    durSprint: '极速模式',
    durSprintSub: '1分钟',
    durDemo: '演示模式',
    durDemoSub: '30秒',
    tipDuration: '3分钟的标准模式是识别中度睡眠压力的最佳选择。',
    lblTrigger: '触发介面',
    trigSpace: '空格键',
    trigSpaceSub: '键盘',
    trigTap: '点击',
    trigTapSub: '任意位置',
    tipTrigger: '使用空格键触发可确保最低的硬件延迟。',
    lblAudio: '听觉反馈',
    audEnabled: '已启用',
    audEnabledSub: '提示音/和弦',
    audDisabled: '已禁用',
    audDisabledSub: '静音模式',
    tipAudio: '针对成功、流失和提早点击生成网页音频提示。',
    startText: '初始化警觉度测试',
    hudRemaining: '剩余时间',
    hudTrials: '测试次数',
    hudLapses: '注意力流失 (>500毫秒)',
    hudFalseStarts: '提早点击',
    quitBtn: '退出测试',
    resultsBadge: '警觉等级',
    qsMeanUnit: '平均毫秒',
    qsLapsesLabel: '流失总数',
    scLblMeanRT: '平均反应时间',
    scUnitMeanRT: '毫秒',
    scLblLapses: '注意力流失次数',
    scLblFalseStarts: '提早点击',
    scLblReciprocal: '反应速率 (1/RT)',
    scCompReciprocal: '警觉速度指数 (s⁻¹)',
    scLblPerfScore: '警觉表现评分',
    chartTitle: '注意力警觉度时间轴',
    chartDesc: '按测试顺序记录的每次反应时间',
    diagTitle: '临床诊断与疲劳度评估',
    histTitle: 'O2 SleepWell 实验室历史记录',
    clearBtn: '清除记录',
    thDate: '日期与时间',
    thDuration: '测试时长',
    thMean: '平均反应',
    thLapses: '流失',
    thFalseStarts: '提早',
    thScore: '评分',
    lblRetry: '重新测评',
    lblPrint: '导出临床报告',
    backToSetup: '退出至配置',
    footerCitation: 'PVT-B 科学方法：Basner, M., & Dinges, D. F. (2011). <em>Maximizing sensitivity of the Psychomotor Vigilance Test (PVT-B) to sleep loss</em>. <strong>Sleep</strong>, 34(5), 581-591. 用于临床疲劳度审计。',
    waitTarget: '请等待目标',
    waitRedBox: '请等待红框亮起！',
    tapSpacePrompt: '当红框变绿且数字开始跳动时，请按空格键',
    tapScreenPrompt: '当红框变绿且数字开始跳动时，请点击屏幕',
    optimal: '优秀',
    lapse: '迟缓',
    tooEarly: '太早',
    falseStart: '提前点击',
    clearHistoryConfirm: '您确定要删除所有历史临床警觉度记录吗？此操作无法撤销。',
    quitActiveConfirm: '您确定要退出当前正在进行的警觉度测试吗？本次测试结果将不会被保存。',
    historyEmptyState: '暂无 committed 临床记录。完成一次警觉性评估即可记录您的首次测试！',
    optimalAlertnessBadge: '优异警觉状态',
    criticalDecayBadge: '警觉极度衰退',
    moderateFatigueBadge: '中度疲劳状态',
    excellentStatusBadge: '良好健康状态',
    eliteTitle: '顶级注意力概况',
    eliteDesc: '您的反应时间非常快，显示出零认知延迟、极高的专心度韧性以及优异的昼夜醒觉度。',
    severeTitle: '严重注意力不集中',
    severeDesc: '显著的注意力流失和极慢的平均反应时间表明存在高度疲劳或急性睡眠压力。微睡眠易感性极高。',
    sluggishTitle: '警觉曲线迟缓',
    sluggishDesc: '观察到注意力缺失和缓慢的反应速度。这与轻度生理睡眠压力、慢性睡眠不足或在昼夜低谷期进行测试一致。',
    optimalExecTitle: '最佳执行力表现',
    optimalExecDesc: '反应速度与高执行功能、最佳神经系统休息以及完全没有睡眠不足相一致。',
    compMeanOptimal: '极佳 (< 250毫秒)',
    compMeanAcceptable: '尚可反应速度',
    compMeanSluggish: '迟缓反应速度',
    compLapsesNone: '未发现注意力流失',
    compLapsesMinor: '轻微流失（进入疲劳临界点）',
    compLapsesCritical: '严重注意力中断',
    compFalseNone: '完美冲动控制',
    compFalseMinor: '轻微预测反应',
    compFalseCritical: '冲动性猜测过高',
    compPerfOptimal: '持续注意力精确度',
    compPerfUnstable: '注意状态不稳定',
    compPerfCompromised: '注意力显著受损',
    lapseThresholdLabel: '注意力流失阈值 (500毫秒)',
    noTrialsLabel: '本次测评中未记录到测试数据'
  }
};

function initLanguage() {
  const savedLang = localStorage.getItem('sleepwell_lang') || localStorage.getItem('pvt_lang') || 'en';
  currentLanguage = savedLang;
  updateLanguageUI();
}

function updateLanguageUI() {
  const d = I18N_DICTS[currentLanguage];
  if (!d) return;
  
  // Set navbar toggle button
  document.getElementById('langToggleBtn').textContent = currentLanguage === 'en' ? '中文' : 'English';
  
  // Set setup screen texts
  document.getElementById('goldBadge').innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
    ${d.goldBadge}
  `;
  document.getElementById('pvtHeroTitle').innerHTML = d.heroTitle;
  document.getElementById('pvtHeroDesc').textContent = d.heroDesc;
  document.getElementById('pvtInstrHeader').textContent = d.instrHeader;
  document.getElementById('pvtInstr1').innerHTML = d.instr1;
  document.getElementById('pvtInstr2').innerHTML = d.instr2;
  document.getElementById('pvtInstr3').innerHTML = d.instr3;
  
  document.getElementById('pvtConfigTitle').textContent = d.configTitle;
  document.getElementById('pvtConfigSubtitle').textContent = d.configSubtitle;
  
  document.getElementById('lblDuration').textContent = d.lblDuration;
  document.getElementById('durClinical').textContent = d.durClinical;
  document.getElementById('durClinicalSub').textContent = d.durClinicalSub;
  document.getElementById('durSprint').textContent = d.durSprint;
  document.getElementById('durSprintSub').textContent = d.durSprintSub;
  document.getElementById('durDemo').textContent = d.durDemo;
  document.getElementById('durDemoSub').textContent = d.durDemoSub;
  document.getElementById('tipDuration').textContent = d.tipDuration;
  
  document.getElementById('lblTrigger').textContent = d.lblTrigger;
  document.getElementById('trigSpace').textContent = d.trigSpace;
  document.getElementById('trigSpaceSub').textContent = d.trigSpaceSub;
  document.getElementById('trigTap').textContent = d.trigTap;
  document.getElementById('trigTapSub').textContent = d.trigTapSub;
  document.getElementById('tipTrigger').textContent = d.tipTrigger;
  
  document.getElementById('lblAudio').textContent = d.lblAudio;
  document.getElementById('audEnabled').textContent = d.audEnabled;
  document.getElementById('audEnabledSub').textContent = d.audEnabledSub;
  document.getElementById('audDisabled').textContent = d.audDisabled;
  document.getElementById('audDisabledSub').textContent = d.audDisabledSub;
  document.getElementById('tipAudio').textContent = d.tipAudio;
  
  document.getElementById('pvtStartText').textContent = d.startText;
  
  // Set arena screen texts
  document.getElementById('hudLblRemaining').textContent = d.hudRemaining;
  document.getElementById('hudLblTrials').textContent = d.hudTrials;
  document.getElementById('hudLblLapses').textContent = d.hudLapses;
  document.getElementById('hudLblFalseStarts').textContent = d.hudFalseStarts;
  document.getElementById('quitTestBtn').textContent = d.quitBtn;
  
  // Set tapInstructionPrompt dynamically matching active config
  if (config.inputType === 'space') {
    tapInstructionPrompt.textContent = d.tapSpacePrompt;
  } else {
    tapInstructionPrompt.textContent = d.tapScreenPrompt;
  }
  
  // Set active timing state texts if timing screen
  if (activeSession.phase === 'waiting') {
    stimulusStateText.textContent = d.waitRedBox;
  } else if (activeSession.phase === 'idle') {
    stimulusStateText.textContent = d.waitTarget;
  }
  
  // Set results screen texts
  document.getElementById('resultsBadge').textContent = d.resultsBadge;
  document.getElementById('qsMeanUnit').textContent = d.qsMeanUnit;
  document.getElementById('qsLapsesLabel').textContent = d.qsLapsesLabel;
  
  document.getElementById('scLblMeanRT').textContent = d.scLblMeanRT;
  document.getElementById('scUnitMeanRT').textContent = d.scUnitMeanRT;
  document.getElementById('scLblLapses').textContent = d.scLblLapses;
  document.getElementById('scLblFalseStarts').textContent = d.scLblFalseStarts;
  document.getElementById('scLblReciprocal').textContent = d.scLblReciprocal;
  document.getElementById('scCompReciprocal').textContent = d.scCompReciprocal;
  document.getElementById('scLblPerfScore').textContent = d.scLblPerfScore;
  
  document.getElementById('chartTitle').textContent = d.chartTitle;
  document.getElementById('chartDesc').textContent = d.chartDesc;
  document.getElementById('diagTitle').textContent = d.diagTitle;
  document.getElementById('histTitle').textContent = d.histTitle;
  document.getElementById('clearHistoryBtn').textContent = d.clearBtn;
  
  document.getElementById('thDate').textContent = d.thDate;
  document.getElementById('thDuration').textContent = d.thDuration;
  document.getElementById('thMean').textContent = d.thMean;
  document.getElementById('thLapses').textContent = d.thLapses;
  document.getElementById('thFalseStarts').textContent = d.thFalseStarts;
  document.getElementById('thScore').textContent = d.thScore;
  
  document.getElementById('lblRetry').textContent = d.lblRetry;
  document.getElementById('lblPrint').textContent = d.lblPrint;
  document.getElementById('backToSetupBtn').textContent = d.backToSetup;
  document.getElementById('footerCitation').innerHTML = d.footerCitation;
  
  // If in results screen, refresh the dynamically loaded items
  if (activeSession.screen === 'results') {
    const stats = computeSessionStats();
    
    // Refresh grades, badge, stats card comparisons, chart axes, recommendations and history logs
    meanRtQuick.textContent = stats.meanRT;
    lapsesQuick.textContent = stats.lapses;
    
    statMeanRT.textContent = stats.meanRT;
    statLapses.textContent = stats.lapses;
    statFalseStarts.textContent = stats.falseStarts;
    statReciprocalRT.textContent = stats.reciprocalRT;
    statPerformanceScore.textContent = stats.performanceScore;
    
    const scorePercent = parseFloat(stats.performanceScore);
    
    let badgeText = d.optimalAlertnessBadge;
    let gradeTitle = d.eliteTitle;
    let gradeDesc = d.eliteDesc;
    let badgeColor = "var(--success)";
    
    if (stats.meanRT >= 340 || stats.lapses > 4 || scorePercent < 60) {
      badgeText = d.criticalDecayBadge;
      gradeTitle = d.severeTitle;
      gradeDesc = d.severeDesc;
      badgeColor = "var(--danger)";
    } else if (stats.meanRT >= 280 || stats.lapses >= 2 || scorePercent < 85) {
      badgeText = d.moderateFatigueBadge;
      gradeTitle = d.sluggishTitle;
      gradeDesc = d.sluggishDesc;
      badgeColor = "var(--warning)";
    } else if (stats.meanRT > 0 && stats.meanRT < 245) {
      badgeText = d.excellentStatusBadge;
      gradeTitle = d.optimalExecTitle;
      gradeDesc = d.optimalExecDesc;
      badgeColor = "var(--success)";
    }
    
    resultsBadge.textContent = badgeText;
    resultsBadge.style.color = badgeColor;
    resultsBadge.style.borderColor = badgeColor.replace(')', ', 0.35)');
    resultsBadge.style.backgroundColor = badgeColor.replace(')', ', 0.08)');
    
    resultsGradeTitle.textContent = gradeTitle;
    resultsGradeDesc.textContent = gradeDesc;
    
    statMeanRTComp.textContent = stats.meanRT < 250 ? d.compMeanOptimal : (stats.meanRT < 300 ? d.compMeanAcceptable : d.compMeanSluggish);
    statLapsesComp.textContent = stats.lapses === 0 ? d.compLapsesNone : (stats.lapses <= 2 ? d.compLapsesMinor : d.compLapsesCritical);
    statFalseStartsComp.textContent = stats.falseStarts === 0 ? d.compFalseNone : (stats.falseStarts <= 2 ? d.compFalseMinor : d.compFalseCritical);
    statPerfComp.textContent = scorePercent >= 90 ? d.compPerfOptimal : (scorePercent >= 70 ? d.compPerfUnstable : d.compPerfCompromised);
    
    renderVigilanceTimelineChart();
    generateDiagnosticClinicalAnalysis(stats);
  }
  
  loadSessionHistory();
}

// --- 3. WEB AUDIO SYNTHESIZER ---
let audioCtx = null;

function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  } catch (e) {
    console.warn("Web Audio API not supported in this browser.", e);
  }
}

function playSynthesizedTone(type) {
  if (!config.audioEnabled) return;
  initAudio();
  if (!audioCtx) return;
  
  // Resume context if suspended (browser security policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  
  if (type === 'success') {
    // Elegant high-pitched success major third chime
    triggerSynthOscillator(600, 'sine', 0.08, now);
    triggerSynthOscillator(750, 'sine', 0.08, now + 0.06);
    triggerSynthOscillator(900, 'sine', 0.1, now + 0.12);
  } else if (type === 'lapse') {
    // Low-frequency warning minor third double pulse
    triggerSynthOscillator(220, 'triangle', 0.15, now);
    triggerSynthOscillator(175, 'triangle', 0.2, now + 0.12);
  } else if (type === 'false-start') {
    // Aggressive square wave frequency sweep buzz
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

function triggerSynthOscillator(freq, wave, duration, startTime) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gainNode.gain.setValueAtTime(0.08, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.005, startTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

// --- 4. DOM ELEMENT REFERENCES ---
// Layout Screens
const configScreen = document.getElementById('configScreen');
const arenaScreen = document.getElementById('arenaScreen');
const resultsScreen = document.getElementById('resultsScreen');

// Config Selectors
const durationSelector = document.getElementById('durationSelector');
const inputSelector = document.getElementById('inputSelector');
const audioSelector = document.getElementById('audioSelector');
const startTestBtn = document.getElementById('startTestBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Active Arena Elements
const hudTimeLeft = document.getElementById('hudTimeLeft');
const hudTrialsCount = document.getElementById('hudTrialsCount');
const hudLapsesCount = document.getElementById('hudLapsesCount');
const hudFalseStartsCount = document.getElementById('hudFalseStartsCount');
const quitTestBtn = document.getElementById('quitTestBtn');
const arenaProgressBar = document.getElementById('arenaProgressBar');
const clickBackdrop = document.getElementById('clickBackdrop');
const stimulusBox = document.getElementById('stimulusBox');
const stimulusStateText = document.getElementById('stimulusStateText');
const stimulusTimer = document.getElementById('stimulusTimer');
const stimulusFeedback = document.getElementById('stimulusFeedback');
const feedbackRt = document.getElementById('feedbackRt');
const feedbackMsg = document.getElementById('feedbackMsg');
const tapInstructionPrompt = document.getElementById('tapInstructionPrompt');

// Results Dashboard Elements
const resultsBadge = document.getElementById('resultsBadge');
const resultsGradeTitle = document.getElementById('resultsGradeTitle');
const resultsGradeDesc = document.getElementById('resultsGradeDesc');
const meanRtQuick = document.getElementById('meanRtQuick');
const lapsesQuick = document.getElementById('lapsesQuick');
const gaugeCircle = document.getElementById('gaugeCircle');

const statMeanRT = document.getElementById('statMeanRT');
const statMeanRTComp = document.getElementById('statMeanRTComp');
const statLapses = document.getElementById('statLapses');
const statLapsesComp = document.getElementById('statLapsesComp');
const statFalseStarts = document.getElementById('statFalseStarts');
const statFalseStartsComp = document.getElementById('statFalseStartsComp');
const statReciprocalRT = document.getElementById('statReciprocalRT');
const statPerformanceScore = document.getElementById('statPerformanceScore');
const statPerfComp = document.getElementById('statPerfComp');

const trialChart = document.getElementById('trialChart');
const diagnosticText = document.getElementById('diagnosticText');
const historyTableBody = document.getElementById('historyTableBody');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const retryTestBtn = document.getElementById('retryTestBtn');
const printReportBtn = document.getElementById('printReportBtn');
const backToSetupBtn = document.getElementById('backToSetupBtn');

// --- 5. THEME SWITCH CONTROLLER ---
function initTheme() {
  const savedTheme = localStorage.getItem('pvt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
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
  localStorage.setItem('pvt_theme', newTheme);
  
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

// --- 6. NAVIGATION ROUTER ---
function showScreen(screenEl) {
  configScreen.classList.add('hidden');
  arenaScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
  
  screenEl.classList.remove('hidden');
  
  if (screenEl === configScreen) {
    activeSession.screen = 'config';
  } else if (screenEl === arenaScreen) {
    activeSession.screen = 'arena';
  } else if (screenEl === resultsScreen) {
    activeSession.screen = 'results';
  }
}

// Setup segment switch event listener helpers
function configureSelector(selectorContainer, configKey, callback) {
  const buttons = selectorContainer.querySelectorAll('.selector-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find closest button in case text was clicked
      const targetBtn = e.target.closest('.selector-btn');
      if (!targetBtn) return;
      
      buttons.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      
      let val = targetBtn.getAttribute('data-value');
      // Typecasting if numeric
      if (!isNaN(val)) {
        val = parseInt(val, 10);
      } else if (val === 'on' || val === 'off') {
        val = val === 'on';
      }
      
      config[configKey] = val;
      if (callback) callback(val);
    });
  });
}

// Initialise segment configurations
configureSelector(durationSelector, 'duration');
configureSelector(inputSelector, 'inputType', (val) => {
  const d = I18N_DICTS[currentLanguage];
  if (val === 'space') {
    tapInstructionPrompt.textContent = d.tapSpacePrompt;
  } else {
    tapInstructionPrompt.textContent = d.tapScreenPrompt;
  }
});
configureSelector(audioSelector, 'audioEnabled', (enabled) => {
  if (enabled) {
    initAudio();
  }
});

// Start button trigger
startTestBtn.addEventListener('click', () => {
  initAudio();
  startTask();
});

// --- 7. ACTIVE TIMING VIGILANCE TASK ENGINE ---
function startTask() {
  activeSession.trials = [];
  activeSession.timeLeft = config.duration;
  
  showScreen(arenaScreen);
  updateHUD();
  
  activeSession.startTime = performance.now();
  
  // High-precision global session countdown interval
  activeSession.globalTimerId = setInterval(() => {
    const elapsed = performance.now() - activeSession.startTime;
    const remaining = Math.max(0, config.duration - elapsed);
    activeSession.timeLeft = remaining;
    
    // Smooth progress bar update
    const percentLeft = (remaining / config.duration) * 100;
    arenaProgressBar.style.width = `${percentLeft}%`;
    
    // Digital clock format
    const totalSecs = remaining / 1000;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const msFraction = Math.floor((remaining % 1000) / 100);
    
    hudTimeLeft.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msFraction}`;
    
    if (remaining <= 0) {
      endTask();
    }
  }, 50);

  triggerNewTrial();
}

function endTask() {
  // Clear all running timers, frames, and timeouts
  clearInterval(activeSession.globalTimerId);
  clearTimeout(activeSession.isiTimeoutId);
  clearTimeout(activeSession.feedbackTimeoutId);
  cancelAnimationFrame(activeSession.countingAnimFrameId);
  
  activeSession.phase = 'idle';
  
  // Synthesise test complete final tone
  playSynthesizedTone('success');
  
  showResultsDashboard();
}

function quitActiveTask() {
  if (confirm(I18N_DICTS[currentLanguage].quitActiveConfirm)) {
    clearInterval(activeSession.globalTimerId);
    clearTimeout(activeSession.isiTimeoutId);
    clearTimeout(activeSession.feedbackTimeoutId);
    cancelAnimationFrame(activeSession.countingAnimFrameId);
    
    activeSession.phase = 'idle';
    showScreen(configScreen);
  }
}

quitTestBtn.addEventListener('click', quitActiveTask);

function triggerNewTrial() {
  activeSession.phase = 'waiting';
  activeSession.currentRT = 0;
  
  // Set waiting layout indicators
  clickBackdrop.className = 'stimulus-backdrop phase-waiting';
  stimulusStateText.classList.remove('hidden');
  stimulusStateText.textContent = I18N_DICTS[currentLanguage].waitRedBox;
  stimulusTimer.classList.add('hidden');
  stimulusFeedback.classList.add('hidden');
  
  // Generate randomized inter-stimulus delay (2000ms - 5000ms)
  const delay = Math.floor(Math.random() * (MAX_ISI - MIN_ISI)) + MIN_ISI;
  
  activeSession.isiTimeoutId = setTimeout(() => {
    launchStimulusCounter();
  }, delay);
}

function launchStimulusCounter() {
  activeSession.phase = 'counting';
  clickBackdrop.className = 'stimulus-backdrop phase-counting';
  
  stimulusStateText.classList.add('hidden');
  stimulusTimer.classList.remove('hidden');
  stimulusTimer.textContent = "0";
  
  activeSession.trialStartTime = performance.now();
  
  // fluid frame timing loop
  runHighPrecisionCounter();
}

function runHighPrecisionCounter() {
  if (activeSession.phase !== 'counting') return;
  
  const elapsed = Math.floor(performance.now() - activeSession.trialStartTime);
  activeSession.currentRT = elapsed;
  stimulusTimer.textContent = elapsed;
  
  // If the user lapses massively (no click for 3.5 seconds), auto-register a huge lapse and trigger feedback
  if (elapsed >= 3500) {
    handlePhysicalAction();
  } else {
    activeSession.countingAnimFrameId = requestAnimationFrame(runHighPrecisionCounter);
  }
}

// physical trigger input overrides
const handlePhysicalAction = () => {
  if (activeSession.screen !== 'arena') return;
  
  const nowTime = performance.now();
  
  if (activeSession.phase === 'waiting') {
    // Attentional False Start: early click/tap during the wait phase
    clearTimeout(activeSession.isiTimeoutId);
    
    activeSession.phase = 'feedback';
    playSynthesizedTone('false-start');
    
    clickBackdrop.className = 'stimulus-backdrop phase-feedback-false';
    stimulusStateText.classList.add('hidden');
    stimulusFeedback.classList.remove('hidden');
    feedbackRt.textContent = "---";
    feedbackMsg.textContent = I18N_DICTS[currentLanguage].falseStart;
    
    const trialRecord = { rt: 0, type: 'false-start', timestamp: Date.now() };
    activeSession.trials.push(trialRecord);
    
    updateHUD();
    
    // Penalty delay lock: user has to wait 1.2s after a false start
    activeSession.feedbackTimeoutId = setTimeout(triggerNewTrial, 1200);
    
  } else if (activeSession.phase === 'counting') {
    // Valid physical reaction
    cancelAnimationFrame(activeSession.countingAnimFrameId);
    activeSession.phase = 'feedback';
    
    const rt = Math.floor(nowTime - activeSession.trialStartTime);
    activeSession.currentRT = rt;
    
    let type = 'valid';
    let label = 'OPTIMAL';
    let chimeType = 'success';
    
    if (rt < FALSE_START_THRESHOLD) {
      type = 'false-start';
      label = 'TOO EARLY';
      chimeType = 'false-start';
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-false';
    } else if (rt >= LAPSE_THRESHOLD) {
      type = 'lapse';
      label = 'LAPSE';
      chimeType = 'lapse';
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-lapse';
    } else {
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-valid';
    }
    
    playSynthesizedTone(chimeType);
    
    stimulusTimer.classList.add('hidden');
    stimulusFeedback.classList.remove('hidden');
    feedbackRt.textContent = `${rt} ms`;
    
    let localLabel = I18N_DICTS[currentLanguage].optimal;
    if (label === 'TOO EARLY') localLabel = I18N_DICTS[currentLanguage].tooEarly;
    else if (label === 'LAPSE') localLabel = I18N_DICTS[currentLanguage].lapse;
    feedbackMsg.textContent = localLabel;
    
    const trialRecord = { rt, type, timestamp: Date.now() };
    activeSession.trials.push(trialRecord);
    
    updateHUD();
    
    // Standard feedback delay display (1 second)
    activeSession.feedbackTimeoutId = setTimeout(triggerNewTrial, 1000);
  }
};

// Event handlers capturing
clickBackdrop.addEventListener('mousedown', (e) => {
  if (config.inputType === 'tap' || isTouchDevice) {
    e.preventDefault();
    handlePhysicalAction();
  }
});

clickBackdrop.addEventListener('touchstart', (e) => {
  if (config.inputType === 'tap' || isTouchDevice) {
    e.preventDefault(); // Prevents scale zooming and double firing touch/mouse events
    handlePhysicalAction();
  }
}, { passive: false });

// Keypress listener (Spacebar overriding)
window.addEventListener('keydown', (e) => {
  if (activeSession.screen !== 'arena') return;
  
  if (e.code === 'Space') {
    e.preventDefault(); // Stop scrolling viewport
    
    if (config.inputType === 'space') {
      handlePhysicalAction();
    }
  }
});

function updateHUD() {
  const stats = computeSessionStats();
  
  hudTrialsCount.textContent = stats.total;
  hudLapsesCount.textContent = stats.lapses;
  hudFalseStartsCount.textContent = stats.falseStarts;
}

// --- 8. MATHEMATICAL DIAGNOSTIC MATH ---
function computeSessionStats() {
  const trials = activeSession.trials;
  
  const validTrials = trials.filter(t => t.type !== 'false-start');
  const lapses = trials.filter(t => t.type === 'lapse').length;
  const falseStarts = trials.filter(t => t.type === 'false-start').length;
  
  const meanRT = validTrials.length > 0 
    ? Math.round(validTrials.reduce((sum, t) => sum + t.rt, 0) / validTrials.length) 
    : 0;
    
  // Reciprocal Reaction Time (1/RT in seconds)
  // Evaluates reaction velocities. Crucial Sleep-Research standard because it resolves positive skewness.
  const reciprocalRT = validTrials.length > 0
    ? (validTrials.reduce((sum, t) => sum + (1000 / t.rt), 0) / validTrials.length).toFixed(2)
    : "0.00";

  // Sustained Accuracy score (false starts and lapses decay accuracy performance)
  const performanceScore = trials.length > 0
    ? ((1 - (lapses + falseStarts) / trials.length) * 100).toFixed(1)
    : "0.0";

  return { 
    meanRT, 
    lapses, 
    falseStarts, 
    reciprocalRT, 
    performanceScore, 
    total: trials.length 
  };
}

// --- 9. RESULTS DASHBOARD CONTROLLER ---
function showResultsDashboard() {
  showScreen(resultsScreen);
  
  const stats = computeSessionStats();
  
  // Save run to local database records
  saveSessionToLocalStorage(stats);
  
  // Render details card parameters
  meanRtQuick.textContent = stats.meanRT;
  lapsesQuick.textContent = stats.lapses;
  
  statMeanRT.textContent = stats.meanRT;
  statLapses.textContent = stats.lapses;
  statFalseStarts.textContent = stats.falseStarts;
  statReciprocalRT.textContent = stats.reciprocalRT;
  statPerformanceScore.textContent = stats.performanceScore;
  
  // Circular gauge display matching accuracy performance
  const scorePercent = parseFloat(stats.performanceScore);
  const strokeOffset = 264 - (264 * (scorePercent / 100));
  gaugeCircle.style.strokeDashoffset = strokeOffset;
  
  // Color code circles based on vigilance grades
  if (scorePercent >= 90) {
    gaugeCircle.style.stroke = "var(--success)";
  } else if (scorePercent >= 70) {
    gaugeCircle.style.stroke = "var(--warning)";
  } else {
    gaugeCircle.style.stroke = "var(--danger)";
  }

  // Update dynamic elements according to active language
  updateLanguageUI();
}

// --- 10. DYNAMIC SVG REACTION PERFORMANCE TIMELINE CHART RENDERER ---
function renderVigilanceTimelineChart() {
  const trials = activeSession.trials;
  const d = I18N_DICTS[currentLanguage];
  
  if (trials.length === 0) {
    trialChart.innerHTML = `<text x="350" y="140" fill="var(--text-muted)" text-anchor="middle" font-size="14" font-weight="600">${d.noTrialsLabel}</text>`;
    return;
  }
  
  const width = 700;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Resolve chart scale values dynamically matching results
  // We want to scale Y up to the max reaction time. Max Y is at least 600ms to preserve context.
  const rts = trials.map(t => t.rt);
  const maxRT = Math.max(600, ...rts);
  const yMax = Math.ceil(maxRT / 100) * 100; // round up to nearest 100ms
  
  // Coordinate transformers
  const getX = (index) => {
    if (trials.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (trials.length - 1)) * chartWidth;
  };
  
  const getY = (rt) => {
    // Clip high outlier RTs to the chart max boundary to preserve layout visual aesthetics
    const clippedRt = Math.min(yMax, rt);
    return paddingTop + chartHeight - (clippedRt / yMax) * chartHeight;
  };

  // Build grid markers and baseline rules
  let gridLines = '';
  const divisions = 4;
  for (let i = 0; i <= divisions; i++) {
    const value = Math.round((yMax / divisions) * i);
    const yCoord = getY(value);
    
    gridLines += `
      <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="3 6" />
      <text x="${paddingLeft - 10}" y="${yCoord + 4}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end" font-family="'Outfit', sans-serif">${value} ${d.scUnitMeanRT}</text>
    `;
  }
  
  // Build standard attention lapse baseline warning border (500ms line)
  const lapseY = getY(LAPSE_THRESHOLD);
  const lapseThresholdLine = `
    <g>
      <line x1="${paddingLeft}" y1="${lapseY}" x2="${width - paddingRight}" y2="${lapseY}" stroke="var(--danger)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.6" />
      <text x="${width - paddingRight - 8}" y="${lapseY - 6}" fill="var(--danger)" font-size="9" font-weight="700" text-anchor="end" font-family="'Outfit', sans-serif" opacity="0.85">${d.lapseThresholdLabel}</text>
    </g>
  `;
  
  // Assemble polyline coordinate paths for valid points
  let pathPoints = [];
  let dots = '';
  
  trials.forEach((trial, index) => {
    const x = getX(index);
    
    if (trial.type === 'false-start') {
      // Plot false starts as warning orange indicator triangles at the bottom (Y=getY(0))
      const yZero = getY(0);
      dots += `
        <polygon points="${x},${yZero - 6} ${x - 5},${yZero + 4} ${x + 5},${yZero + 4}" fill="var(--warning)" />
        <circle cx="${x}" cy="${yZero}" r="12" fill="var(--warning)" opacity="0.15">
          <title>Trial ${index + 1}: False Start</title>
        </circle>
      `;
    } else {
      const y = getY(trial.rt);
      pathPoints.push(`${x},${y}`);
      
      // Determine colors based on speed thresholds
      let nodeColor = 'var(--success)';
      let hoverGlow = 'var(--success-glow)';
      
      if (trial.rt >= LAPSE_THRESHOLD) {
        nodeColor = 'var(--danger)';
        hoverGlow = 'var(--danger-glow)';
      } else if (trial.rt >= 300) {
        nodeColor = 'var(--warning)';
        hoverGlow = 'var(--warning-glow)';
      }
      
      dots += `
        <g class="chart-point">
          <circle cx="${x}" cy="${y}" r="8" fill="${nodeColor}" opacity="0.2" />
          <circle cx="${x}" cy="${y}" r="4" fill="${nodeColor}" stroke="var(--card-bg)" stroke-width="1.5" />
          <title>Trial ${index + 1}: ${trial.rt}ms (${trial.type.toUpperCase()})</title>
        </g>
      `;
    }
  });
  
  // Connect points with a polyline trace if we have multiple valid coordinates
  let linePath = '';
  if (pathPoints.length > 1) {
    linePath = `<polyline points="${pathPoints.join(' ')}" fill="none" stroke="var(--brand-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
  }
  
  // Build chart X-axis trial indicators
  let xAxisLabels = '';
  const step = Math.ceil(trials.length / 10); // cap to maximum 10 labels on X axis to avoid visual overlap
  trials.forEach((_, idx) => {
    if (idx % step === 0 || idx === trials.length - 1) {
      const x = getX(idx);
      xAxisLabels += `<text x="${x}" y="${height - 18}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle" font-family="'Outfit', sans-serif">T-${idx + 1}</text>`;
    }
  });

  trialChart.innerHTML = `
    <!-- Grid System Lines -->
    ${gridLines}
    
    <!-- 500ms Attention Lapse Boundary -->
    ${lapseThresholdLine}
    
    <!-- Smooth Connected Trace Line -->
    ${linePath}
    
    <!-- SVG Nodes/Dots -->
    ${dots}
    
    <!-- X-axis Bottom Labels -->
    ${xAxisLabels}
  `;
}push(`${x},${y}`);
      
      // Determine colors based on speed thresholds
      let nodeColor = 'var(--success)';
      let hoverGlow = 'var(--success-glow)';
      
      if (trial.rt >= LAPSE_THRESHOLD) {
        nodeColor = 'var(--danger)';
        hoverGlow = 'var(--danger-glow)';
      } else if (trial.rt >= 300) {
        nodeColor = 'var(--warning)';
        hoverGlow = 'var(--warning-glow)';
      }
      
      dots += `
        <g class="chart-point">
          <circle cx="${x}" cy="${y}" r="8" fill="${nodeColor}" opacity="0.2" />
          <circle cx="${x}" cy="${y}" r="4" fill="${nodeColor}" stroke="var(--card-bg)" stroke-width="1.5" />
          <title>Trial ${index + 1}: ${trial.rt}ms (${trial.type.toUpperCase()})</title>
        </g>
      `;
    }
  });
  
  // Connect points with a polyline trace if we have multiple valid coordinates
  let linePath = '';
  if (pathPoints.length > 1) {
    linePath = `<polyline points="${pathPoints.join(' ')}" fill="none" stroke="var(--brand-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
  }
  
  // Build chart X-axis trial indicators
  let xAxisLabels = '';
  const step = Math.ceil(trials.length / 10); // cap to maximum 10 labels on X axis to avoid visual overlap
  trials.forEach((_, idx) => {
    if (idx % step === 0 || idx === trials.length - 1) {
      const x = getX(idx);
      xAxisLabels += `<text x="${x}" y="${height - 18}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle" font-family="'Outfit', sans-serif">T-${idx + 1}</text>`;
    }
  });

  trialChart.innerHTML = `
    <!-- Grid System Lines -->
    ${gridLines}
    
    <!-- 500ms Attention Lapse Boundary -->
    ${lapseThresholdLine}
    
    <!-- Smooth Connected Trace Line -->
    ${linePath}
    
    <!-- SVG Nodes/Dots -->
    ${dots}
    
    <!-- X-axis Bottom Labels -->
    ${xAxisLabels}
  `;
}

// --- 11. CLINICAL SLEEP PERFORMANCE INTERPRETATION BUILDER ---
function generateDiagnosticClinicalAnalysis(stats) {
  let content = '';
  
  const scorePercent = parseFloat(stats.performanceScore);
  
  if (stats.meanRT === 0) {
    diagnosticText.innerHTML = currentLanguage === 'zh'
      ? "<p>暂无分析诊断报告。请先完成一次警觉度测评。</p>"
      : "<p>No analytical diagnostics are available. Take the vigilance test first.</p>";
    return;
  }
  
  if (currentLanguage === 'zh') {
    content += `<p>根据您的持续注意力测评数据，实验室已为您生成以下临床认知警觉度报告：</p>`;
    
    // Section A: Averages and Processing speed analysis
    if (stats.meanRT < 240) {
      content += `<p><strong>反应速度：</strong>您的平均反应时间为 <strong>${stats.meanRT}毫秒</strong>，表现**极其优秀**，处于前 10% 的极佳水平。这反映了您有极高的神经传导储备和出色的专注通路。</p>`;
    } else if (stats.meanRT < 285) {
      content += `<p><strong>反应速度：</strong>您的平均反应时间为 <strong>${stats.meanRT}毫秒</strong>，处于**正常健康基线**内。这表明您的执行注意力系统处于活跃状态，具备良好的专注耐力。</p>`;
    } else if (stats.meanRT < 340) {
      content += `<p><strong>反应速度：</strong>您的平均反应时间为 <strong>${stats.meanRT}毫秒</strong>，处于**迟缓专注水平**。这提示可能存在疲劳、过度脑力负荷或中度生理睡眠压力。</p>`;
    } else {
      content += `<p><strong>反应速度：</strong>临界平均反应时间为 <strong>${stats.meanRT}毫秒</strong>，代表**严重的表现衰退**（认知速度慢了 40% 以上）。此程度的广泛反应迟缓表明您的大脑处于重度负荷或严重疲劳状态。</p>`;
    }
    
    // Section B: Attentional Lapses & Sleep Debt
    if (stats.lapses === 0) {
      content += `<p><strong>注意力稳定性：</strong>在此次测评中，您表现出**零注意力流失**，证明了**极佳的持续注意力稳定性**。大脑的专注通路完全同步，未出现任何微睡眠中断。</p>`;
    } else if (stats.lapses <= 2) {
      content += `<p><strong>注意力稳定性：</strong>您记录了 <strong>${stats.lapses} 次注意力流失</strong>。偶发性流失反映了短暂的警觉度下降（如瞬间眨眼或发呆），这在睡眠不足开始累积时非常常见。</p>`;
    } else if (stats.lapses <= 5) {
      content += `<p><strong>注意力稳定性：</strong>您记录了 <strong>${stats.lapses} 次注意力流失</strong>，表明存在**中度睡眠压力与疲劳风险**。您的专心能力开始不稳定，大脑的专注通路偶尔会短暂中断（微睡眠）。进行高精度操作时须极其谨慎。</p>`;
    } else {
      content += `<p><strong>注意力稳定性：</strong>注意力流失次数高达 <strong>${stats.lapses} 次</strong>，表明您处于**频繁流失的严重睡眠债状态**。频繁且严重的流失提示大脑正强制进入微睡眠以弥补睡眠不足。您的持续专注力已受到严重削弱。</p>`;
    }
    
    // Section C: Impulse control and Anticipations
    if (stats.falseStarts === 0) {
      content += `<p><strong>冲动控制力：</strong>您展现了**完美的冲动控制力**（0 次提前点击），这意味着您完全是在视觉目标出现时才做出反应，而非凭猜测或提前预测。</p>`;
    } else if (stats.falseStarts <= 2) {
      content += `<p><strong>冲动控制力：</strong>您出现了 <strong>${stats.falseStarts} 次提前点击</strong>，表明运动反应存在轻微的提前倾向。这是正常的，特别是在患者努力追求更快反应速度时。</p>`;
    } else {
      content += `<p><strong>冲动控制力：</strong>较多的 <strong>${stats.falseStarts} 次提前点击</strong>反映了**运动冲动抑制能力的受损**。频繁地提前猜测表明您在试图通过预测来弥补生理反应速度的减慢，反映出此时注意力策略不够稳定。</p>`;
    }
    
    // Section D: Clinical Recommendation
    if (scorePercent >= 90) {
      content += `<p><strong>临床建议：以优秀成绩通过</strong>。您目前处于警觉度的巅峰状态。非常适合进行高精度任务、复杂编程、精细操作及安全攸关的任务。</p>`;
    } else if (scorePercent >= 70) {
      content += `<p><strong>临床建议：警告 - 中度风险</strong>。您的专注力存在波动。请避免进行安全攸关的操作或长途驾驶。建议适当补充水分、到室外晒晒太阳或进行 20 分钟的短暂午休以恢复警觉度。</p>`;
    } else {
      content += `<p><strong>临床建议：安全警告 - 极度高危状态</strong>。您的睡眠债或疲劳指数极高。极易发生注意力流失和微睡眠。建议立即暂停一切安全攸关的操作，严禁操作机器或驾驶，并尽快获得完整的恢复性睡眠周期（7.5 - 9 小时）。</p>`;
    }
  } else {
    content += `<p>Based on your sustained attention assessment metrics, the laboratory has compiled your clinical cognitive vigilance report:</p>`;
    
    // Section A: Averages and Processing speed analysis
    if (stats.meanRT < 240) {
      content += `<p><strong>Processing Speed:</strong> Your average processing reaction velocity of <strong>${stats.meanRT}ms</strong> is **exceptional**, placing you in the top 10% of the rested cohort. Your neural conduction speeds and muscle reaction execution reflect optimal neurocognitive reserve and strong focus pathways.</p>`;
    } else if (stats.meanRT < 285) {
      content += `<p><strong>Processing Speed:</strong> Your mean reaction velocity of <strong>${stats.meanRT}ms</strong> sits within the **normal healthy baseline**. This indicates an active executive focus threshold, consistent with regular cognitive task endurance.</p>`;
    } else if (stats.meanRT < 340) {
      content += `<p><strong>Processing Speed:</strong> Your mean reaction speed is <strong>${stats.meanRT}ms</strong>. This sits at a **sluggish focus baseline**, suggesting possible fatigue, mental workload saturation, or the presence of moderate biological sleep pressure.</p>`;
    } else {
      content += `<p><strong>Processing Speed:</strong> A critical mean reaction average of <strong>${stats.meanRT}ms</strong> represents a **severe performance decay** (cognitive slowing of over 40%). Widespread slowings of this degree indicate heavy cognitive loading or physical fatigue states.</p>`;
    }
    
    // Section B: Attentional Lapses & Sleep Debt
    if (stats.lapses === 0) {
      content += `<p><strong>Concentration Stability:</strong> With **zero lapses** during this run, you demonstrated **impeccable sustained attention stability**. Focus pathway synapses are fully synced without micro-sleep drops.</p>`;
    } else if (stats.lapses <= 2) {
      content += `<p><strong>Concentration Stability:</strong> You registered <strong>${stats.lapses} attentional lapses</strong>. Occasional lapses reflect slight transient dips of vigilance (moments of blinking or minor focus slips), common when sleep debt is starting to accumulate slightly.</p>`;
    } else if (stats.lapses <= 5) {
      content += `<p><strong>Concentration Stability:</strong> Having <strong>${stats.lapses} attentional lapses</strong> indicates a **moderate sleep pressure and fatigue risk**. Attentional capacity is becoming unstable, and focus pathways are intermittently shutting down (micro-sleeps). Extreme caution should be exercised when engaging in high-precision work.</p>`;
    } else {
      content += `<p><strong>Concentration Stability:</strong> With a critical count of <strong>${stats.lapses} lapses</strong>, you are in a **lapse-prone severe sleep deficit**. Attentional lapses are frequent and severe, indicating that the brain is forcing micro-sleep episodes to offset sleep debt. Sustained mental tasks are heavily compromised.</p>`;
    }
    
    // Section C: Impulse control and Anticipations
    if (stats.falseStarts === 0) {
      content += `<p><strong>Impulse Control:</strong> You displayed **perfect impulse control** (0 false starts), meaning you reacted solely to visual triggers rather than guessing or anticipating.</p>`;
    } else if (stats.falseStarts <= 2) {
      content += `<p><strong>Impulse Control:</strong> With <strong>${stats.falseStarts} false starts</strong>, your motor response showed minor premature triggers. This reveals minor anticipation errors, which is normal as you push for faster response times.</p>`;
    } else {
      content += `<p><strong>Impulse Control:</strong> A high count of <strong>${stats.falseStarts} false starts</strong> reflects **compromised motor impulse inhibition**. Anxious anticipations suggest trying to bypass slow physical reaction speeds by guessing, indicating an unstable focus strategy.</p>`;
    }
    
    // Section D: Clinical Recommendation
    if (scorePercent >= 90) {
      content += `<p><strong>Clinical Recommendation:</strong> <strong>PASSED WITH DISTINCTION</strong>. You are at peak executive potential. High-precision duties, detailed coding, complex operations, and safety-critical tasks are optimal to perform right now.</p>`;
    } else if (scorePercent >= 70) {
      content += `<p><strong>Clinical Recommendation:</strong> <strong>CAUTION - MODERATE RISK</strong>. Focus fluctuates. Refrain from safety-critical duties. Avoid long uninterrupted driving blocks. Consider hydrating, walking under direct sunlight, or taking a short 20-minute power nap to reset sustained alertness.</p>`;
    } else {
      content += `<p><strong>Clinical Recommendation:</strong> <strong>SAFETY WARNING - CRITICAL STATE</strong>. Sleep debt or fatigue indices are exceptionally high. Highly prone to lapses of attention. It is highly recommended to suspend safety-critical operations immediately, refrain from operating machinery, and secure a full sleep recovery cycle (7.5 - 9 hours).</p>`;
    }
  }
  
  diagnosticText.innerHTML = content;
}

// --- 12. LOCAL STORAGE DATABASE MANAGER ---
function saveSessionToLocalStorage(stats) {
  const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
  const durationSec = config.duration / 1000;
  
  const record = {
    id: Date.now(),
    dateTime: new Date().toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    durationLabel: durationSec === 180 ? 'clinical' : (durationSec === 60 ? 'sprint' : 'demo'),
    meanRT: stats.meanRT,
    lapses: stats.lapses,
    falseStarts: stats.falseStarts,
    performanceScore: stats.performanceScore
  };
  
  history.unshift(record); // Add to top
  localStorage.setItem('pvt_history', JSON.stringify(history));
}

function loadSessionHistory() {
  const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
  const d = I18N_DICTS[currentLanguage];
  
  if (history.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="history-empty">
          ${d.historyEmptyState}
        </td>
      </tr>
    `;
    return;
  }
  
  historyTableBody.innerHTML = '';
  history.forEach(item => {
    const tr = document.createElement('tr');
    
    // Performance class indicator coloring
    const perfVal = parseFloat(item.performanceScore);
    let scoreColorClass = 'text-green';
    if (perfVal < 70) scoreColorClass = 'text-danger';
    else if (perfVal < 90) scoreColorClass = 'text-warning';
    
    // Support localized duration labels for both new keys and legacy labels
    const labelText = item.durationLabel === 'clinical' || item.durationLabel === '3m Clinical' 
      ? `${d.durClinical} (${d.durClinicalSub})`
      : (item.durationLabel === 'sprint' || item.durationLabel === '1m Sprint'
        ? `${d.durSprint} (${d.durSprintSub})`
        : `${d.durDemo} (${d.durDemoSub})`);
    
    tr.innerHTML = `
      <td>${item.dateTime}</td>
      <td><strong>${labelText}</strong></td>
      <td><strong>${item.meanRT} ${d.scUnitMeanRT}</strong></td>
      <td class="text-lapses">${item.lapses}</td>
      <td class="text-false-starts">${item.falseStarts}</td>
      <td><span class="${scoreColorClass}" font-weight="700">${item.performanceScore}%</span></td>
    `;
    historyTableBody.appendChild(tr);
  });
}

function clearSessionHistory() {
  if (confirm(I18N_DICTS[currentLanguage].clearHistoryConfirm)) {
    localStorage.removeItem('pvt_history');
    loadSessionHistory();
  }
}

clearHistoryBtn.addEventListener('click', clearSessionHistory);

// --- 13. POST-TEST ACTIONS CONTROL BINDINGS ---
retryTestBtn.addEventListener('click', () => {
  startTask();
});

printReportBtn.addEventListener('click', () => {
  window.print();
});

backToSetupBtn.addEventListener('click', () => {
  showScreen(configScreen);
});

// --- 14. INITIALISATION CONTROLLER ---
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initTheme();
  
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
    localStorage.setItem('pvt_lang', currentLanguage); // fallback legacy
    updateLanguageUI();
  });

  // Dynamic mobile/touch UI defaults
  if (isTouchDevice) {
    const spaceBtn = inputSelector.querySelector('[data-value="space"]');
    const tapBtn = inputSelector.querySelector('[data-value="tap"]');
    if (spaceBtn && tapBtn) {
      spaceBtn.classList.remove('active');
      tapBtn.classList.add('active');
    }
  }
  
  // Switch immediately to initial setup view
  showScreen(configScreen);
});
