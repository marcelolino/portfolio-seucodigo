interface RemixIconProps {
  name: string;
  className?: string;
}

export function RemixIcon({ name, className = "" }: RemixIconProps) {
  // Verifica se o nome já contém 'ri-' e adiciona se necessário
  const iconName = name.startsWith('ri-') ? name : `ri-${name}`;
  
  return (
    <i className={`${iconName} ${className}`}></i>
  );
}
