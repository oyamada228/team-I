function initMap() {
    // 東京駅の座標
    const myLatLng = { lat: 35.6811673, lng: 139.7670516 };

    // 地図の読み込み
    const map = new google.maps.Map(document.getElementById("map"), {

        zoom: 15,
        center: myLatLng,
    });


    // ピン（マーカー）を設置
    new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "Tokyo Station",
    });
}