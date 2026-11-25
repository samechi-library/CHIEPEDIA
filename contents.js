/**
     * SVG文字列を安全なData URIに変換するヘルパー関数
     */
    function createSvgDataUri(svgContent) {
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent.trim());
    }

    /**
     * 豆知識データベース（contents.js）
     * id: 一意のID
     * title: 豆知識名
     * tags: 検索・絞り込み用タグ配列
     * content: 豆知識の解説本文
     * image: 添付画像URL（nullの場合はテキストのみの豆知識）
     * imageCaption: モーダル拡大表示時の解説キャプション
     */
    const TRIVIA_CONTENTS = [
      {
        id: 1,
        title: "フラミンゴの羽がピンク色なのは食べ物のせい",
        tags: ["動物", "生き物", "雑学"],
        content: "フラミンゴは生まれたときは白色や灰色の羽をしています。主食である藍藻類（スピルリナなど）や甲殻類に含まれる赤色色素「カンタキサンチン」を体内で分解・吸収することで、羽が鮮やかなピンク色へと変化します。動物園では色を保つために色素を含む専用エサを与えています。",
        image: createSvgDataUri(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460">
            <defs>
              <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFF1F2"/>
                <stop offset="100%" stop-color="#FFE4E6"/>
              </linearGradient>
            </defs>
            <rect width="800" height="460" fill="url(#bg1)"/>
            <text x="400" y="48" font-family="sans-serif" font-size="24" font-weight="bold" fill="#881337" text-anchor="middle">フラミンゴがピンク色になる仕組み</text>
            <!-- ステップ1：ヒナ -->
            <rect x="45" y="85" width="210" height="310" rx="20" fill="#FFFFFF" stroke="#FECDD3" stroke-width="2"/>
            <circle cx="150" cy="195" r="52" fill="#E2E8F0"/>
            <circle cx="165" cy="180" r="6" fill="#1E293B"/>
            <path d="M195 190 Q220 195 205 210 Z" fill="#64748B"/>
            <text x="150" y="295" font-family="sans-serif" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">① ヒナの頃</text>
            <text x="150" y="325" font-family="sans-serif" font-size="14" fill="#64748B" text-anchor="middle">生まれたての羽は</text>
            <text x="150" y="346" font-family="sans-serif" font-size="14" fill="#64748B" text-anchor="middle">「白〜灰色」</text>
            <!-- 矢印1 -->
            <path d="M268 235 L292 235" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"/>
            <polygon points="290,225 306,235 290,245" fill="#F43F5E"/>
            <!-- ステップ2：食事 -->
            <rect x="310" y="85" width="210" height="310" rx="20" fill="#FFFFFF" stroke="#FECDD3" stroke-width="2"/>
            <circle cx="415" cy="195" r="52" fill="#FFEDD5"/>
            <path d="M390 205 C390 175, 440 175, 435 205 C430 220, 405 220, 405 205" fill="none" stroke="#EA580C" stroke-width="8" stroke-linecap="round"/>
            <circle cx="430" cy="190" r="4" fill="#1E293B"/>
            <text x="415" y="295" font-family="sans-serif" font-size="18" font-weight="bold" fill="#9A3412" text-anchor="middle">② 色素を摂取</text>
            <text x="415" y="325" font-family="sans-serif" font-size="14" fill="#64748B" text-anchor="middle">藻類や甲殻類の</text>
            <text x="415" y="346" font-family="sans-serif" font-size="14" fill="#64748B" text-anchor="middle">「カンタキサンチン」</text>
            <!-- 矢印2 -->
            <path d="M533 235 L557 235" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"/>
            <polygon points="555,225 571,235 555,245" fill="#F43F5E"/>
            <!-- ステップ3：成鳥 -->
            <rect x="575" y="85" width="180" height="310" rx="20" fill="#FFFFFF" stroke="#FDA4AF" stroke-width="3"/>
            <circle cx="665" cy="195" r="52" fill="#FB7185"/>
            <circle cx="680" cy="180" r="6" fill="#1E293B"/>
            <path d="M710 190 Q735 195 720 212 Z" fill="#1E293B"/>
            <text x="665" y="295" font-family="sans-serif" font-size="18" font-weight="bold" fill="#BE123C" text-anchor="middle">③ 成鳥の羽</text>
            <text x="665" y="325" font-family="sans-serif" font-size="14" fill="#64748B" text-anchor="middle">肝臓で分解され</text>
            <text x="665" y="346" font-family="sans-serif" font-size="14" font-weight="bold" fill="#E11D48" text-anchor="middle">鮮やかなピンクへ！</text>
          </svg>
        `),
        imageCaption: "フラミンゴのヒナ（灰色）が藻類や甲殻類の色素を摂取してピンク色の成鳥になるプロセス図解"
      },
      {
        id: 2,
        title: "エッフェル塔は夏になると約15cm背が高くなる",
        tags: ["科学", "建築", "世界"],
        content: "フランスの象徴であるエッフェル塔は錬鉄（鉄）で造られています。金属には温度が上がると体積が膨張する「熱膨張」という性質があるため、真夏に太陽の熱で鉄骨が温められると、塔全体の高さが冬場よりも最大で約15センチメートル伸びます。",
        image: createSvgDataUri(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460">
            <rect width="800" height="460" fill="#EFF6FF"/>
            <text x="400" y="46" font-family="sans-serif" font-size="23" font-weight="bold" fill="#1E3A8A" text-anchor="middle">金属の「熱膨張」によるエッフェル塔の高さ変化</text>
            <!-- 冬の塔 -->
            <rect x="70" y="75" width="300" height="340" rx="20" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
            <text x="220" y="112" font-family="sans-serif" font-size="18" font-weight="bold" fill="#2563EB" text-anchor="middle">❄️ 冬（低温時）</text>
            <polygon points="220,155 180,350 260,350" fill="none" stroke="#3B82F6" stroke-width="6"/>
            <line x1="192" y1="280" x2="248" y2="280" stroke="#3B82F6" stroke-width="5"/>
            <line x1="204" y1="220" x2="236" y2="220" stroke="#3B82F6" stroke-width="5"/>
            <line x1="150" y1="155" x2="290" y2="155" stroke="#93C5FD" stroke-width="2" stroke-dasharray="6,4"/>
            <text x="220" y="385" font-family="sans-serif" font-size="15" fill="#475569" text-anchor="middle">基準の高さ（約300m）</text>
            <!-- 夏の塔 -->
            <rect x="430" y="75" width="300" height="340" rx="20" fill="#FFFFFF" stroke="#FDBA74" stroke-width="2"/>
            <text x="580" y="112" font-family="sans-serif" font-size="18" font-weight="bold" fill="#EA580C" text-anchor="middle">☀️ 夏（高温時）</text>
            <circle cx="675" cy="130" r="22" fill="#F97316" opacity="0.85"/>
            <polygon points="580,132 538,350 622,350" fill="none" stroke="#EA580C" stroke-width="6"/>
            <line x1="550" y1="276" x2="610" y2="276" stroke="#EA580C" stroke-width="5"/>
            <line x1="563" y1="212" x2="597" y2="212" stroke="#EA580C" stroke-width="5"/>
            <line x1="510" y1="155" x2="650" y2="155" stroke="#93C5FD" stroke-width="2" stroke-dasharray="6,4"/>
            <text x="645" y="148" font-family="sans-serif" font-size="15" font-weight="bold" fill="#DC2626">+約15cm!</text>
            <text x="580" y="385" font-family="sans-serif" font-size="15" fill="#475569" text-anchor="middle">鉄骨が熱膨張して伸びる</text>
          </svg>
        `),
        imageCaption: "夏の日差しで鉄骨が熱膨張し、冬の基準高さより約15cm高くなるイメージ図"
      },
      {
        id: 3,
        title: "タコには心臓が3つあり、血液は青い",
        tags: ["動物", "生き物", "海"],
        content: "タコには全身に血液を送る「体心臓」が1つと、左右のエラに血液を送る「鰓（えら）心臓」が2つ、合計3つの心臓があります。さらに、人間の血液は鉄を含むヘモグロビンによって赤色ですが、タコの血液は銅を含む「ヘモシアニン」という色素で酸素を運ぶため青色をしています。",
        image: createSvgDataUri(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460">
            <rect width="800" height="460" fill="#ECFEFF"/>
            <text x="400" y="46" font-family="sans-serif" font-size="23" font-weight="bold" fill="#164E63" text-anchor="middle">タコの3つの心臓と青い血液のひみつ</text>
            <!-- タコのシルエット -->
            <ellipse cx="320" cy="225" rx="115" ry="95" fill="#F97316" opacity="0.2" stroke="#EA580C" stroke-width="3"/>
            <!-- 3つの心臓 -->
            <circle cx="320" cy="185" r="24" fill="#0284C7"/>
            <text x="320" y="190" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">体心臓</text>
            <circle cx="265" cy="245" r="20" fill="#0EA5E9"/>
            <text x="265" y="250" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">鰓心臓</text>
            <circle cx="375" cy="245" r="20" fill="#0EA5E9"/>
            <text x="375" y="250" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">鰓心臓</text>
            <!-- 説明パネル -->
            <rect x="475" y="95" width="275" height="125" rx="16" fill="#FFFFFF" stroke="#A5F3FC" stroke-width="2"/>
            <text x="495" y="130" font-family="sans-serif" font-size="17" font-weight="bold" fill="#0369A1">💙 心臓が合計3つ</text>
            <text x="495" y="158" font-family="sans-serif" font-size="13" fill="#475569">・体心臓（1つ）：全身へ送血</text>
            <text x="495" y="182" font-family="sans-serif" font-size="13" fill="#475569">・鰓心臓（2つ）：左右のエラへ送血</text>
            <rect x="475" y="240" width="275" height="125" rx="16" fill="#FFFFFF" stroke="#A5F3FC" stroke-width="2"/>
            <text x="495" y="275" font-family="sans-serif" font-size="17" font-weight="bold" fill="#0369A1">🧪 血液が青い理由</text>
            <text x="495" y="303" font-family="sans-serif" font-size="13" fill="#475569">銅を含む「ヘモシアニン」が</text>
            <text x="495" y="327" font-family="sans-serif" font-size="13" fill="#475569">酸素と結びつくと青色になる</text>
          </svg>
        `),
        imageCaption: "タコの体心臓（1個）＋鰓心臓（2個）の配置と、ヘモシアニンによる青い血液の解説"
      },
      {
        id: 4,
        title: "純粋なハチミツは腐らない（賞味期限がない）",
        tags: ["食べ物", "科学", "雑学"],
        content: "添加物や水分が混ざっていない100%純粋なハチミツは、基本的に腐敗することがありません。糖度が約80%と極めて高く浸透圧で細菌の水分を奪ううえ、ミツバチの酵素によって殺菌作用のある過酸化水素が生成されるためです。実際に古代エジプトのピラミッドから3000年以上前のハチミツが食べられる状態で発見されています。",
        image: null,
        imageCaption: ""
      },
      {
        id: 5,
        title: "宇宙空間では涙を流しても頬を伝って落ちない",
        tags: ["宇宙", "人体", "科学"],
        content: "国際宇宙ステーション（ISS）のような微小重力環境では、重力がほとんど働かないため涙が下に流れ落ちません。その代わり、水の表面張力によって目の表面に涙が大きな水滴（レンズ状）となって溜まり続けます。拭うときはタオルで吸い取る必要があります。",
        image: null,
        imageCaption: ""
      },
      {
        id: 6,
        title: "地球と月の距離の間には太陽系の全惑星がすっぽり入る",
        tags: ["宇宙", "雑学"],
        content: "地球から月までの平均距離は約38万4,400kmです。一方、太陽系の他の7つの惑星（水星・金星・火星・木星・土星・天王星・海王星）の直径をすべて足し合わせると約38万kmとなり、地球と月の間に全惑星を横一列に並べてもまだ少し隙間が残ります。",
        image: createSvgDataUri(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460">
            <rect width="800" height="460" fill="#0F172A"/>
            <text x="400" y="46" font-family="sans-serif" font-size="22" font-weight="bold" fill="#F8FAFC" text-anchor="middle">地球と月の間（約38.4万km）に太陽系の全惑星が並ぶ！</text>
            <!-- 地球 -->
            <circle cx="65" cy="235" r="32" fill="#3B82F6"/>
            <path d="M50 220 Q65 210 75 230 T55 250 Z" fill="#22C55E"/>
            <text x="65" y="295" font-family="sans-serif" font-size="14" font-weight="bold" fill="#93C5FD" text-anchor="middle">地球</text>
            <!-- 距離ライン -->
            <line x1="105" y1="145" x2="715" y2="145" stroke="#64748B" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="410" y="132" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FBBF24" text-anchor="middle">平均距離：約 384,400 km</text>
            <!-- 惑星群 -->
            <circle cx="130" cy="235" r="5" fill="#94A3B8"/>
            <circle cx="152" cy="235" r="10" fill="#FDE047"/>
            <circle cx="176" cy="235" r="7" fill="#EF4444"/>
            <circle cx="268" cy="235" r="72" fill="#F59E0B"/>
            <ellipse cx="415" cy="235" rx="75" ry="16" fill="none" stroke="#FDE68A" stroke-width="5"/>
            <circle cx="415" cy="235" r="58" fill="#FBBF24"/>
            <circle cx="532" cy="235" r="30" fill="#38BDF8"/>
            <circle cx="604" cy="235" r="29" fill="#2563EB"/>
            <text x="410" y="345" font-family="sans-serif" font-size="14" fill="#CBD5E1" text-anchor="middle">水星・金星・火星・木星・土星・天王星・海王星の直径合計 ＝ 約 380,000 km</text>
            <!-- 月 -->
            <circle cx="745" cy="235" r="14" fill="#E2E8F0"/>
            <text x="745" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#E2E8F0" text-anchor="middle">月</text>
          </svg>
        `),
        imageCaption: "地球と月の平均距離384,400kmの間に太陽系7惑星を並べたスケール比較図"
      },
      {
        id: 7,
        title: "食パンの袋を留めるプラスチックの名称は「バッグ・クロージャー」",
        tags: ["食べ物", "日常", "雑学"],
        content: "食パンの袋の口を留めている四角いプラスチック製の留め具は「バッグ・クロージャー（Bag Closure）」という正式名称があります。アメリカのクイック・ロック社がリンゴの袋を素早く閉じるために発明したもので、日本では埼玉県川口市の工場で一手に製造されています。",
        image: null,
        imageCaption: ""
      },
      {
        id: 8,
        title: "人間の鼻と耳は一生少しずつ成長し続ける",
        tags: ["人体", "雑学"],
        content: "人間の骨格の成長は20歳前後で止まりますが、鼻や耳を構成している「軟骨」は年齢とともにコラーゲンやエラスチンが分解されて弾力を失い、重力の影響で少しずつ垂れ下がりながら大きくなります。そのため高齢になると若い頃より鼻や耳が大きく見えるようになります。",
        image: null,
        imageCaption: ""
      },
      {
        id: 9,
        title: "シロクマの毛は白ではなく「透明」で、皮膚は「黒い」",
        tags: ["動物", "生き物", "科学"],
        content: "ホッキョクグマ（シロクマ）の体毛は実は真っ白ではなく、ストローのように中が空洞になった透明な毛です。太陽の光が空洞の中で乱反射することで人間の目には白く見えています。さらに毛の下の皮膚は太陽の熱を効率よく吸収できるよう真っ黒になっています。",
        image: createSvgDataUri(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460">
            <rect width="800" height="460" fill="#F0F9FF"/>
            <text x="400" y="46" font-family="sans-serif" font-size="23" font-weight="bold" fill="#0C4A6E" text-anchor="middle">シロクマの毛と皮膚のダブル防寒構造</text>
            <!-- 皮膚（黒） -->
            <rect x="110" y="310" width="580" height="75" rx="16" fill="#1E293B"/>
            <text x="400" y="355" font-family="sans-serif" font-size="18" font-weight="bold" fill="#F8FAFC" text-anchor="middle">⬛ 皮膚は「真っ黒」（太陽の熱をしっかり吸収）</text>
            <!-- 透明な毛（中空チューブ） -->
            <rect x="210" y="130" width="38" height="185" rx="18" fill="#FFFFFF" stroke="#38BDF8" stroke-width="4"/>
            <rect x="223" y="145" width="12" height="155" rx="6" fill="#E0F2FE"/>
            <rect x="380" y="130" width="38" height="185" rx="18" fill="#FFFFFF" stroke="#38BDF8" stroke-width="4"/>
            <rect x="393" y="145" width="12" height="155" rx="6" fill="#E0F2FE"/>
            <rect x="550" y="130" width="38" height="185" rx="18" fill="#FFFFFF" stroke="#38BDF8" stroke-width="4"/>
            <rect x="563" y="145" width="12" height="155" rx="6" fill="#E0F2FE"/>
            <!-- 太陽光線と乱反射 -->
            <path d="M150 90 L215 160 L165 210" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
            <path d="M475 90 L412 165 L465 215" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
            <rect x="235" y="75" width="330" height="42" rx="10" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
            <text x="400" y="102" font-family="sans-serif" font-size="15" font-weight="bold" fill="#B45309" text-anchor="middle">☀️ 透明な中空の毛が光を乱反射して白く見える！</text>
          </svg>
        `),
        imageCaption: "シロクマの透明なストロー状の体毛による光の乱反射と、熱を吸収する黒い皮膚の断面イメージ"
      },
      {
        id: 10,
        title: "「鉛筆1本」で約50kmもの長い線を引くことができる",
        tags: ["日常", "科学", "雑学"],
        content: "一般的なHBの黒鉛鉛筆1本（芯の長さ約17.5cm）を使い切るまで一本の線を引き続けると、理論上約50km（東京駅から神奈川県の平塚駅付近まで）の線を引くことができます。文字に換算すると約45,000字を書くことが可能です。",
        image: null,
        imageCaption: ""
      },
      {
        id: 11,
        title: "ワニは口を「開ける力」がとても弱い",
        tags: ["動物", "生き物"],
        content: "ワニが獲物に噛みつく（口を閉じる）力は地球上の生物でもトップクラスで、約1〜2トンもの圧力があります。しかし、口を「開ける」ための筋肉は非常に弱く、人間の手で軽く押さえたり、輪ゴムやガムテープを数周巻くだけで口を開けられなくなります。",
        image: null,
        imageCaption: ""
      },
      {
        id: 12,
        title: "日本で最初に「ランドセル」を使ったのは学習院の小学生",
        tags: ["歴史", "日本", "日常"],
        content: "ランドセルの語源はオランダ語で背負い鞄を意味する「ランセル（Ransel）」です。幕末に西洋式軍隊の装備として輸入された後、1885年（明治18年）に学習院初等科が「馬車や人力車での通学を禁じ、自分の学用品は自分で背負って通うように」と採用したのが始まりとされています。",
        image: null,
        imageCaption: ""
      }
    ];
