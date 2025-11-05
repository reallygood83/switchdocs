import { OrganizationMode, OrganizationOptions } from '../types/organization';
import { detectLanguage } from './language-detector';
import { createAIClient } from './ai-client';
import { AIProvider } from '../types/ai';

export function generateOrganizationPrompt(
  markdown: string,
  options: OrganizationOptions
): { system: string; user: string } {
  const language = detectLanguage(markdown);
  const isKorean = language === 'ko' || language === 'mixed';

  const systemPrompts: Record<OrganizationMode, string> = {
    'restructure': isKorean
      ? '당신은 한국어 콘텐츠 구조화 전문가입니다. 텍스트의 논리적 흐름을 개선하고 단락을 재구성하여 읽기 쉽고 이해하기 쉬운 형식으로 만듭니다.'
      : 'You are a content restructuring expert. Improve logical flow and reorganize paragraphs to make the content more readable and understandable.',
    
    'summarize': isKorean
      ? '당신은 한국어 요약 전문가입니다. 핵심 내용을 간결하면서도 포괄적으로 요약하여 제공합니다.'
      : 'You are a summarization expert. Provide concise yet comprehensive summaries of the core content.',
    
    'extract-key-points': isKorean
      ? '당신은 한국어 핵심 포인트 추출 전문가입니다. 가장 중요한 정보를 불릿 포인트 형식으로 명확하게 추출합니다.'
      : 'You are a key point extraction expert. Extract the most important information in clear bullet point format.',
    
    'translate-organize': options.targetLanguage === 'en'
      ? '당신은 한영 번역 및 구조화 전문가입니다. 한국어를 자연스러운 영어로 번역하면서 내용을 논리적으로 구조화합니다.'
      : 'You are an English-Korean translation and organization expert. Translate English to natural Korean while logically structuring the content.',
    
    'clean-format': isKorean
      ? '당신은 한국어 텍스트 정리 전문가입니다. 중복 제거, 오타 수정, 형식 개선을 통해 깔끔한 마크다운 문서를 만듭니다.'
      : 'You are a text cleaning expert. Remove redundancies, fix typos, and improve formatting to create clean markdown documents.',

    // Teacher-specific modes
    'lesson-plan': '당신은 초등학교 교육 전문가입니다. 주어진 내용을 체계적인 수업 계획안으로 변환합니다. 학습 목표, 수업 단계, 활동 내용, 평가 방법을 명확히 구조화합니다.',

    'observation-record': '당신은 수업 관찰 및 기록 전문가입니다. 수업 관찰 내용을 체계적으로 정리하여 교수학습 개선에 활용할 수 있는 형식으로 만듭니다.',

    'meeting-minutes': '당신은 회의록 작성 전문가입니다. 회의 내용을 구조화하여 안건, 논의사항, 결정사항, 향후 계획을 명확히 정리합니다.',

    'official-document': '당신은 공문서 작성 전문가입니다. 주어진 내용을 공식적인 공문서 형식으로 변환하며, 발신/수신, 제목, 내용, 첨부 등 표준 공문서 구조를 따릅니다.',
  };

  const userPrompts: Record<OrganizationMode, string> = {
    'restructure': isKorean
      ? `다음 마크다운 문서를 논리적으로 재구성해주세요. 단락을 재배치하고, 관련 내용을 그룹화하며, 명확한 제목 계층 구조를 만들어주세요:\n\n${markdown}`
      : `Restructure the following markdown document logically. Reorganize paragraphs, group related content, and create a clear heading hierarchy:\n\n${markdown}`,
    
    'summarize': isKorean
      ? `다음 마크다운 문서를 간결하게 요약해주세요. 핵심 메시지와 중요한 세부사항을 포함하되, 원문의 20-30% 길이로 줄여주세요:\n\n${markdown}`
      : `Summarize the following markdown document concisely. Include core messages and important details, reducing to 20-30% of original length:\n\n${markdown}`,
    
    'extract-key-points': isKorean
      ? `다음 마크다운 문서에서 핵심 포인트를 추출해주세요. 각 포인트는 불릿 포인트로 표현하고, 중요도 순으로 정렬해주세요:\n\n${markdown}`
      : `Extract key points from the following markdown document. Present each point as a bullet and sort by importance:\n\n${markdown}`,
    
    'translate-organize': options.targetLanguage === 'en'
      ? `다음 한국어 마크다운 문서를 영어로 번역하고 구조화해주세요. 자연스러운 영어 표현을 사용하며, 명확한 구조로 재구성해주세요:\n\n${markdown}`
      : `Translate and organize the following markdown document to Korean. Use natural Korean expressions and restructure with clear organization:\n\n${markdown}`,
    
    'clean-format': isKorean
      ? `다음 마크다운 문서를 정리해주세요. 중복된 내용 제거, 오타 수정, 일관된 형식 적용, 불필요한 공백 제거를 수행해주세요:\n\n${markdown}`
      : `Clean up the following markdown document. Remove duplicates, fix typos, apply consistent formatting, and remove unnecessary whitespace:\n\n${markdown}`,

    // Teacher-specific user prompts
    'lesson-plan': `다음 내용을 바탕으로 체계적인 수업 계획안을 작성해주세요. 다음 항목을 포함해주세요:
- 수업 주제 및 학습 목표
- 대상 학년 및 시수
- 수업 단계별 활동 (도입-전개-정리)
- 교수학습 자료 및 준비물
- 평가 계획 및 방법

내용:\n\n${markdown}`,

    'observation-record': `다음 수업 관찰 내용을 체계적으로 정리해주세요. 다음 항목을 포함해주세요:
- 수업 기본 정보 (일시, 학년, 과목, 단원)
- 수업 목표 및 주요 내용
- 교수학습 방법 및 전략
- 학생 참여도 및 반응
- 개선점 및 제언

관찰 내용:\n\n${markdown}`,

    'meeting-minutes': `다음 회의 내용을 체계적인 회의록으로 정리해주세요. 다음 항목을 포함해주세요:
- 회의 기본 정보 (일시, 장소, 참석자)
- 회의 안건 및 목적
- 주요 논의사항
- 결정사항 및 실행 계획
- 차기 일정

회의 내용:\n\n${markdown}`,

    'official-document': `다음 내용을 공식 공문서 형식으로 작성해주세요. 다음 항목을 포함해주세요:
- 수신: [수신처]
- 발신: [발신처]
- 제목: [문서 제목]
- 시행일자: [날짜]
- 문서내용: [본문 - 안건, 내용, 요청사항]
- 첨부: [첨부 문서 목록]

내용:\n\n${markdown}`,
  };

  return {
    system: systemPrompts[options.mode],
    user: userPrompts[options.mode],
  };
}

export async function organizeContent(
  markdown: string,
  options: OrganizationOptions,
  config: { provider: AIProvider; apiKey: string; model: string },
  onProgress?: (chunk: string) => void
): Promise<string> {
  const client = createAIClient({
    provider: config.provider,
    apiKey: config.apiKey,
    model: config.model,
  });
  
  const { system, user } = generateOrganizationPrompt(markdown, options);
  
  if (onProgress && client.supportsStreaming) {
    let result = '';
    
    await client.streamText(
      user,
      system,
      (chunk) => {
        result += chunk;
        onProgress(result);
      },
      options.temperature || 0.3
    );
    
    return result;
  } else {
    const text = await client.generateText(user, system, options.temperature || 0.3);
    if (onProgress) {
      onProgress(text);
    }
    return text;
  }
}

export function getModeName(mode: OrganizationMode, language: 'ko' | 'en' = 'en'): string {
  const names = {
    ko: {
      'restructure': '재구성',
      'summarize': '요약',
      'extract-key-points': '핵심 포인트 추출',
      'translate-organize': '번역 및 구조화',
      'clean-format': '정리 및 형식화',
      // Teacher-specific mode names
      'lesson-plan': '수업 계획안',
      'observation-record': '수업 관찰 기록',
      'meeting-minutes': '회의록',
      'official-document': '공문서',
    },
    en: {
      'restructure': 'Restructure',
      'summarize': 'Summarize',
      'extract-key-points': 'Extract Key Points',
      'translate-organize': 'Translate & Organize',
      'clean-format': 'Clean & Format',
      // Teacher-specific mode names
      'lesson-plan': 'Lesson Plan',
      'observation-record': 'Observation Record',
      'meeting-minutes': 'Meeting Minutes',
      'official-document': 'Official Document',
    },
  };

  return names[language][mode];
}

export function getModeDescription(mode: OrganizationMode, language: 'ko' | 'en' = 'en'): string {
  const descriptions = {
    ko: {
      'restructure': '논리적 흐름을 개선하고 단락을 재구성합니다',
      'summarize': '핵심 내용을 간결하게 요약합니다',
      'extract-key-points': '중요한 정보를 불릿 포인트로 추출합니다',
      'translate-organize': '번역하면서 내용을 구조화합니다',
      'clean-format': '중복 제거 및 형식을 개선합니다',
      // Teacher-specific mode descriptions
      'lesson-plan': '수업 목표, 단계, 활동을 포함한 체계적인 수업 계획안을 작성합니다',
      'observation-record': '수업 관찰 내용을 교수학습 개선에 활용할 수 있도록 체계적으로 정리합니다',
      'meeting-minutes': '회의 안건, 논의사항, 결정사항을 명확히 정리한 회의록을 작성합니다',
      'official-document': '발신/수신, 제목, 내용을 포함한 표준 공문서 형식으로 변환합니다',
    },
    en: {
      'restructure': 'Improve logical flow and reorganize paragraphs',
      'summarize': 'Create a concise summary of key content',
      'extract-key-points': 'Extract important information as bullet points',
      'translate-organize': 'Translate while structuring content',
      'clean-format': 'Remove redundancies and improve formatting',
      // Teacher-specific mode descriptions
      'lesson-plan': 'Create a structured lesson plan with objectives, stages, and activities',
      'observation-record': 'Organize observation notes for teaching improvement',
      'meeting-minutes': 'Structure meeting agenda, discussions, and decisions',
      'official-document': 'Convert to standard official document format',
    },
  };

  return descriptions[language][mode];
}
