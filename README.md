# LemJS
Lem诞生的初衷是构建一个轻量级、低依赖、易上手的前端数据流共享方案，加入风格一致的Web API与Service封装，以及对React Hooks支持与扩展，可以作为一个前端应用框架的基础。Lem会保持自身的单纯性，不会像滚雪球一样，越来越臃肿。

Lem支持Typescript和Javascript。

https://github.com/risma-cc/lemjs

## 安装依赖包

    npm i -S lemjs

## Model
### 创建数据模型

    interface A {
        a: number
    }

    const model = makeModel<A>({
        /* 数据初始化 */
        state: {
            a: 0,
        },
        /* 查询方法 */
        query: {
            b: (payload: any, state: A): any => {
                return state;
            },
        },
        /* 更新方法 */
        update: {
            c: (payload: any, state: A): A => {
                let { x } = payload;
                return { a: a + x };
            },
        },
        /* 异步任务 */
        run: {
            d: async (payload: any, state: A): Promise<void> => {
                /* 通常此处先通过HttpService的fetch请求HttpAPI，从后端获取数据。 */
				...
                /* 更新模型数据 */
                model.update('c', { x: 1 });
            }
        }
    });

### 使用数据模型
#### React函数组件，使用Hooks

    export default () => {
        /* 类Hooks的模型使用方法。 */
        const state = useModel(model);
        /* 模型任务加载事件的回调函数 */
        const onLoading = (on: boolean, action: string) => {
            if (on) {
                /* 显示加载动画组件 */
            } else {
                /* 关闭加载动画组件 */
            }
        };

        useEffect(() => {
            /* 如果需要控制Loading组件显示，订阅模型任务加载事件 */
            model.subscribeLoading(onLoading);
            return () => {
                /* 退订模型任务加载事件 */
                model.unsubscribeLoading(onLoading);
            }
        }, [a]);

        return (
            <div>
                <h1>a is {state.a}</h1>
                /* 调用模型的query/update/run方法进行数据访问与处理。 */
                <a onClick={() => model.run('d', {})}></a>
            </div>
        );
    }

#### React类组件，不使用Hooks

    export default class MyComponent extends Component {
        constructor(props) {
            super(props);
            this.state = model.getState();
        }
        /* 数据更新事件的回调函数 */
        onUpdate = (state: A) => {
            this.setState(state);
        };
        /* 模型任务加载事件的回调函数 */
        onLoading = (on: boolean, action: string) => {
            if (on) {
                /* 显示加载动画组件 */
            } else {
                /* 关闭加载动画组件 */
            }
        };

        componentDidMount() {
            /* 必须订阅数据更新事件 */
            model.subscribeUpdate(this.onUpdate);
            /* 如果需要控制Loading组件显示，订阅模型任务加载事件 */
            model.subscribeLoading(this.onLoading);
        }

        componentWillUnmount() {
            /* 退订数据更新事件 */
            model.unsubscribeUpdate(this.onUpdate);
            /* 退订模型任务加载事件 */
            model.unsubscribeLoading(this.onLoading);
        }

        render() {
            return (
                <div>
                    <h1>a is {this.state.a}</h1>
                    /* 调用模型的query/update/run方法进行数据访问与处理。 */
                    <a onClick={() => model.run('d', {})}></a>
                </div>
            );
        }
    }

## Service
### 定义HTTP服务接口

    const myAPIs = {
        'hello': {
            /*
             * 接口请求，包括URL路径、URL参数、配置选项（参考fetch的RequestInit）
             * 备注：在Service、API以及fetch都可以指定接口请求的各个属性，他们会自动合并。
             * 当同一属性出现多次时，该属性的取值优先级排序是：先fetch、再API、最后Service。
             */
            request: {
                url: '/hello',
                // params: {
                //    'color': ‘red’
                // },
                // config: {
                //    method: ‘POST’,
                // }
            },
            /* 响应处理，data根据Content-Type已转换成string、FormData、JSON对象或者blob。 */
            response: async (data: any, service: HttpService) => {
                let { name } = data;
                return { answer: 'Hello ' + name };
            },
            /* 错误处理，包括网络失败、HTTP非200状态等。 */
            error: async (error: Error, service: HttpService) => {
            },
            /* 如果定义了mock方法，则跳过HTTP请求，模拟接口响应数据。 */
            mock: (request: HttpRequest) => {
                return { answer: 'Hello Jack' };
            }
        },
    }

### 创建HTTP服务

    const service = makeHttpService({
        /* 统一的URL前缀 */
        baseURL: 'http://a.b.c/api',
        /* 默认URL参数，所有请求都自动加上。 */
        defaultParams: {
            'ver': '1.0.0'
        },
        /* 默认配置选项，所有请求都自动加上。 */
        defaultConfig: { },
        httpAPIs: myAPIs,
    });

### 使用HTTP服务接口

    let result = await service.fetch('hello', { params: { 'myname': 'Michael' }});

## Storage

    LocalStorage.set('myName', 'Michael');
    let myName = LocalStorage.getString('myName');

    LocalStorage.set('myPhone', { os: 'Android', version: '10.1' } );
    let myPhone = LocalStorage.getObject('myPhone');

SessionStorage提供的方法与LocalStorage一样。

## LICENSE

MIT License