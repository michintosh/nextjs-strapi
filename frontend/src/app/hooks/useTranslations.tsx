import React from "react";
import { translations } from "../translations/locales";
import { useAppSelector } from "../store/hooks";

const useTranslations = () => {
  const currLang = useAppSelector(
    (state) => state.languageReducer.currentLanguage
  );
  const getString = (scope: string, id: string) => {
    //@ts-ignore
    return translations[currLang][scope][id] || "";
  };
  return { getString };
};

export default useTranslations;
