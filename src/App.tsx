import React, { useState } from "react";
import { BookOpen, Award, ListTodo, Sparkles, AlertCircle, RefreshCw, X, HelpCircle, GraduationCap } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Stage1Form from "./components/Stage1Form";
import Stage2Form from "./components/Stage2Form";
import Stage3Form from "./components/Stage3Form";
import FinalOutput from "./components/FinalOutput";
import { BackwardDesignState } from "./types";

const initialDesignState: BackwardDesignState = {
  subject: "정보",
  grade: "중학교 3학년",
  unitName: "인공지능 이미지 분류기 제작",
  achievementStandard: "[9정05-04] 실생활의 복잡한 문제를 인지하고 이를 해결하기 위해 머신러닝 기법 등 인공지능 모델을 설계하고 구현한다.",
  coreIdeas: "인공지능 모델은 실생활 데이터를 체계적으로 수집, 전처리하여 유의미한 예측 모델을 구축함으로써 사회 구성원의 다양한 난제를 능동적으로 해결한다.",
  essentialQuestions: "1. 인공지능 예측은 늘 공정할까? 데이터 편향성을 교정할 방안은 무엇인가?\n2. 인공지능을 실제 서비스화할 때 인터페이스는 사용자와 어떻게 소통해야 하는가?",
  keyKnowledge: "- 머신러닝 이미지 전처리 및 분류 원리\n- 인공지능 편향성과 윤리적 책임",
  keySkills: "- 수집한 지도 데이터의 전처리를 통한 최적화 튜닝\n- 웹 캠 및 센서와 실시간 인공지능 모델 결합 서비스 기획",
  assessmentTaskName: "우리 학교 맞춤형 스마트 재활용 에코 모니터 기획안",
  grasps: {
    goal: "교내에서 헛갈리는 재활용 플라스틱 재질을 자동 카메라 음성 멘트로 선별해 주는 인공지능 캠페인 기기 기안 작성 및 시제품 구동 모델 완성하기",
    role: "학교 기후동아리 소속 'AI 미래 환경 엔지니어'",
    audience: "교내 학우들 및 학교 자치 위원회",
    situation: "소각장 주변에 쓰레기가 어지럽히는 현상을 해결하기 위해 IT 에듀테크와 환경 공익성을 결합한 참신한 솔루션 홍보가 시급함",
    product: "이미지 검출 예측도가 명시된 AI 앱 시큐리티 프로토안 및 설명 영상",
    standards: "데이터 편향성 제거 정도, 실제 분류 구동 오류 피드백 시스템 구비 여부"
  },
  rubrics: [
    {
      id: "r-init-1",
      criterion: "데이터 튜닝 완성도",
      excellent: "균형 잡힌 데이터 50장 이상 수집하고 AI 비전 학습의 실패율을 분석해 수정 가공한 흔적이 뚜렷함.",
      proficient: "수집한 데이터가 분류 목적에 알맞고 최소 2종 이상의 쓰레기 이미지가 성공적으로 훈련됨.",
      developing: "데이터 수가 극도로 적고 중복 이미지만 존재해 성능 학습이 한계에 직착함."
    },
    {
      id: "r-init-2",
      criterion: "인터페이스 소통 지능",
      excellent: "사용자의 관점을 고려해 에듀테크로 피접근성이 높은 UI 레이아웃을 획기적으로 디자인함.",
      proficient: "일반 사용자가 앱의 구동 목적과 방안을 직관적으로 숙지할 수 있게 도식화함.",
      developing: "화면 전개가 산만하여 구동 과정이나 AI 처리 상태를 타인이 이해하기 어려움."
    }
  ],
  formativeAssessment: "티처블 머신 학습 링크를 모니터링하여 피어 피드백 진행, 패들랫에 문제 해결 시 발생한 오차 기록하고 공동 토의",
  wheretoSteps: [
    {
      key: "W",
      title: "방향 제시 및 목표 공유",
      englishTitle: "Where & What",
      description: "교과 학습이 어디로 향하며 무엇을 위해 수행하는지 알게 합니다.",
      activity: "수업 개요 안내를 통해 본 단원의 성취 합격 지점이 어디인지 노션 가이드라인 포스트로 공유",
      techIntegration: "크롬북 및 학습 대시보드 배부"
    },
    {
      key: "H",
      title: "흥미 유발 및 관심 유지",
      englishTitle: "Hook & Hold",
      description: "문제를 실생활 사태와 엮어 학습자의 주의를 강력하게 이끕니다.",
      activity: "학습 데이터를 편향되게 준 상황에서 인쇄물 오동작을 범하는 어설픈 감지 로봇 데모 시연 및 실패 퀴즈쇼",
      techIntegration: "실시간 투표 도구 및 AI 시뮬레이터 가동"
    },
    {
      key: "E",
      title: "체험 및 문제 탐색",
      englishTitle: "Equip, Experience, Explore",
      description: "필수 아이디어를 직접 지식화하고 디지털 기능 숙련 장치를 부여합니다.",
      activity: "모둠별로 실제 크롬북 카메라를 이용하여 폐기물 사태의 조광, 위치를 고정 촬영하며 가치 학습 실행",
      techIntegration: "AI 기학습 센서 웹캠 피딩 및 구글 드라이브 리셋 공유"
    },
    {
      key: "R",
      title: "재고 및 수정 보완",
      englishTitle: "Rethink, Reconsider, Revise",
      description: "수집 데이터 및 성능을 다시 돌아보며 스스로 개선하는 피드백 루프를 줍니다.",
      activity: "오류 예측 현상 원인을 발견하여 데이터를 조율하여 전개도를 수정하고, 피어 모듈 가이드 교차 논의",
      techIntegration: "캔바 화이트보드 멘토링 주석 게재"
    },
    {
      key: "E2",
      title: "자가 평가 기회 제공",
      englishTitle: "Evaluate",
      description: "학생 스스로 자신의 성장도와 수행 품질을 능동적으로 되짚어봅니다.",
      activity: "성취 루브릭과 자기 역량 평가표에 의거해 기획서의 지적 재산 보호 여부 및 기여도 자가 점수 배포",
      techIntegration: "구글 설문지 성찰 레터 가동"
    },
    {
      key: "T",
      title: "개별화 및 유연한 조절",
      englishTitle: "Tailored to student needs",
      description: "수준별 진척도의 차이에 적절한 비계 설정을 제공합니다.",
      activity: "고속 아동은 블록코딩과 AI API 추가 마스킹 도전을 주고, 저속 아동에겐 사전 세팅 정렬 이미지 폴더 스톡 전송",
      techIntegration: "학습 난이도 차등 링크 패키지 보급"
    },
    {
      key: "O",
      title: "유기적 조직화",
      englishTitle: "Organized for engagement",
      description: "몰입도와 성취도를 극대화할 수 있도록 교수 매락을 구조화합니다.",
      activity: "우리 학교의 쓰레기장 앞에 가상의 전시장(ZEP 메타버스 갤러리)을 연결해 학도 구성원 공모 시연회 개최",
      techIntegration: "ZEP 및 패들랫 연동 모색 교류 캠페인 진행"
    }
  ]
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [designData, setDesignData] = useState<BackwardDesignState>(initialDesignState);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>("info-ai");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const handleUpdateData = (fields: Partial<BackwardDesignState>) => {
    setDesignData((prev) => ({ ...prev, ...fields }));
  };

  const handleLoadTemplate = (template: BackwardDesignState & { id: string }) => {
    setDesignData(template);
    setActiveTemplateId(template.id);
    setStep(1); // Reset to first step for smooth editing experience
  };

  const handleReset = () => {
    setDesignData({
      ...initialDesignState,
      subject: "",
      grade: "",
      unitName: "",
      achievementStandard: "",
      coreIdeas: "",
      essentialQuestions: "",
      keyKnowledge: "",
      keySkills: "",
      assessmentTaskName: "",
      grasps: {
        goal: "",
        role: "",
        audience: "",
        situation: "",
        product: "",
        standards: ""
      },
      rubrics: [],
      formativeAssessment: "",
      wheretoSteps: initialDesignState.wheretoSteps.map(s => ({ ...s, activity: "", techIntegration: "" }))
    });
    setActiveTemplateId(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 h-16 shrink-0 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-100 animate-pulse">
            <GraduationCap size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
              <span>중등 AI·디지털 백워드 설계 시뮬레이터</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide mt-1 leading-none uppercase">
              2022 Revised Curriculum Secondary Backward Design Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTemplateId ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>템플릿 활성화됨</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span>직접 교수 설계 모드</span>
            </div>
          )}

          <button
            onClick={() => setShowHelpModal(true)}
            className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="교육 개념 알아보기"
            id="top-info-btn"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Sidebar Controls */}
        <Sidebar
          currentStep={step}
          setStep={setStep}
          onLoadTemplate={handleLoadTemplate}
          activeTemplateId={activeTemplateId}
          showHelpModal={() => setShowHelpModal(true)}
        />

        {/* Dynamic Canvas Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-0 print:overflow-visible print:p-0" id="main-content-flow">
          
          {/* Top visual tracker for standard desktop */}
          <div className="max-w-4xl mx-auto mb-6 hidden md:block print:hidden">
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              
              {[
                { s: 1, label: "1단계: 성취 목표", desc: "핵심개념 & 질문" },
                { s: 2, label: "2단계: 평가 계획", desc: "수행과제 & 루브릭" },
                { s: 3, label: "3단계: 수업 설계", desc: "WHERETO 통합" },
                { s: 4, label: "최종 설계 검인", desc: "심사서 출력" }
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => setStep(item.s)}
                  className="z-10 group flex flex-col items-center"
                  id={`top-tracker-node-${item.s}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                      step === item.s
                        ? "bg-slate-900 border-slate-900 text-white ring-2 ring-slate-100 scale-110"
                        : step > item.s
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-300 text-slate-400 group-hover:border-slate-400"
                    }`}
                  >
                    {item.s}
                  </div>
                  <span className={`text-[11px] font-bold mt-1 transition-colors ${step === item.s ? "text-slate-900" : "text-slate-500"}`}>
                    {item.label}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 hidden lg:block">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto print:max-w-none">
            {step === 1 && (
              <Stage1Form
                data={designData}
                updateData={handleUpdateData}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Stage2Form
                data={designData}
                updateData={handleUpdateData}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Stage3Form
                data={designData}
                updateData={handleUpdateData}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <FinalOutput
                data={designData}
                onReset={handleReset}
              />
            )}
          </div>
        </main>
      </div>

      {/* Concept Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 print:hidden animate-fade-in" id="help-modal">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600 animate-bounce" />
                <h3 className="text-base font-bold text-slate-900">
                  학습 설계: 백워드(Backward) 교육과정 설계란?
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                id="close-help-modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
              
              <section className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">🌟 핵심 철학 및 2022 개정 유용성</h4>
                <p>
                  기존의 교육과정이 &ldquo;단원에서 어떤 교과서 내용을 가르치고 문제를 풀릴까?&rdquo;를 먼저 고민했다면, <strong>백워드 설계(Backward Design)</strong>는 평가 방법을 교수학습 활동보다 먼저 계획하는 발상의 전환을 꾀합니다.
                </p>
                <p>
                  이는 2022 개정 교육과정의 목표인 <strong>&lsquo;깊이 있는 학습(Deep Learning)&rsquo;</strong>과 <strong>&lsquo;과정 중심 평가(Process-Oriented Assessment)&rsquo;</strong>를 교실 수업 단계에 가장 긴밀하게 고착시키는 주축 설계 모형입니다.
                </p>
              </section>

              <hr className="border-slate-100" />

              <section className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900">🧭 백워드 설계의 3단계 가이드</h4>
                
                <div className="space-y-3">
                  {/* Stage 1 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-indigo-700 block text-[10.5px]">1단계: 바람직한 결과 식별 (Desired Results)</span>
                    <p className="mt-1">
                      학습을 마친 후에 학생들에게 영원히 남는 지혜인 <strong>&lsquo;핵심 아이디어&rsquo;</strong>와 깊은 탐구를 유도하는 <strong>&lsquo;본질적 질문&rsquo;</strong>을 추출합니다. 교사는 교육청 성취기준을 근간으로 삼습니다.
                    </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-emerald-700 block text-[10.5px]">2단계: 평가 계획 수립 (Acceptable Evidence)</span>
                    <p className="mt-1">
                      학생들이 큰 개념을 정말로 체득했음을 입증할 <strong>진정한 평가(Authentic Task)</strong>를 수립합니다. 실생활 역할과 모험 제약을 결합한 <strong>GRASPS 모형</strong>과 명확한 다수준 분석 <strong>루브릭</strong>이 동반됩니다.
                    </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-cyan-700 block text-[10.5px]">3단계: 교수학습 활동 계획 (WHERETO)</span>
                    <p className="mt-1">
                      목표 달성을 효과적으로 돕고, 가치 수행에 도전하도록 전개될 모형 지침입니다:
                    </p>
                    <ul className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px] text-slate-600">
                      <li>• <strong>W</strong>here &amp; What (목표 확인)</li>
                      <li>• <strong>H</strong>ook &amp; Hold (흥미 유지)</li>
                      <li>• <strong>E</strong>xperience &amp; Explore (체험 활동)</li>
                      <li>• <strong>R</strong>ethink &amp; Revise (수정 보정)</li>
                      <li>• <strong>E</strong>valuate (자가 평가)</li>
                      <li>• <strong>T</strong>ailor (개별 조율)</li>
                      <li>• <strong>O</strong>rganize (유기적 구성)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              <section className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">💻 AI·디지털 에듀테크 유기적 접목</h4>
                <p>
                  본 시뮬레이터는 매 설계 단계마다 인공지능 추천 엔진을 도입하여, 각 단계에 어울리는 최적의 에듀테크(구글 드라이브, 캔바, 노션, 실시간 퀴즈풀이 툴 등)가 어떻게 단원 목표와 융합을 이루어 교육 효율을 올리는지 체험 제공합니다.
                </p>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end rounded-b-3xl">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors shadow"
                id="close-help-modal-footer"
              >
                이해 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
