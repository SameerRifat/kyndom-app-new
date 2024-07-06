const FormHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col gap-y-2 text-center">
      <h1 className="font-elmessiri text-4xl font-bold leading-9">{title}</h1>
      <h1 className="text-sm">{subtitle}</h1>
    </div>
  );
};

export default FormHeader;
