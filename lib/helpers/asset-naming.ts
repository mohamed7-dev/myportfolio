import path from "node:path";
import { normalizeString } from "../utils/normalize-string";

export class DefaultAssetNamingStrategy {
  private readonly conflictSuffixRe = /__(\d+)(\.[^.]+)?$/;

  public createSourceName(originalName: string, conflictName?: string): string {
    const fileName = normalizeString(originalName, "-");

    return conflictName
      ? this.bumpConflictSuffix(fileName, conflictName)
      : fileName;
  }

  private bumpConflictSuffix(baseName: string, conflictName: string): string {
    const current = Number(conflictName.match(this.conflictSuffixRe)?.[1]) || 1;

    return this.addConflictSuffix(baseName, current + 1);
  }

  private addConflictSuffix(fileName: string, index: number): string {
    return this.appendSuffix(fileName, `__${String(index).padStart(2, "0")}`);
  }

  private appendSuffix(fileName: string, suffix: string): string {
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);

    return `${name}${suffix}${ext}`;
  }
}
