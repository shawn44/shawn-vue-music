import * as types from './mutations-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, fullScreen) {
    state.fullScreen = fullScreen
  },
  [types.SET_PLAYLIST](state, playList) {
    state.playList = playList
  },
  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CIRRENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex
  }
}

export default mutations
