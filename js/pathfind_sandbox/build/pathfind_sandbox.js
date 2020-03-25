"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var main;
var Main = (function () {
    function Main() {
        this.headerDiv = document.getElementById('header-wrapper-id');
        this.footerDiv = document.getElementById('footer-wrapper-id');
        this.canvasWrapper = document.getElementById('canvas-wrapper-div');
        this.init();
    }
    Main.prototype.init = function () {
        var tileNumberHorizontal = Math.floor((window.innerWidth - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE) - 2;
        var tileNumberVertical = Math.floor((window.innerHeight - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE) - 3;
        var canvasWrapperDivWidth = (tileNumberHorizontal * Constains.MAP_TILE_SIZE) + Constains.MAP_LEFT_COORD;
        var canvasWrapperDivHeight = (tileNumberVertical * Constains.MAP_TILE_SIZE) + Constains.MAP_TOP_COORD;
        this.headerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.footerDiv.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.canvasWrapper.setAttribute("style", "width: " + canvasWrapperDivWidth + "px");
        this.canvasWrapper.setAttribute("style", "height: " + canvasWrapperDivHeight + "px");
        this.canvas = document.getElementById('pathfind-sandbox-canvas-id');
        this.canvas.width = canvasWrapperDivWidth;
        this.canvas.height = canvasWrapperDivHeight;
        this.context = this.canvas.getContext('2d');
        this.context.scale(1, 1);
        var map = new MapControl(tileNumberHorizontal, tileNumberVertical);
        this.util = new Util(this.canvas, this.context, map);
        this.draw = new Draw(this.canvas, this.context, map, this.util);
    };
    Main.prototype.main = function () {
    };
    Main.prototype.updateWindow = function () {
    };
    return Main;
}());
window.onload = function () {
    main = new Main();
    main.main();
};
window.onresize = function () {
    main = new Main();
    main.main();
};
window.onscroll = function () {
    main.updateWindow();
};
var Util = (function () {
    function Util(canvas, context, map) {
        this.canvas = canvas;
        this.context = context;
        this.map = map;
        this.rect = canvas.getBoundingClientRect();
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollOffsetX = 0;
        this.scrollOffsetY = 0;
        this.updateScrollOffsets(this.scrollOffsetX, this.scrollOffsetY);
    }
    Util.getRandomNumber = function (min, max) {
        return Math.floor(Math.random() * max) + min;
    };
    Util.prototype.setMouseCanvasPos = function (event) {
        this.mouseX = (event.clientX - this.rect.left) + this.scrollOffsetX;
        this.mouseY = (event.clientY - this.rect.top) + this.scrollOffsetY;
    };
    Util.prototype.getCurrentSelectedTile = function () {
        var tileX = Math.floor((this.mouseX - Constains.MAP_LEFT_COORD) / Constains.MAP_TILE_SIZE);
        var tileY = Math.floor((this.mouseY - Constains.MAP_TOP_COORD) / Constains.MAP_TILE_SIZE);
        tileX < 0 ? tileX = 0 : tileX = tileX;
        tileY < 0 ? tileY = 0 : tileY = tileY;
        return this.map.getMapTile(tileX, tileY);
    };
    Util.prototype.updateScrollOffsets = function (scrollOffsetX, scrollOffsetY) {
        this.scrollOffsetX = scrollOffsetX;
        this.scrollOffsetY = scrollOffsetY;
    };
    return Util;
}());
var Draw = (function () {
    function Draw(canvas, context, mapControl, util) {
        this.canvas = canvas;
        this.context = context;
        this.mapControl = mapControl;
        this.util = util;
        this.lastSelectedTile = mapControl.getDummyMapTile();
        this.currentSelectedTile = mapControl.getDummyMapTile();
        this.isMousePressed = false;
        this.isMoveStartTile = false;
        this.isMoveEndTile = false;
        this.hiddenStartTileType = TILE_TYPE.EMPTY;
        this.hiddenEndTileType = TILE_TYPE.EMPTY;
        this.clearMap();
        this.drawMap();
    }
    Draw.prototype.clearMap = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = Constains.MAP_BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Draw.prototype.drawMap = function () {
        this.drawMapSymbols();
        this.drawGridMap();
    };
    Draw.prototype.drawMapSymbols = function () {
        var x = Constains.MAP_LEFT_COORD + (Constains.MAP_TILE_SIZE / 2), y = Constains.MAP_TOP_COORD - Constains.MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS;
        for (var i = 0; i != this.mapControl.getWidth(); i++) {
            this.drawMapSymbol(x, y, (i + 1) + '');
            x += Constains.MAP_TILE_SIZE;
        }
        x = Constains.MAP_LEFT_COORD - Constains.MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS,
            y = Constains.MAP_TOP_COORD + (Constains.MAP_TILE_SIZE / 2) + 4;
        for (var i = 0; i != this.mapControl.getHeight(); i++) {
            this.drawMapSymbol(x, y, (i + 1) + '');
            y += Constains.MAP_TILE_SIZE;
        }
    };
    Draw.prototype.drawGridMap = function () {
        for (var mapCoordW = 0; mapCoordW != this.mapControl.getWidth(); mapCoordW++) {
            for (var mapCoordH = 0; mapCoordH != this.mapControl.getHeight(); mapCoordH++) {
                var mapTile = this.mapControl.getMapMatrix()[mapCoordW][mapCoordH];
                this.drawMapTile(mapTile);
            }
        }
    };
    Draw.prototype.mouseButtonDownEvent = function () {
        if (this.currentSelectedTile != null) {
            if (this.currentSelectedTile.getType() == TILE_TYPE.START) {
                this.isMoveStartTile = true;
            }
            if (this.currentSelectedTile.getType() == TILE_TYPE.END) {
                this.isMoveEndTile = true;
            }
            this.isMousePressed = true;
            this.clickCanvasEvent();
        }
    };
    Draw.prototype.mouseButtonUpEvent = function () {
        if (this.currentSelectedTile != null) {
            this.isMousePressed = false;
            this.isMoveStartTile = false;
            this.isMoveEndTile = false;
            this.clickCanvasEvent();
        }
    };
    Draw.prototype.mouseMoveEvent = function () {
        this.currentSelectedTile = this.getCurrentSelectedTile();
        if (this.isSwitchTile()) {
            if (this.isMousePressed) {
                this.clickCanvasEvent();
            }
            else {
                this.drawMapTile(this.lastSelectedTile);
                this.drawCursorMapTile(this.currentSelectedTile.getDrawCoord().getX(), this.currentSelectedTile.getDrawCoord().getY());
            }
            this.lastSelectedTile = this.currentSelectedTile;
        }
    };
    Draw.prototype.clickCanvasEvent = function () {
        if (this.currentSelectedTile != null) {
            if (this.isMoveStartTile && this.currentSelectedTile.getType() != TILE_TYPE.END) {
                var hiddenTile = this.mapControl.getStartTile();
                this.changeTileTypeAndDraw(hiddenTile, this.hiddenStartTileType);
                this.hiddenStartTileType = this.currentSelectedTile.getType();
                this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.START);
                this.mapControl.setStartTile(this.currentSelectedTile);
            }
            else if (this.isMoveEndTile && this.currentSelectedTile.getType() != TILE_TYPE.START) {
                var hiddenTile = this.mapControl.getEndTile();
                this.changeTileTypeAndDraw(hiddenTile, this.hiddenEndTileType);
                this.hiddenEndTileType = this.currentSelectedTile.getType();
                this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.END);
                this.mapControl.setEndTile(this.currentSelectedTile);
            }
            else {
                switch (this.currentSelectedTile.getType()) {
                    case TILE_TYPE.EMPTY:
                        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.WALL);
                        break;
                    case TILE_TYPE.WALL:
                        this.changeTileTypeAndDraw(this.currentSelectedTile, TILE_TYPE.EMPTY);
                        break;
                }
            }
        }
    };
    Draw.prototype.changeTileTypeAndDraw = function (tile, newType) {
        this.mapControl.changeTileType(tile, newType);
        this.drawMapTile(tile);
    };
    Draw.prototype.drawMapTile = function (mapTile) {
        switch (mapTile.getType()) {
            case TILE_TYPE.EMPTY:
                this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.WALL:
                this.drawWallMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.START:
                this.drawStartMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            case TILE_TYPE.END:
                this.drawEndMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
            default:
                this.drawEmptyMapTile(mapTile.getDrawCoord().getX(), mapTile.getDrawCoord().getY());
                break;
        }
    };
    Draw.prototype.drawEmptyMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_EMPTY_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawStartMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_START_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawEndMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_END_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawWallMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_WALL_TILE_BACKGROUND_COLOR, Constains.MAP_TILE_BORDER_COLOR, 1);
    };
    Draw.prototype.drawCursorMapTile = function (x, y) {
        this.drawBorderSquare(x, y, Constains.MAP_TILE_SIZE, Constains.MAP_TILE_CURSOR_BACKGROUND_COLOR, Constains.MAP_TILE_CURSOR_BORDER_COLOR, 1);
    };
    Draw.prototype.drawBorderSquare = function (x, y, size, fillColor, borderColor, borderTickness) {
        this.drawBorderRectangle(x, y, size, size, fillColor, borderColor, borderTickness);
    };
    Draw.prototype.drawBorderRectangle = function (x, y, width, height, fillColor, borderColor, borderTickness) {
        this.context.fillStyle = borderColor;
        this.context.fillRect(x, y, width, height);
        this.drawFillRectangle(x + borderTickness, y + borderTickness, width - (2 * borderTickness), height - (2 * borderTickness), fillColor);
    };
    Draw.prototype.drawFillSquare = function (x, y, size, color) {
        this.drawFillRectangle(x, y, size, size, color);
    };
    Draw.prototype.drawFillRectangle = function (x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    };
    Draw.prototype.drawMapSymbol = function (x, y, text) {
        this.drawText(x, y, text, Constains.MAP_SYMBOL_FONT_SIZE, Constains.MAP_SYMBOL_FONT, Constains.MAP_SYMBOL_FONT_COLOR);
    };
    Draw.prototype.drawText = function (x, y, text, fontSize, font, color) {
        this.context.font = fontSize + ' ' + font;
        this.context.fillStyle = color;
        this.context.textAlign = "center";
        this.context.fillText(text, x, y);
    };
    Draw.prototype.isSwitchTile = function () {
        return this.currentSelectedTile.getMapCoord().getX() != this.lastSelectedTile.getMapCoord().getX() || this.currentSelectedTile.getMapCoord().getY() != this.lastSelectedTile.getMapCoord().getY();
    };
    Draw.prototype.getCurrentSelectedTile = function () {
        return this.util.getCurrentSelectedTile();
    };
    return Draw;
}());
var MapControl = (function () {
    function MapControl(width, height) {
        this.width = width;
        this.height = height;
        this.mapMatrix = [];
        this.initMap();
        this.startTile = this.getSearchedTileByType(TILE_TYPE.START);
        this.endTile = this.getSearchedTileByType(TILE_TYPE.END);
    }
    MapControl.prototype.initMap = function () {
        var drawCoordX = Constains.MAP_LEFT_COORD, drawCoordY = Constains.MAP_TOP_COORD;
        for (var mapCoordW = 0; mapCoordW != this.width; mapCoordW++) {
            this.mapMatrix[mapCoordW] = [];
            for (var mapCoordH = 0; mapCoordH != this.height; mapCoordH++) {
                var mapTile = new MapTile(new Coord(mapCoordW, mapCoordH), new Coord(drawCoordY, drawCoordX), TILE_TYPE.EMPTY);
                this.mapMatrix[mapCoordW][mapCoordH] = mapTile;
                drawCoordX += Constains.MAP_TILE_SIZE;
            }
            drawCoordX = Constains.MAP_LEFT_COORD;
            drawCoordY += Constains.MAP_TILE_SIZE;
        }
        this.initStartAndEndTiles();
    };
    MapControl.prototype.initStartAndEndTiles = function () {
        var startTileCoord = new Coord((Math.floor(this.width / 2) - Math.floor(this.width / 8)), Math.floor(this.height / 2));
        this.mapMatrix[startTileCoord.getX()][startTileCoord.getY()].setType(TILE_TYPE.START);
        var endTileCoord = new Coord((Math.floor(this.width / 2) + Math.floor(this.width / 8)), Math.floor(this.height / 2));
        this.mapMatrix[endTileCoord.getX()][endTileCoord.getY()].setType(TILE_TYPE.END);
    };
    MapControl.prototype.getStartTile = function () {
        return this.startTile;
    };
    MapControl.prototype.setStartTile = function (newTile) {
        this.startTile = newTile;
    };
    MapControl.prototype.getEndTile = function () {
        return this.endTile;
    };
    MapControl.prototype.setEndTile = function (newTile) {
        this.endTile = newTile;
    };
    MapControl.prototype.getSearchedStartTile = function () {
        return this.getSearchedTileByType(TILE_TYPE.START);
    };
    MapControl.prototype.getSearchedEndTile = function () {
        return this.getSearchedTileByType(TILE_TYPE.END);
    };
    MapControl.prototype.getSearchedTileByType = function (tileType) {
        if (this.mapMatrix != null) {
            for (var mapCoordW = 0; mapCoordW != this.getWidth(); mapCoordW++) {
                for (var mapCoordH = 0; mapCoordH != this.getHeight(); mapCoordH++) {
                    var mapTile = this.getMapMatrix()[mapCoordW][mapCoordH];
                    if (mapTile.getType() == tileType) {
                        return mapTile;
                    }
                }
            }
        }
        return this.getDummyMapTile();
    };
    MapControl.prototype.getWidth = function () {
        return this.width;
    };
    MapControl.prototype.getHeight = function () {
        return this.height;
    };
    MapControl.prototype.getMapMatrix = function () {
        return this.mapMatrix;
    };
    MapControl.prototype.changeTileType = function (selectedTile, tileType) {
        if (selectedTile != null) {
            this.getMapTile(selectedTile.getMapCoord().getX(), selectedTile.getMapCoord().getY()).setType(tileType);
        }
    };
    MapControl.prototype.getMapTile = function (mapCoordW, mapCoordH) {
        return this.getMapMatrix()[mapCoordW][mapCoordH];
    };
    MapControl.prototype.getDummyMapTile = function () {
        return new MapTile(new Coord(-1, -1), new Coord(-100, -100), TILE_TYPE.EMPTY);
    };
    return MapControl;
}());
var TILE_TYPE;
(function (TILE_TYPE) {
    TILE_TYPE[TILE_TYPE["EMPTY"] = 0] = "EMPTY";
    TILE_TYPE[TILE_TYPE["WALL"] = 1] = "WALL";
    TILE_TYPE[TILE_TYPE["START"] = 2] = "START";
    TILE_TYPE[TILE_TYPE["END"] = 3] = "END";
    TILE_TYPE[TILE_TYPE["CURSOR"] = 4] = "CURSOR";
})(TILE_TYPE || (TILE_TYPE = {}));
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    Coord.prototype.getX = function () {
        return this.x;
    };
    Coord.prototype.getY = function () {
        return this.y;
    };
    return Coord;
}());
var MapTile = (function () {
    function MapTile(mapCoord, drawCoord, type) {
        this.mapCoord = mapCoord;
        this.drawCoord = drawCoord;
        this.type = type;
    }
    MapTile.prototype.getMapCoord = function () {
        return this.mapCoord;
    };
    MapTile.prototype.setMapCoord = function (mapCoord) {
        this.mapCoord = mapCoord;
    };
    MapTile.prototype.getDrawCoord = function () {
        return this.drawCoord;
    };
    MapTile.prototype.setDrawCoord = function (drawCoord) {
        this.drawCoord = drawCoord;
    };
    MapTile.prototype.getType = function () {
        return this.type;
    };
    MapTile.prototype.setType = function (type) {
        this.type = type;
    };
    MapTile.prototype.toString = function () {
        console.log('mapX: ' + this.getMapCoord().getX() + '  mapY: ' + this.getMapCoord().getY() + '  type: ' + TILE_TYPE[this.getType()]);
    };
    return MapTile;
}());
var SpecTile = (function (_super) {
    __extends(SpecTile, _super);
    function SpecTile(mapCoord, drawCoord, type, hiddenTile) {
        var _this = _super.call(this, mapCoord, drawCoord, type) || this;
        _this.hiddenTile = hiddenTile;
        return _this;
    }
    SpecTile.prototype.getHiddenTile = function () {
        return this.hiddenTile;
    };
    SpecTile.prototype.setHiddenTile = function (tile) {
        this.hiddenTile = tile;
    };
    SpecTile.prototype.toString = function () {
        var tileString = _super.prototype.toString.call(this);
        console.log(tileString + ' hiddenTile: ' + this.hiddenTile.toString());
    };
    return SpecTile;
}(MapTile));
var Constains = (function () {
    function Constains() {
    }
    Constains.MAP_HORIZONTAL_MINIMUM_TILE_NUMBER = 10;
    Constains.MAP_VERTICAL_MINIMUM_TILE_NUMBER = 10;
    Constains.MAP_HORIZONTAL_MAXIMUM_TILE_NUMBER = 300;
    Constains.MAP_VERTICAL_MAXIMUM_TILE_NUMBER = 300;
    Constains.MAP_HORIZONTAL_TILE_NUMBER = 60;
    Constains.MAP_VERTICAL_TILE_NUMBER = 28;
    Constains.MAP_TILE_SIZE = 26;
    Constains.MAP_TOP_COORD = 30;
    Constains.MAP_LEFT_COORD = 30;
    Constains.MAP_BACKGROUND_COLOR = '#fff';
    Constains.MAP_EMPTY_TILE_BACKGROUND_COLOR = '#fff7ed';
    Constains.MAP_START_TILE_BACKGROUND_COLOR = '#ff6568';
    Constains.MAP_END_TILE_BACKGROUND_COLOR = '#58f770';
    Constains.MAP_WALL_TILE_BACKGROUND_COLOR = '#c7d6f5';
    Constains.MAP_TILE_BORDER_COLOR = '#989898';
    Constains.MAP_TILE_CURSOR_BACKGROUND_COLOR = '#e4ded7';
    Constains.MAP_TILE_CURSOR_BORDER_COLOR = 'orange';
    Constains.MAP_SYMBOL_FONT = 'Consolas, monaco, monospace';
    Constains.MAP_SYMBOL_FONT_SIZE = (Constains.MAP_TILE_SIZE / 2.5) + 'px';
    Constains.MAP_SYMBOL_FONT_COLOR = '#989898';
    Constains.MAP_SYMBOL_HORIZONTAL_DISTANCE_FROM_GRIDS = 5;
    Constains.MAP_SYMBOL_VERTICAL_DISTANCE_FROM_GRIDS = 15;
    return Constains;
}());