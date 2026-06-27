interface Props {

  title: string;

  value: string | number;

  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  subtitle
}: Props) {

  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow
      p-6"
    >

      <h3
        className="
        text-gray-500"
      >
        {title}
      </h3>

      <p
        className="
        text-3xl
        font-bold"
      >
        {value}
      </p>
{subtitle && (
  <p className="text-sm text-gray-400 mt-2">
    {subtitle}
  </p>
)}
    </div>
    
  );
}