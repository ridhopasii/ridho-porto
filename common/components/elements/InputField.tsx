import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface RadioInputProps<TFormValue extends FieldValues> {
  register: UseFormRegister<TFormValue>;
  name: Path<TFormValue>;
  error: FieldErrors;
  rule?: RegisterOptions<TFormValue, Path<TFormValue>>;
  isTextArea?: boolean;
  placeholder?: string;
  rows?: number;
}

const InputField = <TFormValue extends FieldValues>({
  name,
  rule,
  error,
  isTextArea = false,
  placeholder = "",
  rows = 2,
  register,
}: RadioInputProps<TFormValue>) => {
  const renderPlaceholder =
    placeholder || name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div className="w-full space-y-2">
      {isTextArea ? (
        <textarea
          rows={rows}
          placeholder={renderPlaceholder}
          {...register(name, rule)}
          className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-3 text-sm text-neutral-800 backdrop-blur-md transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-200 dark:focus:border-blue-500 dark:focus:bg-neutral-900"
        ></textarea>
      ) : (
        <input
          type="text"
          placeholder={renderPlaceholder}
          {...register(name, rule)}
          className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-3 text-sm text-neutral-800 backdrop-blur-md transition-all duration-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-200 dark:focus:border-blue-500 dark:focus:bg-neutral-900"
        />
      )}{" "}
      {error[name]?.type === "required" && (
        <p role="alert" className="text-[10px] text-red-400">
          *{name} is required
        </p>
      )}
      {error[name]?.type === "pattern" && (
        <p role="alert" className="text-[10px] text-red-400">
          *{String(error[name]?.message)}
        </p>
      )}
    </div>
  );
};

export default InputField;
