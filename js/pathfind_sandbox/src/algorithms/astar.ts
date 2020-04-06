//tutorials:
//https://www.geeksforgeeks.org/a-search-algorithm/
//https://www.redblobgames.com/pathfinding/a-star/introduction.html
//http://theory.stanford.edu/~amitp/GameProgramming/

//videos:
//https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ

class AStar {
  
  private draw: Draw;
  private mapControl: MapControl;  
  private map: MapTile[][];
  private openList: MapTile[];
  private closeList: MapTile[];
  private isDiagonal: boolean;
  private cost: number;
  private diagonalCost: number;

  constructor(draw: Draw, mapControl: MapControl, isDiagonal: boolean, cost: number, diagonalCost: number) {
    this.draw = draw;
    this.mapControl = mapControl;    
    this.map = mapControl.getMapMatrix();
    this.isDiagonal = isDiagonal;
    this.cost = cost;
    this.diagonalCost = diagonalCost;
    this.openList = new Array();
    this.openList.push(mapControl.getStartTile());        //az open list-nek tartalmaznia kell a start tile-t
    this.closeList = new Array();
    this.run();
  }

  run(): void {
    //console.log('astar is started ' + new Date().toLocaleString());

    this.mapControl.getStartTile().toString();
    let neighborsTiles = this.mapControl.getNeighbourTiles(this.mapControl.getStartTile(), this.isDiagonal, this.cost, this.diagonalCost);
    

    this.toConsoleTileArray(neighborsTiles);

    //console.log('astar is end ' + new Date().toLocaleString());
  }

  //getters/setters -----------------------------------------------------------
  toConsoleTileArray(tileArray: MapTile[]): void {
    for(let i = 0; i != tileArray.length; i++) {
      let tile = tileArray[i];
      console.log('id: ' + tile.getId() + ' mX: ' + tile.getMapCoord().getX() + ' mY: ' + tile.getMapCoord().getY() + ' type: ' + TILE_TYPE[tile.getType()] + ' g: ' + tile.getG() + ' h: ' + tile.getH() + ' f: ' + tile.getF());
    }
  }

}