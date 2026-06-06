import { BookOpen, HelpCircle, Layers, Award, ListTodo, Sparkles } from "lucide-react";
import { CURRICULUM_TEMPLATES } from "../data/templates";
import { CurriculumTemplate } from "../types";

interface SidebarProps {
  currentStep: number;
  setStep: (step: number) => void;
  onLoadTemplate: (template: CurriculumTemplate) => void;
  activeTemplateId: string | null;
  showHelpModal: () => void;
}

export default function Sidebar({
  currentStep,
  setStep,
  onLoadTemplate,
  activeTemplateId,
  showHelpModal,
}: SidebarProps) {
  const steps = [
    {
      index: 1,
      title: "기본 정보 & 1단계",
      subtitle: "단원 목표 및 성취기준",
      icon: BookOpen,
      desc: "지속적 과제에 도달하는 학업 성취 목표 탐정",
    },
    {
      index: 2,
      title: "2단계: 평가 계획",
      subtitle: "수행 평가 (GRASPS) & 루브릭",
      icon: Award,
      desc: "목표 도달의 타당한 증거 자료 확립",
    },
    {
      index: 3,
      title: "3단계: 교수학습 활동",
      subtitle: "WHERETO 에듀테크 시나리오",
      icon: ListTodo,
      desc: "효과적인 탐색 흐름 조직 및 개별화",
    },
    {
      index: 4,
      title: "설계서 출력 및 전송",
      subtitle: "최종 심사 대시보드",
      icon: Sparkles,
      desc: "완성된 백워드 설계서 인쇄 및 사후 검인",
    },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white border-r border-slate-200 lg:h-[calc(100vh-4rem)] p-5 flex flex-col justify-between shrink-0" id="sidebar-container">
      <div>
        {/* Help & Title */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <span className="text-xs font-mono font-medium tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
            WIGGINS & MCTIGHE
          </span>
          <button
            onClick={showHelpModal}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            id="help-btn"
          >
            <HelpCircle size={14} />
            설계 가이드
          </button>
        </div>

        {/* Steps navigation */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3 px-1">
            시뮬레이션 설계 단계
          </h3>
          <div className="space-y-1">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.index;
              const isCompleted = currentStep > step.index;

              return (
                <button
                  key={step.index}
                  onClick={() => setStep(step.index)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-4 ${
                    isActive
                      ? "bg-indigo-50 border-l-4 border-indigo-600 shadow-sm"
                      : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                  id={`step-link-${step.index}`}
                >
                  <div
                    className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold transition-colors duration-150 ${
                        isActive ? "text-indigo-900" : "text-slate-700"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-light mt-0.5 leading-tight">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pre-designed templates section */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              2022 개정 모범 템플릿
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
              추천
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3 px-1 leading-relaxed">
            중등 교과별 AI·디지털 가공 예시안을 불러와 단계를 체험해보세요.
          </p>

          <div className="space-y-2">
            {CURRICULUM_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  if (confirm("템플릿을 불러오면 편집 중이던 백워드 설계 정보가 초기화됩니다. 계속 진행하시겠습니까?")) {
                    onLoadTemplate(tmpl);
                  }
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all duration-150 border uppercase ${
                  activeTemplateId === tmpl.id
                    ? "bg-emerald-50/50 border-emerald-300 text-emerald-800 font-semibold"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
                id={`template-btn-${tmpl.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{tmpl.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal shrink-0">
                    {tmpl.grade.split(" ")[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini concept banner */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed self-end w-full">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
          <Layers size={14} className="text-indigo-500 animate-pulse" />
          <span>백워드(Backward) 핵심 철학</span>
        </div>
        &ldquo;평가 계획을 마지막이 아닌, 교수학습 활동 계획보다 <strong>앞서 결정</strong>하여 교육과정과 평가, 활동의 실질적 일치를 달성합니다.&rdquo;
      </div>
    </aside>
  );
}
