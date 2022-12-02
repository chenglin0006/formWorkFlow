// 提供全局可使用的history

// 使用history@4而不是@5原因如下：
// "Redirect" from "react-router" doesn't work anymore because of history@5.0.0
// https://github.com/ReactTraining/history/issues/840
import { createBrowserHistory } from 'history';

export default createBrowserHistory();
