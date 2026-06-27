interface Props {
  title: string;
}

export default function EmptyState({
  title
}: Props) {

  return (

    <div
      className="
      bg-white
      rounded-xl
      p-8
      text-center"
    >

      <h3 className="text-lg font-semibold">
        Nenhum registro encontrado
      </h3>

      <p className="text-gray-500">
        {title}
      </p>

    </div>
  );
}