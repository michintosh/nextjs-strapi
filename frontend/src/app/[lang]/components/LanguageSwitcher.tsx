"use client";
import { setLanguage } from "@/app/store/features/langSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation'

interface IProps {
  locales: {
    id: number;
    code: string;
    isDefault: boolean;
  }[];
}

const LanguageSwitcher = ({ locales }: IProps) => {
  const router = useRouter();
  const pathname = usePathname()

  const currLang = useAppSelector(
    (state) => state.languageReducer.currentLanguage
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const urlLan = pathname.split("/")[1]
    if (currLang !== urlLan) {
      const tmpUrl = pathname.replace(`/${urlLan}`,`/${currLang}`)
      router.push(tmpUrl)
    }
  }, [currLang]);

  return (
    <>
      {locales
        .map((el) => ({ id: el.id, code: el.code }))
        .map((el) => {
          return (
            <span
              className={`dark:text-white hover:cursor-pointer ${currLang === el.code && "underline"}`}
              key={el.id}
              onClick={() => dispatch(setLanguage(el.code))}
            >
              {el.code}
            </span>
          );
        })}
    </>
  );
};

export default LanguageSwitcher;
