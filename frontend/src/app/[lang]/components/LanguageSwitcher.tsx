"use client";
import { setLanguage } from "@/app/store/features/langSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import React from "react";

interface IProps {
  locales: {
    id: number;
    code: string;
    isDefault:boolean;
  }[];
}

const LanguageSwitcher = ({ locales }: IProps) => {
  const currLang = useAppSelector(
    (state) => state.languageReducer.currentLanguage
  );
  const dispatch = useAppDispatch();
  return (
    <>
      {locales
        .map((el) => ({ id: el.id, code: el.code }))
        .map((el) => {
          return (
            <span
              className={`text-white ${currLang === el.code && "underline"}`}
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
