/**
 * Types and interfaces for the Backward Design Simulator
 */

export interface RubricCriteria {
  id: string;
  criterion: string;
  excellent: string;
  proficient: string;
  developing: string;
}

export interface GraspsData {
  goal: string;       // Goal (목적)
  role: string;       // Role (역할)
  audience: string;   // Audience (대상)
  situation: string;  // Situation (상황)
  product: string;    // Product (산출물)
  standards: string;  // Standards (평가 기준 요약)
}

export interface WheretoStep {
  key: "W" | "H" | "E" | "R" | "E2" | "T" | "O";
  title: string;
  englishTitle: string;
  description: string;
  activity: string;
  techIntegration: string; // 에듀테크/AI 통합 방안
}

export interface BackwardDesignState {
  subject: string;            // 교과
  grade: string;              // 학년/대상
  unitName: string;           // 단원명
  achievementStandard: string; // 성취기준 (2022 개정 교육과정)
  
  // 1단계: Desired Results (목표 설정)
  coreIdeas: string;          // 핵심 아이디어
  essentialQuestions: string; // 본질적 질문들 (줄바꿈 구분)
  keyKnowledge: string;       // 이해 및 학생이 알아야 할 지식
  keySkills: string;          // 학생이 할 수 있어야 할 기능
  
  // 2단계: Acceptable Evidence (평가 계획)
  assessmentTaskName: string; // 평가 과제명
  grasps: GraspsData;
  rubrics: RubricCriteria[];
  formativeAssessment: string; // 형성평가 및 성찰 방법
  
  // 3단계: Plan Learning Experiences (교수학습 활동 계획)
  wheretoSteps: WheretoStep[];
}

export interface CurriculumTemplate {
  id: string;
  title: string;
  subject: string;
  grade: string;
  unitName: string;
  achievementStandard: string;
  coreIdeas: string;
  essentialQuestions: string;
  keyKnowledge: string;
  keySkills: string;
  assessmentTaskName: string;
  grasps: GraspsData;
  rubrics: RubricCriteria[];
  formativeAssessment: string;
  wheretoSteps: WheretoStep[];
}
