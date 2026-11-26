
async function initMap() {
  if (!document.getElementById("map")) return;
    // 郡山駅の座標
    const centerLatLng = {
        lat: 37.3980,
        lng: 140.3881
    };

    // 地図の読み込み
    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 13,
            center: centerLatLng
        }
    );

    // 店舗情報をAPIから取得
    try {
        const response = await fetch(
            "https://localhost:7028/api/Shops"
        );

        if (!response.ok) {
            throw new Error("店舗情報の取得に失敗しました");
        }

        const shops = await response.json();

        // 店舗ごとにマーカーを設置
        shops.forEach(shop => {
            const marker = new google.maps.Marker({
                position: {
                    lat: Number(shop.lat),
                    lng: Number(shop.lng)
                },
                map: map,
                title: shop.name
            });

            // マーカーをクリックしたときの表示
            const infoWindow = new google.maps.InfoWindow({
                content: `<div><strong>${shop.name}</strong></div>`
            });

            marker.addListener("click", () => {
                infoWindow.open({
                    anchor: marker,
                    map: map
                });
            });
        });

        console.log("店舗情報を取得しました", shops);

    } catch (error) {
        console.error("API接続エラー:", error);
    }
}


