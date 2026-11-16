
async function initMap() {

    // =====================================
    // 1. 郡山駅の初期位置
    // =====================================

    const defaultLatLng = {
        lat: 37.3980,
        lng: 140.3881
    };

    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 13,
            center: defaultLatLng
        }
    );


    // =====================================
    // 2. 地域情報を取得
    // =====================================

    try {

        const areaResponse = await fetch(
            "https://localhost:7028/api/Areas"
        );

        if (!areaResponse.ok) {
            throw new Error("地域情報の取得に失敗しました");
        }

        const areas = await areaResponse.json();

        const koriyama = areas.find(
            area => area.name === "郡山市"
        );

        if (koriyama) {
            map.setCenter({
                lat: Number(koriyama.lat),
                lng: Number(koriyama.lng)
            });
        }

        console.log("地域情報を取得しました", areas);

    } catch (error) {

        console.error("地域APIエラー:", error);

    }


    // =====================================
    // 3. 店舗情報を取得
    // =====================================

    try {

        const response = await fetch(
            "https://localhost:7028/api/Shops"
        );

        if (!response.ok) {
            throw new Error("店舗情報の取得に失敗しました");
        }

        const shops = await response.json();

        // 店舗の種類を日本語に変換
        const kindLabels = {
            hanbai: "販売",
            shokuji: "食事",
            izakaya: "居酒屋"
        };

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


            // 料理一覧を作成
            const foodList =
                Array.isArray(shop.foods) && shop.foods.length > 0
                    ? shop.foods
                        .map(food => `<li>${food}</li>`)
                        .join("")
                    : "<li>料理情報はありません</li>";


            // 店舗詳細を作成
            const infoWindow = new google.maps.InfoWindow({

                content: `
                    <div style="
                        padding: 10px;
                        min-width: 220px;
                        max-width: 300px;
                        font-family: sans-serif;
                    ">

                        <h3 style="
                            margin: 0 0 12px;
                            font-size: 18px;
                            color: #333;
                        ">
                            ${shop.name}
                        </h3>

                        <p style="margin: 6px 0;">
                            <strong>住所：</strong><br>
                            ${shop.address || "住所は未登録です"}
                        </p>

                        <p style="margin: 6px 0;">
                            <strong>店舗の種類：</strong>
                            ${kindLabels[shop.kind] || shop.kind}
                        </p>

                        <p style="margin: 6px 0;">
                            <strong>店舗コメント：</strong><br>
                            ${shop.comment || "コメントはありません"}
                        </p>

                        <hr>

                        <strong>取り扱い郷土料理</strong>

                        <ul style="
                            padding-left: 20px;
                            margin-bottom: 5px;
                        ">
                            ${foodList}
                        </ul>

                    </div>
                `

            });


            // マーカーをクリックしたとき
            marker.addListener("click", () => {

                infoWindow.open({
                    anchor: marker,
                    map: map
                });

            });

        });

        console.log("店舗情報を取得しました", shops);

    } catch (error) {

        console.error("店舗APIエラー:", error);

    }

}


// =====================================
// 4. 住所から緯度・経度を取得
// 国土地理院API
// =====================================

async function geocodeShopAddresses() {

    const shops = [

        { name: "安兵衛（大町店）", address: "福島県郡山市大町1-3-12" },
        { name: "正月荘", address: "福島県郡山市大槻町字水門東1-20" },
        { name: "おうせ茶屋", address: "福島県郡山市逢瀬町河内字東長倉1-1" },
        { name: "もりっしゅ", address: "福島県郡山市燧田195" },
        { name: "鶴我", address: "福島県郡山市大町1-2-18" },
        { name: "枡はん", address: "福島県郡山市本町1-14-3" },
        { name: "めん処 成", address: "福島県郡山市朝日1-7-12" },
        { name: "郡山中華そば しょうや", address: "福島県郡山市大槻町字御十日1-1" },
        { name: "しのや", address: "福島県郡山市駅前2-6-3" },
        { name: "くしぜん", address: "福島県郡山市大町1-4-16" },
        { name: "珍満", address: "福島県郡山市駅前2-7-19" },
        { name: "村さ来（桑野店）", address: "福島県郡山市桑野3-11-13" },
        { name: "美日庵", address: "福島県郡山市富田東5-101" },
        { name: "クッチーナ", address: "福島県郡山市並木3-6-8" }

    ];

    const results = [];

    console.log("住所から緯度・経度を取得します");

    for (const shop of shops) {

        try {

            const url =
                "https://msearch.gsi.go.jp/address-search/AddressSearch?q="
                + encodeURIComponent(shop.address);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("住所検索に失敗しました");
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error("住所が見つかりません");
            }

            const coordinates =
                data[0].geometry.coordinates;

            const latitude = coordinates[1];
            const longitude = coordinates[0];

            results.push({
                name: shop.name,
                address: shop.address,
                lat: latitude,
                lng: longitude,
                status: "成功"
            });

        } catch (error) {

            console.error(shop.name + " の取得失敗:", error);

            results.push({
                name: shop.name,
                address: shop.address,
                lat: null,
                lng: null,
                status: "失敗"
            });

        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );

    }

    console.log("位置情報の取得が完了しました");

    console.table(results);

    console.log(
        "取得した位置情報：",
        JSON.stringify(results, null, 2)
    );

    return results;

}


// =====================================
// 5. Consoleから呼び出せるようにする
// =====================================

window.geocodeShopAddresses = geocodeShopAddresses;
