export interface Flashcard {
  id: number;
  category: 'rn' | 'frontend' | 'backend' | 'algorithms' | 'leadership' | 'mentoring' | 'appstore' | 'mobile' | 'personal'|'behavioral'|'ielts';
  sub?: string;
  question: string;
}