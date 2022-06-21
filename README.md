# 노션만들기

>💡**vecel이용예정**
- vercel을 만든 팀이 넉스트.js를 만들었습니다
- 서버리스함수에서 서울 리전을 선택할 수 있어서 넷니파이 서버리스보다 빠릅니다.
- 단점은 엣지펑션이 없다는 부분입니다.

## 🐥 파악하기
[노션예제페이지](https://compassionate-jackson-fd7d60.netlify.app/workspaces/WshMKztczVrf7K9u4BM5)

![](https://velog.velcdn.com/images/0seo8/post/8070a91a-0d7b-4b1f-a663-7a9efb391b6b/image.png)

- 주소창을 확인하면 주소/workspaces/\[워크스페이스아이디]가 있는 것을 확인할 수 있습니다.
- WoW하위, Hello Wolrd스페이스 하위, Good스페이스가 있습니다
- 상단에 경로도 표시가 되고 있습니다.

>💡**포인트**
단일페이지구조로 만들지만 여러페이지로 관리를 할수 있도록 vue router를 설치해 이용할 예정입니다.

## 🐥 개발환경 세팅

### 1. vite vue 프로젝트 시작
[vite.js공식문서]([vite.js공식문서](https://vitejs-kr.github.io/guide/#scaffolding-your-first-vite-project))

>**필요한 패키지 및 플러그인 설치**
```shell
$ npm create vite@latest 폴더이름
$ cd 폴더이름
$ code . -r
$ npm i
$ npm install vue-router pinia
$ npm i -D eslint eslint-plugin-vue sass
```
**vite.config.js**
```js
export default defineConfig({
  plugins: [vue()],
  alias: [
    {find :'~', replacement: `${__dirname}/src`},
  ]
})
```
**.eslintrc.json**
```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  "rules": {
    "semi": ["error", "never"],
    "quotes": ["error", "single"],
    "eol-last": ["error", "always"], //빈줄 하나 허용
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "never"
    }],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
        "normal": "never",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    "vue/comment-directive": "off",
    "vue/multi-word-component-names": "off"
  }
}
```

### 2. pinia연결

**store>workspace.js**

```js
import {defineStore} from 'pinia'

export const useWorkspaceStore = defineStore('workspace', {
  state() {
    return {

    }
  },
  getters: {

  },
  actions: {

  }
})

```

**main.js**

```js
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .mount('#app')
```

### 3. routes연결

>rotues에 Home.vue와 Workspace.vue를 만들어줍니다.

**3-1 routes>index.js**
```js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import Workspace from './Workspace.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({top: 0}),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/workspaces', //나중에 
      component: Workspace
    }
  ]
})

```

**3-2 main.js**
```js
import { createApp } from 'vue'
import router from './routes'
import App from './App.vue'

createApp(App
  .use(router)
  .mount('#app')
```

**3-3 App.vue , RouterView연결**
```js
<template>
  <RouterView />
</template>
```

**3-4 main.js**

```js
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import router from './routes'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

## 🐥목록? 워크스페이스?

목록이 생성된 후에 워크스페이스가 생성된 것인지, 또는 워크스페이스가 생성되어야 목록이 구성되는 것인지 딜레마에 빠질 수 있습니다.

일단, 워크스페이스를 하나정도 생성하고 목록을 가져오는 코드를 먼저 만들어보겠습니다.

[깃허브-KDT](https://github.com/KDT1-FE/KDT2-JS-M3#%EC%9B%8C%ED%81%AC%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4-%EC%83%9D%EC%84%B1)

워크스페이스 속에 들어가는 내용은 모두 div요소 안에 위치하게 됩니다. 또한 이 div안에서 특정한 영역에 css를 넣을 수 있도록 설계가 되어 있습니다(`contentitable`이용)

>**[원시HTML의 보안취약점](https://v3.ko.vuejs.org/guide/template-syntax.html#%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%89%E1%85%B5-html)**
웹사이트에서 임의의 HTML을 동적으로 렌더링하면 XSS 취약점 (opens new window)(https://en.wikipedia.org/wiki/Cross-site_scripting)으로 쉽게 이어질 수 있고 이는 매우 위험할 소지가 있습니다. HTML 보간법은 반드시 신뢰할 수 있는 콘텐츠에서만 사용하고 사용자가 제공한 콘텐츠에서는 절대 사용하면 안 됩니다.

따라서 프로젝트에서는 서버쪽에서 이를 방지를 설정을 하게 됩니다. 단, `div`,`br`을 제외한 나머지를 막게 설정을 해  div안에서 특정한 영역에 css를 넣을 수 있도록 설계했습니다.

### 1. store>workspace.js

다른 곳에서도 사용을 할 수 있도록 CRUD 함수를 store안에 작성합니다.

```js
import {defineStore} from 'pinia'

export const useWorkspaceStore = defineStore('workspace', {
  state() {
    return {

    }
  },
  getters: {

  },
  actions: {
    //CRUD
    async createWorkspace() {
      const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
        body: JSON.stringify({
          // parentId: '',
          title: '처음 만드는 워크스페이스',
          content:'내용...',
          // poster: ''
        })
      })
      const workspace = await res.json()
      console.log(workspace)
      this.readWorkspaces()
    }
  }
})
```

### 2. routes>Workspace.vue & Home.vue

**Workspace.vue**
```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button>
</template>
```
```js
<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/store/workspace'
export default {
 computed: {
  ...mapStores([useWorkspaceStore])
 } 
}
</script>
```

**Home.vue**
```
<template>
  <h1>Home!</h1>
</template>
```

## 🐥 결과확인
`http://localhost:3000/workspaces`를 확인해보면 아래와 같이 화면이 렌더링되며, 워크스페이스 생성 버튼을 누르면 콘솔에 출력되는 것을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/0seo8/post/e0dd9088-8d9f-43f7-ac6e-2f5e4b049dad/image.png)

# 노션만들기2

## 1. 워크스페이스 목록 조회

### 1-1 fetch함수
**workspace.js**

```js
    async readWorkspaces() {
      const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
      })
      const workspaces = await res.json()
      console.log(workspaces)
    }
  }
```

### 1- 2. 버튼생성 

**Workspace.vue**

```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button>
  <button @click="workspaceStore.readWorkspaces"> ✅
    워크스페이스 조회!
  </button>
</template>
```

워크스페이스 조회 버튼을 클릭하면 콘솔에 아래와 같이 출력이 됩니다.

![](https://velog.velcdn.com/images/0seo8/post/0cfa6b0f-833a-4b0b-b58b-1ccff8b99a8c/image.png)

하지만 이는 워크스페이스에 대한 상세정보는 아닙니다.

![](https://velog.velcdn.com/images/0seo8/post/bab747a3-ac41-41d3-b104-69fec4de1379/image.png)
 
 이 모든 정보가 들어있지 않으며 title만 출력이 됩니다. 따라서 이는 목록을 만들때 사용하면 됩니다.
 (상세정보는 목록을 클릭해 상세정보로 들어갔을 때 사용을 하면 됩니다.)
 
### 1-3 데이터로 관리

가지고 온 정보를 스토어의 데이터로 만들어줍니다.

```js
  state() {
    return {
      workspaces: [] ✅//데이터를 초기화.
    }
  },
    ...
     //워크스페이스 목록 조회
    async readWorkspaces() {
      const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
      })
      const workspaces = await res.json()
      this.workspaces = workspaces ✅ //workspaces 데이터에 가지고 온 정보를 담아줍니다.
      
      //위 두줄을 this.workspaces = awati res.json()으로 바로 할당하는 것이 더 좋습니다.
    }   
```
 
 ### 1-4 화면에 출력해보기
 
 **components > LNB.vue (left navigation bar)**
 
 ```html
<!-- 목록 출력 -->
<template>
  <ul>
    <!-- 모듈이름.workspaces -->
    <li
      v-for="workspace in workspaceStore.workspaces"
      :key="workspace.id">
      {{ workspace.title }}
    </li>
  </ul>
</template>
```
```js
//store의 데이터가져와 연결
<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/store/workspace'
export default {
 computed: {
  ...mapStores(useWorkspaceStore)
 } 
}
</script>
```

### 1-5 출력 위치 선정

>navigation은 항상 왼쪽에 있을 것이라고 전제합니다.

**App.vue**

```html
<template>
  <LNB />
  <RouterView />
</template>
```

```js
<script>
import LNB from '~/components/LNB.vue'
export default {
  components: {
    LNB
  }
}
</script>
```

![](https://velog.velcdn.com/images/0seo8/post/51bcf3ae-13fd-40f9-be6c-1517c323cf6d/image.png)

워크스페이스 생성 버튼을 누르면 위와 같이 출력이 됩니다.

버튼을 눌러야 출력되는 것이 아니라 완성본처럼 왼쪽에 네비게이션이 항상 떠있을 수 있도록 구성해보도록 하겠습니다. 즉, 화면에 그려지기 전에 요청이 들어가야합니다.

**LNB.vue**

```js
export default {
 computed: {
  ...mapStores(useWorkspaceStore)
 },
 created() {
  this.workspaceStore.readWorkspaces()
 }
}
</script>
```

## 2. 삭제기능 추가

>**워크스페이스 삭제**
- 특정 워크스페이스를 삭제합니다.
- 자식 워크스페이스의 부모 워크스페이스 참조도 같이 삭제됩니다.
```
curl -X 'DELETE' \ 
https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/:workspaceId
```

![](https://velog.velcdn.com/images/0seo8/post/0ecdeb81-6a4d-40a7-9bb5-614112a57d15/image.png)

WoW 하위의 HelloWorld 스페이스를 지우니 그 자식으로 위치했던 Good~는 상위로 올라오는 것을 확인할 수 있습니다.

(workspaceId는 삭제할 목록을 누르면 그 목록의 아이디를 가져오게 만들 것입니다.)

### 2-1 삭제 api 호출

**workspace.js**
```js
async deleteWorkspaces(id) {
  // 요청 주소에 동적라우터가 포함되어 있습니다.(:workspaceId)
  await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'Rohyoungseo'
    }, 
  })
  // await res.json() : 요청이 들어가는 것으로(삭제) 끝이기 때문에 굳이 json으로 parsing할 필요가 없습니다.
}
```

### 2-2 화면처리

요청을 보내 DB상으로는 지웠기 때문에 이제 화면에서 처리를 해줘야합니다.

>**화면에서 없애는 방법**
1. id를 바탕으로 workspaces 목록에서 개만 지우기!
2. 목록을 서버에서 다시 가져오기
- 최적화는 1번이 좋지만 복잡합니다. 2번은 최적화는 아니지만 편합니다 저희는 2번으로 진행하도록 하겠습니다.

```js
async deleteWorkspaces(id) {

  // 요청 주소에 동적라우터가 포함되어 있습니다.(:workspaceId)
  await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'Rohyoungseo'
    },
  })
  this.readWorkspaces() ✅
}
```
### 2-3 삭제버튼생성

**LNB.vue**

```html
<template>
  <ul>
    <!-- 모듈이름.workspaces -->
    <li
      v-for="workspace in workspaceStore.workspaces"
      :key="workspace.id">
      {{ workspace.title }}
      <button @click="workspaceStore.deleteWorkspaces(workspace.id)"> //✅
        삭제
      </button>
    </li>
  </ul>
</template>
```

### 2-4 동적라우터 설정 + 화면 갱신

**routes>index.js**
```js
{
  path: '/workspaces/:id',✅
  component: Workspace
}
```

**Workspace.vue**
>`this.$route.params.id`를 이용해서 id를 찾아낼 것입니다.

```js
 created() {
  this.$route.params.id
 } 
```

## 3 상세정보가져오기

>**워크스페이스 상세 내용 조회**
단일 워크스페이스의 상세 내용을 가져옵니다.
```
curl -X 'GET' \ 
https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/:workspaceId
```

### 3-1 api가져오기

**workspace.js**
```js
state() {
  return {
    workspace: {}, //null도 가능
    workspaces: []
  }
},
    ....
actions: {    
//상세정보 조회
async readWorkspace(id) {
  const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'Rohyoungseo'
    },
  })
  const workspace = await res.json()
  console.log(workspace)  

  this.workspace = workspace
  },
}
```

**workspace.vue**
```js
 created() {
  this.workspaceStore.readWorkspace(this.$route.params.id)
 } 
```

### 3-2 Workspace.vue HTML

```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button>
  <div>
    <h1>{{ workspaceStore.workspace.title }}</h1>
    <p>{{ workspaceStore.workspace.content }}</p>
  </div>
</template>
```

### 3-3 LNB의 title을 클릭하면 상세페이지로 이동하게금 설정

```html
<template>
  <ul>
    <!-- 모듈이름.workspaces -->
    <li
      v-for="workspace in workspaceStore.workspaces"
      :key="workspace.id">
      
      //✅
      <RouterLink :to="`/workspaces/${workspace.id}`">
        {{ workspace.title }}
      </RouterLink>
      
      <button @click="workspaceStore.deleteWorkspaces(workspace.id)">
        삭제
      </button>
    </li>
  </ul>
</template>
```

![](https://velog.velcdn.com/images/0seo8/post/517e364b-ca0d-4d9e-b37a-71c36fa5ec99/image.png)

와 같이 타이틀을 클릭하면 아래 페이지가 출력됩니다.

문제점은 다른 타이틀을 클릭하면 주소는 변경되지만 내용이 바뀌지 않는 것을 확인할 수 있습니다.

이는 **vue.js의 화면에 보이는 어떠한 정보를 변경하려고 할 때 구조적으로 같으면 그 상태를 유지하려고 하기 때문에 생기는 문제**입니다.


이를 해결하기 위해서는 각 태그(`div`)가 다른것이라는 것을 명확하게 해줘야합니다. 이는 key를 이용해 명확하게 할 수 있습니다.

**Workspace.vue**
```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button>
  <div :key="$route.params.id"> ✅다른 div임을 인식하게 됩니다.
    <h1>{{ workspaceStore.workspace.title }}</h1>
    <p>{{ workspaceStore.workspace.content }}</p>
  </div>
</template>
```
```js
<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/store/workspace'
export default {
 computed: {
  ...mapStores(useWorkspaceStore)
 },
 watch: { //✅페이지가 바뀔 때마다 상세정보를 다시 가져옴
  $route() {
    this.workspaceStore.readWorkspace(this.$route.params.id)
  }
 },
 created() {
  this.workspaceStore.readWorkspace(this.$route.params.id)
 } 
}
</script>
```
## 4. 생성한 코드 리팩토링

### 4-1 contenteditable

**Workspace.vue**

임시로 div요소를 만들어보겠습니다.

```html
...

  <div contenteditable>
    Heropy~!!
  </div>
</template>
```
![](https://velog.velcdn.com/images/0seo8/post/f54c1f08-c5cd-4cba-a21f-d015ae94cf9e/image.png)

위와 같이 생성된 것을 확인할 수 있습니다.

```html
  <div contenteditable>
    <span style="color:red; font-size: 20px;">He</span>ropy~!!
  </div>
```

> 장점: input, textarea와 다르게 스타일을 설정할 수 있습니다. , enter치는 만큼 크기가 늘어납니다.(줄바꿈이 가능합니다)
단점: 서버로 데이터를 전송되는 경우 날것의 것이 전송되기 때문에 악의적인 코드가 포함되어 문제가 발생할 수 있습니다.(XSS)

따라서 프로젝트에서는 `content`내에서 `div`,`br`태그만을 허용합니다.


**Workspace.vue**

```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button>

  <section :key="$route.params.id">
    <h1 contenteditable>
      {{ workspaceStore.workspace.title }}
    </h1>
    <p contenteditable>
      {{ workspaceStore.workspace.content }}
    </p>
  </section>
</template>
```
>⭐⭐**point**
title에서는 줄바꿈을 고려하지 않을 예정으로 title부분에서 enter을 하는 경우 content로 focus가 넘어가게 됩니다. 즉, div없이 textcontent만 사용하게 할 것입니다
- 글자만 필요(div를 걷어내야함)하기 때문에 innerHTML이 아니라 textcontent을 사용합니다
- 반면, content는 줄바꿈도 허용(div사용도 허용)할 것이기 때문에 div가 포함될 수 있도록 innerHTML을 사용할 예정입니다.

```js
...
 methods: {
  onInput() {
    const title = this.$refs.title.textContent
    const content = this.$refs.content.innerHTML
  }
...   
```
![](https://velog.velcdn.com/images/0seo8/post/33298d4f-2baa-4665-a55b-2fbd2d1ece47/image.png)

### 4-2 수정api 만들기

>**워크스페이스 수정**
워크스페이스의 내용(content)은 `<div>`, `<br>` 태그만 허용합니다.
```
curl -X 'PUT' \ 
https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/:workspaceId
```
- title와 content를 각각 수정하는 api가 아니라 동시에 하는 api입니다. 즉 어떤 것을 수정하더라도 api를 호출해 동시에 수정할것입니다.
- return 값으로 수정된 정보가 옵니다.

**workspace.js**
  
```js
    //수정
    async updateWorkspace(payload){
      const {id, title, content, poster} = payload
      await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
        body:JSON.stringify({
          title,
          content,
        })
      })
```

**문제점 체크**

제목을 수정하면 workspace에서는 바로 수정되지만 navigaition은 바로 갱신이 되지 않기 떄문에 갱신을 시켜줘야합니다.
```js
    async updateWorkspace(payload){
      const {id, title, content, poster} = payload
      await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
        body:JSON.stringify({
          title,
          content,
        })
      })
      this.readWorkspaces() ✅//이부분 추가
    },
```

### 4-3 수정가능한 상태 만들기

**Workspace.vue**

>content에서 수정이 끝나면 blur이벤트가 발생하게 됩니다.
```html
  <section :key="$route.params.id">
    <h1
      ref="title"
      contenteditable
      @blur="onInput">
      {{ workspaceStore.workspace.title }}
    </h1>
    <p
      ref="content"
      contenteditable
      @blur="onInput">
      {{ workspaceStore.workspace.content }}
    </p>
  </section>
```

>Workspace가 열려있다는 것은 주소부분에 id가 포함되어 있다는 것입니다. 따라서 id는 주소에서 가지고 옵니다.

```js
 methods: {
  onInput() {
    const title = this.$refs.title.textContent
    const content = this.$refs.content.innerHTML

    this.workspaceStore.updateWorkspace({ //✅
      id:this.$route.params.id,
      title,
      content
    })
  }
 } 
```

**문제점**
content에서 enter을 치면서 수정하고 blur가 되면 아래와 같이 div태그도 함께 출력이 됩니다.

![](https://velog.velcdn.com/images/0seo8/post/e63581c3-53c2-46a1-9ffb-39ce411403d5/image.png)

따라서 p태그는 v-html을 이용해야합니다.

```html
    <p
      ref="content"
      contenteditable
      @blur="onInput"
      v-html="workspaceStore.workspace.content">
    </p>
```

>h1에서 enter를 하는 경우 content로 포커스가 넘어가게 하자
contenteditable에서 enter를 하면 줄바뀜이 되는 것은 기본 동작입니다. 따라서 prevent수식어를 사용할 수 있습니다.

```html
<h1
    ref="title"
    contenteditable
    @blur="onInput"
    @keydown.prevent.enter="$refs.content.focus()">
  {{ workspaceStore.workspace.title }}
</h1>
```

### 4-4 placeholder

![](https://velog.velcdn.com/images/0seo8/post/d361127d-0ec9-40c8-a764-40493e396060/image.png)


contenteditable에서는 placeholder를 지원하지 않기 때문에 특별한 방법으로 만들어줘야합니다.

```html
  <section :key="$route.params.id">
    <h1
      ref="title"
      placeholder="제목 없음"
      contenteditable
      @blur="onInput"
      @keydown.prevent.enter="$refs.content.focus()">
      {{ workspaceStore.workspace.title }}
    </h1>
    <p
      ref="content"
      placeholder="내용을 입력하세요!"
      contenteditable
      @blur="onInput"
      v-html="workspaceStore.workspace.content">
    </p>
  </section>
```

따라서 placeholder="제목 없음"는 동작하지 않습니다. 이를 위해 약간의 css작업을 추가하도록 하겠습니다.

```scss
<style scoped lang="scss">
  [contenteditable] {
    //해당하는 요소의 내용이 비어져있을 때
    &:empty::before {
      content: attr(placeholder);
    }
  }
</style>
```

그런데 `br`등의 불필요한 태그들이 남는 경우 적요이 되지 않습니다. 따라서 자바스크립트에 조건을 넣어주겠습니다.

```js
  onInput() {
    const title = this.$refs.title.textContent
    const content = this.$refs.content.innerHTML

    if(!title.trim()) {
      this.$refs.title.innerHTML = ''
    }
    if(!this.$refs.content.textContent.trim()) {
      this.$refs.content.innerHTML = ''
    }

    this.workspaceStore.updateWorkspace({
      id:this.$route.params.id,
      title,
      content
    })
  }
```
# 노션만들기3

## 자식 워크스페이스 생성

## 1. 이해

![](https://velog.velcdn.com/images/0seo8/post/583005f6-4b7b-411d-8cfc-effbc26cf6ce/image.png)

위와 같이 하위의 자식들을 가실 수 있습니다. 물론, 처음에 워크스페이스를 생성한다면 최상위 워크스페이스가 될테지만 하나 이상생긴다면 첫번째 워크스페이스를 기준으로 하위 워크스페이스를 생성할 수 있을 것입니다.

>워크스페이스 생성
워크스페이스를 생성합니다.
워크스페이스의 내용(content)은 `<div>`, `<br>` 태그만 허용합니다.
```
curl -X 'POST' \ 
https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces
```
@param {String} parentId - 부모 워크스페이스 ID
@param {String} title - 워크스페이스 제목
@param {String} content - 워크스페이스 내용
@param {String} poster - 워크스페이스 대표 이미지(Base64)
@return {Object} - 생성된 워크스페이스 객체
  
```js
  async createWorkspace(payload) {
    const {parentId} = payload
```

>
- 개인적으로 매개변수를 여러개 만드는 것보다 추후 확장성을 고려해 payload라는 매개변수를 받아서 그안에서 꺼내쓰는것을 권장합니다.
- 만약 payload로 아무런 값도 들어오지 않는다면 undefined가 되게 됩니다. 이때 객체구조분해할당을 하게 되면 error가 나기 떄문에 기본값을 {}빈객체로 만들어줍니다.
  
**workspaces.js** 
```js
    async createWorkspace(payload={}) {
      const {parentId} = payload

      const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'apikey': 'FcKdtJs202204',
          'username': 'Rohyoungseo'
        },
        body: JSON.stringify({
          parentId,
          title: 'HelloWorld',
          content:'내용1234...',
          // poster: ''
        })
      })
      const workspace = await res.json()
      console.log(workspace)
      this.readWorkspaces()
    },  
```
  
**Workspace.vue**
  
```html
<template>
  <h1>Workspace!</h1>
  <button @click="workspaceStore.createWorkspace">
    워크스페이스 생성!
  </button> 
...  
```

`workspaceStore.createWorkspace`이부분에 따로 인수를 넣지 않는다면 parentId는 undefined가 되게 됩니다.
즉, 아무것도 넣지 않는다면  parentId가 없는 것과 같기에 최상위워크스페이스가 만들어지게 되는 것입니다.
  
## 2. 생성 버튼

![](https://velog.velcdn.com/images/0seo8/post/8df8ab16-5e7c-44fb-9c5e-52f04a7fd0b8/image.png)

+버튼은 해당워크자식컴포넌트가 생기고, 하단의 새로운 페이지를 누르면 부모워크스페이스가 생깁니다.
플러스 부분을 클릭하면 위와 같이 하위에 바로 빈페이지가 생성되게 됩니다.
  
![](https://velog.velcdn.com/images/0seo8/post/a084ee19-0be4-4d9c-84bb-4fcce96f7556/image.png)

+버튼을 누르면 제목이 비어있는 자식 워크스페이스가 생기게 됩니다.
 
### 2-1 +버튼
 
**LNB.vue**
  
```html
<button @click="workspaceStore.createWorkspace({parentId:workspace.id})">✅
  추가
</button>
```
✅부모 아이디를 함께 넣어줘야합니다. 새로운 워크스페이스를 만들때 title을 비울 예정입니다. (제목없음)

![](https://velog.velcdn.com/images/0seo8/post/758476ef-f73f-4ee0-8ca7-7ffc3d88e685/image.png)

(+)추가버튼을 누르면 화면에 렌더링이 되지 않지만, 아래와 같이콘솔창으로 확인해보면 children으로 title:''로 생긴 것을 확인할 수 있습니다.  

![](https://velog.velcdn.com/images/0seo8/post/c37cf758-4cd9-4861-a99b-c3dd4c6da258/image.png)

----

![](https://velog.velcdn.com/images/0seo8/post/2817a0dd-0d37-4080-a584-2282f60c09b6/image.png)

위와 같은 구조가 화면에 뿌려지는 방법을 연습하는 것입니다.

![](https://velog.velcdn.com/images/0seo8/post/d041be19-c9de-4219-bd4f-047edd71f0b2/image.png)

위 콘솔에 출력한 상태는 아래와 같이 목록이 모두 열려있는 것과 같습니다.

![](https://velog.velcdn.com/images/0seo8/post/cc9aaf21-dfbb-4657-9c57-09148c3cc235/image.png)

----

## 3. 재귀컴포넌트

>💡**Vue.js**
vue.js의 경우 컴포넌트를 재귀적으로 사용을 할 수 있습니다.


![](https://velog.velcdn.com/images/0seo8/post/4d86d3b2-c506-4b66-b1f6-10dc6e6783b8/image.png)


### 3-1 사용할 컴포넌트 분리

현재 네모칸 친 부분을 재귀적으로 출력하기 위해 체크된 부분을 컴포넌트로 만들어보도록 하겠습니다.

**WorkspaceItem**
```html
<template>
  <li
    v-for="workspace in workspaceStore.workspaces"
    :key="workspace.id">
    <RouterLink :to="`/workspaces/${workspace.id}`">
      {{ workspace.title }}
    </RouterLink>
    <button @click="workspaceStore.createWorkspace({parentId:workspace.id})">
      추가
    </button>
    <button @click="workspaceStore.deleteWorkspaces(workspace.id)">
      삭제
    </button>
  </li>
</template>
```
```js

<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/sotre/workspace'

export default {
  computed: {
    ...mapStores(useWorkspaceStore)
  }
}
</script>
```

LNB.vue에서 li부분을 잘라내어 WorkspaceItem.vue에 붙여줍니다. 또한 pinia를 연결해줍니다.


### 3-2 LNB.vue에 등록
```html
<template>
  <ul>
    <WorkspaceItem />✅
  </ul>
</template>
```
```js
<script>
import { mapStores } from 'pinia'
import { useWorkspaceStore } from '~/store/workspace'
import WorkspaceItem from '~/components/WorkspaceItem.vue'✅

export default {
  components: {✅
    WorkspaceItem
  },
 computed: {
  ...mapStores(useWorkspaceStore)
 },
 created() {
  this.workspaceStore.readWorkspaces()
 }
}
</script>
```

### 3-3 정리

#### 1. v-for은 App.vue로! props로 workspace 내려보내기!

컴포넌트가 하는 역할을 단순하게 단순 아이템만(아이템안의 배열은 취급하지 않음)출력하기 위해 반복되는 코드는 workspaceItem에 존재해서 안됩니다. 대신 LNB.vue에 있어야합니다.

**WorkspaceItem**
```html
<template>
  <li>
    <RouterLink :to="`/workspaces/${workspace.id}`">
      {{ workspace.title }}
    </RouterLink>
    <button @click="workspaceStore.createWorkspace({parentId:workspace.id})">
      추가
    </button>
    <button @click="workspaceStore.deleteWorkspaces(workspace.id)">
      삭제
    </button>
  </li>
</template>
```
```js
export default {
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapStores(useWorkspaceStore)
  }
}
</script>
```

**LNB.vue**
```html
<template>
  <ul>
    <WorkspaceItem
      v-for="workspace in workspaceStore.workspaces" //
      :key="workspace.id"
      :workspace="workspace" /> //✅props로 내려보내줍니다.
  </ul>
</template>
```

### 3-4 컴포넌트 재귀 => 강의 놓침,정리필요

놓쳤따!!!

**workspaceItem**
```html
<template>
  <li>
    <RouterLink :to="`/workspaces/${workspace.id}`">
      {{ workspace.title }}
    </RouterLink>
    <button @click="workspaceStore.createWorkspace({parentId:workspace.id})">
      추가
    </button>
    <button @click="workspaceStore.deleteWorkspaces(workspace.id)">
      삭제
    </button>
    <ul v-if="workspace.children"> //✅
      <WorkspaceItem
        v-for="ws in workspace.children"
        :key="ws.id"
        :workspace="ws" />
    </ul>
  </li>
</template>
```

재귀할 코드를 가져와 붙여넣은 후 중복되는 코드가 발생하지 않도록 workspace를 ws로 수정해줍니다. v-if를 통해 workspace.children로 설정해줍니다. v-for부분도  workspace.children로 변경해줍니다.

### 3-5

```html
<template>
  <li>
    <RouterLink :to="`/workspaces/${workspace.id}`">
      {{ workspace.title || '제목 없음' }} //✅
```


## 4. 포스터넣기

![](https://velog.velcdn.com/images/0seo8/post/a169cd58-8fd7-4ef7-b7c3-900485cf77d2/image.png)

포스터에 x버튼이 있어 삭제도 가능합니다.

### 4-1 포스터를 넣을 자리를 만들기

**Workspace.vue**
```html
  <section :key="$route.params.id">
    <div class="poster">
      <img
        v-if="workspaceStore.workspace.poster"
        :src="workspaceStore.workspace.poster"
        alt="poster" />
      <input type="file" />
    </div>
```

- 포스터를 출력한 위치와 포스터를 입력받을 input태그를 만들어줍니다.
- 포스터가 있을 때만 출력되도록 v-if를 걸어줍니다.
- src속성에 포스터를 넣어줍니다

# 노션페이지만들기4

![](https://velog.velcdn.com/images/0seo8/post/b0811c88-d8e3-40d8-b512-c3031f1bbd7c/image.png)

경로표시하는 것이 학습목표입니다.

## 🐥복습

### 1. 전체 페이지들의 상위 경로 확인

```js
let currentWorkspacePath = []
const workspaces =[
  {
    id: '1',
    children: [
      {
        id: '1-1',
        children: [
          {id: '1-1-1'}
        ]
      },
      {
        id: '1-2',
        children: [ㄴ
          {id: '1-2-1'}
        ]
      },
    ]
  },
  {
    id: '2',
    children: [
      { id: '2-1' },
      { id: '2-2' }
    ]
  },
  { id: '3' }
]
```
```js
function findWorkspacePath() {
  function find(workspace, parents =[]) {
    if(workspace.children) {
      workspace.children.forEach(ws => {
        find(ws, [...parents, workspace])
      })
    }
    console.log([...parents, workspace])
  }
  workspaces.forEach(ws => {
    find(ws)
  })
}

findWorkspacePath()
console.log(currentWorkspacePath)
```
![](https://velog.velcdn.com/images/0seo8/post/79150b3c-f20c-42a4-8412-81dea79866ee/image.png)

workspace의 모든 구조가 배열로 존재하게 됩니다.

### 2. 현재 페이지의 상위 경로 확인

만약, 내가 원하는 아이디만 찾고 싶다면 아래와 같이 if문을 넣어줍니다.

```js
function findWorkspacePath() {
  function find(workspace, parents =[]) {
    const id='1-2-1'
    if(id===workspace.id) {
      currentWorkspacePath = [...parents, workspace]
    }
    if(workspace.children) {
      workspace.children.forEach(ws => {
        find(ws, [...parents, workspace])
      })
    }
  }
  workspaces.forEach(ws => {
    find(ws)
  })
}

findWorkspacePath()
console.log(currentWorkspacePath)
```

![](https://velog.velcdn.com/images/0seo8/post/ee2efd11-d2fb-40a5-aa99-b2ebc5884dde/image.png)

## 3. findWorkspacePath

### 3-1 store > workspace.js > actions > findWorkspacePath

```js
findWorkspacePath({ state, commit }) {
  const currentWorkspaceId = router.currentRoute.value.params.id
  function _find(workspace, parents) {
    ...
  }
}
```

지난 시간에 발생했던 에러의 경우 현재 페이지에 대한 id정보를 알아내기 위해 `router.currentRoute.value.params.id`를 통해 id값을 스크립트 부분에서 조회해하려고 했었습니다. 예상하기로는 피니아에서의 구조가 vuex와 달라 발생하는 에러로 보입니다.

따라서 스크립트에서 알아내지 않고  `findWorkspacePath`가 호출될 때 주소에 있는 workspaceid값을 알아내서 인수로 받아 사용하는 방식으로 수정하도록 하겠습니다.

```js
findWorkspacePath(currentWorkspaceId) { ✅스크립트가 아니라 인수로 받아서 사용
 function _find(workspace, parents) {
    ...
  }
}
```

### 3-2 확인

**TheHeader.vue**
```html
<template>
  <header>
    Headr!!
    <div>{{workspaceStore.currentWorkspacePath}}</div>✅
  </header>
</template>
```
```js
<script>
export default {  
  mounted() {
    this.workspaceStore.findWorkspacePath(this.$route.params.id)
  }
}
</script>
```
`this.$route.params.id`는 현재 주소에 있는 id입니다.

**확인을 해보면 화면에 제대로 나오지 않습니다.**

### 3-3 왜 동작하지 않을까?

`findWorkspacePath`가 실행되는 위치는 `TheHeader`라는 컴포넌트와 연결되면 입니다.

**전체코드**
```js
findWorkspacePath(currentWorkspaceId) {
  const find = (workspace, parents) => {
    if(currentWorkspaceId === workspace.id) {
      this.currentWorkspacePath = [...parents, workspace]
    }
    if(workspace.children) {
      workspace.children.forEach(ws => {
        find(ws, [...parents, workspace])
      })
    }
  }
  this.workspaces.forEach(workspace => {
    find(workspace, [])
  })
}
```

현재, findWorkspacePath의 전체코드는 위와 같습니다. 그런데 findWorkspacePath의 경우 `this.workspaces`를 받아야 forEach를 돌려서 완성 될 수가 있습니다.

그런데 TheHeader의 mounted가 실행될 때는 아직 `this.workspaces`를 요청해서 받지 못한 상황입니다.

### 3-4 그렇다면 언제 ?

**LNB.vue**의 created부분의 `this.workspaceStore.readWorkspaces()`가 호출되고 가지고 오는 행위가 다끝나야 `this.workspaces`가 존재하게 됩니다.

그렇다면 아래와 같이 **LNB.vue**에서 사용을 하면 될까요?

```js
 async created() {
  await this.workspaceStore.readWorkspaces()
  this.workspaceStore.findWorkspacePath(this.$route.params.id)
 }
```
하지만 `findWorkspacePath`는 액션은 TheHeader.vue에서 활용하기 위해 만든 것이기에 LNB.vue에서 호출한다는 것은 조금 이상합니다.

따라서 아래와 같이 수정해주도록 하겠습니다.

**workspace.js**
```js
  state() {
    return {
      workspacesLoaded: false
    }
   actions: {
    //워크스페이스 목록 조회
    async readWorkspaces() {
      const workspaces = await request({
        method:'GET'
      })

      this.workspaces = workspaces
      this.workspacesLoaded = true //목록을 다 가지고 오면 그떄 true로 변경

      if(!this.workspaces.length) {
        this.createWorkspace()
      }
    },
```

**TheHeader.vue**
```html
<div>{{workspaceStore.currentWorkspacePath}}</div>
```
```js
export default {
  computed: {
    ...mapStores(useWorkspaceStore),
    workspacesLoaded() {
      return this.workspaceStore.workspacesLoaded
    }
  },
  watch: {
    workspacesLoaded(value) {
    value && this.workspaceStore.findWorkspacePath(this.$route.params.id)
    },
    $route() {
      this.workspaceStore.findWorkspacePath(this.$route.params.id)
    }
  }
}
</script>
```

>**💡 A && B**
A가 true이면 B가 실행되게 됩니다.

각각배열의 워크스페이스가 가지고 있는 정보가 아래와 같이 출력되게 됩니다.

![](https://velog.velcdn.com/images/0seo8/post/b7d24f3e-8894-466d-82e1-7a610e47437c/image.png)

이 객체데이터 중 title만 필요하기 떄문에 title을 뽑아 나열하도록 하겠습니다.

```html
<template>
  <header>
    Header!!
    <ul>
      <li
        v-for="path in workspaceStore.currentWorkspacePath"
        :key="path.id">
        {{ path.title || '제목 없음' }} //✅tile이 없으면 '제목 없음'
      </li>
    </ul>
  </header>
</template>
```
![](https://velog.velcdn.com/images/0seo8/post/222a23be-4ec4-441f-b72f-ad637856ce69/image.png)

순서대로 잘 출력되는 것을 학인할 수 있습니다.

## 4. 페이지 이동시 반영

하지만 LNB의 목록을 클릭하면 페이지 이동은 되지만 header의 내용은 바뀌지 않는 것을 볼 수 있습니다.

![](https://velog.velcdn.com/images/0seo8/post/b7ac0946-3ef3-4a2e-8657-7498e5d28cee/image.png)

이는 경로를 알아내는 `findWorkspacePath`는 워크스페이스가 생성될 때 최초로 가지고 오고 끝나기 때문입니다. 따라서 새로고침시에만 동작하고 페이지가 이동할 때는 동작하지 않는 것입니다.

>Workspace.vue의 watch부분에 한번 사용한 적이 있습니다.
```js
 watch: {
  $route() {
    this.workspaceStore.readWorkspace(this.$route.params.id)
  }
 },
```
- `$route`의 객체가 바뀌면 페이지가 변경된 것이므로 이것을 추척하게 만들어놓았습니다.

**TheHeadr**
```js
  watch: {
...
    $route() {
      this.workspaceStore.findWorkspacePath(this.$route.params.id)
    }
  }
```

## 5. 타이틀 클리시 해당페이지로 이동

**The Header.vue**

```html
<template>
  <header>
    Header!!
    <ul>
      <li
        v-for="path in workspaceStore.currentWorkspacePath"
        :key="path.id">
        <RouterLink :to="`/workspaces/${path.id}`"> ✅
          {{ path.title || '제목 없음' }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>
```

## 6. 모두 지웠을 때 최초페이지 생성

### 6-1 고유데이터가 없는 경우 새페이지 생성

```js
    //워크스페이스 목록 조회
async readWorkspaces() {
  const workspaces = await request({
    method:'GET'
  })

  this.workspaces = workspaces
  this.workspacesLoaded = true

  if(!this.workspaces.length) { ✅
    this.createWorkspace()
  }
},
```

worksapces에 정보가 없으면 createWorkspace가 실행되게 합니다.

### 6-2 페이지 생성시 그 페이지로 이동

또한 createWorkspace가 실행되면 생성된 페이지로 이동할 수 있게 만들어줍니다.

```js
async createWorkspace(payload={}) {
  const {parentId} = payload
  //워크스페이스생성
  const workspace = await request({
    method: 'POST',
    body: {
      parentId,
      title: '',
    }
  })
  this.readWorkspaces()
  //새롭게 생성한 페이지로 이동
  router.push(`/workspaces/${workspace.id}`)✅
},
```

- 페이지가 생성된 후 그 페이지로 이동할 수 있도록 workspace.js에 router를 import해 옵니다.
- Vue컴포넌트에서는 페이지 이동을 위해 `this.$router.push('/login')`과 같이 사용을 했습니다.
- 스토어에서는 `router.push(`/workspaces/${workspace.id}`)`로 사용을 할 수 있습니다.
- 아이디는 어떻게 알아낼까요?
  - POST를 날리면 요청데이터로 생성된 워크스페이스객체가 오게 됩니다. 이를 받아서 그 객체 안의 id를 사용합니다.
  
### 6-3 문제점 발생
  
- 피니아에서는 router 객체를 가져와 사용을 하는데 문제가 발생을 해 다른 방법을 통해 이동을 해보도록 하겠습니다.

```js
async createWorkspace(payload={}) {
  const {parentId} = payload
  const workspace = await request({
    method: 'POST',
    body: {
      parentId,
      title: '',
    }
  })
  this.readWorkspaces()
  window.location.href = `/workspaces/${workspace.id}` ✅
},

```
  
## 7. 스타일 설정

### 7-1 기본구조틀

!codepen[0seo8/embed/QWQoYwQ?default-tab=html%2Cresult]

- App.vue라는 컴포넌트에서 #app에는 접근을 할 수 없습니다. 만약 접근을 하려면 scoped를 날려야합니다.
- 조금 더 안전한 방법을 위해 .app-container로 한번 감싸줍니다.

### 7-2 영역분리하기
![](https://velog.velcdn.com/images/0seo8/post/8e9cd681-fac6-407e-828f-0dd1e836594e/image.png)
**App.vue**
```html
<template>
  <div class="app__container">
    <LNB />
    <div class="app__page">
      <RouterView />
    </div>
  </div>
</template>
```
```scss
<style scoped lang="scss">
.app {
  &__container {
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  }
  &__page {
    flex-grow: 1;
    box-sizing: border-box;
  }
}
</style>
```

### 7-3 네비게이션 스타일

![](https://velog.velcdn.com/images/0seo8/post/19ed4f09-3bed-4312-ae02-a7d4de6effe8/image.png)

만약 높이값이 줄어드는 경우의 스타일을 만들어볼 예정입니다.(list부분이 가변)
!codepen[0seo8/embed/QWQoYwQ?default-tab=html%2Cresult]

**LNB.vue**
```scss
<style scoped lang="scss">
nav {
  flex-shrink: 0;
  min-width: 160px;
  max-width: 500px;
  display: flex;
  flex-direction: column;   
  .header{
    flex-shrink: 0;
    height: 48px;
  }
  ul.workspaces {
    flex-grow: 1;
    overflow: auto;
  }
  .actions {
    flex-shrink: 0;
    height: 48px;
  }
}
</style>
```

### 7-4. scss전역등록

- 각 vue컴포넌트에서 @import를 통해 가져옵니다.

### 7-5 네비게이션 패딩
![](https://velog.velcdn.com/images/0seo8/post/71e757c3-1228-4fbc-9466-8cc540e0098c/image.png)

```scss
<style scoped lang="scss">
@import '~/scss/variables';
nav {
  flex-shrink: 0;
  min-width: 160px;
  max-width: 500px;
  display: flex;
  flex-direction: column;   
  background-color: $color-background;
  .header{
    flex-shrink: 0;
    height: 48px;
    padding: 14px;
  }
  ul.workspaces {
    flex-grow: 1;
    overflow: auto;
  }
  .actions {
    flex-shrink: 0;
    height: 48px;
    padding: 14px;
    border-top: 1px solid red;
  }
}
</style>
```

