
export function truncateAddress(address:string) {
  if (!address) return '';

  const firstChars = address.slice(0, 6); 
  const lastChars = address.slice(-4);

  return `${firstChars}...${lastChars}`;
}