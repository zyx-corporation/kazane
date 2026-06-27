import type { Lang } from '../types';

export interface Translations {
  tagline1: string; tagline2: string;
  sidebarDesc: string;
  btnActivityLog: string; btnNewItem: string; btnReset: string;
  subDash: string; dashSummary: string;
  hdMorning: string; hdBounced: string; bouncedNote: string; returnedTag: string;
  hdQueue: string; hdDomainQueue: string;
  cInProgress: string; sInProgress: string; cHuman: string; sHuman: string;
  cRde: string; sRde: string; cGate: string; sGate: string;
  subBoard: string; legendAI: string; legendHuman: string; legendGate: string;
  tabContext: string; tabHandoff: string; tabEvidence: string; tabRde: string; tabGate: string;
  subCtx: string; unresolvedShort: string; sendToRde: string;
  flQuestion: string; flPurpose: string; flContext: string; flConstraint: string;
  flPast: string; flUnresolved: string;
  relatedWI: string; relatedEv: string; unresolvedHd: string; nextPolicy: string;
  btnConnectWI: string; btnCreateCtx: string;
  subHand: string;
  flDid: string; flJudged: string; flCouldnt: string; flUncertain: string;
  flBounceBoundary: string; flBounce: string; flNext: string;
  flUpdCtx: string; flRefEv: string; flAsk: string;
  btnReturnHuman: string; btnReassign: string; btnUpdCtx: string;
  subGateScr: string; chipAll: string; permLabel: string; stopLabel: string;
  riskClassifier: string; riskLow: string; riskMed: string; riskHigh: string;
  approvalFlow: string; af1: string; af2: string; af3: string; af4: string;
  stopTemplates: string; st1: string; st2: string; st3: string; st4: string;
  subRdeScr: string;
  rdeKept: string; rdeTransformed: string; rdeAdded: string;
  rdeUnresolved: string; rdeDeviation: string; rdeNextPolicy: string;
  btnRunRdeAudit: string; btnPromoteUnresolved: string;
  btnUpdCtxCard: string; btnExportReport: string;
  evidenceSub: string; btnAddEv: string; trust: string;
  moveHd: string; openCtxFull: string; openHoFull: string;
  openRdeFull: string; openGateFull: string;
  evRefHd: string; noRdeMsg: string; itemGateHd: string;
  modalTitle: string; modalDesc: string;
  fTitle: string; fDomain: string; fAssignee: string; titlePh: string;
  btnCancel: string; btnAddInbox: string;
  toastAdded: string; toastMoved: string; toastRde: string; toastNeedTitle: string;
  btnAiRun: string; toastAiStopped: string; toastAiDone: string;
  hoAutoDid: string; hoAutoUncertain: string; hoAutoNext: string;
  // v0.1 additions
  btnEdit: string; btnSave: string; btnDelete: string;
  toastEdited: string; toastDeleted: string; toastExported: string;
  newCtxModalTitle: string; fCtxTitle: string; fCtxQuestion: string;
  ctxTitlePh: string; ctxQuestionPh: string; btnAddCtx: string;
  goCtxCard: string;
  // v0.2 additions
  btnAssignAgent: string;
  toastAgentAssigned: string;
  toastAgentHandoffReceived: string;
  toastAgentEscalated: string;
  agentPickedUpLabel: string;
  agentEscalatedLabel: string;
  agentQueueEmpty: string;
  // v0.3 additions
  tabTimeline: string;
  timelineEmpty: string;
  btnProposeCtxUpdate: string;
  toastCtxUpdated: string;
}

const T: Record<Lang, Translations> = {
  ja: {
    tagline1: '仕事の気配を聴き、', tagline2: '判断の来歴を綴る。',
    sidebarDesc: 'Kazaneは開発管理ツールではない。AIエージェントが関与できる業務フローを、文脈・判断・証跡・責任境界とともに管理する知的協働OSである。',
    btnActivityLog: 'AI作業ログ', btnNewItem: '+ 新規 Work Item', btnReset: 'デモをリセット',
    subDash: 'ZYX社内の業務フロー全体を俯瞰する。今朝、AIが処理した仕事と、いま人間の判断を待っている仕事。',
    dashSummary: '今日のAI協働サマリー — AI番頭が朝に5件を処理。3件が人間判断待ち、2件が専門家確認候補、1件が差し戻し。停止はすべて責任境界を守る正常フロー。',
    hdMorning: '今朝 AIが処理した作業', hdBounced: '差し戻された作業', bouncedNote: '正常フロー — 責任境界を守るための停止', returnedTag: '差し戻し',
    hdQueue: '判断待ちキュー', hdDomainQueue: '業務領域別キュー',
    cInProgress: '進行中 Work Item', sInProgress: 'AI Working + Inbox', cHuman: '人間判断待ち', sHuman: 'Needs Human',
    cRde: 'RDE 監査要件', sRde: '意味変化の監査', cGate: '専門家確認候補', sGate: 'Expert / Gate',
    subBoard: '人間とAIが同じ業務空間でWork Itemを扱う。開発だけでなく、営業・顧客対応・経理・執筆・調査・会議・AI番頭・診断士連携まで。カードを開くと文脈・引き継ぎ・証跡・監査に辿れる。',
    legendAI: 'AI 担当', legendHuman: '人間 担当', legendGate: 'Gate = AIが止まる責任境界（正常フロー）',
    tabContext: '文脈', tabHandoff: '引き継ぎ', tabEvidence: '証跡', tabRde: 'RDE監査', tabGate: 'Gate',
    subCtx: 'Work Itemの背後にある問い・目的・制約・顧客文脈・過去判断を保存する。仕事はここから生まれる。',
    unresolvedShort: '未解決', sendToRde: 'RDE Auditへ送る',
    flQuestion: 'この仕事が生まれた問い', flPurpose: '目的', flContext: '顧客・社内文脈', flConstraint: '制約', flPast: '過去の判断', flUnresolved: '未解決点',
    relatedWI: '関連 Work Item', relatedEv: '関連 Evidence', unresolvedHd: '未解決点 — クリックでWork Item化', nextPolicy: '次回更新方針 ·',
    btnConnectWI: 'Work Itemと接続', btnCreateCtx: 'Context Card作成',
    subHand: 'AIまたは人間が作業後に残す引き継ぎ。何を実施し、何を判断し、何を判断できず、なぜ止めたか。差し戻しは失敗ではなく次への接続。',
    flDid: '実施内容', flJudged: '判断したこと', flCouldnt: '判断できなかったこと', flUncertain: '不確実性',
    flBounceBoundary: '差し戻し理由（責任境界）', flBounce: '差し戻し理由', flNext: '次アクション', flUpdCtx: '更新すべき Context', flRefEv: '参照した Evidence', flAsk: '人間への依頼',
    btnReturnHuman: '人間へ差し戻し', btnReassign: 'AIへ再依頼', btnUpdCtx: 'Context更新',
    subGateScr: 'AIが止まる条件を業務領域ごとに定義する。停止は失敗ではなく、責任境界を守る正常系。高リスク領域ほどAIの権限は狭い。',
    chipAll: 'すべて', permLabel: 'AI権限', stopLabel: '停止条件 — 人間・専門家へ',
    riskClassifier: 'リスク分類器', riskLow: '低 — AI自走', riskMed: '中 — Needs Human', riskHigh: '高 — Expert / Gate',
    approvalFlow: '承認フロー', af1: 'AIが停止し、Handoffを残す', af2: '人間が判断・承認', af3: '必要なら専門家確認', af4: '承認ログをEvidenceに記録',
    stopTemplates: '停止理由テンプレート', st1: '価格・契約条件の提示', st2: '税務・法律・医療判断', st3: '外部公開・第三者への送信', st4: '本番反映・破壊的変更',
    subRdeScr: '業務結果が、元の問い・顧客文脈・判断意図・公開責任からどう意味が変化したかを監査する。品質チェックではなく、意味の来歴の監査。',
    rdeKept: '保存された要素', rdeTransformed: '変換された要素', rdeAdded: '補完された要素', rdeUnresolved: '未解決の要素', rdeDeviation: '逸脱リスク', rdeNextPolicy: '次回更新方針',
    btnRunRdeAudit: 'RDE Audit実行', btnPromoteUnresolved: '未解決点をWork Item化', btnUpdCtxCard: 'Context Card更新', btnExportReport: '監査レポート出力',
    evidenceSub: 'AIが何を読んで判断したかの証跡', btnAddEv: '+ Evidence追加', trust: '信頼度',
    moveHd: '状態を移す — 人間の操作', openCtxFull: 'Context Card全体を開く →', openHoFull: 'Handoff Note全体を開く →', openRdeFull: 'RDE Audit全体を開く →', openGateFull: 'Escalation Gate設定を開く →',
    evRefHd: 'AIが参照した証跡', noRdeMsg: 'このWork ItemはまだRDE監査未実施。', itemGateHd: 'このItemのGate',
    modalTitle: '新規 Work Item', modalDesc: 'Inbox に追加され、AIまたは人間が着手します。業務領域でKazaneは開発に閉じません。',
    fTitle: 'タイトル', fDomain: '業務領域', fAssignee: '担当（AI / 人間）', titlePh: '例：顧客問い合わせ返信案を作成', btnCancel: 'キャンセル', btnAddInbox: 'Inbox に追加',
    toastAdded: '{id} を Inbox に追加しました', toastMoved: '{id} → {status}', toastRde: '{id} を RDE 監査に送りました', toastNeedTitle: 'タイトルを入力してください',
    btnAiRun: 'AIに実行させる（自動）', toastAiStopped: '{id}：AIが停止 → {status}（Handoff記録）', toastAiDone: '{id}：AIが完了、Handoffを記録',
    hoAutoDid: 'AIが関連情報を整理し、作業案を作成。', hoAutoUncertain: '一部に人間の確認が必要な判断が含まれる。', hoAutoNext: '人間が責任境界を確認し、承認する。',
    btnEdit: '編集', btnSave: '保存', btnDelete: '削除',
    toastEdited: '{id} を更新しました', toastDeleted: '{id} を削除しました', toastExported: 'エクスポート完了',
    newCtxModalTitle: 'Context Card 新規作成', fCtxTitle: 'タイトル', fCtxQuestion: '問い（この仕事が生まれた問い）',
    ctxTitlePh: '例：顧客との合意形成プロセス', ctxQuestionPh: '例：なぜこの案件は合意に時間がかかっているのか？', btnAddCtx: 'Context Card を追加',
    goCtxCard: 'Context Card を開く →',
    btnAssignAgent: 'エージェントに割り当てる',
    toastAgentAssigned: '{id} をエージェントに割り当てました',
    toastAgentHandoffReceived: 'エージェントから引き継ぎを受け取りました — {id}',
    toastAgentEscalated: 'エージェントがエスカレーション — {id} → Gate',
    agentPickedUpLabel: 'エージェント着手',
    agentEscalatedLabel: 'エスカレーション',
    agentQueueEmpty: '割り当て待ちのタスクはありません',
    tabTimeline: '履歴',
    timelineEmpty: 'このWork Itemの履歴はまだ記録されていません。',
    btnProposeCtxUpdate: 'を更新（このHOから）',
    toastCtxUpdated: '{ctxId} を Handoff Note から更新しました',
  },
  en: {
    tagline1: 'Hear the signals of work,', tagline2: 'chronicle the lineage of decisions.',
    sidebarDesc: 'Kazane is not a dev task tool. It is an intelligent collaboration OS that manages AI-involved work with its context, decisions, evidence, and lines of responsibility.',
    btnActivityLog: 'AI Activity Log', btnNewItem: '+ New Work Item', btnReset: 'Reset demo',
    subDash: 'An overview of all work across ZYX — what AI handled this morning, and what now awaits human judgment.',
    dashSummary: "Today's AI collaboration — AI-Banto handled 5 items this morning. 3 await human judgment, 2 need expert review, 1 was returned. Every stop is a normal flow that guards a line of responsibility.",
    hdMorning: 'Handled by AI this morning', hdBounced: 'Returned for human judgment', bouncedNote: 'Normal flow — a stop that guards responsibility', returnedTag: 'Returned',
    hdQueue: 'Awaiting-judgment queue', hdDomainQueue: 'Queue by work domain',
    cInProgress: 'In-progress Work Items', sInProgress: 'AI Working + Inbox', cHuman: 'Awaiting human', sHuman: 'Needs Human',
    cRde: 'RDE audits due', sRde: 'Audit of meaning change', cGate: 'Expert review', sGate: 'Expert / Gate',
    subBoard: 'Humans and AI share one workspace — not just engineering, but sales, support, finance, writing, research, meetings, AI-Banto, and advisor liaison. Open a card to reach its context, handoff, evidence, and audit.',
    legendAI: 'AI owner', legendHuman: 'Human owner', legendGate: 'Gate = the line where AI stops (a normal flow)',
    tabContext: 'Context', tabHandoff: 'Handoff', tabEvidence: 'Evidence', tabRde: 'RDE Audit', tabGate: 'Gate',
    subCtx: 'Stores the question, purpose, constraints, customer context, and past decisions behind a Work Item. Work is born here.',
    unresolvedShort: 'Open', sendToRde: 'Send to RDE Audit',
    flQuestion: 'The question that created this work', flPurpose: 'Purpose', flContext: 'Customer / internal context', flConstraint: 'Constraints', flPast: 'Past decisions', flUnresolved: 'Open questions',
    relatedWI: 'Related Work Items', relatedEv: 'Related Evidence', unresolvedHd: 'Open questions — click to turn into a Work Item', nextPolicy: 'Next update policy ·',
    btnConnectWI: 'Link a Work Item', btnCreateCtx: 'New Context Card',
    subHand: 'The handoff left after work — what was done, judged, not judged, and why it stopped. A return is not a failure but a bridge to the next step.',
    flDid: 'What was done', flJudged: 'Judged', flCouldnt: 'Could not judge', flUncertain: 'Uncertainty',
    flBounceBoundary: 'Reason for return (responsibility line)', flBounce: 'Reason for return', flNext: 'Next action', flUpdCtx: 'Context to update', flRefEv: 'Evidence referenced', flAsk: 'Request to human',
    btnReturnHuman: 'Return to human', btnReassign: 'Reassign to AI', btnUpdCtx: 'Update Context',
    subGateScr: "Defines where AI stops, per work domain. A stop is not a failure but a normal flow that guards responsibility. The higher the risk, the narrower the AI's authority.",
    chipAll: 'All', permLabel: 'AI authority', stopLabel: 'Stop conditions — to human / expert',
    riskClassifier: 'Risk classifier', riskLow: 'Low — AI runs', riskMed: 'Medium — Needs Human', riskHigh: 'High — Expert / Gate',
    approvalFlow: 'Approval flow', af1: 'AI stops and leaves a Handoff', af2: 'Human judges and approves', af3: 'Expert review if needed', af4: 'Approval logged to Evidence',
    stopTemplates: 'Stop-reason templates', st1: 'Pricing / contract terms', st2: 'Tax / legal / medical judgment', st3: 'Public release / sending to third parties', st4: 'Production deploy / breaking change',
    subRdeScr: "Audits how the result's meaning shifted from the original question, customer context, intent, and publishing responsibility. Not a QA check — an audit of meaning's lineage.",
    rdeKept: 'Preserved', rdeTransformed: 'Transformed', rdeAdded: 'Added', rdeUnresolved: 'Unresolved', rdeDeviation: 'Deviation risk', rdeNextPolicy: 'Next update policy',
    btnRunRdeAudit: 'Run RDE Audit', btnPromoteUnresolved: 'Turn open question into a Work Item', btnUpdCtxCard: 'Update Context Card', btnExportReport: 'Export audit report',
    evidenceSub: 'Record of what the AI read and judged on', btnAddEv: '+ Add Evidence', trust: 'Trust',
    moveHd: 'Move state — human action', openCtxFull: 'Open full Context Card →', openHoFull: 'Open full Handoff Note →', openRdeFull: 'Open full RDE Audit →', openGateFull: 'Open Escalation Gate →',
    evRefHd: 'Evidence the AI referenced', noRdeMsg: 'This Work Item has not been RDE-audited yet.', itemGateHd: "This item's Gate",
    modalTitle: 'New Work Item', modalDesc: 'Added to Inbox for AI or a human to pick up. Kazane spans every work domain, not just engineering.',
    fTitle: 'Title', fDomain: 'Work domain', fAssignee: 'Owner (AI / human)', titlePh: 'e.g. Draft a reply to a customer inquiry', btnCancel: 'Cancel', btnAddInbox: 'Add to Inbox',
    toastAdded: '{id} added to Inbox', toastMoved: '{id} → {status}', toastRde: '{id} sent to RDE audit', toastNeedTitle: 'Please enter a title',
    btnAiRun: 'Run with AI (auto)', toastAiStopped: '{id}: AI stopped → {status} (Handoff logged)', toastAiDone: '{id}: AI finished, Handoff logged',
    hoAutoDid: 'AI organized the context and drafted the work.', hoAutoUncertain: 'Some judgments require human confirmation.', hoAutoNext: 'A human reviews the responsibility line and approves.',
    btnEdit: 'Edit', btnSave: 'Save', btnDelete: 'Delete',
    toastEdited: '{id} updated', toastDeleted: '{id} deleted', toastExported: 'Export complete',
    newCtxModalTitle: 'New Context Card', fCtxTitle: 'Title', fCtxQuestion: 'Question (what created this work)',
    ctxTitlePh: 'e.g. Customer agreement process', ctxQuestionPh: 'e.g. Why is consensus taking so long?', btnAddCtx: 'Add Context Card',
    goCtxCard: 'Open Context Card →',
    btnAssignAgent: 'Assign to Agent',
    toastAgentAssigned: '{id} assigned to agent',
    toastAgentHandoffReceived: 'Agent handoff received — {id}',
    toastAgentEscalated: 'Agent escalated — {id} → Gate',
    agentPickedUpLabel: 'Agent picked up',
    agentEscalatedLabel: 'Escalated',
    agentQueueEmpty: 'No tasks pending for agent',
    tabTimeline: 'Timeline',
    timelineEmpty: 'No history recorded for this Work Item yet.',
    btnProposeCtxUpdate: '→ update from this HO',
    toastCtxUpdated: '{ctxId} updated from Handoff Note',
  },
  zh: {
    tagline1: '聆听工作的气息，', tagline2: '记录决策的脉络。',
    sidebarDesc: 'Kazane 不是开发管理工具，而是一个智能协作 OS——把 AI 参与的业务流程，连同其上下文、判断、证据与责任边界一起管理。',
    btnActivityLog: 'AI 操作日志', btnNewItem: '+ 新建 Work Item', btnReset: '重置演示',
    subDash: '俯瞰 ZYX 全公司的业务流程——今早 AI 处理了什么，现在又有什么在等待人来判断。',
    dashSummary: '今日 AI 协作 — AI 番头今早处理了 5 项。3 项等待人工判断，2 项需专家确认，1 项被退回。每一次停止都是守护责任边界的正常流程。',
    hdMorning: '今早由 AI 处理的工作', hdBounced: '被退回的工作', bouncedNote: '正常流程 — 守护责任边界的停止', returnedTag: '退回',
    hdQueue: '待判断队列', hdDomainQueue: '按业务领域分类的队列',
    cInProgress: '进行中的 Work Item', sInProgress: 'AI Working + Inbox', cHuman: '等待人工判断', sHuman: 'Needs Human',
    cRde: '待 RDE 审计', sRde: '意义变化的审计', cGate: '专家确认候选', sGate: 'Expert / Gate',
    subBoard: '人与 AI 在同一业务空间处理 Work Item。不仅是开发，还包括销售、客户支持、财务、写作、调研、会议、AI 番头、咨询师联动。',
    legendAI: 'AI 负责', legendHuman: '人工负责', legendGate: 'Gate = AI 停止的责任边界（正常流程）',
    tabContext: '上下文', tabHandoff: '交接', tabEvidence: '证据', tabRde: 'RDE 审计', tabGate: 'Gate',
    subCtx: '保存 Work Item 背后的提问、目的、约束、客户上下文与过往判断。工作由此而生。',
    unresolvedShort: '未解决', sendToRde: '送往 RDE 审计',
    flQuestion: '催生此项工作的提问', flPurpose: '目的', flContext: '客户 / 内部上下文', flConstraint: '约束', flPast: '过往判断', flUnresolved: '未解决点',
    relatedWI: '关联的 Work Item', relatedEv: '关联的 Evidence', unresolvedHd: '未解决点 — 点击转为 Work Item', nextPolicy: '下次更新方针 ·',
    btnConnectWI: '关联 Work Item', btnCreateCtx: '新建 Context Card',
    subHand: 'AI 或人在工作后留下的交接。做了什么、判断了什么、无法判断什么、为何停止。退回不是失败，而是通往下一步的桥梁。',
    flDid: '执行内容', flJudged: '已判断', flCouldnt: '无法判断', flUncertain: '不确定性',
    flBounceBoundary: '退回理由（责任边界）', flBounce: '退回理由', flNext: '下一步行动', flUpdCtx: '需更新的 Context', flRefEv: '参照的 Evidence', flAsk: '对人的请求',
    btnReturnHuman: '退回人工', btnReassign: '重新交给 AI', btnUpdCtx: '更新 Context',
    subGateScr: '按业务领域定义 AI 停止的条件。停止不是失败，而是守护责任边界的正常流程。风险越高，AI 的权限越窄。',
    chipAll: '全部', permLabel: 'AI 权限', stopLabel: '停止条件 — 转交人 / 专家',
    riskClassifier: '风险分类器', riskLow: '低 — AI 自走', riskMed: '中 — Needs Human', riskHigh: '高 — Expert / Gate',
    approvalFlow: '审批流程', af1: 'AI 停止并留下 Handoff', af2: '人进行判断与审批', af3: '必要时专家确认', af4: '审批日志记入 Evidence',
    stopTemplates: '停止理由模板', st1: '报价 / 合同条款', st2: '税务 / 法律 / 医疗判断', st3: '对外公开 / 发送给第三方', st4: '生产环境发布 / 破坏性变更',
    subRdeScr: '审计业务结果相对于最初的提问、客户上下文、判断意图与公开责任，其意义发生了怎样的变化。',
    rdeKept: '被保留的要素', rdeTransformed: '被转换的要素', rdeAdded: '被补充的要素', rdeUnresolved: '未解决的要素', rdeDeviation: '偏离风险', rdeNextPolicy: '下次更新方针',
    btnRunRdeAudit: '执行 RDE 审计', btnPromoteUnresolved: '将未解决点转为 Work Item', btnUpdCtxCard: '更新 Context Card', btnExportReport: '导出审计报告',
    evidenceSub: 'AI 读取并据以判断的证据记录', btnAddEv: '+ 添加 Evidence', trust: '可信度',
    moveHd: '移动状态 — 人工操作', openCtxFull: '打开完整 Context Card →', openHoFull: '打开完整 Handoff Note →', openRdeFull: '打开完整 RDE 审计 →', openGateFull: '打开 Escalation Gate →',
    evRefHd: 'AI 参照的证据', noRdeMsg: '此 Work Item 尚未进行 RDE 审计。', itemGateHd: '此项的 Gate',
    modalTitle: '新建 Work Item', modalDesc: '添加到 Inbox，由 AI 或人着手。Kazane 覆盖所有业务领域，不限于开发。',
    fTitle: '标题', fDomain: '业务领域', fAssignee: '负责（AI / 人）', titlePh: '例：起草客户咨询的回复', btnCancel: '取消', btnAddInbox: '添加到 Inbox',
    toastAdded: '{id} 已添加到 Inbox', toastMoved: '{id} → {status}', toastRde: '{id} 已送往 RDE 审计', toastNeedTitle: '请输入标题',
    btnAiRun: '交给 AI 执行（自动）', toastAiStopped: '{id}：AI 已停止 → {status}（已记录 Handoff）', toastAiDone: '{id}：AI 完成，已记录 Handoff',
    hoAutoDid: 'AI 整理了相关信息并起草了工作方案。', hoAutoUncertain: '部分判断需要人工确认。', hoAutoNext: '由人确认责任边界并审批。',
    btnEdit: '编辑', btnSave: '保存', btnDelete: '删除',
    toastEdited: '{id} 已更新', toastDeleted: '{id} 已删除', toastExported: '导出完成',
    newCtxModalTitle: '新建 Context Card', fCtxTitle: '标题', fCtxQuestion: '提问（催生此项工作的提问）',
    ctxTitlePh: '例：与客户的共识形成过程', ctxQuestionPh: '例：为什么这个项目的共识需要这么长时间？', btnAddCtx: '添加 Context Card',
    goCtxCard: '打开 Context Card →',
    btnAssignAgent: '分配给 Agent',
    toastAgentAssigned: '{id} 已分配给 Agent',
    toastAgentHandoffReceived: '收到 Agent 交接 — {id}',
    toastAgentEscalated: 'Agent 已上报 — {id} → Gate',
    agentPickedUpLabel: 'Agent 已接手',
    agentEscalatedLabel: '已上报',
    agentQueueEmpty: '没有待处理的 Agent 任务',
    tabTimeline: '历史',
    timelineEmpty: '此 Work Item 暂无历史记录。',
    btnProposeCtxUpdate: '→ 从此 HO 更新',
    toastCtxUpdated: '{ctxId} 已从 Handoff Note 更新',
  },
};

export function getT(lang: Lang): Translations {
  return T[lang] ?? T.ja;
}
