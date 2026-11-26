import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import Groq from 'groq-sdk';
import 'dotenv/config';

console.log('Groq APIキー読み込み確認:', process.env.GROQ_API_KEY ? 'あり' : 'なし（空です！）');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/course', async (req, res) => {
  try {
    const { time, mood, move, lat, lng } = req.body;

    const prompt = `
      現在地（緯度: ${lat}, 経度: ${lng}）をスタート地点としたお出かけ食べ歩きコースを1つ提案してください。
      【条件】
      ・所要時間: ${time}
      ・今の気分: ${mood}
      ・移動手段: ${move}

      現在地周辺（緯度・経度から判断した地域）に実在する店舗や観光スポットを2〜3箇所選んでください。
      各スポットの正確な緯度・経度と、前の地点からの移動時間（${move}での目安）も算出してください。

      必ず以下のJSON形式のみで出力してください。
      {
        "title": "コースの魅力的なタイトル",
        "description": "コース全体の概要説明（2文程度）",
        "spots": [
          {
            "name": "実在するスポット名・店舗名",
            "access": "前の地点からの移動時間（例: 現在地から徒歩5分）",
            "lat": 37.3981,
            "lng": 140.3886
          }
        ]
      }
    `;

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b', // 高精度・日本語に強い最新モデル
      messages: [
        {
          role: 'system',
          content: 'あなたは優秀な日本の観光・お出かけナビゲーターです。指示されたJSONフォーマットのみを正確に出力してください。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' }, // ★確実に正しいJSONで返させる設定
      temperature: 0.7,
    });

    const rawText = completion.choices[0]?.message?.content;
    const courseData = JSON.parse(rawText);

    res.json(courseData);

  } catch (error) {
    console.error('★Groqサーバー側エラー詳細:', error);
    res.status(500).json({ error: 'コースの生成に失敗しました' });
  }
});

// ★Routes API を使って道路に沿ったルート線を取得する処理
app.post('/api/route', async (req, res) => {
  try {
    const { origin, destination, waypoints = [], move } = req.body;

    // 移動手段を Routes API の形式に変換
    const modeMap = {
      "徒歩": "WALK",
      "車": "DRIVE",
      "自転車": "BICYCLE",
      "電車": "TRANSIT"
    };
    const travelMode = modeMap[move] || "WALK";

    // Routes API に送るリクエストデータ
    const requestBody = {
      origin: {
        location: { latLng: { latitude: origin.lat, longitude: origin.lng } }
      },
      destination: {
        address: `福島県郡山市 ${destination}` // 検索精度を上げるため地域名を補完
      },
      // 電車(TRANSIT)は経由地指定が非対応のため空にする
      intermediates: travelMode === "TRANSIT" ? [] : waypoints.map((name) => ({
        address: `福島県郡山市 ${name}`
      })),
      travelMode: travelMode
    };

    // ① 正しいエンドポイントURLに修正
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.polyline.encodedPolyline,routes.viewport,routes.legs.endLocation'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('ルートが見つかりませんでした: ' + JSON.stringify(data));
    }

    // ② data.routes[0] を指定して返す
    const route = data.routes[0];
    res.json({
      encodedPolyline: route.polyline.encodedPolyline,
      viewport: route.viewport,
      legs: route.legs
    });
  } catch (error) {
    console.error('★Routes APIエラー:', error);
    res.status(500).json({ error: 'ルートの取得に失敗しました' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));