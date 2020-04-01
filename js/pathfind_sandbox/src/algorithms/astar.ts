class AStar {
  
  private draw: Draw;
  private mapControl: MapControl;
  private map: MapTile[][];

  constructor(draw: Draw, mapControl: MapControl) {
    this.draw = draw;
    this.mapControl = mapControl;
    this.map = mapControl.getMapMatrix();

    mapControl.printMapToConsole();
  }

  start(): void {
    console.log('astar is ready to run...2');
  }

  //getters/setters -----------------------------------------------------------

}