<template>
  <div>
    <!-- {{ data.prefectures }} -->
    {{ data.population }}
    <Chart />
    <div class="checkbox-container">
      <div
        class="checkbox-item"
        v-for="(pref, index) in data.prefectures"
        :key="index"
      >
        <input
          type="checkbox"
          v-model="data.prefcode"
          :name="pref.prefCode"
          :value="pref.prefCode"
          @change="getCheckedPopulation"
        />
        <label>{{ pref.prefName }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  useContext,
} from "@nuxtjs/composition-api";
import Chart from "@/components/Chart.vue";

export default defineComponent({
  components: {
    Chart,
  },
  setup() {
    onMounted(() => {
      getPrefectures();
    });

    // const { $config } = useContext();
    const { $axios, $config } = useContext();

    const data = reactive({
      prefectures: [],
      prefcode: [],
      population: [],
    });

    const baseURL = $config.baseURL;
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": $config.apiKey,
    };

    const getCheckedPopulation = () => {
      let p = data.prefcode;
      let tmpdata = [];
      for (let i in p) {
        getPopulation(p[i]).then((result) => {
          tmpdata.push(result);
        });
      }
      data.population = tmpdata;
    };

    const getPopulation = async (code) => {
      const populationUrl = `${baseURL}api/v1/population/composition/perYear?cityCode=-&prefCode=${code}`;
      const res = await $axios.$get(populationUrl, { headers: headers });
      return res;
    };

    const getPrefectures = async () => {
      const prefecturesUrl = `${baseURL}api/v1/prefectures`;
      const res = await $axios.$get(prefecturesUrl, { headers: headers });
      data.prefectures = res.result;
    };

    return { data, getCheckedPopulation };
  },
});
</script>

<style>
.checkbox-container {
  width: 600px;
  display: flex;
  flex-flow: row wrap;
}

.checkbox-item {
  margin: 10px;
}
</style>
