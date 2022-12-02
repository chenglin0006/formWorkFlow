/* eslint-disable no-unused-vars */
// 图片上传七牛云，调用七牛云SDK
import message from '@/components/message';
import * as Qiniu from 'qiniu-js';
import { Remote } from '@/util';

const uuid = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  // eslint-disable-next-line no-bitwise
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  // eslint-disable-next-line no-multi-assign
  s[8] = s[13] = s[18] = s[23] = '-';

  return s.join('');
};

const compressOptions = {
  // quality: 0.8,
  noCompressIfLarger: true,
  maxWidth: 1500,
  maxHeight: 1500,
};

const uploadByQiniu = (e) => {
  const { file, onProgress, onSuccess, onError } = e;
  const key = uuid();

  file.id = key;
  onProgress({
    percent: 0,
    file,
  });

  Remote.get('/upload/getQiniuTokenWithParams', null, {
    urlType: 'qiniu',
  }).then((response) => {
    const {
      response: { code, data },
    } = response;

    if (code === 0) {
      const token = data.upToken;
      const putExtra = {
        // fname: '',
        mimeType: 'image/jpeg;image/png',
      };
      const observer = {
        next(res) {
          onProgress({
            percent: Math.round(res.total.percent).toFixed(0),
            file,
          });
        },
        error(err) {
          onError({
            error: err.message,
            file,
          });

          if (err && err.isRequestError) {
            switch (err.code) {
              case 614:
                message.error('图片已存在！');
                break;
              default:
                message.error(err.message);
            }
          } else {
            message.error('支持jpg、.png、.jpeg格式!');
          }
        },
        complete(res) {
          const timeStamp = new Date().getTime();

          onSuccess({
            response: {
              ...res,
              url: `https://res1.bnq.com.cn/${res.key}?t=${timeStamp}&width=${res.w}&height=${res.h}`,
            },
            file,
          });
        },
      };

      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      // console.log('observable Qiniu.upload: ', {
      //     file, key, token, putExtra,
      // });
      // 压缩文件后上传
      // Qiniu.compressImage(file, compressOptions).then((res) => {
      //   const observable = Qiniu.upload(res.dist, key, token, putExtra);
      //   // const subscription = observable.subscribe(observer); // 取消时调用
      //   observable.subscribe(observer);
      // });

      // 未压缩
      const observable = Qiniu.upload(file, key, token, putExtra);
      // const subscription = observable.subscribe(observer); // 取消时调用
      observable.subscribe(observer);
    }
  });
};

export default { uploadByQiniu };
