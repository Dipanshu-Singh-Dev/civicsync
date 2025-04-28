import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext, Controller } from "react-hook-form";

export function FileInput({ number }) {
  const { control } = useFormContext();
  const name = `picture${number}`;
  console.log(name);
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={name}>Picture {number}</Label>
          <Input
            id={name}
            type="file"
            accept="image/*"
            name={field.name}
            ref={field.ref}
            onChange={(e) => field.onChange(e.target.files)}
          />
        </div>
      )}
    />
  );
}
