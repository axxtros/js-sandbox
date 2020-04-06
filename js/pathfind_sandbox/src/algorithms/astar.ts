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

  constructor(draw: Draw, mapControl: MapControl, isDiagonal: boolean) {
    this.draw = draw;
    this.mapControl = mapControl;    
    this.map = mapControl.getMapMatrix();
    this.isDiagonal = isDiagonal;
    this.openList = new Array();
    this.openList.push(mapControl.getStartTile());        //az open list-nek tartalmaznia kell a start tile-t
    this.closeList = new Array();
    this.run();
  }

  run(): void {
    console.log('astar is started ' + new Date().toLocaleString());

    

    console.log('astar is end ' + new Date().toLocaleString());
  }

  //getters/setters -----------------------------------------------------------

}