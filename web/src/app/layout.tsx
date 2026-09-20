// Passthrough: <html> lives in app/[locale]/layout.tsx so it can carry the
// correct lang attribute, which drives the Gurmukhi type switch in CSS.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
