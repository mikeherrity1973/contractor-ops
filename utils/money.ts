export const toPence = (gbp: number) => Math.round(gbp * 100);
export const fromPence = (pence: number) => (pence || 0) / 100;
export const pounds = (n?: number|null) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n || 0);
