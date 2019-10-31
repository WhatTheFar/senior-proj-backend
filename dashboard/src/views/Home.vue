<template>
  <div class="home container" style="font-size:12px;">
    <div class="row justify-content-md-center">
      <img
        src="https://onefact.net/wp-content/uploads/2016/06/seniorproject.png"
        class="img-fluid"
        alt="Responsive image"
        style="width:50%;height:50%;margin:20px;"
      />
      <div class="col-12">
        <!-- Set the number of people -->
        <h2>
          Current number of people:
          <b>{{ currentNumberOfPeople }}</b>
        </h2>
      </div>
      <div class="input-group col-12">
        <input
          type="number"
          class="form-control"
          placeholder="# of people"
          v-model="numberOfPeople"
          style="color:black;font-size:50px;"
        />
        <div class="input-group-append" id="button-addon4">
          <button
            class="btn btn-success"
            type="button"
            data-toggle="modal"
            data-target="#confirmSetModal"
            :disabled="resetBtnDisable"
            style="paddingLeft:25px;paddingRight:25px;"
          >
            <b>SET</b>
          </button>
          <button
            class="btn btn-secondary"
            type="button"
            data-toggle="modal"
            data-target="#confirmResetModal"
            :disabled="resetBtnDisable"
          >
            Reset Background
            <br />
            <h5 v-if="resetBtnIsClicked">(60s)</h5>
          </button>
        </div>
      </div>
      <!-- Reset button loading -->
      <div class="d-flex align-items-center" v-if="resetBtnDisable" style="margin:10px">
        <strong>Processing...</strong>
        <div class="spinner-border ml-auto" role="status" aria-hidden="true" style="margin:20px;"></div>
      </div>

      <!-- Table -->
      <div class="col-12">
        <hr />
        <h2>Data Table</h2>
        <table v-if="sensorInfo" class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">
                Date &amp;
                <br />Time
              </th>
              <th scope="col">People</th>
              <th scope="col">
                CO2
                <br />(ppm)
              </th>
              <th scope="col">
                Hum1
                <br />(%)
              </th>
              <th scope="col">H2</th>
              <th scope="col">H3</th>
              <th scope="col">H4</th>
              <th scope="col">
                Temp1
                <br />(*C)
              </th>
              <th scope="col">T2</th>
              <th scope="col">T3</th>
              <th scope="col">T4</th>
              <th scope="col">
                Light1
                <br />(LUX)
              </th>
              <th scope="col">L2</th>
              <th scope="col">L3</th>
              <th scope="col">L4</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in sensorInfo" :key="key">
              <th scope="row">{{value.date}}</th>
              <td>{{value.people.people}}</td>
              <td>{{value.co2[0].co2}}</td>
              <td>{{value.multi[0].hum}}</td>
              <td>{{value.multi[1].hum}}</td>
              <td>{{value.multi[2].hum}}</td>
              <td>{{value.multi[3].hum}}</td>
              <td>{{value.multi[0].temp}}</td>
              <td>{{value.multi[1].temp}}</td>
              <td>{{value.multi[2].temp}}</td>
              <td>{{value.multi[3].temp}}</td>
              <td>{{value.multi[0].light}}</td>
              <td>{{value.multi[1].light}}</td>
              <td>{{value.multi[2].light}}</td>
              <td>{{value.multi[3].light}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal for Set button -->
      <div class="modal fade" id="confirmSetModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Confirmation</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>
                You're setting from
                <b>{{currentNumberOfPeople}}</b> people to
                <b>{{numberOfPeople}}</b> people
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                @click="setNumberOfPeople"
              >Confirm!</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal for Reset button -->
      <div class="modal fade" id="confirmResetModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Confirmation</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Wait for 60 seconds to reset the background.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button>
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                v-on:click="resetBackground()"
              >Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SensorInfo } from "@/types/sensor";
import { mapGetters } from "vuex";
@Component({
  computed: {
    ...mapGetters({
      sensorInfo: "sensorInfo"
    })
  }
})
export default class Home extends Vue {
  private numberOfPeople = "0";
  private resetBackgroundTimer = 10;
  private resetBtnIsClicked = false;
  private resetBtnDisable = false;
  private sensorInfo!: Array<SensorInfo>;

  mounted() {
    this.$store.dispatch('startPollingSensorInfo');
  }

  destroyed() {
    this.$store.dispatch('stopPollingSensorInfo');
  }

  get currentNumberOfPeople(): number {
    return this.sensorInfo.length > 0 ? this.sensorInfo[0].people.people : 0;
  }

  private async setNumberOfPeople() {
    if (parseInt(this.numberOfPeople) < 0) {
      alert(
        "Please input valid number" +
          "\n" +
          "The number must be equal or more than 0"
      );
    } else {
      console.log("People: " + this.numberOfPeople);
    }
    const result = await this.axios.put("/iot/sensor/people/count", {
      people: parseInt(this.numberOfPeople)
    });
    console.log(result.data);
  }

  private async resetBackground() {
    this.resetBtnIsClicked = true;
    this.resetBtnDisable = true;
    const result = await this.axios.put("/iot/sensor/people/bg");
    console.log(result.data);
    setTimeout(() => {
      this.resetBtnIsClicked = false;
      this.resetBtnDisable = false;
      alert("Background reset successful!");
    }, 60 * 1000);
  }
}
</script>
