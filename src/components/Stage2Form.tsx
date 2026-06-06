import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Award, Plus, Trash2, Info, CheckCircle } from "lucide-react";
import { BackwardDesignState, RubricCriteria } from "../types";

interface Stage2FormProps {
  data: BackwardDesignState;
  updateData: (fields: Partial<BackwardDesignState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Stage2Form({ data, updateData, onNext, onBack }: Stage2FormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const updateGrasps = (key: keyof typeof data.grasps, value: string) => {
    updateData({
      grasps: {
        ...data.grasps,
        [key]: value
      }
    });
  };

  const updateRubricRow = (index: number, field: keyof RubricCriteria, value: string) => {
    const updated = [...data.rubrics];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ rubrics: updated });
  };

  const addRubricRow = () => {
    const newRow: RubricCriteria = {
      id: "rubric-" + Date.now(),
      criterion: "새로운 평가 기준",
      excellent: "상 수준의 구체적 성취 기술",
      proficient: "중 수준의 기본 성취 기술",
      developing: "하 수준의 최소 보완 필요점"
    };
    updateData({ rubrics: [...data.rubrics, newRow] });
  };

  const removeRubricRow = (index: number) => {
    const updated = data.rubrics.filter((_, idx) => idx !== index);
    updateData({ rubrics: updated });
  };

  const handleAISuggest = async () => {
    if (!data.achievementStandard.trim()) {
      setErrorMsg("성취기준이 입력되어야 합니다. 1단계로 이동하여 대입하거나 입력해주세요.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/suggest-stage2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.subject,
          grade: data.grade,
          unitName: data.unitName,
          achievementStandard: data.achievementStandard,
          coreIdeas: data.coreIdeas,
          essentialQuestions: data.essentialQuestions
        }),
      });

      if (!response.ok) {
        throw new Error("서버 통계 반응이 불량합니다.");
      }
      const result = await response.json();

      updateData({
        assessmentTaskName: result.assessmentTaskName || "",
        grasps: result.grasps ? {
          goal: result.grasps.goal || "",
          role: result.grasps.role || "",
          audience: result.grasps.audience || "",
          situation: result.grasps.situation || "",
          product: result.grasps.product || "",
          standards: result.grasps.standards || ""
        } : data.grasps,
        rubrics: result.rubrics || data.rubrics,
        formativeAssessment: result.formativeAssessment || data.formativeAssessment
      });

      if (result.isMock) {
        setErrorMsg("참고: 현재 API 키 미등록 상태입니다. 시스템 가상 시뮬레이션 평가안 데이터를 대리 생성했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI 2단계 평가 추천 중 서버 오류가 발생했습니다. 직접 루브릭을 성안할 수 있습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="stage2-form">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl">
        <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
          <Award className="text-emerald-700 shrink-0" size={20} />
          <span>2단계: 피드백과 평가 계획 결정 (Acceptable Evidence)</span>
        </h2>
        <p className="text-xs text-emerald-800/80 mt-1.5 leading-relaxed">
          &ldquo;목표에 도달했음을 입증하는 참된 증거는 무엇인가?&rdquo; 백워드 설계에서는 가상의 지식 시험(선택형 지필)에 머물지 않고, 실제 사태 속 유의미성을 가진 <strong>GRASPS 기반 수행평가 과제</strong>와 공정한 성취준거를 담은 <strong>평가 루브릭</strong>을 먼저 수립합니다.
        </p>
      </div>

      {/* Main Task Title & AI Magic Button */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>핵심 실제적 수행 평가 과제 설정</span>
            </h3>
            <p className="text-xs text-slate-500">학생이 자신의 지식 가치를 발휘하는 실생활 형태의 미션 제목입니다.</p>
          </div>
          <button
            type="button"
            onClick={handleAISuggest}
            disabled={loading}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-md self-start sm:self-auto disabled:bg-emerald-400"
            id="ai-suggest-stage2"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>AI가 평가안 제작 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-yellow-300 animate-pulse" />
                <span>AI 평가과제 및 루브릭 제안받기</span>
              </>
            )}
          </button>
        </div>

        <input
          type="text"
          placeholder="예: 우리 학교 맞춤형 '환경 가이드 마스터' 인포그래픽 보급 미션"
          value={data.assessmentTaskName}
          onChange={(e) => updateData({ assessmentTaskName: e.target.value })}
          className="w-full text-sm bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 outline-none transition-all shadow-sm"
          id="input-task-name"
        />

        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 flex items-center gap-2">
            <Info size={14} className="shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* GRASPS Model */}
      <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            🎭 GRASPS 기반 맥락적 과제 디자이너
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">상황 맥락을 깊게 부여하여 학습자의 실제 연수감과 주도성을 자극합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goal (G) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              🎯 Goal (과제의 핵심 목적)
            </label>
            <textarea
              rows={2}
              placeholder="과제가 추구하는 진짜 목적과 결실입니다. (예: 교내 플라스틱 분리 오경보 오류 개선)"
              value={data.grasps.goal}
              onChange={(e) => updateGrasps("goal", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-goal"
            />
          </div>

          {/* Role (R) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              👤 Role (학생의 실제 상황 속 기여 직책)
            </label>
            <textarea
              rows={2}
              placeholder="학생들이 맡아 가치를 수행할 매체 직함입니다. (예: 1일 AI 캠페인 엔지니어)"
              value={data.grasps.role}
              onChange={(e) => updateGrasps("role", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-role"
            />
          </div>

          {/* Audience (A) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              📢 Audience (최종 제작물을 향유할 성찰 독자층)
            </label>
            <textarea
              rows={2}
              placeholder="과제 결과물을 실생활에서 읽고 반응해 주며 수용할 가상/실제 상대입니다. (예: 우리 학교 전교생과 교장선생님)"
              value={data.grasps.audience}
              onChange={(e) => updateGrasps("audience", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-audience"
            />
          </div>

          {/* Situation (S) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              🎬 Situation (미션 수상이 처해진 모험 제약과 배경)
            </label>
            <textarea
              rows={2}
              placeholder="학생들을 흥미롭게 몰입하도록 환경적 제약을 제시합니다. (예: 교내 폐기물 혼동 소각 비용 부담 가열)"
              value={data.grasps.situation}
              onChange={(e) => updateGrasps("situation", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-situation"
            />
          </div>

          {/* Product (P) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              📦 Product (학생들이 직접 가공할 산출물/수행)
            </label>
            <textarea
              rows={2}
              placeholder="학생들에 의해 직접 제출되거나 발표될 결과 규격입니다. (예: 디지털 캔바 보드 및 티처블 머신 구동 링크)"
              value={data.grasps.product}
              onChange={(e) => updateGrasps("product", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-product"
            />
          </div>

          {/* Standards (S) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              ⚖️ Standards (합격 혹은 도달 여부를 증명할 일차 항목 요약)
            </label>
            <textarea
              rows={2}
              placeholder="성공적인 실질 기준 규격을 한 줄로 정의합니다. (예: 데이터 편정 요소 없음, 타당한 동반 해결안 도출)"
              value={data.grasps.standards}
              onChange={(e) => updateGrasps("standards", e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3 outline-none transition-all"
              id="grasp-standards"
            />
          </div>
        </div>
      </div>

      {/* Rubrics Board */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm" id="rubric-builder">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-semibold text-slate-800">
          <h3>📊 과정 및 수행 평가 척도 (Rubric) 빌더</h3>
          <button
            type="button"
            onClick={addRubricRow}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border border-slate-200"
            id="btn-add-rubric"
          >
            <Plus size={14} />
            평가기준 추가
          </button>
        </div>

        <div className="space-y-4">
          {data.rubrics.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              등록된 루브릭 기준이 없습니다. 우측 상단 '평가기준 추가'를 눌러 항목을 추가해 보세요!
            </p>
          ) : (
            data.rubrics.map((rub, index) => (
              <div
                key={rub.id || index}
                className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-3 relative group"
                id={`rubric-row-${index}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={rub.criterion}
                      onChange={(e) => updateRubricRow(index, "criterion", e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-200 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 outline-none transition-all w-full max-w-xs"
                      placeholder="평가 기준 명칭"
                      id={`rubric-criterion-${index}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRubricRow(index)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors rounded-lg hover:bg-slate-100"
                    title="기준 삭제"
                    id={`btn-delete-rubric-${index}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Excellent */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      상 (Excellent)
                    </span>
                    <textarea
                      rows={2}
                      value={rub.excellent}
                      onChange={(e) => updateRubricRow(index, "excellent", e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500 leading-relaxed"
                      placeholder="우수 성취 수준 상세"
                      id={`rubric-excellent-${index}`}
                    />
                  </div>

                  {/* Proficient */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      중 (Proficient)
                    </span>
                    <textarea
                      rows={2}
                      value={rub.proficient}
                      onChange={(e) => updateRubricRow(index, "proficient", e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-500 leading-relaxed"
                      placeholder="기본 성취 수준 상세"
                      id={`rubric-proficient-${index}`}
                    />
                  </div>

                  {/* Developing */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      하 (Developing)
                    </span>
                    <textarea
                      rows={2}
                      value={rub.developing}
                      onChange={(e) => updateRubricRow(index, "developing", e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-amber-500 leading-relaxed"
                      placeholder="지원 필요 수준 상세"
                      id={`rubric-developing-${index}`}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Formative assessment & Daily reflections */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
        <label className="text-xs font-semibold text-slate-700 block">
          🔍 동행적 평가 성찰 (형성평가 및 자가성장 피드백 방안)
        </label>
        <p className="text-[11px] text-slate-500 mb-2">실시간 수업 중 학습자들이 자신의 결함을 보완하고 성장하도록 피드백해주는 교육 보조 장치입니다.</p>
        <textarea
          rows={3}
          placeholder="예: 각 모둠이 촬영한 모델 리소스를 정해진 마인드맵에 실시간 태깅하여, 상호 이미지 중복이나 과적합을 피하는 급간 상담을 수혈함."
          value={data.formativeAssessment}
          onChange={(e) => updateData({ formativeAssessment: e.target.value })}
          className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
          id="input-formative"
        />
      </div>

      {/* Direction Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-xl transition-all"
          id="btn-stage2-back"
        >
          <ArrowLeft size={13} />
          <span>이전 단계로</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-900 text-white text-xs font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-slate-200"
          id="btn-stage2-next"
        >
          <span>3단계: 교수학습 환경 설계하기</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
