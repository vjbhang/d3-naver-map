/* eslint-disable linebreak-style */
import * as d3 from 'd3';

var CustomOverlay = function (options) {
    // make a div that contain shape
    const div = document.createElement('div');
    // make deletebutton
    const deleteButton = document.createElement('div');
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', (e) => {
        this.onRemove();
    });

    const svg = d3.create('svg');
    svg.append('ellipse');
    div.appendChild(svg.node());
    div.appendChild(deleteButton);
    this._element = div;

    // current map ratio
    this._zoom = options.naverMap.getZoom();
    this._map = options.naverMap;

    this.setPosition(options.position);
    this.setMap(options.map || null);
};

CustomOverlay.prototype = new window.naver.maps.OverlayView();

CustomOverlay.prototype.constructor = CustomOverlay;

CustomOverlay.prototype.setPosition = function (position) {
    this._startPos = position.startPos;
    this._endPos = position.endPos;
    this.draw();
};

CustomOverlay.prototype.getPosition = function () {
    const start = {};
    start.x = Math.min(this._startPos.coord.x, this._endPos.coord.x);
    start.y = Math.max(this._startPos.coord.y, this._endPos.coord.y);
    return start;
};

CustomOverlay.prototype.onAdd = function () {
    var overlayLayer = this.getPanes().overlayLayer;

    overlayLayer.appendChild(this._element);
};

CustomOverlay.prototype.draw = function () {
    if (!this.getMap()) {
        return;
    }
    const projection = this.getProjection();
    const position = this.getPosition();
    const pixelPosition = projection.fromCoordToOffset(position);
    this._element.style.position = 'absolute';

    // place thd div where user click
    this._element.style.top = `${pixelPosition.y}px`;
    this._element.style.left = `${pixelPosition.x}px`;

    // set the ratio
    const ratio = this._map.getZoom() - this._zoom;

    // calculate the div width and height (Subtraction of two coordinates) with zoom ratio
    const width = Math.abs(this._endPos.offset.x - this._startPos.offset.x);
    const height = Math.abs(this._endPos.offset.y - this._startPos.offset.y);
    const widthRatio = width * (2 ** ratio);
    const heightRatio = height * (2 ** ratio);

    // match the div and svg size
    this._element.style.width = `${widthRatio}px`;
    this._element.style.height = `${heightRatio}px`;

    const svg = this._element.childNodes[0];
    svg.style.width = widthRatio;
    svg.style.height = heightRatio;

    // place the ellipse's center point and resize
    const ellipse = svg.childNodes[0];
    ellipse.style.cx = widthRatio / 2;
    ellipse.style.cy = heightRatio / 2;
    ellipse.style.rx = (width / 2) * (2 ** ratio);
    ellipse.style.ry = (height / 2) * (2 ** ratio);

};

CustomOverlay.prototype.onRemove = function () {
    this._element.parentNode.removeChild(this._element);
};

export default CustomOverlay;
