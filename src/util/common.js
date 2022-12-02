/* eslint-disable no-unused-vars */
import { parse, stringify } from 'qs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isIpad, isWeixin, isMobile, isQywx } from '@/util/const';

dayjs.extend(customParseFormat);

export function diffTime(from, to) {
  const a = dayjs(from, 'YYYY-MM-DD HH:mm:ss');
  const b = dayjs(to, 'YYYY-MM-DD HH:mm:ss');

  let diff = a.diff(b, 'second');

  diff = Math.abs(diff);

  let res;
  if (diff < 60) {
    res = `${diff}秒`;
  } else if (diff >= 60 && diff < 3600) {
    const m = parseInt(diff / 60, 10);
    const s = diff % 60;

    res = `${m}分${s}秒`;
  } else {
    const h = parseInt(diff / 3600, 10);
    const m = parseInt((diff % 3600) / 60, 10);
    const s = parseInt((diff % 3600) % 60, 10);

    res = `${h}时${m}分${s}秒`;
  }

  return res;
}

/**
 * 解析出url的请求参数
 *
 * @export
 * @param {string} search
 * @returns {object}
 */
export function getPageQuery(search) {
  const str = search || window.location.href;

  return parse(str.split('?')[1]);
}

/**
 * 根据请求参数生成url
 *
 * @export
 * @param {string} [path='']
 * @param {object} [query={}]
 * @returns {string}
 */
export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/**
 *  UploadImage组件的fileList格式转换方法
 *  将url字符串或数组转换成Upload组件的fileList
 *
 * @export
 * @param {*} urls url字符串或数组
 * @returns {array} 符合UploadImage组件的fileList格式
 */
export function formatFilelist(urls) {
  let res = urls;

  if (!res) {
    return [];
  }

  // 针对app端只保存七牛云资源key的处理
  const foramtUrl = (url) => {
    let temp = url;
    if (!url) {
      return undefined;
    }

    if (temp.indexOf('http') === -1 && temp.indexOf('res1.bnq.com.cn') === -1) {
      // eslint-disable-next-line no-param-reassign
      temp = `https://res1.bnq.com.cn/${temp}`;
    }

    return temp;
  };

  if (typeof res === 'string') {
    res = res.split(',');
  }

  if (Array.isArray(res) && res.length) {
    let uid = 0;
    res = res.map((item) => {
      uid -= 1;

      return {
        uid,
        name: 'image.png',
        status: 'done',
        url: foramtUrl(item),
      };
    });
  }

  return res;
}

/**
 * 格式化输入的数字, 保留两位小数的正数
 *
 * @export
 * @param {string} value
 * @returns {string}
 */
export function foramtNumber(value) {
  // 得到第一个字符是否为负号
  const t = value.charAt(0);
  // 先把非数字的都替换掉，除了数字和.
  let temp = value.replace(/[^\d.]/g, '');
  // 必须保证第一个为数字而不是.
  temp = temp.replace(/^\./g, '');
  // 保证只有出现一个.而没有多个.
  temp = temp.replace(/\.{2,}/g, '.');
  // 保证.只出现一次，而不能出现两次以上
  temp = temp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只能输入两个小数
  temp = temp.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
  // 如果第一位是负号，则允许添加
  if (t === '-') {
    temp = `${temp}`;
  }
  return temp;

  // let res = value.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
  // res = res.replace(/^\./g, ''); // 必须保证第一个为数字而不是.
  // res = res.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
  // res = res.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // res = res.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');// 只能输入两个小数
  // if (res.indexOf('.') < 0 && res !== '' && res !== '0') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
  //     res = parseFloat(res);
  // }

  // return res;
}

// NEW

/** 判断是否是图片链接 */
export function isImgStr(path) {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);
}

/** 判断是否是链接 */
export function isUrl(path) {
  if (!path.startsWith('http')) {
    return false;
  }
  try {
    const url = new URL(path);
    return !!url;
  } catch (error) {
    return false;
  }
}

/**
 * 返回图片文件的宽高
 *
 * @export
 * @param {file} file
 * @returns {promise} {widht, height}
 */
export function getImgInfo(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        });
      };

      image.src = e.target.result;
    };
  });
}

// 针对不同浏览器打开新页面
export function open(url, target = '_blank') {
  if (!url) return;

  const UA = window.navigator.userAgent.toLowerCase();

  // 针对Safari浏览器中无法异步打开新页面的处理
  if (/safari/.test(UA) && !/chrome/.test(UA)) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    if (/macintosh/.test(UA) && !isIpad) {
      a.target = target; // iphone/ipad safari中设置该项，会导致a标签点击失效；mac中有效
    }
    a.click();
    document.body.removeChild(a);
  } else if (isMobile && (isWeixin || isQywx)) {
    // fix ios手机端微信打开时页面无法跳转
    window.location.href = url;
  } else {
    window.open(url);
  }
}
