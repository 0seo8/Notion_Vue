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