import { HorizontalBar } from 'vue-chartjs';
import storage from '../assets/js/storage';

export default {
  extends: HorizontalBar,
  async mounted() {
    const data = await storage.getData();
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: Object.keys(data),
      datasets: [
        {
          label: `Stats for ${storage.getCurrentDate()}`,
          backgroundColor: '#f87979',
          data: Object.values(data)
        }
      ]
    }, {
      scales: {
          xAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      },
      barThickness: 30
  });
  }
};
