import type { Metadata } from "next";
import { BASE_PATH } from "@/i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Root sends Punjabi browsers to /pa and everyone else to /en. Static-export
 *  safe: no middleware, and it still works with JS off via the noscript links. */
export default function LocaleGate() {
  const script = `(function(){var B=${JSON.stringify(BASE_PATH)};try{var s=localStorage.getItem("kb.locale");var n=(navigator.language||"").toLowerCase();var l=s==="pa"||s==="en"?s:(n.indexOf("pa")===0?"pa":"en");location.replace(B+"/"+l+"/");}catch(e){location.replace(B+"/en/");}})();`;
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0;url=${BASE_PATH}/en/`} />
        <title>Know Brampton</title>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </head>
      <body>
        <noscript>
          <p>
            <a href={`${BASE_PATH}/en/`}>Continue in English</a> · <a href={`${BASE_PATH}/pa/`}>ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ</a>
          </p>
        </noscript>
      </body>
    </html>
  );
}
