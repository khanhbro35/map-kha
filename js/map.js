/// <reference path="./data.js" />
/// <reference path="./jquery.min.js" />

const constValue = {
    guidEmpty: '00000000-0000-0000-0000-000000000000',
    name_QuocGia: {
        ul_name: 'ul-quocgia',
        btn_name: 'ul-btn-quocgia'
    },
    name_TinhThanh: {
        ul_name: 'ul-tinhthanh',
        btn_name: 'ul-btn-tinhthanh'
    },
    name_Tram: {
        ul_name: 'ul-tram',
        btn_name: 'ul-btn-tram'
    }
}

const dataLatLngNM = data_geo.features.reduce(function (pre, cur) {
    if(!pre.some(obj => obj.latnm == cur.properties.latnm && obj.lngnm == cur.properties.lngnm)) {
        pre.push({
            latnm: cur.properties.latnm,
            lngnm: cur.properties.lngnm
        });
    }
    return pre;
}, []).map(function (item) {
    return {
        type: 'Feature',
        properties: {
            latnm: item.lngnm,
            lngnm: item.latnm
        },
        geometry: {
            type: 'Point',
            coordinates: [item.lngnm, item.latnm]
        }
    }
});

const data_QuocGia = data_geo.quocgia_arr;
const data_TinhThanh = data_geo.tinhthanh_arr;
const data_tram = data_geo.tram_arr;
const features_unique = data_geo.features.reduce(function (pre, cur) {
    if(!pre.some(feature => feature.properties.thuadat.idthuadat == cur.properties.thuadat.idthuadat) && cur.geometry.coordinates.length > 0) pre.push(cur);
    return pre;
}, []);

var html = new function () {
    this.genHtmlPopup = function(thuadatobject) {
        return `
            <div class="card">
                <div class="card_content">
                    <h2 class="card_title">${thuadatobject.mathua}</h2>
                    <div class="card_text">
                        <p>
                            Nhóm đất: ${thuadatobject.nhomdat.name} </br>
                            Tổng diện tích: ${thuadatobject.tongdientichthuadat} </br>
                            Lat: ${thuadatobject.lat} </br>
                            Long: ${thuadatobject.lng} </br>
                            Quốc gia: ${thuadatobject.quocgia.name} </br>
                            Tỉnh thành: ${thuadatobject.tinhthanh.name}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    this.genHtmlModal = function (thuadat, chitietmia) {
        return `
                <div role="document" class="modal-dialog">
                    <div class="modal-content">
                    <div
                        class="modal-header row d-flex justify-content-between mx-1 mx-sm-3 mb-0 pb-0 border-0"
                    >
                        <div class="tabs active" id="tab01">
                        <h6 class="font-weight-bold">Thửa đất</h6>
                        </div>
                        <div class="tabs" id="tab02">
                        <h6 class="text-muted">Thông tin hợp đồng</h6>
                        </div>
                        <div class="tabs" id="tab03">
                        <h6 class="text-muted">Thu hoạch</h6>
                        </div>
                        <!-- <div class="tabs" id="tab04">
                        <h6 class="text-muted">Education</h6>
                        </div> -->
                    </div>
                    <div class="line"></div>
                    <div class="modal-body p-0">
                        <fieldset class="show" id="tab011">
                            <div class="bg-light">
                                <h5 class="text-center mb-4 mt-0 pt-4">Thông tin thửa đất</h5>
                                <div class="card" id="parcel">
                                    <h6 class="px-3">Mã thửa đất: ${thuadat.mathua}</h6>
                                    <p class="px-4">
                                        Tổng diện tích: ${thuadat.tongdientichthuadat} </br>
                                        Lat: ${thuadat.lat} </br>
                                        Long: ${thuadat.lng} </br>
                                    </p>
                                    <p class="px-4">
                                        Quốc gia: ${thuadat.quocgia.name} </br>
                                        Tỉnh thành: ${thuadat.tinhthanh.name} </br>
                                        Nguồn nước: ${thuadat.nguonnuoc} </br>
                                    </p>
                                    <p class='px-4'>
                                        Trạm: ${chitietmia.tram} </br>
                                        Cán bộ nv: ${chitietmia.canbonongvu} </br>
                                    </p>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset id="tab021">
                        <div class="bg-light">
                            <h5 class="text-center mb-4 mt-0 pt-4">Thông tin chi tiết mía</h5>
                            <div class="card" id="detail-sugarcane">
                                <h6 class="px-3">Khách hàng: ${chitietmia.khachhang}</h6>
                                <p class="px-4">
                                    Loại sở hữu: ${chitietmia.loaisohuu.name} </br>
                                    Tưới mía: ${chitietmia.tuoimia ? 'Có' : 'Không'} </br>
                                    Vụ trồng: ${chitietmia.vutrong.name} </br>
                                </p>
                                <p class="px-4">
                                    Loại gốc mía: ${chitietmia.loaigocmia.name} </br>
                                    Mục đích sản xuất: ${chitietmia.mucdichsansuatmia.name} </br>
                                    Tổng số ngày trồng: ${chitietmia.tongsongaytrong} </br>
                                </p>
                                <p class="px-4">
                                    Mía cháy: ${chitietmia.miachay ? 'Có' : 'Không'} </br>
                                    Diện tích còn lại: ${chitietmia.dientichconlai} </br>
                                    CCS: ${chitietmia.ccs} </br>
                                </p>
                                <p class="px-4">
                                    Năng suất thực tế: ${chitietmia.nangsuatthucte} </br>
                                    Năng suất đường: ${chitietmia.nangsuatduong} </br>
                                    Ngày thu hoạch dự kiến: ${chitietmia.ngaythuhoachdukien.slice(0, 10)} </br>
                                    Cự ly vận chuyển: ${chitietmia.culyvanchuyen}
                                </p>
                            </div>
                        </div>
                        </fieldset>
                        <fieldset id="tab031">
                        <div class="bg-light">
                            <h5 class="text-center mb-4 mt-0 pt-4">Thông tin thời tiết</h5>
                            <div class="card" id="weather">
                                <h6 class="px-3">Most Used Apps</h6>
                                <p class="px-4">hello</p>
                            </div>
                        </div>
                        </fieldset>
                        <!-- <fieldset id="tab041">
                        <div class="bg-light">
                            <h5 class="text-center mb-4 mt-0 pt-4">Education</h5>
                            <form>
                            <div class="form-group pb-2 px-3">
                                <input
                                type="text"
                                placeholder="Enter College Name"
                                class="form-control"
                                />
                            </div>
                            <div class="form-group row pb-2 px-3">
                                <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Percentage"
                                    class="form-control"
                                />
                                </div>
                                <div class="col-6">
                                <input
                                    type="text"
                                    placeholder="Grade"
                                    class="form-control"
                                />
                                </div>
                            </div>
                            <div class="form-group px-3 pb-2">
                                <label class="form-control-label">
                                <h6>What are you good at ?</h6>
                                </label>
                                <div class="custom-control custom-checkbox">
                                <input
                                    class="custom-control-input"
                                    id="option1"
                                    type="checkbox"
                                    value=""
                                />
                                <label class="custom-control-label" for="option1"
                                    >Web Development</label
                                >
                                </div>
                                <div class="custom-control custom-checkbox">
                                <input
                                    class="custom-control-input"
                                    id="option2"
                                    type="checkbox"
                                    value=""
                                />
                                <label class="custom-control-label" for="option2"
                                    >Data Structures & Algorithms</label
                                >
                                </div>
                                <div class="custom-control custom-checkbox">
                                <input
                                    class="custom-control-input"
                                    id="option3"
                                    type="checkbox"
                                    value=""
                                />
                                <label class="custom-control-label" for="option3"
                                    >Android Development</label
                                >
                                </div>
                                <div class="custom-control custom-checkbox">
                                <input
                                    class="custom-control-input"
                                    id="option4"
                                    type="checkbox"
                                    value=""
                                />
                                <label class="custom-control-label" for="option4"
                                    >Blockchain</label
                                >
                                </div>
                                <div class="custom-control custom-checkbox">
                                <input
                                    class="custom-control-input"
                                    id="option5"
                                    type="checkbox"
                                    value=""
                                />
                                <label class="custom-control-label" for="option5"
                                    >Machine Learning Algorithms</label
                                >
                                </div>
                            </div>
                            <div class="form-group pb-5 row justify-content-center">
                                <button type="button" class="btn btn-primary px-3">
                                Submit
                                </button>
                            </div>
                            </form>
                        </div>
                        <div class="px-3">
                            <h6 class="pt-3 pb-3 mb-4 border-bottom">
                            <span class="fa fa-rocket"></span> Trending Technologies
                            </h6>
                            <h6 class="text-primary pb-2">
                            <a href="#">Augmented Reality and Virtual Reality</a>
                            </h6>
                            <h6 class="text-primary pb-2">
                            <a href="#">Angular and React</a>
                            </h6>
                            <h6 class="text-primary pb-2">
                            <a href="#">Big Data and Hadoop</a>
                            </h6>
                            <h6 class="text-primary pb-4">
                            <a href="#">Internet of Things (IoT)</a>
                            </h6>
                        </div>
                        </fieldset> -->
                    </div>
                    <div class="line"></div>
                    <div class="modal-footer d-flex flex-column justify-content-center border-0">
                        <!-- <p class="text-muted">Can't find what you're looking for?</p> -->
                        <button type="button" class="btn btn-primary" id="routing">
                            Tìm đường về nhà máy
                        </button>
                    </div>
                    </div>
                </div>
        `
    }

    this.genHtmlLineTable = function ({chitietmia, thuadat}) {
        return `
            <tr>
                <td>${thuadat.mathua}</td>
                <td>${chitietmia.tram}</td>
                <td>${thuadat.tongdientichthuadat}</td>
            </tr>
        `.trim();
    }

    this.genHtmlOptionSelect = function (name_ul_attribute, name_btn_name, data, func) {
        let arr_element = data.map(function (item) {
            return `<li role="option" tabindex="-1" aria-selected="false" aria-id="${item.id}">${item.name}</li>`;
        });

        arr_element.unshift(`<li role="option" tabindex="-1" aria-selected="false" aria-id="${constValue.guidEmpty}">--</li>`);
        $(`.md-select ul[name=${name_ul_attribute}]`).empty();
        $(`.md-select ul[name=${name_ul_attribute}]`).append(arr_element.join(''));
        func($(`.md-select ul[name=${name_ul_attribute}] li`), $(`.md-select label[name=${name_btn_name}] button`));
    }
}

const action = new function () {

    this.initSelect = function () {
        $('.md-select').on('click', function () {
            $.map($('.md-select').not($(this)), function (value, index) {
                if($(value).hasClass('active')) $(value).removeClass('active')
            });
            $(this).toggleClass('active');
        });

        html.genHtmlOptionSelect(constValue.name_QuocGia.ul_name, constValue.name_QuocGia.btn_name, data_QuocGia, function (elementLi, elementBtn) {
            elementLi.on('click', function () {
                var v = 'Quốc gia';
                let tinhThanhObj = action.getObjectValueSelected(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name);
                if(tinhThanhObj != null) {
                    tinhThanhObj.elementLi.attr('aria-selected', 'false');
                    tinhThanhObj.elementBtn.text('Tỉnh thành');
                }
                let tramQbj = action.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);
                if(tramQbj != null) {
                    tramQbj.elementLi.attr('aria-selected', 'false');
                    tramQbj.elementBtn.text('Trạm');
                }
                var atrrId = $(this).attr('aria-id');
                if(atrrId !== constValue.guidEmpty) 
                {
                    v = $(this).text();
                    html.genHtmlOptionSelect(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name, data_TinhThanh.filter(th => th.quocgiaid == atrrId), function (elementLi, elementBtn) {
                        elementLi.on('click', function () {
                            var v = 'Tỉnh thành';
                            let tramQbj = action.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);
                            if(tramQbj != null) {
                                tramQbj.elementLi.attr('aria-selected', 'false');
                                tramQbj.elementBtn.text('Trạm');
                            }
                            var atrrId = $(this).attr('aria-id');
                            if(atrrId != constValue.guidEmpty) {
                                html.genHtmlOptionSelect(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name, data_tram.filter(_ => _.tinhthanhid == atrrId), function (elemenLi, elementBtn) {
                                    elemenLi.on('click', function (e) {
                                        var v = 'Trạm';
                                        var atrrId = $(this).attr('aria-id');
                                        if(atrrId !== constValue.guidEmpty) v = $(this).text();
                                        $(this).siblings().attr('aria-selected', 'false');
                                        $(this).attr('aria-selected', 'true');
                                        $('.md-select ul li').not($(this)).removeClass('active');
                                        $(this).addClass('active');
                                        elementBtn.text(v)
                                        action.buttonIsActive();
                                    })
                                });
                                v = $(this).text();
                            }
                            else {
                                html.genHtmlOptionSelect(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name, data_tram, function (elemenLi, elementBtn) {
                                    elemenLi.on('click', function (e) {
                                        var v = 'Trạm';
                                        var atrrId = $(this).attr('aria-id');
                                        if(atrrId !== constValue.guidEmpty) v = $(this).text();
                                        $(this).siblings().attr('aria-selected', 'false');
                                        $(this).attr('aria-selected', 'true');
                                        $('.md-select ul li').not($(this)).removeClass('active');
                                        $(this).addClass('active');
                                        elementBtn.text(v)
                                        action.buttonIsActive();
                                    })
                                });
                            }
                            $(this).siblings().attr('aria-selected', 'false');
                            $(this).attr('aria-selected', 'true');
                            $('.md-select ul li').not($(this)).removeClass('active');
                            $(this).addClass('active');
                            elementBtn.text(v)
                            action.buttonIsActive();
                        })
                    });
                }
                else {            
                    html.genHtmlOptionSelect(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name, data_TinhThanh, function (elementLi, elementBtn) {
                        elementLi.on('click', function () {
                            var v = 'Tỉnh thành';
                            let tramQbj = action.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);
                            if(tramQbj != null) {
                                tramQbj.elementLi.attr('aria-selected', 'false');
                                tramQbj.elementBtn.text('Trạm');
                            }
                            var atrrId = $(this).attr('aria-id');
                            if(atrrId !== constValue.guidEmpty) v = $(this).text();
                            $(this).siblings().attr('aria-selected', 'false');
                            $(this).attr('aria-selected', 'true');
                            $('.md-select ul li').not($(this)).removeClass('active');
                            $(this).addClass('active');
                            elementBtn.text(v)
                            action.buttonIsActive();
                        })
                    });
                }
                $(this).siblings().attr('aria-selected', 'false');
                $(this).attr('aria-selected', 'true');
                $('.md-select ul li').not($(this)).removeClass('active');
                $(this).addClass('active');
                elementBtn.text(v)
                action.buttonIsActive();
            })
        });

        html.genHtmlOptionSelect(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name, data_TinhThanh, function (elementLi, elementBtn) {
            elementLi.on('click', function () {
                var v = 'Tỉnh thành';
                let tramQbj = action.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);
                if(tramQbj != null) {
                    tramQbj.elementLi.attr('aria-selected', 'false');
                    tramQbj.elementBtn.text('Trạm');
                }
                var atrrId = $(this).attr('aria-id');
                if(atrrId != constValue.guidEmpty) {
                    html.genHtmlOptionSelect(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name, data_tram.filter(_ => _.tinhthanhid == atrrId), function (elemenLi, elementBtn) {
                        elemenLi.on('click', function (e) {
                            var v = 'Trạm';
                            var atrrId = $(this).attr('aria-id');
                            if(atrrId !== constValue.guidEmpty) v = $(this).text();
                            $(this).siblings().attr('aria-selected', 'false');
                            $(this).attr('aria-selected', 'true');
                            $('.md-select ul li').not($(this)).removeClass('active');
                            $(this).addClass('active');
                            elementBtn.text(v)
                            action.buttonIsActive();
                        })
                    });
                    v = $(this).text();
                }
                else {
                    html.genHtmlOptionSelect(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name, data_tram, function (elemenLi, elementBtn) {
                        elemenLi.on('click', function (e) {
                            var v = 'Trạm';
                            var atrrId = $(this).attr('aria-id');
                            if(atrrId !== constValue.guidEmpty) v = $(this).text();
                            $(this).siblings().attr('aria-selected', 'false');
                            $(this).attr('aria-selected', 'true');
                            $('.md-select ul li').not($(this)).removeClass('active');
                            $(this).addClass('active');
                            elementBtn.text(v)
                            action.buttonIsActive();
                        })
                    });
                }
                $(this).attr('aria-selected', 'true');
                $('.md-select ul li').not($(this)).removeClass('active');
                $(this).addClass('active');
                elementBtn.text(v)
                action.buttonIsActive();
            })
        });

        html.genHtmlOptionSelect(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name, data_tram, function (elemenLi, elementBtn) {
            elemenLi.on('click', function (e) {
                var v = 'Trạm';
                var atrrId = $(this).attr('aria-id');
                if(atrrId !== constValue.guidEmpty) v = $(this).text();
                $(this).siblings().attr('aria-selected', 'false');
                $(this).attr('aria-selected', 'true');
                $('.md-select ul li').not($(this)).removeClass('active');
                $(this).addClass('active');
                elementBtn.text(v)
                action.buttonIsActive();
            })
        });
    }

    this.getObjectValueSelected = function (name_ul_attribute, name_btn_name) {
        let objValue = null;
        let elementLi = $(`ul[name=${name_ul_attribute}] li[aria-selected=true]`);
        let elementBtn = $(`label[name=${name_btn_name}] button`);
        const id = elementLi.attr('aria-id')
        if(elementLi.length > 0 && id !== constValue.guidEmpty) {
            objValue = {
                id: id,
                name: elementBtn.text(),
                elementLi,
                elementBtn
            }
        }
        return objValue;
    }

    this.buttonIsActive = function (objectQuocGia, objTinhThanh, objectTram) {
        // debugger;
        if(objectQuocGia == null || objectQuocGia == undefined) objectQuocGia = this.getObjectValueSelected(constValue.name_QuocGia.ul_name, constValue.name_QuocGia.btn_name);
        if(objTinhThanh == null || objTinhThanh == undefined) objTinhThanh = this.getObjectValueSelected(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name);
        if(objectTram == null || objectTram == undefined) objectTram = this.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);
        const elementBtnSearch = $('#btn-search');
        let isActive = true;
        if((objectQuocGia != null && objTinhThanh != null && objectTram != null) || (objectQuocGia && objTinhThanh)) elementBtnSearch.removeAttr('disabled');
        else {
            
            elementBtnSearch.attr('disabled', 'true');
            isActive = false;
        } 
        return isActive;
        
    }
}

const MapHelper = (function ($) {
    
    var _options = {
        center: [0, 0],
        zoom: 1
    }

    var _mapId = '';
    var _map = null;
    var _map_routing = null;
    var _baseMaps = {};
    var _geojsongroup = [];

    var init = function (mapId, options) {
        $.extend(_options, options);
        _mapId = mapId;
        // _map = mapId
        initMap();
    }

    var addgeoJson = function (data, options) {
        let geojson = L.geoJSON(data, options);
        let layers = geojson._layers;
        let layergroup = L.layerGroup(Object.keys(layers).map(key => layers[key]), {
            id: _geojsongroup.length + 1
        }).addTo(_map);
        _geojsongroup.push(layergroup); 
        return layergroup.options.id;
    }

    var initMap = function () {
        _map = L.map(_mapId, {
            center: _options.center,
            zoom: _options.zoom,
            crs: L.CRS.EPSG3857,
            attributionControl: true,
            contextmenu: true,
            contextmenuWidth: 140
        });

        _baseMaps["OSM"] = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">TTC Sugar</a>'
        }).addTo(_map);

        _map.fitBounds([
            [11.375031, 106.131363],
            [10.762622, 106.660172]
        ]);
    }

    var addListenEvent = function (eventname, action) {
        _map.on(eventname, action);
    }


    var addRouting = function (route) {
        if(_map_routing != null) {
            _map.removeControl(_map_routing);
        } 
        _map_routing = route;
        _map_routing.addTo(_map);
    }

    var initSearch = function (id) {
        let grouplayer = getGroupLayer(id);
        L.control.search({
            layer: grouplayer,
            initial: false,
            propertyName: 'thuadat',
            marker: false,
            moveToLocation: function(latlng, title, inputValue, map) {
                //map.fitBounds( latlng.layer.getBounds() );
                let latlngBound = latlng[inputValue];
                let coordiante = latlngBound.getSouthEast();
                coordiante.lat -= 100;
                coordiante.lng += 100;
                var zoom = map.getBoundsZoom(latlng.layer.getBounds());
                map.setView(coordiante, zoom - 1); // access the zoom
            },

            filterData: function (inputSearch, records) {
                // console.log(records);
                return records.filter(loc => loc.thuadat.mathua === inputSearch);
            },

            buildTip: function(text, val) {
                // console.log(val);
                return '<a href="#"><b>'+ text +'</b></a>';
            }
        }).on('search:locationfound', function (ev) {
            ev.layer.openPopup();
        }).addTo(_map);
    }

    var getMap = function () {
        return _map;
    }

    var getGroupLayer = id => _geojsongroup.filter(group => group.options.id === id).pop();

    return {
        init,
        addgeoJson,
        addListenEvent,
        addRouting,
        getGroupLayer,
        initSearch,
        getMap
    }

})(jQuery);

$(function () {
    MapHelper.init('map', {
        center: [11.375020, 106.131330],
        zoom: 14
    });
    
    MapHelper.addListenEvent('layeradd', function (ev) {
        let map = MapHelper.getMap();
        if(ev.layer._path != undefined) {
            if(ev.layer.feature != undefined || ev.layer.feature != null) {
                var path = ev.layer._path;
                path.dataset.toggle = 'modal';
                path.dataset.target = '#myModal';
            }
        }
    });

    MapHelper.addListenEvent('zoomend', function (ev) {
        const map = MapHelper.getMap();
        const zoom = MapHelper.getMap().getZoom();
        console.log(zoom)
        const tyle = zoom > 0 ? Math.round((zoom / 18) * 10) / 10 + .1 : Math.round((zoom / 18) * 10) / 10;
        let layerNhaMay = MapHelper.getGroupLayer(idgeojsonnhamay).getLayers();
        
        layerNhaMay.map(function (layer) {
            let icon = layer.getIcon();
            const [w, h] = [34, 44];
            let iconOverWrite = L.icon($.extend(icon.options, {iconSize: [w * tyle, h * tyle]}));
            layer.setIcon(iconOverWrite);
        })
    });
    
    const idgeojsonthuadat = MapHelper.addgeoJson(features_unique, {
        style: function (feature) {
            return {color: feature.properties.color};
        },
        onEachFeature: function(feature, layer) {
            let thuadat = feature.properties.thuadat;
            var popup = L.popup(
                L.latLng(thuadat.lat, thuadat.lng), 
                {
                    content: html.genHtmlPopup(thuadat),
                    autoClose: true
                }
            );
            layer.bindPopup(popup);
            layer.on('mouseover', function(ev){
                layer.openPopup();
            });
            layer.on('mouseout', function(ev) {
                if(layer.isPopupOpen()) layer.closePopup();
            });
    
            layer.on('click', function (ev) {
                var {thuadat, chitietmia} = layer.feature.properties;
                var {latnm, lngnm} = layer.feature.properties;
                // console.log(latnm, lngnm);
                let htmlModal = html.genHtmlModal(thuadat, chitietmia).trim();
                let htmlDomModal = $(htmlModal);
                htmlDomModal.children().find('button#routing').on('click',function (e) {
                    $('#myModal').removeClass('show');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
    
                    let route = L.Routing.control(
                        {
                            waypoints: [
                                L.latLng(thuadat.lat, thuadat.lng),
                                L.latLng(latnm, lngnm)
                            ],
    
                            createMarker: function (i, wp, nWps) {
                                return L.marker(wp.latLng, 
                                    {
                                        icon: L.icon(
                                            {
                                                iconUrl: './images/icon-3.png',
                                                iconSize: [34, 44],
                                                className: 'icon-color'
                                                // iconAnchor: [22, 94],
                                                // popupAnchor: [-3, -76],
                                                // shadowSize: [68, 95],
                                                // shadowAnchor: [22, 94]
                                            }
                                        ) 
                                    });
                            },
    
                            routeLine: function (route) {
                                var line = L.Routing.line(route, {
                                    styles: [{
                                        color: '#03a9f4',
                                        weight: 3
                                    }],
                                    addWaypoints: false,
                                    draggableWaypoints: false,
                                    autoRoute: true,
                                    routeWhileDragging: false,
                                });
                                return line;
                            },
                            show: false
                        }
                    )
                    MapHelper.addRouting(route);
                });
                $('#myModal').empty();
                $('#myModal').append(htmlDomModal);
                $(".tabs").on('click', function(){
                    $(".tabs").removeClass("active");
                    $(".tabs h6").removeClass("font-weight-bold");
                    $(".tabs h6").addClass("text-muted");
                    $(this).children("h6").removeClass("text-muted");
                    $(this).children("h6").addClass("font-weight-bold");
                    $(this).addClass("active");
                    current_fs = $(".active");
                    next_fs = $(this).attr('id');
                    next_fs = "#" + next_fs + "1";
                    $("fieldset").removeClass("show");
                    $(next_fs).addClass("show");
                    current_fs.animate({}, {
                        step: function() {
                            current_fs.css({
                            'display': 'none',
                            'position': 'relative'
                            });
                            next_fs.css({
                            'display': 'block'
                            });
                        }
                    });
                });
            });
        }
    });
    
    // MapHelper.getGroupLayer(idgeojsonthuadat).clearLayers();
    
    const idgeojsonnhamay = MapHelper.addgeoJson(dataLatLngNM, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: './images/icon-2.png',
                    iconSize: [30, 26]
                })
            })
        },
    
        onEachFeature: function (feature, layer) {
            var popup = L.popup(
                L.latLng(feature.properties.latnm, feature.properties.lngnm), 
                {
                    content: '<h4>Nhà máy đường ttc sugar</h4>',
                    autoClose: true
                }
            );
            layer.bindPopup(popup);
        }
    });

    MapHelper.initSearch(idgeojsonthuadat);
    
    action.initSelect();
    action.buttonIsActive();

    $('#btn-search').on('click', function (e) {
        const groupLayer = MapHelper.getGroupLayer(idgeojsonthuadat);
        const layers = groupLayer.getLayers();
        const objQuocGia = action.getObjectValueSelected(constValue.name_QuocGia.ul_name, constValue.name_QuocGia.btn_name);
        const objTinhThanh = action.getObjectValueSelected(constValue.name_TinhThanh.ul_name, constValue.name_TinhThanh.btn_name);
        const objTram = action.getObjectValueSelected(constValue.name_Tram.ul_name, constValue.name_Tram.btn_name);

        let result = [];

        if(objQuocGia != null) {
           if(result.length == 0) result = layers.filter(layer => layer.feature.properties.thuadat.quocgia.id == objQuocGia.id);
           else result = result.filter(layer => layer.feature.properties.thuadat.quocgia.id == objQuocGia.id);
        }

        if(objTinhThanh != null) {
            if(result.length == 0) result = layers.filter(layer => layer.feature.properties.thuadat.tinhthanh.id == objTinhThanh.id);
            else result = result.filter(layer => layer.feature.properties.thuadat.tinhthanh.id == objTinhThanh.id);
        }

        if(objTram != null) {
            if(result.length == 0) result = layers.filter(layer => layer.feature.properties.chitietmia.tram == objTram.name);
            else result = result.filter(layer => layer.feature.properties.chitietmia.tram == objTram.name);
        }

        if(result.length > 0) {
            let tongdientich = 0;
            let resultHtml = result.map(function (item) {
                tongdientich += item.feature.properties.thuadat.tongdientichthuadat;
                return html.genHtmlLineTable(item.feature.properties);
            });
            resultHtml.push(
                `
                    <tr>
                        <td>Tổng diện tích</td>
                        <td></td>
                        <td>${tongdientich}</td>
                    </tr>
                `
            )
            $('.container-table tbody').empty();
            $('.container-table tbody').append(resultHtml.join(''));
        }
    });

    console.log(MapHelper.getMap().getZoom());
});



