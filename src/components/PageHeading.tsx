type Props = {
  heading: string;
  description: string;
};

/**
 * The page title and the line under it. Plain text, not a visual card.
 */
export function PageHeading({ heading, description }: Props) {
  return (
    <div data-id="page-heading" className="px-2">
      <h1 className="text-2xl font-bold leading-8">{heading}</h1>
      <p className="text-base font-normal leading-6">{description}</p>
    </div>
  );
}
