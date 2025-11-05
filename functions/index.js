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
