import { HorizontalBar } from 'vue-chartjs';
import utils, { DATAKEY } from '../assets/js/utils';

export default {
  extends: HorizontalBar,
  async mounted() {
    const currentDate = utils.getCurrentDate();
    let data = await utils.getData(DATAKEY);
    data = data[currentDate] || {};
    const values = Object.values(data).map(each => (each / 60).toFixed(2));
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: Object.keys(data),
      datasets: [{
        label: `Stats for ${currentDate}`,
        // label: 'Stats for today',
        backgroundColor: '#f87979',
        data: values
      }]
    }, {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Minutes'
          }
        }],
        yAxes: [{
          barThickness: 'flex'
        }]
      }
    });
  }
};
