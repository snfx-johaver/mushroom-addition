const rows: Record<string, [string, string, string, string, string, string]> = {
  en: ["Visible hours", "Status entity", "Workflow presentation", "Hours shown for prices, forecasts and planning tracks.", "Optional entity reporting planning status.", "Show sequential groups or a connected relationship graph."],
  nl: ["Zichtbare uren", "Statusentiteit", "Workflowweergave", "Getoonde uren voor prijzen, prognoses en planning.", "Optionele entiteit met de planningsstatus.", "Toon opeenvolgende groepen of een verbonden relatiegrafiek."],
  de: ["Sichtbare Stunden", "Statusentität", "Workflow-Darstellung", "Angezeigte Stunden für Preise, Prognosen und Planung.", "Optionale Entität für den Planungsstatus.", "Gruppen als Ablauf oder verbundenes Beziehungsdiagramm anzeigen."],
  es: ["Horas visibles", "Entidad de estado", "Presentación del flujo", "Horas mostradas para precios, previsiones y planificación.", "Entidad opcional que indica el estado de planificación.", "Mostrar grupos secuenciales o un grafo de relaciones conectado."],
  fr: ["Heures visibles", "Entité d'état", "Présentation du flux", "Heures affichées pour les prix, prévisions et plans.", "Entité facultative indiquant l'état de planification.", "Afficher des groupes séquentiels ou un graphe de relations connecté."],
  it: ["Ore visibili", "Entità di stato", "Presentazione del flusso", "Ore mostrate per prezzi, previsioni e pianificazione.", "Entità facoltativa che indica lo stato della pianificazione.", "Mostra gruppi sequenziali o un grafo di relazioni connesso."],
  "pt-BR": ["Horas visíveis", "Entidade de status", "Apresentação do fluxo", "Horas exibidas para preços, previsões e planejamento.", "Entidade opcional que informa o status do planejamento.", "Exibir grupos sequenciais ou um grafo de relações conectado."],
  "pt-PT": ["Horas visíveis", "Entidade de estado", "Apresentação do fluxo", "Horas apresentadas para preços, previsões e planeamento.", "Entidade opcional que indica o estado do planeamento.", "Mostrar grupos sequenciais ou um grafo de relações ligado."],
  pl: ["Widoczne godziny", "Encja stanu", "Prezentacja przepływu", "Godziny wyświetlane dla cen, prognoz i planowania.", "Opcjonalna encja wskazująca stan planowania.", "Pokaż kolejne grupy lub połączony graf relacji."],
  ru: ["Видимые часы", "Сущность состояния", "Отображение процесса", "Часы отображения цен, прогнозов и планов.", "Необязательная сущность состояния планирования.", "Показывать последовательные группы или связный граф отношений."],
  uk: ["Видимі години", "Сутність стану", "Відображення процесу", "Години відображення цін, прогнозів і планів.", "Необов'язкова сутність стану планування.", "Показувати послідовні групи або зв'язний граф відносин."],
  cs: ["Viditelné hodiny", "Entita stavu", "Zobrazení procesu", "Zobrazené hodiny pro ceny, předpovědi a plánování.", "Volitelná entita se stavem plánování.", "Zobrazit postupné skupiny nebo propojený graf vztahů."],
  sk: ["Viditeľné hodiny", "Entita stavu", "Zobrazenie procesu", "Zobrazené hodiny pre ceny, predpovede a plánovanie.", "Voliteľná entita so stavom plánovania.", "Zobraziť postupné skupiny alebo prepojený graf vzťahov."],
  da: ["Synlige timer", "Statusentitet", "Visning af arbejdsgang", "Viste timer for priser, prognoser og planlægning.", "Valgfri entitet med planlægningsstatus.", "Vis sekventielle grupper eller en sammenhængende relationsgraf."],
  nb: ["Synlige timer", "Statusentitet", "Visning av arbeidsflyt", "Viste timer for priser, prognoser og planlegging.", "Valgfri entitet med planleggingsstatus.", "Vis sekvensielle grupper eller en sammenkoblet relasjonsgraf."],
  sv: ["Synliga timmar", "Statusentitet", "Visning av arbetsflöde", "Visade timmar för priser, prognoser och planering.", "Valfri entitet med planeringsstatus.", "Visa sekventiella grupper eller en sammanhängande relationsgraf."],
  fi: ["Näkyvät tunnit", "Tilakohde", "Työnkulun esitys", "Hinnoille, ennusteille ja suunnittelulle näytettävät tunnit.", "Valinnainen suunnittelun tilan ilmoittava kohde.", "Näytä peräkkäiset ryhmät tai yhdistetty suhdekaavio."],
  ro: ["Ore vizibile", "Entitate de stare", "Prezentarea fluxului", "Ore afișate pentru prețuri, prognoze și planificare.", "Entitate opțională care indică starea planificării.", "Afișează grupuri secvențiale sau un graf de relații conectat."],
  tr: ["Görünür saatler", "Durum varlığı", "İş akışı görünümü", "Fiyatlar, tahminler ve planlama için gösterilen saatler.", "Planlama durumunu bildiren isteğe bağlı varlık.", "Sıralı grupları veya bağlantılı ilişki grafiğini göster."],
  id: ["Jam yang terlihat", "Entitas status", "Tampilan alur kerja", "Jam yang ditampilkan untuk harga, prakiraan dan perencanaan.", "Entitas opsional yang melaporkan status perencanaan.", "Tampilkan kelompok berurutan atau graf hubungan yang terhubung."],
  bg: ["Видими часове", "Обект за състояние", "Представяне на процеса", "Показвани часове за цени, прогнози и планиране.", "Незадължителен обект за състоянието на планирането.", "Показване на последователни групи или свързан граф на отношенията."],
  el: ["Ορατές ώρες", "Οντότητα κατάστασης", "Παρουσίαση ροής", "Ώρες εμφάνισης τιμών, προβλέψεων και σχεδιασμού.", "Προαιρετική οντότητα που αναφέρει την κατάσταση σχεδιασμού.", "Εμφάνιση διαδοχικών ομάδων ή συνδεδεμένου γράφου σχέσεων."],
  "ko-KR": ["표시 시간", "상태 엔티티", "워크플로 표시", "가격, 예측 및 계획을 표시할 시간입니다.", "계획 상태를 보고하는 선택적 엔티티입니다.", "순차 그룹 또는 연결된 관계 그래프를 표시합니다."],
  vi: ["Số giờ hiển thị", "Thực thể trạng thái", "Hiển thị quy trình", "Số giờ hiển thị giá, dự báo và kế hoạch.", "Thực thể tùy chọn báo cáo trạng thái lập kế hoạch.", "Hiển thị các nhóm tuần tự hoặc đồ thị quan hệ được kết nối."],
  "zh-Hans": ["显示小时数", "状态实体", "工作流显示方式", "价格、预测和计划显示的小时数。", "报告计划状态的可选实体。", "显示顺序分组或相连的关系图。"],
  "zh-Hant": ["顯示小時數", "狀態實體", "工作流程顯示方式", "價格、預測和計畫顯示的小時數。", "回報計畫狀態的選用實體。", "顯示順序群組或相連的關係圖。"],
  sr: ["Видљиви сати", "Ентитет стања", "Приказ тока рада", "Сати приказани за цене, прогнозе и планирање.", "Опциони ентитет који пријављује стање планирања.", "Прикажи узастопне групе или повезани граф односа."],
  "sr-Latn": ["Vidljivi sati", "Entitet stanja", "Prikaz toka rada", "Sati prikazani za cene, prognoze i planiranje.", "Opcioni entitet koji prijavljuje stanje planiranja.", "Prikaži uzastopne grupe ili povezani graf odnosa."],
  he: ["שעות מוצגות", "ישות מצב", "תצוגת תהליך", "מספר השעות להצגת מחירים, תחזיות ותכנון.", "ישות אופציונלית המדווחת על מצב התכנון.", "הצגת קבוצות רציפות או גרף קשרים מחובר."],
  ar: ["الساعات المعروضة", "كيان الحالة", "عرض سير العمل", "الساعات المعروضة للأسعار والتوقعات والتخطيط.", "كيان اختياري يبلغ عن حالة التخطيط.", "عرض مجموعات متسلسلة أو رسم علاقات مترابط."],
  sl: ["Vidne ure", "Entiteta stanja", "Prikaz poteka", "Prikazane ure za cene, napovedi in načrtovanje.", "Izbirna entiteta, ki poroča o stanju načrtovanja.", "Prikaži zaporedne skupine ali povezan graf odnosov."],
  ca: ["Hores visibles", "Entitat d'estat", "Presentació del flux", "Hores mostrades per a preus, previsions i planificació.", "Entitat opcional que indica l'estat de la planificació.", "Mostra grups seqüencials o un graf de relacions connectat."],
  hu: ["Látható órák", "Állapotentitás", "Munkafolyamat nézete", "Az árakhoz, előrejelzésekhez és tervekhez megjelenített órák.", "A tervezés állapotát jelző opcionális entitás.", "Egymást követő csoportok vagy összekapcsolt kapcsolatgráf megjelenítése."],
};

export const energyEditorLabels: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, values]) => [locale, {
    visibleHours: values[0], statusEntity: values[1], presentation: values[2],
  }]),
);
export const energyEditorHelpers: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, values]) => [locale, {
    visibleHours: values[3], statusEntity: values[4], presentation: values[5],
  }]),
);
