import { cn } from "@/lib/utils";

export interface ITextFieldProps {
  label?: string;
  value?: string;
  className?: string;
  readOnly?: boolean;
}

const TextField = ({
  label,
  value,
  className,
  readOnly = true,
}: ITextFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {label && <h3 className="text-neutral-700 text-xs">{label}</h3>}
      <input
        value={value ?? ""}
        readOnly={readOnly}
        className="text-neutral-950 font-normal text-sm bg-transparent outline-none"
      />
    </div>
  );
};

export default TextField;
