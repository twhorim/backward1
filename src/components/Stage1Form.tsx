import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, BookOpen, Volume2, Info } from "lucide-react";
import { BackwardDesignState } from "../types";

interface Stage1FormProps {
  data: BackwardDesignState;
  updateData: (fields: Partial<BackwardDesignState>) => void;
  onNext: () => void;
}

export default function Stage1Form({ data, updateData, onNext }: Stage1FormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const SUBJECT_OPTIONS = [
    "정보",
    "국어",
    "수학",
    "사회",
    "과학",
    "영어",
    "기술·가정",
    "체육",
    "미술",
    "음악",
    "도덕"
  ];

  const GRADE_OPTIONS = [
    "중학교 1학년",
    "중학교 2학년",
    "중학교 3학년",
    "고등학교 1학년",
    "고등학교 2학년",
    "고등학교 3학년",
    "초등학교 5학년",
    "초등학교 6학년"
  ];

  const isCustomSubject = data.subject && !SUBJECT_OPTIONS.includes(data.subject);
  const selectSubjectValue = isCustomSubject ? "기타" : (data.subject || "");

  const isCustomGrade = data.grade && !GRADE_OPTIONS.includes(data.grade);
  const selectGradeValue = isCustomGrade ? "기타" : (data.grade || "");

  const handleAISuggest = async () => {
    if (!data.subject.trim() || !data.achievementStandard.trim()) {
      setErrorMsg("인공지능 추천을 받기 위해 교과명과 성취기준을 먼저 입력해 주세요.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/suggest-stage1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: data.subject,
          grade: data.grade,
          achievementStandard: data.achievementStandard
        }),
      });
      if (!response.ok) {
        throw new Error("서버와의 통신이 원활치 못했습니다.");
      }
      const result = await response.json();
      
      updateData({
        coreIdeas: result.coreIdeas || "",
        essentialQuestions: result.essentialQuestions || "",
        keyKnowledge: result.keyKnowledge || "",
        keySkills: result.keySkills || ""
      });

      if (result.isMock) {
        setErrorMsg("참고: 현재 API 키 미등록 상태입니다. 시스템 가상 시뮬레이션 데이터를 제공해드렸습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("AI 추천 생성 중 오류가 발생했습니다. 직접 설계를 이어 가실 수도 있습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="stage1-form">
      {/* Step Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 p-5 rounded-2xl">
        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <BookOpen className="text-indigo-600 shrink-0" size={20} />
          <span>1단계: 바람직한 결과 식별하기 (단원 목표 설정)</span>
        </h2>
        <p className="text-xs text-indigo-800/80 mt-1.5 leading-relaxed">
          &ldquo;학생들이 단원을 마치고 나면 어떤 큰 개념(Understandings)을 깊이 깨달아야 하는가? 어떤 본질적 질문(Essential Questions)에 대해 평생 사색해야 하는가?&rdquo;를 구체화하는 가장 중요한 단계입니다. 2022 개정 성취기준을 토대로 설계를 개시해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="basic-info-grid">
        {/* Subject */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <span>교과명</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectSubjectValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "기타") {
                  updateData({ subject: isCustomSubject ? data.subject : "" });
                } else {
                  updateData({ subject: val });
                }
              }}
              className="w-full text-sm bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 outline-none transition-all shadow-sm"
              id="select-subject"
            >
              <option value="">-- 교과 선택 --</option>
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
              <option value="기타">기타 (직접 입력)</option>
            </select>
          </div>
          {(selectSubjectValue === "기타" || isCustomSubject) && (
            <div className="animate-fade-in">
              <input
                type="text"
                placeholder="교과명을 직접 입력해 주세요"
                value={data.subject}
                onChange={(e) => updateData({ subject: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all shadow-inner"
                id="input-subject-custom"
                required
              />
            </div>
          )}
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <span>대상 학년</span>
            </label>
            <select
              value={selectGradeValue}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "기타") {
                  updateData({ grade: isCustomGrade ? data.grade : "" });
                } else {
                  updateData({ grade: val });
                }
              }}
              className="w-full text-sm bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 outline-none transition-all shadow-sm"
              id="select-grade"
            >
              <option value="">-- 학년 선택 --</option>
              {GRADE_OPTIONS.map((gr) => (
                <option key={gr} value={gr}>{gr}</option>
              ))}
              <option value="기타">기타 (직접 입력)</option>
            </select>
          </div>
          {(selectGradeValue === "기타" || isCustomGrade) && (
            <div className="animate-fade-in">
              <input
                type="text"
                placeholder="대상 학년을 직접 입력해 주세요"
                value={data.grade}
                onChange={(e) => updateData({ grade: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg px-3 py-2 outline-none transition-all shadow-inner"
                id="input-grade-custom"
              />
            </div>
          )}
        </div>

        {/* Unit Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <span>단원명</span>
          </label>
          <input
            type="text"
            placeholder="예: 인공지능과 실생활 문제 해결"
            value={data.unitName}
            onChange={(e) => updateData({ unitName: e.target.value })}
            className="w-full text-sm bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 outline-none transition-all shadow-sm"
            id="input-unit"
          />
        </div>
      </div>

      {/* Achievement Standards */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            교육과정 성취기준 (2022 개정 및 연계 기준) <span className="text-rose-500">*</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">코드 정보 포함 가능</span>
        </label>
        <textarea
          rows={3}
          placeholder="예: [9정05-04] 실생활의 복잡한 문제를 인지하고 이를 해결하기 위해 머신러닝 기법 등 인공지능 모델을 설계하고 구현한다."
          value={data.achievementStandard}
          onChange={(e) => updateData({ achievementStandard: e.target.value })}
          className="w-full text-xs font-sans bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
          id="input-achievement"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-400">
            💡 교과와 성취기준을 기반으로 인공지능 교수 설계 조언을 바로 가공할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={handleAISuggest}
            disabled={loading}
            className={`flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-indigo-100 disabled:bg-indigo-400`}
            id="ai-suggest-stage1"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>AI가 설계안 도출 중...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-yellow-300 animate-pulse" />
                <span>AI 단원설계(1단계) 추천 채우기</span>
              </>
            )}
          </button>
        </div>
        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 mt-2 flex items-center gap-2">
            <Info size={14} className="shrink-0 text-amber-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* Target elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Ideas */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">
              1
            </span>
            <label className="text-xs font-semibold text-slate-700">단원의 핵심 아이디어 (Big Idea / 가리키는 진리)</label>
          </div>
          <textarea
            rows={4}
            placeholder="성취기준의 핵심 개념과 그것이 보편적으로 시사하는 바를 한 문장으로 깊이 있게 표현해 보세요."
            value={data.coreIdeas}
            onChange={(e) => updateData({ coreIdeas: e.target.value })}
            className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
            id="input-core-ideas"
          />
        </div>

        {/* Essential Questions */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">
              2
            </span>
            <label className="text-xs font-semibold text-slate-700">학습 유도용 본질적 질문 (Essential Questions)</label>
            <span className="text-[10px] text-slate-400">(한 줄에 하나의 질문)</span>
          </div>
          <textarea
            rows={4}
            placeholder="1. 이 영역은 우리의 현실에 어떻게 숨쉬는가?&#10;2. 가공되지 않은 정제 데이터가 유발하는 문제점은 무엇이고 왜 극복해야 할까?"
            value={data.essentialQuestions}
            onChange={(e) => updateData({ essentialQuestions: e.target.value })}
            className="w-full text-xs font-mono bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
            id="input-essential-qs"
          />
        </div>

        {/* Key Knowledge */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">
              3
            </span>
            <label className="text-xs font-semibold text-slate-700">이해할 내용 & 필수 습득 지식 (Knowledge / 이해·인식)</label>
          </div>
          <textarea
            rows={4}
            placeholder="학생들이 성취기준에 도달하기 위해 기본적으로 알고 체득하게 될 세부 원리 및 지식 항목들입니다."
            value={data.keyKnowledge}
            onChange={(e) => updateData({ keyKnowledge: e.target.value })}
            className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
            id="input-knowledge"
          />
        </div>

        {/* Key Skills */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center">
              4
            </span>
            <label className="text-xs font-semibold text-slate-700">할 수 있어야 할 필수 기능 (Skills / 설계·수행)</label>
          </div>
          <textarea
            rows={4}
            placeholder="학생들이 도구를 사용하여 산출하고, 조율하고, 논평하며 실제 손과 발로 발휘할 수 있는 역량 기능입니다."
            value={data.keySkills}
            onChange={(e) => updateData({ keySkills: e.target.value })}
            className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 outline-none transition-all shadow-sm leading-relaxed"
            id="input-skills"
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-900 text-white text-xs font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-slate-200"
          id="btn-stage1-next"
        >
          <span>2단계: 평가 계획 수립하러 가기</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
