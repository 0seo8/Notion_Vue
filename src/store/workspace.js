import {defineStore} from 'pinia'
import router from '~/routes'

export const useWorkspaceStore = defineStore('workspace', {
  state() {
    return {
      workspace: {}, //null도 가능
      workspaces: [],
      currentWorkspacePath: []
    }
  },
  getters: {

  },
  actions: {
    //CRUD
    async createWorkspace(payload={}) {
      const {parentId} = payload
      await request({
        method: 'POST',
        body: {
          parentId,
          title: '',
        }
      })
      this.readWorkspaces()
    },
    //워크스페이스 목록 조회
    async readWorkspaces() {
      const workspaces = await request({
        method:'GET'
      })

      this.workspaces = workspaces
    },
    //상세정보 조회
    async readWorkspace(id) {
      const workspace = await request({
        method:'GET',
        id
      })
      this.workspace = workspace
    },
    //수정
    async updateWorkspace(payload){
      const {id, title, content, poster} = payload
      
      const updatedWorkspace =  await request({
        id,
        method:'PUT',
        body: {
          title,
          content,
          poster
        }
      })
      this.workspace = updatedWorkspace
      this.readWorkspaces()
    },
    async deleteWorkspaces(id) {      
      // 요청 주소에 동적라우터가 포함되어 있습니다.(:workspaceId)
      await request({
        id,
        method: 'DELETE'
      })
      this.readWorkspaces()
    },
    findWorkspacePath() {
      const currentWorkspaceId = router.currentRoute.value.params.id
      function find(workspace, parents) {
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
  }
})


async function request(options) {
  const { id='', method, body } = options
  const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/notion/workspaces/${id}`, {
    method,
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202204',
      'username': 'Rohyoungseo'
    },
    body: JSON.stringify(body)
  }) 
  //await가 있을 필요가 없습니다.
  //res.json() => promise 인스턴스
  return res.json()
}
