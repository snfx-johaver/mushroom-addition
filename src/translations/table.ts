export function translationTable(english: readonly string[], rows: Record<string, string>): Record<string, Record<string, string>> {
  return Object.fromEntries(Object.entries({ en: english.join("|"), ...rows }).map(([locale, row]) => {
    const values = row.split("|");
    if (values.length !== english.length || values.some(value => !value.trim())) {
      throw new Error(`Invalid ${locale} translation table: ${values.length}/${english.length}`);
    }
    return [locale, Object.fromEntries(english.map((text, index) => [`ui.release.${text}`, values[index]]))];
  }));
}
