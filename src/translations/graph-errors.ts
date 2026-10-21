const keys = [
  "ui.graph.entity_required", "ui.graph.no_history", "ui.graph.history_failed",
] as const;

const rows: Record<string, string> = {
  en: "Mini Graph Card requires at least one entity.|No recorder history is available for the selected entities.|Unable to load recorder history.",
  ar: "تتطلب بطاقة الرسم المصغر كيانًا واحدًا على الأقل.|لا يتوفر سجل من المسجل للكيانات المحددة.|تعذر تحميل سجل المسجل.",
  bg: "Картата Mini Graph изисква поне един обект.|Няма история от Recorder за избраните обекти.|Историята от Recorder не може да се зареди.",
  ca: "La targeta Mini Graph requereix almenys una entitat.|No hi ha historial del gravador per a les entitats seleccionades.|No s'ha pogut carregar l'historial del gravador.",
  cs: "Karta Mini Graph vyžaduje alespoň jednu entitu.|Pro vybrané entity není k dispozici historie z Recorderu.|Historii z Recorderu se nepodařilo načíst.",
  da: "Mini Graph-kortet kræver mindst én entitet.|Der er ingen Recorder-historik for de valgte entiteter.|Recorder-historikken kunne ikke indlæses.",
  de: "Die Mini-Graph-Karte benötigt mindestens eine Entität.|Für die ausgewählten Entitäten ist kein Recorder-Verlauf verfügbar.|Der Recorder-Verlauf konnte nicht geladen werden.",
  el: "Η κάρτα Mini Graph απαιτεί τουλάχιστον μία οντότητα.|Δεν υπάρχει ιστορικό του Recorder για τις επιλεγμένες οντότητες.|Δεν ήταν δυνατή η φόρτωση του ιστορικού του Recorder.",
  es: "La tarjeta Mini Graph requiere al menos una entidad.|No hay historial de Recorder para las entidades seleccionadas.|No se ha podido cargar el historial de Recorder.",
  fi: "Mini Graph -kortti vaatii vähintään yhden entiteetin.|Valituille entiteeteille ei ole Recorder-historiaa.|Recorder-historian lataaminen epäonnistui.",
  fr: "La carte Mini Graph nécessite au moins une entité.|Aucun historique Recorder n'est disponible pour les entités sélectionnées.|Impossible de charger l'historique Recorder.",
  he: "כרטיס Mini Graph דורש לפחות ישות אחת.|אין היסטוריית Recorder עבור הישויות שנבחרו.|לא ניתן לטעון את היסטוריית Recorder.",
  hu: "A Mini Graph kártyához legalább egy entitás szükséges.|A kiválasztott entitásokhoz nem érhető el Recorder-előzmény.|Nem sikerült betölteni a Recorder-előzményeket.",
  id: "Kartu Mini Graph memerlukan setidaknya satu entitas.|Riwayat Recorder tidak tersedia untuk entitas yang dipilih.|Tidak dapat memuat riwayat Recorder.",
  it: "La scheda Mini Graph richiede almeno un'entità.|Non è disponibile una cronologia Recorder per le entità selezionate.|Impossibile caricare la cronologia Recorder.",
  "ko-KR": "Mini Graph 카드에는 하나 이상의 엔티티가 필요합니다.|선택한 엔티티의 Recorder 기록이 없습니다.|Recorder 기록을 불러올 수 없습니다.",
  nb: "Mini Graph-kortet krever minst én entitet.|Ingen Recorder-historikk er tilgjengelig for de valgte entitetene.|Kunne ikke laste Recorder-historikken.",
  nl: "De Mini Graph-kaart vereist minstens één entiteit.|Er is geen Recorder-geschiedenis beschikbaar voor de geselecteerde entiteiten.|De Recorder-geschiedenis kon niet worden geladen.",
  pl: "Karta Mini Graph wymaga co najmniej jednej encji.|Brak historii Recorder dla wybranych encji.|Nie można wczytać historii Recorder.",
  "pt-BR": "O cartão Mini Graph requer pelo menos uma entidade.|Não há histórico do Recorder disponível para as entidades selecionadas.|Não foi possível carregar o histórico do Recorder.",
  "pt-PT": "O cartão Mini Graph requer pelo menos uma entidade.|Não existe histórico do Recorder disponível para as entidades selecionadas.|Não foi possível carregar o histórico do Recorder.",
  ro: "Cardul Mini Graph necesită cel puțin o entitate.|Nu există istoric Recorder pentru entitățile selectate.|Istoricul Recorder nu a putut fi încărcat.",
  ru: "Для карточки Mini Graph нужна хотя бы одна сущность.|Для выбранных сущностей нет истории Recorder.|Не удалось загрузить историю Recorder.",
  sk: "Karta Mini Graph vyžaduje aspoň jednu entitu.|Pre vybrané entity nie je dostupná história z Recorderu.|Históriu z Recorderu sa nepodarilo načítať.",
  sl: "Kartica Mini Graph zahteva vsaj eno entiteto.|Za izbrane entitete ni zgodovine Recorder.|Zgodovine Recorder ni bilo mogoče naložiti.",
  "sr-Latn": "Mini Graph kartica zahteva najmanje jedan entitet.|Za izabrane entitete nije dostupna Recorder istorija.|Učitavanje Recorder istorije nije uspelo.",
  sr: "Mini Graph картица захтева најмање један ентитет.|За изабране ентитете није доступна Recorder историја.|Учитавање Recorder историје није успело.",
  sv: "Mini Graph-kortet kräver minst en entitet.|Ingen Recorder-historik finns för de valda entiteterna.|Det gick inte att läsa in Recorder-historiken.",
  tr: "Mini Graph kartı en az bir varlık gerektirir.|Seçilen varlıklar için Recorder geçmişi yok.|Recorder geçmişi yüklenemedi.",
  uk: "Для картки Mini Graph потрібна принаймні одна сутність.|Для вибраних сутностей немає історії Recorder.|Не вдалося завантажити історію Recorder.",
  vi: "Thẻ Mini Graph yêu cầu ít nhất một thực thể.|Không có lịch sử Recorder cho các thực thể đã chọn.|Không thể tải lịch sử Recorder.",
  "zh-Hans": "Mini Graph 卡片至少需要一个实体。|所选实体没有可用的 Recorder 历史记录。|无法加载 Recorder 历史记录。",
  "zh-Hant": "Mini Graph 卡片至少需要一個實體。|所選實體沒有可用的 Recorder 歷史記錄。|無法載入 Recorder 歷史記錄。",
};

export const graphErrorTranslations: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, row]) => {
    const values = row.split("|");
    if (values.length !== keys.length) throw new Error(`Invalid graph error count for ${locale}`);
    return [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
  }),
);
