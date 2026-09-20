import type { Metadata } from "next";
import { Archivo, Newsreader, Noto_Sans_Gurmukhi, Noto_Serif_Gurmukhi } from "next/font/google";
import "../globals.css";
import { DEFAULT_LOCALE, getDict, isLocale, LOCALES, LOCALE_META, type Locale } from "@/i18n";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const gurmukhiSans = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi", "latin"],
  variable: "--font-gurmukhi-sans",
  display: "swap",
});
const gurmukhiSerif = Noto_Serif_Gurmukhi({
  subsets: ["gurmukhi", "latin"],
  variable: "--font-gurmukhi-serif",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  return {
    title: { default: t.site.name, template: `%s · ${t.site.name}` },
    description: t.home.standfirst,
    alternates: {
      languages: { en: "/en/", pa: "/pa/" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const fonts = [newsreader.variable, archivo.variable, gurmukhiSans.variable, gurmukhiSerif.variable].join(" ");
  return (
    <html lang={LOCALE_META[locale].htmlLang} dir={LOCALE_META[locale].dir} className={fonts}>
      <body>{children}</body>
    </html>
  );
}
