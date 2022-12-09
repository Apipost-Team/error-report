# error-report
A component used to collect reported error logs

### 使用

```
  npm i apipost-error-report -S
```

#### 

文件入口使用：

webpack.config.js添加

{
  resolve: {
    fallback: {
      crypto: false
    }
  }
}

```javsScript

  import { Monitor } from 'apipost-error-report';

  const monitor = Monitor.init({
    report: {
      url: 'http://localhost:9898/reportError',      // 错误上报url
      method: 'post',                         
      contentType: 'application/x-www-form-urlencoded'
    }
  }, {
    appVersion: '1',  
    gitHash: 'githush'
  });

  错误监听
  monitor.on('event', (errorName, errorInfo) => {
    // 错误上报至后台
    monitor.reporter.reportError(errorInfo)
  })

```
