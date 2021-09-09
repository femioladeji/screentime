import { HorizontalBar } from 'vue-chartjs';
import utils, { DATAKEY } from '../assets/js/utils';

export default {
  extends: HorizontalBar,
  async mounted() {
    const currentDate = utils.getCurrentDate();
    let data = await utils.getData(DATAKEY);
    data = data[currentDate] || {};
    const values = Object.values(data).map(each => (each / 60).toFixed(2));
    const backgrounds = utils.getBarGradients(this.$refs.canvas.getContext('2d'), values.length);
    this.renderChart({
      labels: Object.keys(data),
      datasets: [{
        label: '',
        hoverBackgroundColor: backgrounds,
        backgroundColor: backgrounds,
        data: values,
        barThickness: 'flex'
      }]
    }, {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'MINUTES'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'SITES'
          }
        }]
      }
    });
  }
};
