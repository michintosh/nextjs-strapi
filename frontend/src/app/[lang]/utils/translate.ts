import { translations } from "@/app/translations/locales"

export const translate = (locale:string,scope:string,id:string) => {
    //@ts-ignore
    return translations[locale][scope][id]
}