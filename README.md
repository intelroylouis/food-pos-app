# 
## develop
[バックオフィス](https://localhost:50443/)
[レジアプリ](http://localhost:8100)
### docker
```
# dockerコンテナを起動する
$ docker-compose up -d
# dockerコンテナに入る
$ docker-compose exec web sh
# ionicアプリをスタート
> ionic serve --address=0.0.0.0
```
### deploy
```
# on docker
> ionic build --prod
# on local
$ firebase deploy
```


・chrome設定
    chrome://flagsのInsecure origins treated as secureにvescaJSのエンドポイント（ws://192.168.1.214:3647）
    を入れて、enabledにする。

・posアプリデプロイ方法
    ionic build --prod　
        を実行した後、
    firebase deploy



・package.jsonのscripts部分
    firebaseの場合:
        "scripts": {
            "ng": "ng",
            "start": "ng serve",
            "build": "ng build",
            "test": "ng test",
            "lint": "ng lint",
            "e2e": "ng e2e"
        },
    aws amplifyの場合: 
        "scripts": {
            "start": "[ -f src/aws-exports.js ] && mv src/aws-exports.js src/aws-exports.ts || ionic-app-scripts serve",
            "clean": "ionic-app-scripts clean",
            "build": "[ -f src/aws-exports.js ] && mv src/aws-exports.js src/aws-exports.ts || ionic-app-scripts build",
            "lint": "ionic-app-scripts lint"
        },

