/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import * as d3 from 'd3';
import Toolbox from './Toolbox';
import CustomOverlay from './CustomOverlay';
import './App.css';

class App extends Component {
    state = {
        map: undefined
    }

    componentDidMount() {
        const naver = window.naver;
        const mapOptions = {
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT
            },
            logoControl: true,
            logoControlOptions: {
                position: naver.maps.Position.BOTTOM_RIGHT
            },
            scaleControl: true,
            scaleControlOptions: {
                position: naver.maps.Position.BOTTOM_RIGHT
            },
            mapDataControl: true,
            mapDataControlOptions: {
                position: naver.maps.Position.BOTTOM_LEFT
            }
        };
        const map = new naver.maps.Map(d3.select('#map').node(), mapOptions);
        this.setState({ map });

        naver.maps.Event.addListener(map, 'click', function (e) { // 클릭한 위치에 오버레이를 추가합니다.
            console.log('click');
            new CustomOverlay({
                position: e.coord,
                mm: map
            }).setMap(map);
        });
    }

    render() {
        const { map } = this.state;
        return (
            <div id="wrapper">
                <div id="map" style={{ height: '100vh' }}></div>
                <Toolbox map={map}></Toolbox>
            </div>
        );
    }
}

export default App;
