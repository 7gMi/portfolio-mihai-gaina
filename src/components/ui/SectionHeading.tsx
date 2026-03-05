interface SectionHeadingProps {
  title: string;
  description?: string;
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-text-secondary">{description}</p>
      )}
    </div>
  );
}
