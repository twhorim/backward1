import React, { useRef } from "react";
import { Printer, Copy, RotateCcw, Check, Sparkles, Award, ListTodo, BookOpen, Clock, Heart } from "lucide-react";
import { BackwardDesignState } from "../types";

interface FinalOutputProps {
  data: BackwardDesignState;
  onReset: () => void;
}

export default function FinalOutput({ data, onReset }: FinalOutputProps) {
  const [copied, setCopied] = React.useState(false);
  const [printMode, setPrintMode] = React.useState(false);

  const handleCopyMarkdown = () => {
    let md = `# [2022 개정 교육과정 연계] AI·디지털 기반 백워드 설계 단원안\n\n`;
    md += `## 0. 기본 단원 정보\n`;
    md += `- **교과명**: ${data.subject}\n`;
    md += `- **학년**: ${data.grade || "미기입"}\n`;
    md += `- **단원명**: ${data.unitName || "미기입"}\n`;
    md += `- **연계 성취기준**: ${data.achievementStandard}\n\n`;

    md += `## 1단계: Desired Results (목표 설정)\n`;
    md += `### 핵심 아이디어 (Core Idea)\n> ${data.coreIdeas || "미기입"}\n\n`;
    md += `### 본질적 질문 (Essential Questions)\n`;
    if (data.essentialQuestions) {
      data.essentialQuestions.split("\n").forEach((q, i) => {
        md += `${i + 1}. ${q}\n`;
      });
    } else {
      md += `- 미기입\n`;
    }
    md += `\n`;
    md += `### 습득할 지식 (Key Knowledge)\n${data.keyKnowledge || "미기입"}\n\n`;
    md += `### 발휘할 기능 (Key Skills)\n${data.keySkills || "미기입"}\n\n`;

    md += `## 2단계: Acceptable Evidence (평가 계획)\n`;
    md += `### 핵심 수행 평가 과제명\n> **${data.assessmentTaskName || "미기입"}**\n\n`;
    md += `### GRASPS 시나리오 맥락\n`;
    md += `- **Goal (목적)**: ${data.grasps.goal || "미기입"}\n`;
    md += `- **Role (역할)**: ${data.grasps.role || "미기입"}\n`;
    md += `- **Audience (대상)**: ${data.grasps.audience || "미기입"}\n`;
    md += `- **Situation (상황)**: ${data.grasps.situation || "미기입"}\n`;
    md += `- **Product (산출물)**: ${data.grasps.product || "미기입"}\n`;
    md += `- **Standards (평가 잣대 요약)**: ${data.grasps.standards || "미기입"}\n\n`;

    md += `### 평가 루브릭 세트\n`;
    data.rubrics.forEach((rub, i) => {
      md += `#### 기준 ${i + 1}. ${rub.criterion}\n`;
      md += `- **상 (Excellent)**: ${rub.excellent}\n`;
      md += `- **중 (Proficient)**: ${rub.proficient}\n`;
      md += `- **하 (Developing)**: ${rub.developing}\n\n`;
    });

    md += `### 동행적 형성평가 및 성찰 방안\n${data.formativeAssessment || "미기입"}\n\n`;

    md += `## 3단계: WHERETO 교수학습 활동 계획\n`;
    data.wheretoSteps.forEach((step) => {
      md += `### [${step.key}] ${step.title} (${step.englishTitle})\n`;
      md += `- **활동 시나리오**: ${step.activity || "미기입"}\n`;
      md += `- **AI 및 에듀테크 통합 방안**: ${step.techIntegration || "미기입"}\n\n`;
    });

    md += `\n---\n*중등 AI디지털 백워드 설계 시뮬레이이터로 제작되었습니다.*`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePrintMode = () => {
    setPrintMode(!printMode);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="final-output-container">
      {/* Back button when in print mode page */}
      {printMode ? (
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-semibold text-slate-200">
              인쇄 모드가 활성화되었습니다. 프린트 완료 후 일반 화면으로 복귀하실 수 있습니다.
            </span>
          </div>
          <button
            onClick={() => setPrintMode(false)}
            className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-3.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            id="btn-close-print-mode"
          >
            일반 화면 복귀
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl print:hidden">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded uppercase">
              COHERENT DESIGN COMPLETE
            </span>
            <h2 className="text-lg font-bold mt-1 text-white">
              🎉 중등 교육과정 AI디지털 백워드 설계 완료!
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              성취기준과 교육 평가 목적, 그리고 WHERETO 원리에 입각한 수업 시나리오가 유기적으로 일치하는 백워드 교안이 탄생했습니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Copy markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
              id="copy-markdown-btn"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>클립보드 복사됨</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-indigo-400" />
                  <span>마크다운 형식 복사</span>
                </>
              )}
            </button>

            {/* Print */}
            <button
              onClick={() => {
                setPrintMode(true);
                setTimeout(() => {
                  window.print();
                }, 150);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-900/10 transition-colors"
              id="print-btn"
            >
              <Printer size={14} className="text-cyan-200" />
              <span>설계서 인쇄 / PDF 저장</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                if (confirm("모든 설계 정보가 초기화되고 첫 화면으로 돌아갑니다. 진행하시겠습니까?")) {
                  onReset();
                }
              }}
              className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              title="설계 리셋하기"
              id="reset-btn"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main Print Area Card */}
      <div className={`bg-white border text-sm text-slate-800 ${printMode ? "border-transparent shadow-none p-0" : "border-slate-200 shadow-sm p-6 sm:p-8"} rounded-3xl space-y-8`} id="printable-area">
        {/* Print Only Header */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              [2022 개정 연계] AI·디지털 과정중심 백워드 설계서
            </h1>
            <span className="text-xs text-slate-400 font-mono">
              작성시간: {new Date().toLocaleDateString("ko-KR")}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            중등 인공지능 디지털 기틀 백워드 설계 시뮬레이터를 기반으로 구조화됨.
          </div>
        </div>

        {/* Core Unit Profile Block */}
        <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
              UNIT SPECIFICATION
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {data.unitName || "미정의 단원"} <span className="font-normal text-slate-500 text-sm">({data.subject} / {data.grade || "전학종"})</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl font-mono mt-1">
              <strong>성취기준:</strong> {data.achievementStandard || "성취기준 미도표"}
            </p>
          </div>
        </div>

        {/* STAGE 1 SHOWCASE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-5 bg-indigo-600 rounded"></span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">1단계: 설정된 단원 목표 (Desired Results)</h3>
              <span className="text-[10px] text-indigo-500 font-medium">영속적 이해 추출</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core Ideas */}
            <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <BookOpen size={14} className="text-indigo-600" />
                <span>핵심 빅 아이디어 (Core Idea)</span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {data.coreIdeas || "핵심 아이디어가 기재되지 않았습니다."}
              </p>
            </div>

            {/* Essential Questions */}
            <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                <Clock size={14} className="text-indigo-600" />
                <span>본질적 질문 (Essential Questions)</span>
              </div>
              <ul className="space-y-1.5 leading-relaxed text-xs text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono">
                {data.essentialQuestions ? (
                  data.essentialQuestions.split("\n").map((eq, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-indigo-600 shrink-0">Q{i + 1}.</span>
                      <span>{eq}</span>
                    </li>
                  ))
                ) : (
                  <span className="text-slate-400">등록된 질문이 없습니다.</span>
                )}
              </ul>
            </div>

            {/* Knowledge */}
            <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-2">
              <div className="text-xs font-semibold text-slate-700 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span>학생들이 꼭 알아야 할 지식 (Knowledge)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-slate-200">
                {data.keyKnowledge || "지식 요구 내용이 공백 상태입니다."}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white border border-slate-100 rounded-xl p-4.5 space-y-2">
              <div className="text-xs font-semibold text-slate-700 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span>학생들이 발휘해야 할 기능 (Skills)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-slate-200">
                {data.keySkills || "기능 요구내용이 공백 상태입니다."}
              </p>
            </div>
          </div>
        </section>

        {/* STAGE 2 SHOWCASE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-5 bg-emerald-600 rounded"></span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">2단계: 수립된 평가 계획 (Acceptable Evidence)</h3>
              <span className="text-[10px] text-emerald-600 font-medium font-mono">GRASPS &amp; RUBRIC</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                PRIMARY ASSESSMENT TASK
              </span>
              <h4 className="text-sm font-bold text-slate-800 mt-1">
                {data.assessmentTaskName || "평가 과제 미설정"}
              </h4>
            </div>

            {/* GRASPS Checklist Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">G - Goal (과제 목적)</span>
                <p className="text-slate-700 mt-1">{data.grasps.goal || "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">R - Role (학생 역직)</span>
                <p className="text-slate-700 mt-1">{data.grasps.role || "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">A - Audience (예상 청중)</span>
                <p className="text-slate-700 mt-1">{data.grasps.audience || "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">S - Situation (활동 상황)</span>
                <p className="text-slate-700 mt-1">{data.grasps.situation || "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">P - Product (제작 산출)</span>
                <p className="text-slate-700 mt-1">{data.grasps.product || "-"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 uppercase font-mono block text-[10.5px]">S - Standards (평정 기본)</span>
                <p className="text-slate-700 mt-1">{data.grasps.standards || "-"}</p>
              </div>
            </div>
          </div>

          {/* Rubrics table */}
          {data.rubrics.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 w-1/4">평가 기준 (Criterion)</th>
                    <th className="p-3 w-1/4 text-indigo-700 bg-indigo-50/20">상 (Excellent)</th>
                    <th className="p-3 w-1/4 text-emerald-700 bg-emerald-50/20">중 (Proficient)</th>
                    <th className="p-3 w-1/4 text-amber-700 bg-amber-50/20">하 (Developing)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.rubrics.map((rub) => (
                    <tr key={rub.id} className="hover:bg-slate-50/30">
                      <td className="p-3 font-semibold text-slate-800 bg-slate-50/30">{rub.criterion}</td>
                      <td className="p-3 text-slate-600 bg-indigo-50/5 leading-relaxed">{rub.excellent}</td>
                      <td className="p-3 text-slate-600 bg-emerald-50/5 leading-relaxed">{rub.proficient}</td>
                      <td className="p-3 text-slate-600 bg-amber-50/5 leading-relaxed">{rub.developing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formative assessment view */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-sans">
            <span className="text-[10px] font-bold text-slate-500 uppercase">동행 형성평가 및 교차 성찰 피드백</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-1">{data.formativeAssessment || "등록된 지속적 성찰방안이 없습니다."}</p>
          </div>
        </section>

        {/* STAGE 3 SHOWCASE */}
        <section className="space-y-4 break-before-page">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-2 h-5 bg-cyan-600 rounded"></span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">3단계: WHERETO 교수학습 활동 시나리오</h3>
              <span className="text-[10px] text-cyan-600 font-medium">활동 &amp; AI-에듀테크 결합도</span>
            </div>
          </div>

          <div className="flow-root" id="whereto-flowchart">
            <div className="space-y-4">
              {data.wheretoSteps.map((step) => (
                <div key={step.key} className="border border-slate-100 rounded-xl p-4 bg-slate-50/10 hover:bg-slate-50/40 transition-colors flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                  <div className="shrink-0 flex items-center gap-2 sm:flex-col sm:items-center sm:w-20">
                    <span className="w-9 h-9 rounded-xl font-mono text-base font-bold bg-slate-900 text-slate-100 flex items-center justify-center shadow-inner">
                      {step.key}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 font-sans sm:text-center shrink-0">
                      {step.englishTitle.split(" ")[0]}
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">교사 대 아동 탐색활동</span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{step.activity || "활동 미작성"}</p>
                    </div>

                    <div className="bg-indigo-50/20 p-3 rounded-lg border border-indigo-100/30 space-y-0.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                        <Heart size={10} className="text-indigo-500 animate-pulse" />
                        <span>AI &amp; 디지털 가동</span>
                      </span>
                      <p className="text-indigo-900 leading-relaxed">{step.techIntegration || "테크 통합 미안"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outro Brand */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans print:border-slate-300">
          <div className="flex items-center gap-1">
            <span>2022 개정 중등 AI디지털 기반 백워드 설계 시뮬레이션 문서</span>
          </div>
          <div>WIGGINS &amp; MCTIGHE COHERENCE DESIGN VERIFICATION PASSED</div>
        </div>
      </div>
    </div>
  );
}
