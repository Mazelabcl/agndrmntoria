export function validateChileanRUT(rut: string): boolean {
  const cleanRUT = rut.replace(/[.-]/g, '');
  
  if (cleanRUT.length < 2) return false;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  
  if (!/^\d+$/.test(body)) return false;
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDV = 11 - (sum % 11);
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
  
  return dv === calculatedDV;
}

export function validateChileanPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s-()]/g, '');
  
  return /^(\+?56)?9\d{8}$/.test(cleanPhone);
}

export function formatChileanRUT(rut: string): string {
  const cleanRUT = rut.replace(/[.-]/g, '');
  if (cleanRUT.length < 2) return rut;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);
  
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${dv}`;
}
