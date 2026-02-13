import { useState } from "react";

import translations from "./translations";

export default () => {
  const [language, setLanguage] = useState("en");
  const tr = (phrase) => translations[language][phrase];
  return [tr, language, setLanguage];
};
