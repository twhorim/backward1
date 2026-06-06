import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Helper function to get Gemini client with safe API key checking
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("API_KEY")) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST Interface endpoints
// 1단계 목표 추천 API
app.post("/api/gemini/suggest-stage1", async (req, res) => {
  try {
    const { subject, grade, achievementStandard } = req.body;
    if (!subject || !achievementStandard) {
      return res.status(400).json({ error: "교과명과 성취기준은 필수 입력 사항입니다." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        return res.status(200).json({
          isMock: true,
          coreIdeas: `[API 키 미등록 안내: 시뮬레이션용 가상 데이터 생성] ${subject} 과목의 핵심 아이디어: 학문적 본질 규명 및 탐구를 중시하며 디지털 에반젤리스트로서 지식을 실생활에 유기적으로 가공할 수 있는 핵심 맥락입니다.`,
          essentialQuestions: "1. 이 성취기준이 우리 삶에서 중요한 이유는 무엇인가?\n2. 우리가 학습한 지식을 실제 문제에 어떻게 전이할 수 있을까?\n3. 디지털 세상에서 우리는 어떤 주체적인 판단을 해야 하는가?",
          keyKnowledge: "1. 해당 과목의 기본 가치관과 구성 단원 원리\n2. 2022 개정 과정에서 요구하는 주요 핵심 역량 지표",
          keySkills: "1. 자료수집 및 데이터 통합 시각화 구현 능력\n2. 문제를 스스로 발견하여 디지털 수치로 시연하는 탐구 역량"
        });
      }
      throw err;
    }

    const prompt = `2022 개정 교육과정 및 중등학교 교수학습 맥락에서 '백워드 디자인(Backward Design) 1단계(바람직한 결과 식별)' 설계를 수행하려고 합니다.
입력 데이터:
- 교과: ${subject}
- 대상 학년: ${grade || "중학교 공통"}
- 성취기준: ${achievementStandard}

위 정보를 참고하여 교사가 단원 목표를 입체적으로 세울 수 있도록 아래 항목을 친근한 한국어로 생성해 주세요.
1. 핵심 아이디어 (Core Idea): 성취기준을 관통하는 지속성 있는 큰 개념(Big Idea)의 한 문장 요약
2. 본질적 질문 (Essential Questions): 학생들의 깊은 탐구와 성차을 유도할 수 있는 본질적 질문 3가지 (줄바꿈 문자로 구분)
3. 학생이 알아야 할 지식 (Key Knowledge): 성취기준 도달을 위해 필수적인 인지적 지식 내용들
4. 학생이 할 수 있어야 할 기능 (Key Skills): 학생들이 직접 조작하거나 수행할 수 있어야 하는 핵심 실행력/도구 능력들`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["coreIdeas", "essentialQuestions", "keyKnowledge", "keySkills"],
          properties: {
            coreIdeas: {
              type: Type.STRING,
              description: "성취기준을 한 문장으로 깊이 있게 관통하는 핵심 아이디어"
            },
            essentialQuestions: {
              type: Type.STRING,
              description: "본질적 질문 3가지 (각각 줄바꿈으로 구분해 작성)"
            },
            keyKnowledge: {
              type: Type.STRING,
              description: "핵심 지식 리스트"
            },
            keySkills: {
              type: Type.STRING,
              description: "실제 수행할 기능 목록"
            }
          }
        },
        systemInstruction: "당신은 한국의 2022 개정 교육과정과 위긴스&맥타이의 백워드 설계(Wiggins & McTighe's Backward Design)에 정통한 교육전문가이자 수석 장학사입니다. 중등 교사들이 AI와 디지털 에듀테크 도구를 유기적으로 통합하도록 친절하고 실질적인 교육 목표를 제언해야 합니다."
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Stage 1 suggest error:", error);
    res.status(500).json({ error: error.message || "서버 오류가 발생했습니다." });
  }
});

// 2단계 평가 추천 API (GRASPS + 루브릭)
app.post("/api/gemini/suggest-stage2", async (req, res) => {
  try {
    const { subject, grade, unitName, achievementStandard, coreIdeas, essentialQuestions } = req.body;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        return res.status(200).json({
          isMock: true,
          assessmentTaskName: `스마트 에듀테크를 활용한 ${unitName || "주제"} 진로 보고서 및 가상 체험 투어 배포`,
          grasps: {
            goal: "크롬북이나 스마트 디바이스를 이용해 실생활 데이터를 수합하고, 탐구 결과의 효과를 전교생이나 인근 시민들에게 제안하는 디지털 패널 작성.",
            role: "주제 연계 지식 공공 크리에이터 및 학생 연구원",
            audience: "환경 혹은 교육에 동참할 교내 학우들과 심사 교사단",
            situation: "수업 중 배운 핵심 원리가 사물 속에서만 사장되지 않도록 이를 매체화하여 일상의 자가 변화를 유치해야 함.",
            product: "반응형 디지털 다큐멘트 및 상호 피드백 온라인 대시보드",
            standards: "논리 전개가 일관되며 사실에 기반하고 있는가, 에듀테크를 활용해 상호 소통을 촉진하였는가"
          },
          rubrics: [
            {
              id: "suggest-r1",
              criterion: "교과 지식의 실제적 전이",
              excellent: "배운 핵심 개념을 실제 생활 사태에 완벽히 전이하여 논리 정연하고 심도 있게 증명함.",
              proficient: "배운 지식을 오류 없이 바르게 적용하였으며 상황 분석에 부족함이 없음.",
              developing: "지식의 단순 나열이며 실생활 사태에 반영된 해석을 찾기 어려움."
            },
            {
              id: "suggest-r2",
              criterion: "AI 및 디지털 도구 활용",
              excellent: "학습/소통을 위해 최적의 디지털 도구를 유기적으로 선택하였고, 피어 피드백 수렴 장치가 매우 탁월함.",
              proficient: "디지털 기기를 성실하게 다루었으며 산출물을 타인과 공유하여 소통하려는 목적에 충실함.",
              developing: "도구 조작 미숙으로 수행 과정에 장애가 있거나, 단순 텍스트 입력 수준에 그침."
            }
          ],
          formativeAssessment: "활동 매 단계마다 크롬북 협업 보드(패들렛)에 본질적 질문에 대한 각자의 생각을 배움 노트로 올리고 교사 및 동료 피드백을 실시간 확인하여 수시로 수정 보완함."
        });
      }
      throw err;
    }

    const prompt = `백워드 설계 2단계(평가 계획 수립)를 진행합니다. 성취기준과 교과 특성을 고려하여, 학생들이 실제 능력을 발휘해야 하는 '수행 평가 과제(Performance Task)'를 설계해 주세요.
평가 과제 설계에는 반드시 위긴스의 GRASPS 모형을 사용하고, 평가 척도(루브릭)를 2가지 생성하고, 학생들이 학습 도중 스스로를 수정 보완해가는 '동행적 형성평가 및 성찰 방안'까지 함께 상세하게 작성해 주세요.

[컨텍스트 정보]
- 교과: ${subject}
- 대상: ${grade}
- 단원명: ${unitName}
- 성취기준: ${achievementStandard}
- 핵심 아이디어: ${coreIdeas}
- 본질적 질문: ${essentialQuestions}

아래 형태의 JSON 포맷으로 생성해 주세요:
1. assessmentTaskName: 평가 과제명
2. grasps: { goal(목적), role(역할), audience(대상), situation(상황), product(산출물), standards(평가기준요약) }
3. rubrics: 기준별 루브릭 세트 2가지 [{ id, criterion(평가기준명), excellent(상), proficient(중), developing(하) }]
4. formativeAssessment: 동행적 형성평가 및 성찰 방안 상세 기술 (단어 나열이 아닌 문장 형식의 실질적 수업 설계 제안)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["assessmentTaskName", "grasps", "rubrics", "formativeAssessment"],
          properties: {
            assessmentTaskName: { type: Type.STRING, description: "실제적이며 매력적인 수행평가 과제 제목" },
            grasps: {
              type: Type.OBJECT,
              required: ["goal", "role", "audience", "situation", "product", "standards"],
              properties: {
                goal: { type: Type.STRING, description: "과제의 목표 및 목적" },
                role: { type: Type.STRING, description: "학생들이 맡게 되는 실생활 역할" },
                audience: { type: Type.STRING, description: "산출물의 실제 예상 관객/청중" },
                situation: { type: Type.STRING, description: "수행이 펼쳐지는 가상적 혹은 실제적 상황 맥락" },
                product: { type: Type.STRING, description: "학생이 제작 또는 시연할 최종 결과물 형태" },
                standards: { type: Type.STRING, description: "해당 산출물을 판단할 주요 고차 평가 잣대들" }
              }
            },
            rubrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "criterion", "excellent", "proficient", "developing"],
                properties: {
                  id: { type: Type.STRING },
                  criterion: { type: Type.STRING, description: "평가 기준 (예: '디지털 도구 탐색', '과학적 해결방안 도출' 등)" },
                  excellent: { type: Type.STRING, description: "수준별 묘사: 상 (매우 우수)" },
                  proficient: { type: Type.STRING, description: "수준별 묘사: 중 (보통)" },
                  developing: { type: Type.STRING, description: "수준별 묘사: 하 (부족/피어 비계 필요)" }
                }
              }
            },
            formativeAssessment: { type: Type.STRING, description: "학생들의 적극적인 배움 수정과 스스로의 성장을 돕는 다각적인 형성평가 방법 및 성찰 방안 제안" }
          }
        },
        systemInstruction: "당신은 백워드 설계의 GRASPS 평가 설계를 완벽히 적용하며, 에듀테크 및 AI를 결합한 과정중심 평가 루브릭 및 동행적 형성평가 성찰안을 명확하고 구체적인 교사 중심 관찰 언어로 제안하는 장학전문가입니다."
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Stage 2 suggest error:", error);
    res.status(500).json({ error: error.message || "서버 오류가 발생했습니다." });
  }
});

// 3단계 교수학습 활동 추천 API (WHERETO)
app.post("/api/gemini/suggest-stage3", async (req, res) => {
  try {
    const { subject, grade, achievementStandard, assessmentTaskName, grasps } = req.body;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      if (err.message === "GEMINI_API_KEY_MISSING") {
        return res.status(200).json({
          isMock: true,
          wheretoSteps: [
            {
              key: "W",
              title: "방향 제시 및 목표 공유",
              englishTitle: "Where & What",
              description: "교과 학습이 어디로 향하며 무엇을 위해 수행하는지 알게 합니다.",
              activity: `학생들에게 본 단원의 목표와 평가 과제인 "${assessmentTaskName || "디지털 프로토타입"}"의 성격, 일정, 루브릭을 성찰 패드에 업로드하여 주도성을 심어줍니다.`,
              techIntegration: "사전에 구성된 온라인 협업 드라이브 제공"
            },
            {
              key: "H",
              title: "흥미 유발 및 관심 유지",
              englishTitle: "Hook & Hold",
              description: "문제를 실생활 사태와 엮어 학습자의 주의를 강력하게 이끕니다.",
              activity: "실제 실패 사례나 충격적인 뉴스 동향, 또는 인터랙티브 시뮬레이터를 사용해 기습 질문을 던지고 호기심을 유도합니다.",
              techIntegration: "온라인 투표 보드(멘티미터), 반응형 맵 가동 "
            },
            {
              key: "E",
              title: "체험 및 문제 탐색",
              englishTitle: "Equip, Experience, Explore",
              description: "필수 아이디어를 직접 지식화하고 디지털 기능 숙련 장치를 부여합니다.",
              activity: "학생들이 핵심 내용(지식과 기능)을 습득하고 모둠 활동을 통하여 직접 가공해볼 수 있는 안전한 실질 과제를 연습합니다.",
              techIntegration: "스마트 기기를 통한 공공 데이터 스크랩 및 협업 필기 도구"
            },
            {
              key: "R",
              title: "재고 및 수정 보완",
              englishTitle: "Rethink, Reconsider, Revise",
              description: "수집 데이터 및 성능을 다시 돌아보며 스스로 개선하는 피드백 루프를 줍니다.",
              activity: "산출물의 미진한 구조를 교사 검토 피드백 혹은 또래 피드백 교류를 통해 스스로 재설작성하는 워크숍을 제공합니다.",
              techIntegration: "협업 화이트보드 캔바 릴레이 스티커 부착 메커니즘"
            },
            {
              key: "E2",
              title: "자가 평가 기회 제공",
              englishTitle: "Evaluate",
              description: "학생 스스로 자신의 성장도와 수행 품질을 능동적으로 되짚어봅니다.",
              activity: "스스로 루브릭에 조준하여 보정 노트를 쓰고 배움 일기를 완성하여 출판 공간에 등재하는 단계입니다.",
              techIntegration: "구글 설문지 3문항 숏폼 자가 성찰 피드백"
            },
            {
              key: "T",
              title: "개별화 및 유연한 조절",
              englishTitle: "Tailored to student needs",
              description: "수준별 진척도의 차이에 적절한 비계 설정을 제공합니다.",
              activity: "학생 각자의 장점(디자인, 시나리오, 데이터 전처리, 발표)에 맞춰 역할을 선택하도록 돕고 보충/심화 학습용 링크 꾸러미를 보장합니다.",
              techIntegration: "난이도별 AI 보조 챗봇 및 선택형 서브 태스크 매칭"
            },
            {
              key: "O",
              title: "유기적 조직화",
              englishTitle: "Organized for engagement",
              description: "몰입도와 성취도를 극대화할 수 있도록 교수 매락을 구조화합니다.",
              activity: "모두의 완성작을 전람회나 발표회, 교육 기고문 투고 형태로 마무리하여 실제 세상의 효용감과 직접 연결합니다.",
              techIntegration: "디지털 메타버스 갤러리 또는 웹사이트 연동 제작본 송출 정착"
            }
          ]
        });
      }
      throw err;
    }

    const prompt = `백워드 설계의 3단계 '교수학습 활동 계획'을 수립합니다.
교수학습 원리인 WHERETO 각 요소별로 해당 단원 내에서 구체적으로 실행할 '활동 시나리오'와 'AI 및 에듀테크 통합 방안'을 설계해 주세요.

[단원 배경 정보]
- 교과명: ${subject}
- 대상: ${grade}
- 성취기준: ${achievementStandard}
- 수행 평가 과제명: ${assessmentTaskName}
- GRASPS 목적: ${grasps?.goal || ""}
- GRASPS 산출물: ${grasps?.product || ""}

아래 JSON 형태로 총 7개 단계(W, H, E, R, E2, T, O)의 리스트를 제안해주세요:
{
  wheretoSteps: [
    {
      key: "W" | "H" | "E" | "R" | "E2" | "T" | "O",
      activity: "수업 시간에 전계할 교사 대 학생의 상호작용 지성 활동 상세",
      techIntegration: "구체적으로 도입할 AI 챗봇 혹은 에듀테크 툴(예: 노션, 캔바, 클래스팅 등)의 활용 공정"
    },
    ... (나머지 단계도 동일하게 구성)
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["wheretoSteps"],
          properties: {
            wheretoSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["key", "activity", "techIntegration"],
                properties: {
                  key: { type: Type.STRING, enum: ["W", "H", "E", "R", "E2", "T", "O"] },
                  activity: { type: Type.STRING, description: "구체적 수업 중 활동 지침" },
                  techIntegration: { type: Type.STRING, description: "접목할 인공지능/에듀테크 도구 일체" }
                }
              }
            }
          }
        },
        systemInstruction: "당신은 위긴스의 3단계 설계 중 WHERETO 모형을 현대적인 디지털 클래스룸과 AI 맞춤형 교육 환경에 맞게 창안하는 미래교육 지침가입니다."
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // UI displays 7 static WHERETO definitions. We will combine incoming AI outputs back into standard titles.
    const stepsMeta = {
      W: { title: "방향 제시 및 목표 공유", englishTitle: "Where & What", description: "교과 학습이 어디로 향하며 무엇을 위해 수행하는지 알게 합니다." },
      H: { title: "흥미 유발 및 관심 유지", englishTitle: "Hook & Hold", description: "문제를 실생활 사태와 엮어 학습자의 주의를 강력하게 이끕니다." },
      E: { title: "체험 및 문제 탐색", englishTitle: "Equip, Experience, Explore", description: "필수 아이디어를 직접 지식화하고 디지털 기능 숙련 장치를 부여합니다." },
      R: { title: "재고 및 수정 보완", englishTitle: "Rethink, Reconsider, Revise", description: "수집 데이터 및 성능을 다시 돌아보며 스스로 개선하는 피드백 루프를 줍니다." },
      E2: { title: "자가 평가 기회 제공", englishTitle: "Evaluate", description: "학생 스스로 자신의 성장도와 수행 품질을 능동적으로 되짚어봅니다." },
      T: { title: "개별화 및 유연한 조절", englishTitle: "Tailored to student needs", description: "수준별 진척도의 차이에 적절한 비계 설정을 제공합니다." },
      O: { title: "유기적 조직화", englishTitle: "Organized for engagement", description: "몰입도와 성취도를 극대화할 수 있도록 교수 매락을 구조화합니다." }
    };

    const formattedSteps = (data.wheretoSteps || []).map((step: any) => {
      const meta = stepsMeta[step.key as keyof typeof stepsMeta] || stepsMeta.W;
      return {
        key: step.key,
        title: meta.title,
        englishTitle: meta.englishTitle,
        description: meta.description,
        activity: step.activity,
        techIntegration: step.techIntegration
      };
    });

    res.json({ wheretoSteps: formattedSteps });
  } catch (error: any) {
    console.error("Stage 3 suggest error:", error);
    res.status(500).json({ error: error.message || "서버 오류가 발생했습니다." });
  }
});

export default app;
