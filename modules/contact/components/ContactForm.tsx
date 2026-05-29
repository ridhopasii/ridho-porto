"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import InputField from "@/common/components/elements/InputField";

interface FormEmail {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormEmail>();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send Email");
  const [isSuccess, setIsSuccess] = useState(false);

  const t = useTranslations("ContactPage");

  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if (isLoading) {
      setButtonText("Sending your message...");
      return;
    }
    if (isSuccess) {
      setButtonText("Your email sent successfully");
      const timeout = setTimeout(() => {
        setButtonText("Send Email");
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
    setButtonText("Send Email");
  }, [isLoading, isSuccess]);

  const handleFormSubmit = async (payload: FormEmail) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/email", payload);
      if (response.status === 200) setIsSuccess(true);
      reset();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{t("form.title")}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Feel free to reach out to me via email or fill out the form below. I will get back to you as soon as possible.</p>
      </div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 transition-all duration-300"
      >
        <div className="flex w-full flex-col space-y-5 md:flex-row md:space-x-4 md:space-y-0">
          <InputField
            name="name"
            rule={{ required: true }}
            register={register}
            error={errors}
          />
          <InputField
            name="email"
            rule={{
              required: true,
              pattern: {
                value: regexEmail,
                message: "please enter a valid email",
              },
            }}
            register={register}
            error={errors}
          />
        </div>
        <InputField
          name="message"
          rule={{ required: true }}
          register={register}
          error={errors}
          isTextArea
          rows={4}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="group relative w-full overflow-hidden rounded-xl bg-neutral-900 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {buttonText}
          </span>
          <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
