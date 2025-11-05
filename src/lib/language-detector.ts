export function detectKorean(text: string): boolean {
  // Korean Unicode ranges:
  // Hangul Syllables: AC00–D7AF
  // Hangul Jamo: 1100–11FF
  // Hangul Compatibility Jamo: 3130–318F
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
  return koreanRegex.test(text);
}

export function getKoreanPercentage(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const koreanChars = text.match(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g);
  const koreanCount = koreanChars ? koreanChars.length : 0;
  
  // Count non-whitespace characters
  const totalChars = text.replace(/\s/g, '').length;
  
  if (totalChars === 0) return 0;
  
  return (koreanCount / totalChars) * 100;
}

export function isPrimarilyKorean(text: string): boolean {
  return getKoreanPercentage(text) > 30;
}

export function detectLanguage(text: string): 'ko' | 'en' | 'mixed' {
  const koreanPercent = getKoreanPercentage(text);
  
  if (koreanPercent > 50) return 'ko';
  if (koreanPercent > 10) return 'mixed';
  return 'en';
}
