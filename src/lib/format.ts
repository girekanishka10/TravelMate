export function ageFromDob(dob: string) {
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const year = e.getFullYear();
  return `${s.toLocaleDateString("en-IN", opts)}–${e.toLocaleDateString("en-IN", opts)} ${year}`;
}

export function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function firstName(name: string) {
  return name.split(" ")[0];
}
