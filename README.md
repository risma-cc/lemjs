# LemJS
Lem诞生的初衷是构建一个轻量级、低依赖、易上手的前端数据流共享方案，加入编码风格一致的WebAPI封装，以及对React Hooks支持与扩展，可以作为一个前端应用框架的基础。

Lem采用Typescript开发，同时支持在Javascript和Typescritp中使用。核心逻辑代码只使用原生标准库，原则上对各个前端主流框架的支持与整合都是将来可以考虑的。目前，先只加入了对React Hooks的支持。

Lem会保持自身的单纯性，不会像滚雪球一样越来越臃肿，也不会一味追求新潮而增加了学习成本。希望即使是Javascript和Typescript的初学者，也能在习得它的设计模式与编码风格之后，即可轻松玩转。

https://github.com/risma-cc/lemjs

## 安装依赖包

    npm i -S lemjs

## Model
### 创建数据模型

    interface A {
        a: number,
        answer: string,
    }

    const myModel = makeModel<A>({
        /* 数据初始化 */
        state: {
            a: 0,
            answer: '',
        },
        /* 查询方法 */
        query: {
            'ab': (payload: any, state: A): any => {
                return { a: state.a, b: 'B' };
            },
        },
        /* 更新方法 */
        update: {
            'add': (payload: any, state: A): A => {
                let { x } = payload;
                return { a: a + x };
            },
            'set': (payload: any, state: A): A => {
                return { ...state, ...payload };
            },
        },
    });

### 使用数据模型
#### React函数组件，使用Hooks

    export default () => {
        /* 类Hooks的模型使用方法。 */
        const state = useModel(myModel);

        return (
            <div>
                <h1>a is {state.a}</h1>
                /* 调用模型的update方法进行数据访问与处理。 */
                <a onClick={() => myModel.update('add', { x: 1 })}></a>
            </div>
        );
    }

#### React类组件，不使用Hooks

    export default class MyComponent extends Component {
        constructor(props) {
            super(props);
            this.state = myModel.getState();
        }
        /* 数据更新事件的回调函数 */
        onUpdate = (state: A) => {
            this.setState(state);
        };

        componentDidMount() {
            /* 必须订阅数据更新事件 */
            myModel.subscribe(this.onUpdate);
        }

        componentWillUnmount() {
            /* 退订数据更新事件 */
            myModel.unsubscribe(this.onUpdate);
        }

        render() {
            return (
                <div>
                    <h1>a is {this.state.a}</h1>
                    /* 调用模型的update方法进行数据访问与处理。 */
                    <a onClick={() => myModel.update('add', { x: 1 })}></a>
                </div>
            );
        }
    }

## HTTP Client
### 定义HTTP服务接口

    const myAPIs = {
        'hello': {
            /* 请求URL路径，如果HttpClient指定了baseURL，这里只需要指定子路由路径。 */
            url: '/hello/{you}',
            /*
                * 请求URL参数。
                * 如果参数名已在url中定义（如示例中“you”），则不会出现在“?”之后的参数中。
                */
            params: {
                'you': 'Jack',
                'color': 'red'
            },
            /* 请求配置选项，参考fetch的RequestInit。 */
            config: {
                /* HTTP请求方法，缺省为“GET”。 */
                method: ‘POST’,
                /*
                    * HTTP请求携带的消息体，除了支持fetch的BodyInit，还增加了JsonBody(object)
                    * 和FormBody(FormElement[])。如果是动态变化的，则使用函数方式返回。
                    */
                body: FormBody([
                    {
                        name: 'avatar',
                        value: /* 文件Blob/File */,
                        fileName: 'myavatar.jpg'
                    }
                ])
            },
            /* 响应处理，data根据Content-Type已转换成string、FormData、JSON对象或者blob。 */
            response: (data: any, request: HttpRequest) => {
                let { name } = data;
                if (!name) {
                    throw new Error('Wrong result');
                }
                return { answer: 'Hello ' + name };
            },
            /* 错误处理，包括网络失败、HTTP非200状态等。 */
            error: (error: Error, request: HttpRequest) => {
            },
            /*
             * 如果定义了mock方法，则跳过HTTP请求，模拟接口响应数据。
             * 当环境变量NODE_ENV为"production"或者MOCK为"none"时，mock将被忽略。
             */
            mock: (request: HttpRequest) => {
                return { answer: 'Hello Jack' };
            }
        },
    }

### 创建HTTP服务Client

    const myClient = makeHttpClient({
        /* 接口定义 */
        httpAPIs: myAPIs,
        /* 统一的URL前缀 */
        baseURL: 'http://a.b.c/api',
        /* 默认URL参数。如果定义了，所有请求都自动加上。如果是动态变化的，则使用函数方式返回。 */
        defaultParams: () => {
            return { 'ver': myVersion };
        },
        /* 默认配置选项。如果定义了，所有请求都自动加上。如果是动态变化的，则使用函数方式返回。 */
        defaultConfig: { },
        /* 默认响应处理。如果HttpAPI中定义了response，则不调用默认响应处理方法。 */
        defaultResponse: (response: any, request: HttpRequest) => {
            /* 响应结果处理，可以修改返回的响应数据。 */
            return response;
        },
        /* 默认错误处理。如果HttpAPI中定义了error，则不调用默认错误处理方法。 */
        defaultError: (error: any, request: HttpRequest) => {
            /* 错误处理 */
        },
    });

### 使用HTTP服务接口

    /*
     * 接口的URL路径、URL参数、配置选项在HttpAPI以及fetch都可以指定，还有HttpClient中的默认值，他们会自动合并。
     * 当同一属性出现多次时，该属性的取值优先级排序是：先fetch、再HttpAPI、最后HttpClient默认值。
     */
    let result = await myClient.fetch('hello', { params: { 'myname': 'Michael' }});

### 自定义Service
绝大部分实际情况中，Model数据都是先调用HTTP服务接口，根据响应数据来进行更新的。因此，建议定义一层Service方法来实现不同的业务逻辑，以封装HTTP API调用以及Model数据更新，并在View层（React组件）调用。

*svc.ts*

    export async function hello(myName: string) {
        let result = await myClient.fetch('login', {
            params: {
                'myName': myName,
            }
        });
        myModel.update('set', { answer: result.answer });
    }

*page.ts*

    import * as svc from './svc';
    
    export default () => {
        const { answer } = useModel(myModel);

        return (
            <div>
                <h1>{answer}</h1>
                <a onClick={{() => svc.hello('Ryan')}>Hello</a>
            </div>
        );
    }

## Storage
### LocalStorage

    LocalStorage.set('myName', 'Michael');
    let myName = LocalStorage.get('myName');
    LocalStorage.remove('myName');

    LocalStorage.set('myPhone', { os: 'Android', version: '10.1' } );
    let myPhone = LocalStorage.get('myPhone');
    LocalStorage.remove('myPhone');

### SessionStorage
SessionStorage提供的方法与LocalStorage一致。

### AsyncFileReader

    let buf = await AsyncFileReader.readAsArrayBuffer(file);
    let img = await AsyncFileReader.readAsDataURL(file);
    let txt = await AsyncFileReader.readAsText(file);

## LICENSE
MIT License