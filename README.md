### config.json
```
{
  "entry": {
    "button": "button.vue",
    "hello": "hello.vue"
  },
  "units": ["px", "rem"]
}
```

### Usage
```
vueCompiler.compile({
    // entry: {hello: 'hello/hello.vue'}
    entry: ['hello/hello.vue'],
    index: '12345678', // must
    esModule: false // default
}).then(data => {
    console.log('----')
    console.log(data.config)
    console.log('==========')
    let resultData = data.stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n'
    console.log(resultData)
    if (data.stats.hasErrors()) {
        console.log('exist error')
    }
    console.log('===')
})
```


#### webpack dependences
```
"autoprefixer": "^7.2.5",
"babel-core": "^6.26.0",
"babel-loader": "^7.1.2",
"babel-preset-env": "^1.6.1",
"babel-preset-stage-2": "^6.24.1",
"css-loader": "^0.28.9",
"extract-text-webpack-plugin": "^3.0.2",
"node-sass": "^4.7.2",
"optimize-css-assets-webpack-plugin": "^3.2.0",
"postcss-import": "^11.0.0",
"postcss-loader": "^2.0.10",
"postcss-url": "^7.3.0",
"sass-loader": "^6.0.6",
"sass-resources-loader": "^1.3.1",
"vue": "^2.5.13",
"vue-loader": "^13.7.0",
"vue-template-compiler": "^2.5.13",
"webpack": "^3.10.0"
```

upload files
```
<input type="file" multiple @change="uploadFile($event)">
uploadFile (e) {
    let fd = new FormData()
    Array.prototype.forEach.call(e.target.files, file => {
      fd.append('files', file)
    })
    fd.append('index', '123456')
    this.apiInstance.post('http://localhost:4001/api/uploader/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
      console.log(res)
    })
  }
},
```

部署参考`https://www.jianshu.com/p/9680c87a3696`
```
pm2 deploy ecosystem.config.js production
```


// config/application.json
```
{
  "PORT": "4001",
  "ossConfig": {
    "accessKeyId": "LTAIgoOwneZiuS9b",
    "accessKeySecret": "j5dZlRkWP2SVnDoD3XqAh60WCdOM1l",
    "bucket": "webco-cloud",
    "region": "oss-cn-shanghai"
  }
}
```