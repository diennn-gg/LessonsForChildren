import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/audio');

// Tất cả items
const items = [
  { id: 'bo', text: 'con bò' },
  { id: 'ga', text: 'con gà' },
  { id: 'cho', text: 'con chó' },
  { id: 'meo', text: 'con mèo' },
  { id: 'lon', text: 'con lợn' },
  { id: 'vit', text: 'con vịt' },
  { id: 'ca', text: 'con cá' },
  { id: 'tho', text: 'con thỏ' },
  { id: 'khi', text: 'con khỉ' },
  { id: 'voi', text: 'con voi' },
  { id: 'cop', text: 'con cọp' },
  { id: 'su-tu', text: 'con sư tử' },
  { id: 'huou', text: 'con hươu' },
  { id: 'ngua', text: 'con ngựa' },
  { id: 'be', text: 'con bê' },
  { id: 'cuu', text: 'con cừu' },
  { id: 'de', text: 'con dê' },
  { id: 'gau', text: 'con gấu' },
  { id: 'chim', text: 'con chim' },
  { id: 'ran', text: 'con rắn' },
  { id: 'do', text: 'màu đỏ' },
  { id: 'xanh-la', text: 'màu xanh lá' },
  { id: 'xanh-duong', text: 'màu xanh dương' },
  { id: 'vang', text: 'màu vàng' },
  { id: 'cam', text: 'màu cam' },
  { id: 'tim', text: 'màu tím' },
  { id: 'hong', text: 'màu hồng' },
  { id: 'nau', text: 'màu nâu' },
  { id: 'den', text: 'màu đen' },
  { id: 'trang', text: 'màu trắng' },
  { id: 'tao', text: 'quả táo' },
  { id: 'chuoi', text: 'quả chuối' },
  { id: 'cam-qua', text: 'quả cam' },
  { id: 'nho', text: 'quả nho' },
  { id: 'dau-tay', text: 'quả dâu tây' },
  { id: 'dua-hau', text: 'quả dưa hấu' },
  { id: 'xoai', text: 'quả xoài' },
  { id: 'dua', text: 'quả dứa' },
  { id: 'dao', text: 'quả đào' },
  { id: 'le', text: 'quả lê' },
  { id: 'mot', text: 'số một' },
  { id: 'hai', text: 'số hai' },
  { id: 'ba', text: 'số ba' },
  { id: 'bon', text: 'số bốn' },
  { id: 'nam', text: 'số năm' },
  { id: 'sau', text: 'số sáu' },
  { id: 'bay', text: 'số bảy' },
  { id: 'tam', text: 'số tám' },
  { id: 'chin', text: 'số chín' },
  { id: 'muoi', text: 'số mười' },
];

// Câu hỏi quiz: "Đâu là X?"
const quizQuestions = items.map(({ id, text }) => ({
  id: `q-${id}`,
  text: `Đâu là ${text}?`,
}));

// Phản hồi
const feedback = [
  { id: 'dung-roi', text: 'Đúng rồi! Giỏi lắm!' },
  { id: 'thu-lai', text: 'Thử lại nhé!' },
];

const words = [...items, ...quizQuestions, ...feedback];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadAudio(id, text) {
  const filepath = path.join(audioDir, `${id}.mp3`);
  if (existsSync(filepath)) {
    console.log(`⏭  ${id} (đã có)`);
    return;
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob&ttsspeed=0.8`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/',
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  await writeFile(filepath, Buffer.from(buffer));
  console.log(`✅  ${id}: "${text}" (${(buffer.byteLength / 1024).toFixed(1)}KB)`);
}

async function main() {
  await mkdir(audioDir, { recursive: true });
  console.log(`Tải ${words.length} file âm thanh...\n`);
  let ok = 0, fail = 0;
  for (const { id, text } of words) {
    try {
      await downloadAudio(id, text);
      ok++;
      await sleep(300);
    } catch (e) {
      console.error(`❌  ${id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nXong! ✅ ${ok} thành công, ❌ ${fail} lỗi`);
}

main();
