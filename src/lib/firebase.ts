import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const storage = getStorage(app);

// DOCX 변환 함수
export async function convertDocxToMarkdown(file: File): Promise<string> {
  try {
    // 1. Storage에 임시 업로드
    const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = storageRef.fullPath;

    // 2. Cloud Function 호출
    const convertDocx = httpsCallable(functions, 'convertDocx');
    const result = await convertDocx({ fileUrl });

    return (result.data as { markdown: string }).markdown;
  } catch (error) {
    console.error('DOCX conversion error:', error);
    throw new Error(`DOCX 변환 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// XLSX 변환 함수
export async function convertXlsxToMarkdown(file: File): Promise<string> {
  try {
    const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = storageRef.fullPath;

    const convertXlsx = httpsCallable(functions, 'convertXlsx');
    const result = await convertXlsx({ fileUrl });

    return (result.data as { markdown: string }).markdown;
  } catch (error) {
    console.error('XLSX conversion error:', error);
    throw new Error(`XLSX 변환 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// PPTX 변환 함수
export async function convertPptxToMarkdown(file: File): Promise<string> {
  try {
    const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = storageRef.fullPath;

    const convertPptx = httpsCallable(functions, 'convertPptx');
    const result = await convertPptx({ fileUrl });

    return (result.data as { markdown: string }).markdown;
  } catch (error) {
    console.error('PPTX conversion error:', error);
    throw new Error(`PPTX 변환 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// HTML 변환 함수
export async function convertHtmlToMarkdown(file: File): Promise<string> {
  try {
    const storageRef = ref(storage, `temp/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = storageRef.fullPath;

    const convertHtml = httpsCallable(functions, 'convertHtml');
    const result = await convertHtml({ fileUrl });

    return (result.data as { markdown: string }).markdown;
  } catch (error) {
    console.error('HTML conversion error:', error);
    throw new Error(`HTML 변환 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
