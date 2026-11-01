export interface EditorField {
  name: string;
  selector?: Record<string, unknown>;
}

export class EditorSchemaCache {
  private readonly schemas = new Map<string, EditorField[]>();

  public get(schema: EditorField[]): EditorField[] {
    const key = JSON.stringify(schema);
    const previous = this.schemas.get(key);
    if (previous) return previous;
    if (this.schemas.size >= 64) this.schemas.clear();
    this.schemas.set(key, schema);
    return schema;
  }
}
