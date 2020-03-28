enum TILE_TYPE {
  EMPTY = 0,
  WALL = 1,
  START = 2,
  END = 3,
  CURSOR = 4
}

class Coord {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}

class MapTile {

  private mapCoord: Coord;
  private drawCoord: Coord;
  private type: TILE_TYPE;

  constructor(mapCoord: Coord, drawCoord: Coord, type: TILE_TYPE) {
    this.mapCoord = mapCoord;
    this.drawCoord = drawCoord;
    this.type = type;
  }

  getMapCoord(): Coord {
    return this.mapCoord;
  }

  setMapCoord(mapCoord: Coord): void {
    this.mapCoord = mapCoord;
  }

  getDrawCoord(): Coord {
    return this.drawCoord;
  }

  setDrawCoord(drawCoord: Coord): void {
    this.drawCoord = drawCoord;
  }

  getType(): TILE_TYPE {
    return this.type;
  }

  setType(type: TILE_TYPE): void {
    this.type = type;
  }

  toString(): void {    
    console.log('mapX: ' + this.getMapCoord().getX() + '  mapY: ' + this.getMapCoord().getY() + '  type: ' + TILE_TYPE[this.getType()]);
  }

  toStringLight(): string {
    let typeTinyName: string = TILE_TYPE[this.getType()];
    typeTinyName = typeTinyName.substring(0, 1);
    return 'mX:' + this.getMapCoord().getX() + '  mY:' + this.getMapCoord().getY() + ' tp:' + typeTinyName;
  }

}

class SpecTile extends MapTile {

  private hiddenTile: MapTile;

  constructor(mapCoord: Coord, drawCoord: Coord, type: TILE_TYPE, hiddenTile: MapTile) {
    super(mapCoord, drawCoord, type);
    this.hiddenTile = hiddenTile;
  }

  getHiddenTile(): MapTile {
    return this.hiddenTile;
  }

  setHiddenTile(tile: MapTile): void {
    this.hiddenTile = tile;
  }

  toString(): void {
    let tileString = super.toString();
    console.log(tileString + ' hiddenTile: ' + this.hiddenTile.toString());
  }

}