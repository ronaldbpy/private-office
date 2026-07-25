// Color identificador por empresa — determinístico (mismo entityId siempre
// da el mismo color, sin necesidad de mantener un mapeo manual que haya que
// actualizar cada vez que se crea una empresa nueva). Paleta acotada a tonos
// apagados/cálidos, coherentes con la dirección de MD-400 (nunca colores
// saturados tipo neón).
const PALETTE = [
  "#6B8E7F", // salvia
  "#C97B63", // terracota
  "#6E8FAE", // azul polvo
  "#B99A4C", // ocre
  "#A56B7A", // malva
  "#8C7AA6", // violeta apagado
  "#7FA0A0", // verde azulado
  "#B08968", // arcilla
  "#9B8C4A", // oliva
  "#A6785F", // óxido
  "#6B7FA0", // azul pizarra
  "#8FA65F", // musgo
];

export function entityColor(entityId: string): string {
  let hash = 0;
  for (let i = 0; i < entityId.length; i++) {
    hash = (hash * 31 + entityId.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
