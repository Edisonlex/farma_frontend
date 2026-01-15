import { useForm, type UseFormProps, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ZodTypeAny } from "zod"

export function useZodForm<TFieldValues extends FieldValues>(schema: ZodTypeAny, options?: Omit<UseFormProps<TFieldValues>, "resolver">) {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    ...options,
  })
}
