const rows: Record<string, string> = {
  en: "Entity picture|Last changed|Last updated",
  ar: "صورة الكيان|آخر تغيير|آخر تحديث",
  bg: "Изображение на обекта|Последна промяна|Последно обновяване",
  ca: "Imatge de l'entitat|Darrer canvi|Darrera actualització",
  cs: "Obrázek entity|Poslední změna|Poslední aktualizace",
  da: "Entitetsbillede|Senest ændret|Senest opdateret",
  de: "Entitätsbild|Zuletzt geändert|Zuletzt aktualisiert",
  el: "Εικόνα οντότητας|Τελευταία αλλαγή|Τελευταία ενημέρωση",
  es: "Imagen de entidad|Último cambio|Última actualización",
  fi: "Entiteetin kuva|Viimeksi muutettu|Viimeksi päivitetty",
  fr: "Image de l'entité|Dernière modification|Dernière mise à jour",
  he: "תמונת ישות|שינוי אחרון|עדכון אחרון",
  hu: "Entitás képe|Utolsó módosítás|Utolsó frissítés",
  id: "Gambar entitas|Terakhir berubah|Terakhir diperbarui",
  it: "Immagine dell'entità|Ultima modifica|Ultimo aggiornamento",
  "ko-KR": "엔티티 사진|마지막 변경|마지막 업데이트",
  nb: "Entitetsbilde|Sist endret|Sist oppdatert",
  nl: "Entiteitsafbeelding|Laatst gewijzigd|Laatst bijgewerkt",
  pl: "Obraz encji|Ostatnia zmiana|Ostatnia aktualizacja",
  "pt-BR": "Imagem da entidade|Última alteração|Última atualização",
  "pt-PT": "Imagem da entidade|Última alteração|Última atualização",
  ro: "Imaginea entității|Ultima modificare|Ultima actualizare",
  ru: "Изображение сущности|Последнее изменение|Последнее обновление",
  sk: "Obrázok entity|Posledná zmena|Posledná aktualizácia",
  sl: "Slika entitete|Zadnja sprememba|Zadnja posodobitev",
  "sr-Latn": "Slika entiteta|Poslednja promena|Poslednje ažuriranje",
  sr: "Слика ентитета|Последња промена|Последње ажурирање",
  sv: "Entitetsbild|Senast ändrad|Senast uppdaterad",
  tr: "Varlık resmi|Son değişiklik|Son güncelleme",
  uk: "Зображення сутності|Остання зміна|Останнє оновлення",
  vi: "Hình thực thể|Lần thay đổi cuối|Lần cập nhật cuối",
  "zh-Hans": "实体图片|上次更改|上次更新",
  "zh-Hant": "實體圖片|上次變更|上次更新",
};

const keys = ["option.entity_picture", "option.last_changed", "option.last_updated"] as const;
export const presentationOptionTranslations: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(rows).map(([locale, row]) => {
    const values = row.split("|");
    if (values.length !== keys.length) throw new Error(`Invalid ${locale} presentation option row: ${values.length}/${keys.length}`);
    return [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
  }),
);
