import * as XLSX from 'xlsx';

export type SheetRow = {
  CODE?: string; DESCRIPTION?: string; 'BASE RATE'?: number; 'CONTRACT RATE UNIT'?: number; Unit?: string; QTY?: number; TOTAL?: number; LOCATION?: string; COMMENTS?: string; ITEM_ID?: string;
};

export function parseXlsx(file: File): Promise<SheetRow[]> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = new Uint8Array(fr.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<SheetRow>(ws, { defval: '' });
        resolve(json);
      } catch (e) { reject(e); }
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}

export function exportXlsx(rows: any[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
  XLSX.writeFile(wb, filename);
}
