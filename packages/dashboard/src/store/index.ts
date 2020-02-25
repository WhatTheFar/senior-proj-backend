import Vue from 'vue';
import Vuex from 'vuex';
import { SensorInfo } from '@/types/sensor';

Vue.use(Vuex);

interface Store {
  sensorInfo: SensorInfo[];
  currentInterval: number;
}

export default new Vuex.Store<Store>({
  state: {
    sensorInfo: [],
    currentInterval: -1,
  },
  getters: {
    sensorInfo: ({ sensorInfo }) => sensorInfo,
  },
  mutations: {
    setSensorInfo: (state, payload: SensorInfo[]) => {
      const sortedPayload: SensorInfo[] = JSON.parse(JSON.stringify(payload));
      sortedPayload.forEach((o) => (o.multi = []));
      payload.forEach((obj, index) => {
        obj.multi.forEach((e) => {
          if (e.device === 1) {
            sortedPayload[index].multi[0] = e;
          } else if (e.device === 2) {
            sortedPayload[index].multi[1] = e;
          } else if (e.device === 3) {
            sortedPayload[index].multi[2] = e;
          } else if (e.device === 4) {
            sortedPayload[index].multi[3] = e;
          }
        });
      });
      state.sensorInfo = sortedPayload;
    },
    setInterval: (state, payload) => {
      state.currentInterval = payload;
    },
  },
  actions: {
    startPollingSensorInfo: async ({ commit }) => {
      const { data } = await Vue.axios.get<SensorInfo>('iot/sensor', {
        params: {
          offset: 0,
          limit: 10,
        },
      });
      commit('setSensorInfo', data);
      const interval = setInterval(async () => {
        const { data } = await Vue.axios.get<SensorInfo>('iot/sensor', {
          params: {
            offset: 0,
            limit: 10,
          },
        });
        commit('setSensorInfo', data);
      }, 30 * 1000);
      commit('setInterval', interval);
    },
    stopPollingSensorInfo: ({ state, commit }) => {
      clearInterval(state.currentInterval);
      commit('setInterval', -1);
    },
  },
  modules: {},
});
