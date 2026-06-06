import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, ListTodo, Info, AlertCircle, Laptop } from "lucide-react";
import { BackwardDesignState, WheretoStep } from "../types";

interface Stage3FormProps {
  data: BackwardDesignState;
  updateData: (fields: Partial<BackwardDesignState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Stage3Form({ data, updateData, onNext, onBack }: Stage3FormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAISuggest = async () => {
    if (!data.achievementStandard.trim()) {
      setErrorMsg("성취기준이 부재합니다. 1단계와 2단계를 먼저 거치거나 입력해 주세요.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/suggest-stage3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.subject,
          grade: data.grade,
          achievementStandard: data.achievementStandard,
          assessmentTaskName: data.assessmentTaskName,
          grasps: data.grasps
        }),
      });

      if (!response.ok) {
        throw new Error("서버와의 시뮬레이션 연결 상태를 다듬어 주세요.");
      }
      const result = await response.json();

      if (result.wheretoSteps && result.wheretoSteps.length > 0) {
        // Overlay generated activities and technology integrations on existing steps
        const mergedSteps = data.wheretoSteps.map((step) => {
          const matchingResult = result.wheretoSteps.find((rStep: any) => rStep.key === step.key);
          if (matchingResult) {
            return {
              ...step,
              activity: matchingResult.activity || step.activity,
              techIntegration: matchingResult.techIntegration || step.techIntegration
            };
          }
          return step;
        });

        updateData({ wheretoSteps: mergedSteps });
      }

      if (result.isMock) {
        setErrorMsg("참고: 현재 API 키 미등록 상태입니다. 시스템 가상 시뮬레이션 3단계 WHERETO 수업 시나리오를 구성했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI 수업활동 로딩 중 에러가 발생했습니다. 직접 에듀테크 도구를 설계하고 기입하실 수 있습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (key: string, field: "activity" | "techIntegration", value: string) => {
    const updated = data.wheretoSteps.map((step) => {
      if (step.key === key) {
        return { ...step, [field]: value };
      }
      return step;
    });
    updateData({ wheretoSteps: updated });
  };

  return (
    <div className="space-y-6 animate-fade-in" id="stage3-form">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 p-5 rounded-2xl">
        <h2 className="text-lg font-bold text-cyan-900 flex items-center gap-2">
          <ListTodo className="text-cyan-700 shrink-0" size={20} />
          <span>3단계: 교수학습 활동 계획 수립 (Plan Learning Plan - WHERETO)</span>
        </h2>
        <p className="text-xs text-cyan-800/80 mt-1.5 leading-relaxed">
          &ldquo;어떤 수업 활동과 디지털 자원들이 목표 달성과 최고 수행을 이끌어 줄 수 있는가?&rdquo;를 구체화합니다. 2022 개정 세부 원리에 힘입어 학습자의 능률을 올리기 위해 <strong>WHERETO 설계 프레임워크</strong>와 <strong>AI/디지털 에듀테크의 시너지 매칭</strong>을 구상합니다.
        </p>
      </div>

      {/* AI Suggest Section */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Laptop size={16} className="text-cyan-600 animate-pulse" />
            <span>AI 디지털 기반 WHERETO 연계 엔진</span>
          </h3>
          <p className="text-xs text-slate-500">
            앞선 1단계 학업 수준과 2단계 GRASPS 기획안에 100% 매핑되는 스마트 수업 활동 세부 가이드를 가상 툴 배치와 함께 자동 완성해 줍니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAISuggest}
          disabled={loading}
          className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-750 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 disabled:bg-cyan-400"
          id="ai-suggest-stage3"
        >
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>AI가 메이킹 중...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-yellow-300 animate-pulse" />
              <span>WHERETO 전체 수업 시나리오 생성</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Elements Grid (W-H-E-R-E-T-O Tabs or Cards) */}
      <div className="space-y-6" id="whereto-cards">
        {data.wheretoSteps.map((step, index) => {
          // Color representations for letters
          const letterColors: Record<string, { bg: string, text: string, border: string }> = {
            W: { bg: "bg-blue-50 text-blue-700", text: "text-blue-900", border: "border-blue-100" },
            H: { bg: "bg-rose-50 text-rose-700", text: "text-rose-900", border: "border-rose-100" },
            E: { bg: "bg-green-50 text-green-700", text: "text-green-900", border: "border-green-100" },
            R: { bg: "bg-purple-50 text-purple-700", text: "text-purple-900", border: "border-purple-100" },
            E2: { bg: "bg-amber-50 text-amber-700", text: "text-amber-900", border: "border-amber-100" },
            T: { bg: "bg-teal-50 text-teal-700", text: "text-teal-900", border: "border-teal-100" },
            O: { bg: "bg-indigo-50 text-indigo-700", text: "text-indigo-900", border: "border-indigo-100" }
          };

          const color = letterColors[step.key] || letterColors.W;

          return (
            <div
              key={step.key}
              className={`bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow leading-relaxed shadow-sm`}
              id={`whereto-card-${step.key}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                <span className={`w-10 h-10 rounded-xl font-mono text-lg font-bold flex items-center justify-center shrink-0 ${color.bg} shadow-inner`}>
                  {step.key}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{step.title}</span>
                    <span className="text-xs font-mono font-medium text-slate-400">({step.englishTitle})</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-0.5">{step.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Activity Detail */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">
                    📝 구체적 수업 활동 (활동 설계)
                  </label>
                  <textarea
                    rows={4}
                    value={step.activity}
                    onChange={(e) => handleStepChange(step.key, "activity", e.target.value)}
                    className="w-full text-xs font-sans bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl p-3 outline-none transition-all leading-relaxed"
                    placeholder="수업 현장이나 온라인 과제로 진행할 정량적인 활동 세부를 설계해 보세요."
                    id={`whereto-activity-${step.key}`}
                  />
                </div>

                {/* Tech Integration */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block flex items-center gap-1">
                    <span>💻 인공지능 &amp; 에듀테크 통합 방안</span>
                  </label>
                  <textarea
                    rows={4}
                    value={step.techIntegration}
                    onChange={(e) => handleStepChange(step.key, "techIntegration", e.target.value)}
                    className="w-full text-xs font-sans bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl p-3 outline-none transition-all leading-relaxed"
                    placeholder="활동 과정에 접목하여 상호 피드백이나 분석, 맞춤 비계를 보조할 기술 도구를 적어 보세요. (예: 캔바, 구글 공유 스프레드시트, ChatGPT AI 보조)"
                    id={`whereto-tech-${step.key}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation and Flow buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-xl transition-all"
          id="btn-stage3-back"
        >
          <ArrowLeft size={13} />
          <span>이전 단계로</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-slate-900 hover:bg-cyan-900 text-white text-xs font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-slate-200"
          id="btn-stage3-next"
        >
          <span>통합 설계 분석서 발행하기</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
