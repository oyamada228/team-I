function initMap() {
    // 郡山駅の座標
    const myLatLng = { lat: 37.3980, lng: 140.3881 };

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