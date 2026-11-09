function initMap() {
    // 郡山駅の座標
    const nnnmyLatLng = { lat: 37.3980, lng: 140.3881 };

    // 地図の読み込み
    const nnnmap = new google.maps.Map(document.getElementById("map"), {

        zoom: 15,
        center: nnnmyLatLng,
    });


    // ピン（マーカー）を設置
    new google.maps.Marker({
        position: nnnmyLatLng,
        map: nnnmap,
        title: "Tokyo Station",
    });
}