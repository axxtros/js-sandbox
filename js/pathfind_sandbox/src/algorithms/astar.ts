class AStar {
  
  private draw: Draw;
  private mapControl: MapControl;
  private map: MapTile[][];

  constructor(draw: Draw, mapControl: MapControl) {
    this.draw = draw;
    this.mapControl = mapControl;
    this.map = mapControl.getMapMatrix();

    mapControl.printMapToConsle();
  }

  start(): void {
    console.log('astar is ready to run...');
  }

  //getters/setters -----------------------------------------------------------

}