const keys = [
  "ui.greeting_hello", "ui.greeting_morning", "ui.greeting_afternoon", "ui.greeting_evening",
  "ui.pollen_none", "ui.pollen_very_low", "ui.pollen_low", "ui.pollen_medium",
  "ui.pollen_high", "ui.pollen_very_high", "ui.pollen_tree", "ui.pollen_grass", "ui.pollen_weed",
];

const rows: Record<string, string> = {
  ar: "مرحبًا|صباح الخير|مساء الخير|مساء الخير|لا شيء|منخفض جدًا|منخفض|متوسط|مرتفع|مرتفع جدًا|الأشجار|الحشائش|الأعشاب الضارة",
  bg: "Здравей|Добро утро|Добър ден|Добър вечер|Няма|Много ниско|Ниско|Средно|Високо|Много високо|Дървета|Треви|Плевели",
  ca: "Hola|Bon dia|Bona tarda|Bon vespre|Cap|Molt baix|Baix|Mitjà|Alt|Molt alt|Arbres|Gramínies|Males herbes",
  cs: "Ahoj|Dobré ráno|Dobré odpoledne|Dobrý večer|Žádný|Velmi nízká|Nízká|Střední|Vysoká|Velmi vysoká|Stromy|Trávy|Plevele",
  da: "Hej|Godmorgen|God eftermiddag|God aften|Ingen|Meget lav|Lav|Middel|Høj|Meget høj|Træer|Græs|Ukrudt",
  de: "Hallo|Guten Morgen|Guten Tag|Guten Abend|Keine|Sehr niedrig|Niedrig|Mittel|Hoch|Sehr hoch|Bäume|Gräser|Kräuter",
  el: "Γεια σου|Καλημέρα|Καλό απόγευμα|Καλησπέρα|Καθόλου|Πολύ χαμηλή|Χαμηλή|Μέτρια|Υψηλή|Πολύ υψηλή|Δέντρα|Αγρωστώδη|Ζιζάνια",
  en: "Hello|Good morning|Good afternoon|Good evening|None|Very low|Low|Medium|High|Very high|Trees|Grass|Weeds",
  es: "Hola|Buenos días|Buenas tardes|Buenas noches|Ninguno|Muy bajo|Bajo|Medio|Alto|Muy alto|Árboles|Hierbas|Malezas",
  fi: "Hei|Hyvää huomenta|Hyvää iltapäivää|Hyvää iltaa|Ei lainkaan|Erittäin matala|Matala|Kohtalainen|Korkea|Erittäin korkea|Puut|Heinät|Rikkakasvit",
  fr: "Bonjour|Bonjour|Bon après-midi|Bonsoir|Aucun|Très faible|Faible|Moyen|Élevé|Très élevé|Arbres|Graminées|Herbacées",
  he: "שלום|בוקר טוב|אחר צהריים טובים|ערב טוב|ללא|נמוך מאוד|נמוך|בינוני|גבוה|גבוה מאוד|עצים|דגניים|עשבים שוטים",
  hu: "Szia|Jó reggelt|Jó napot|Jó estét|Nincs|Nagyon alacsony|Alacsony|Közepes|Magas|Nagyon magas|Fák|Pázsitfüvek|Gyomnövények",
  id: "Halo|Selamat pagi|Selamat siang|Selamat malam|Tidak ada|Sangat rendah|Rendah|Sedang|Tinggi|Sangat tinggi|Pohon|Rumput|Gulma",
  it: "Ciao|Buongiorno|Buon pomeriggio|Buonasera|Nessuno|Molto basso|Basso|Medio|Alto|Molto alto|Alberi|Graminacee|Erbe infestanti",
  "ko-KR": "안녕하세요|좋은 아침이에요|좋은 오후예요|좋은 저녁이에요|없음|매우 낮음|낮음|보통|높음|매우 높음|나무|잔디|잡초",
  nb: "Hei|God morgen|God ettermiddag|God kveld|Ingen|Svært lav|Lav|Middels|Høy|Svært høy|Trær|Gress|Ugress",
  nl: "Hallo|Goedemorgen|Goedemiddag|Goedenavond|Geen|Zeer laag|Laag|Gemiddeld|Hoog|Zeer hoog|Bomen|Grassen|Kruiden",
  pl: "Cześć|Dzień dobry|Dzień dobry|Dobry wieczór|Brak|Bardzo słabe|Słabe|Średnie|Wysokie|Bardzo wysokie|Drzewa|Trawy|Zioła",
  "pt-BR": "Olá|Bom dia|Boa tarde|Boa noite|Nenhum|Muito baixo|Baixo|Médio|Alto|Muito alto|Árvores|Gramíneas|Ervas daninhas",
  "pt-PT": "Olá|Bom dia|Boa tarde|Boa noite|Nenhum|Muito baixo|Baixo|Médio|Alto|Muito alto|Árvores|Gramíneas|Ervas",
  ro: "Salut|Bună dimineața|Bună ziua|Bună seara|Niciunul|Foarte scăzut|Scăzut|Mediu|Ridicat|Foarte ridicat|Arbori|Graminee|Buruieni",
  ru: "Привет|Доброе утро|Добрый день|Добрый вечер|Нет|Очень низкий|Низкий|Средний|Высокий|Очень высокий|Деревья|Злаки|Сорняки",
  sk: "Ahoj|Dobré ráno|Dobré popoludnie|Dobrý večer|Žiadny|Veľmi nízka|Nízka|Stredná|Vysoká|Veľmi vysoká|Stromy|Trávy|Buriny",
  sl: "Živjo|Dobro jutro|Dober dan|Dober večer|Nič|Zelo nizka|Nizka|Srednja|Visoka|Zelo visoka|Drevesa|Trave|Plevel",
  "sr-Latn": "Zdravo|Dobro jutro|Dobar dan|Dobro veče|Nema|Veoma nizak|Nizak|Srednji|Visok|Veoma visok|Drveće|Trave|Korov",
  sr: "Здраво|Добро јутро|Добар дан|Добро вече|Нема|Веома низак|Низак|Средњи|Висок|Веома висок|Дрвеће|Траве|Коров",
  sv: "Hej|God morgon|God eftermiddag|God kväll|Ingen|Mycket låg|Låg|Medel|Hög|Mycket hög|Träd|Gräs|Ogräs",
  tr: "Merhaba|Günaydın|İyi günler|İyi akşamlar|Yok|Çok düşük|Düşük|Orta|Yüksek|Çok yüksek|Ağaçlar|Çimler|Yabani otlar",
  uk: "Вітаю|Доброго ранку|Добрий день|Добрий вечір|Немає|Дуже низький|Низький|Середній|Високий|Дуже високий|Дерева|Злаки|Бур'яни",
  vi: "Xin chào|Chào buổi sáng|Chào buổi chiều|Chào buổi tối|Không có|Rất thấp|Thấp|Trung bình|Cao|Rất cao|Cây thân gỗ|Cỏ|Cỏ dại",
  "zh-Hans": "你好|早上好|下午好|晚上好|无|极低|低|中等|高|极高|树木|禾本科植物|杂草",
  "zh-Hant": "你好|早安|午安|晚安|無|極低|低|中等|高|極高|樹木|禾本科植物|雜草",
};

export const greetingPollenTranslations: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, row]) => {
    const values = row.split("|");
    if (values.length !== keys.length) throw new Error(`Greeting/pollen translation count mismatch: ${locale}`);
    return [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
  }),
);
