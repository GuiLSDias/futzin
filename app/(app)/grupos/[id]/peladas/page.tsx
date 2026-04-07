export default function GrupoPeladasPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Peladas do Grupo {params.id}</h1>
      {/* List of peladas for the group */}
    </div>
  );
}
