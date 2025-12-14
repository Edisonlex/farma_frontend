interface PaymentMethodBadgeProps {
  method: string;
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
      {method}
    </span>
  );
}
