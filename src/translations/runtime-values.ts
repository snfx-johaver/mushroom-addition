const keys = [
  "ui.renderer.minimum_value", "ui.renderer.maximum_value",
  "ui.renderer.net_result", "ui.area.select_required",
] as const;

const rows: Record<string, string> = {
  en: "Min {value}|Max {value}|Net result for {energy} kWh: {net} €|Select an area in the native Area editor.",
  ar: "الأدنى {value}|الأقصى {value}|النتيجة الصافية لـ {energy} kWh: ‏{net} €|اختر منطقة في محرر بطاقة المنطقة الأصلي.",
  bg: "Мин. {value}|Макс. {value}|Нетен резултат за {energy} kWh: {net} €|Изберете зона във вградения редактор на картата за зона.",
  ca: "Mín. {value}|Màx. {value}|Resultat net per a {energy} kWh: {net} €|Seleccioneu una àrea a l'editor natiu de la targeta d'àrea.",
  cs: "Min. {value}|Max. {value}|Čistý výsledek za {energy} kWh: {net} €|Vyberte oblast ve vestavěném editoru karty oblasti.",
  da: "Min. {value}|Maks. {value}|Nettoresultat for {energy} kWh: {net} €|Vælg et område i den indbyggede områdekorteditor.",
  de: "Min. {value}|Max. {value}|Nettoergebnis für {energy} kWh: {net} €|Wähle einen Bereich im nativen Bereichskarten-Editor aus.",
  el: "Ελάχ. {value}|Μέγ. {value}|Καθαρό αποτέλεσμα για {energy} kWh: {net} €|Επιλέξτε περιοχή στον ενσωματωμένο επεξεργαστή της κάρτας περιοχής.",
  es: "Mín. {value}|Máx. {value}|Resultado neto para {energy} kWh: {net} €|Seleccione un área en el editor nativo de la tarjeta de área.",
  fi: "Min. {value}|Maks. {value}|Nettotulos energialle {energy} kWh: {net} €|Valitse alue alkuperäisessä aluekortin muokkaimessa.",
  fr: "Min. {value}|Max. {value}|Résultat net pour {energy} kWh : {net} €|Sélectionnez une zone dans l'éditeur natif de la carte de zone.",
  he: "מינימום {value}|מקסימום {value}|תוצאה נטו עבור {energy} kWh: ‏{net} €|יש לבחור אזור בעורך כרטיס האזור המובנה.",
  hu: "Min. {value}|Max. {value}|Nettó eredmény {energy} kWh esetén: {net} €|Válassz területet a beépített területkártya-szerkesztőben.",
  id: "Min. {value}|Maks. {value}|Hasil bersih untuk {energy} kWh: {net} €|Pilih area di editor kartu area bawaan.",
  it: "Min. {value}|Max. {value}|Risultato netto per {energy} kWh: {net} €|Seleziona un'area nell'editor nativo della scheda area.",
  "ko-KR": "최솟값 {value}|최댓값 {value}|{energy} kWh의 순 결과: {net} €|기본 구역 카드 편집기에서 구역을 선택하세요.",
  nb: "Min. {value}|Maks. {value}|Nettoresultat for {energy} kWh: {net} €|Velg et område i det innebygde områdekortets redigering.",
  nl: "Min. {value}|Max. {value}|Nettoresultaat voor {energy} kWh: {net} €|Selecteer een gebied in de ingebouwde gebiedskaarteditor.",
  pl: "Min. {value}|Maks. {value}|Wynik netto dla {energy} kWh: {net} €|Wybierz obszar we wbudowanym edytorze karty obszaru.",
  "pt-BR": "Mín. {value}|Máx. {value}|Resultado líquido para {energy} kWh: {net} €|Selecione uma área no editor nativo do cartão de área.",
  "pt-PT": "Mín. {value}|Máx. {value}|Resultado líquido para {energy} kWh: {net} €|Selecione uma área no editor nativo do cartão de área.",
  ro: "Min. {value}|Max. {value}|Rezultat net pentru {energy} kWh: {net} €|Selectează o zonă în editorul nativ al cardului de zonă.",
  ru: "Мин. {value}|Макс. {value}|Чистый результат за {energy} kWh: {net} €|Выберите зону во встроенном редакторе карточки зоны.",
  sk: "Min. {value}|Max. {value}|Čistý výsledok za {energy} kWh: {net} €|Vyberte oblasť vo vstavanom editore karty oblasti.",
  sl: "Najm. {value}|Najv. {value}|Neto rezultat za {energy} kWh: {net} €|Izberite območje v vgrajenem urejevalniku kartice območja.",
  "sr-Latn": "Min. {value}|Maks. {value}|Neto rezultat za {energy} kWh: {net} €|Izaberite oblast u ugrađenom uređivaču kartice oblasti.",
  sr: "Мин. {value}|Макс. {value}|Нето резултат за {energy} kWh: {net} €|Изаберите област у уграђеном уређивачу картице области.",
  sv: "Min. {value}|Max. {value}|Nettoresultat för {energy} kWh: {net} €|Välj ett område i den inbyggda områdeskortredigeraren.",
  tr: "En düşük {value}|En yüksek {value}|{energy} kWh için net sonuç: {net} €|Yerleşik alan kartı düzenleyicisinde bir alan seçin.",
  uk: "Мін. {value}|Макс. {value}|Чистий результат за {energy} kWh: {net} €|Виберіть зону у вбудованому редакторі картки зони.",
  vi: "Thấp nhất {value}|Cao nhất {value}|Kết quả ròng cho {energy} kWh: {net} €|Chọn khu vực trong trình chỉnh sửa thẻ khu vực tích hợp.",
  "zh-Hans": "最小值 {value}|最大值 {value}|{energy} kWh 的净收益：{net} €|请在原生区域卡片编辑器中选择区域。",
  "zh-Hant": "最小值 {value}|最大值 {value}|{energy} kWh 的淨收益：{net} €|請在原生區域卡片編輯器中選擇區域。",
};

export const runtimeValueTranslations: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, row]) => {
    const values = row.split("|");
    if (values.length !== keys.length) throw new Error(`Invalid runtime value label count for ${locale}`);
    return [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
  }),
);
