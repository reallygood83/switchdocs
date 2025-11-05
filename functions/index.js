const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mammoth = require("mammoth");
const XLSX = require("xlsx");

admin.initializeApp();

// DOCX 변환 함수
exports.convertDocx = functions.https.onCall(async (data) => {
  try {
    const {fileUrl} = data;

    // Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    // DOCX → Markdown 변환
    const result = await mammoth.convertToMarkdown({buffer});

    // 임시 파일 삭제 (5분 후)
    setTimeout(async () => {
      await file.delete();
    }, 5 * 60 * 1000);

    return {
      success: true,
      markdown: result.value,
      messages: result.messages,
    };
  } catch (error) {
    console.error("DOCX conversion error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// XLSX 변환 함수
exports.convertXlsx = functions.https.onCall(async (data) => {
  try {
    const {fileUrl} = data;

    // Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    // XLSX → Markdown 변환
    const workbook = XLSX.read(buffer, {type: "buffer"});
    let markdown = "";

    workbook.SheetNames.forEach((sheetName, index) => {
      markdown += `## Sheet ${index + 1}: ${sheetName}\n\n`;

      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const rows = csv.split("\n");

      if (rows.length > 0) {
        // 헤더 행
        const headers = rows[0].split(",");
        markdown += "| " + headers.join(" | ") + " |\n";
        markdown += "| " + headers.map(() => "---").join(" | ") + " |\n";

        // 데이터 행 (최대 100개)
        for (let i = 1; i < Math.min(rows.length, 101); i++) {
          markdown += "| " + rows[i].split(",").join(" | ") + " |\n";
        }

        if (rows.length > 101) {
          markdown += `\n*Note: Only first 100 rows shown. ` +
            `Total rows: ${rows.length - 1}*\n`;
        }
      }

      markdown += "\n\n";
    });

    // 임시 파일 삭제 (5분 후)
    setTimeout(async () => {
      await file.delete();
    }, 5 * 60 * 1000);

    return {
      success: true,
      markdown: markdown,
    };
  } catch (error) {
    console.error("XLSX conversion error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// PPTX 변환 함수 (향후 구현)
exports.convertPptx = functions.https.onCall(async (data) => {
  try {
    // fileUrl는 나중에 사용 예정
    // const {fileUrl} = data;

    // 현재는 기본 정보만 반환
    return {
      success: true,
      markdown: "# PowerPoint Document\n\n" +
        "*Note: PPTX full conversion is under development.*",
    };
  } catch (error) {
    console.error("PPTX conversion error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// HTML 변환 함수
exports.convertHtml = functions.https.onCall(async (data) => {
  try {
    const {fileUrl} = data;

    // Storage에서 파일 다운로드
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileUrl);
    const [buffer] = await file.download();

    // HTML을 텍스트로 읽기
    const html = buffer.toString("utf-8");

    // 간단한 HTML to Markdown 변환
    let markdown = html
        // HTML 태그 제거
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "")
        // 헤더 변환
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n")
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n")
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n")
        // 단락 변환
        .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n")
        .replace(/<br\s*\/?>/gi, "\n")
        // 리스트 변환
        .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
        .replace(/<ul[^>]*>/gi, "\n")
        .replace(/<\/ul>/gi, "\n")
        .replace(/<ol[^>]*>/gi, "\n")
        .replace(/<\/ol>/gi, "\n")
        // 강조 변환
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
        .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
        // 링크 변환
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
        // 이미지 변환
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
        .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "![]($1)")
        // 코드 변환
        .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
        .replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```")
        // 나머지 HTML 태그 제거
        .replace(/<[^>]+>/g, "")
        // HTML 엔티티 변환
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        // 다중 공백 정리
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();

    // 임시 파일 삭제 (5분 후)
    setTimeout(async () => {
      await file.delete();
    }, 5 * 60 * 1000);

    return {
      success: true,
      markdown: markdown,
    };
  } catch (error) {
    console.error("HTML conversion error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
