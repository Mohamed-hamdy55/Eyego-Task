import { useSelector } from "react-redux"
import translationLanguages from "../translationData"

/**
 * useTranslate custom Hook: that take a translation target (static word) and return the translation
 * depending on the current language (Now: "ar" and "eng" only)
 * @param {*} translationTarget 
 * @returns 
 */
export  function useTranslate(){
    const language = useSelector((state)=>state.language.lang)

    return (key) => {
        return translationLanguages[language][key] || key;
      };
}