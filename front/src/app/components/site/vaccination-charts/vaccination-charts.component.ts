import { Component, OnInit } from '@angular/core';
import {EChartsOption} from "echarts";
import {ApiService} from "../../../services/api.service";
import {MessageService} from "../../../services/message.service";

interface NightingaleDataInner {
  name: string;
  value: number;
}

@Component({
  selector: 'app-vaccination-charts',
  templateUrl: './vaccination-charts.component.html',
  styleUrls: ['./vaccination-charts.component.css']
})
export class VaccinationChartsComponent implements OnInit {
  NightingaleChartOption: EChartsOption = {};
  BarChartOption: EChartsOption = {};

  constructor(private api: ApiService,
              private msg: MessageService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.GetVaccinationVaccineCountSite().subscribe({
      next: getVaccinationVaccineCountP => {
        let nightingaleData = new Array<NightingaleDataInner>();
        for (let vCount of getVaccinationVaccineCountP) {
          if (vCount.vaccine) {
            nightingaleData.push({
              name: vCount.vaccine.manufacturer + vCount.vaccine.type,
              value: vCount.count
            });
          } else {
            nightingaleData.push({
              name: vCount.vaccine_id.toString(),
              value: vCount.count
            });
          }
        }
        this.NightingaleChartOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            top: '0%',
            left: 'center',
            height: 600
          },
          series: [
            {
              name: '疫苗种类',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              data: nightingaleData
            }
          ]
        };
      },
      error: err => {
        this.msg.SendMessage(`获取统计数据失败: ${err}`);
      }
    });
    this.api.GetVaccinationMonthCountSite().subscribe({
      next: getVaccinationMonthCountP => {
        let barData = new Array<number>();
        for (let mCount of getVaccinationMonthCountP) {
          barData.push(mCount.count);
        }
        this.BarChartOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '接种人数',
              type: 'bar',
              barWidth: '60%',
              data: barData
            }
          ]
        };
      },
      error: err => {
        this.msg.SendMessage(`获取统计数据失败: ${err}`);
      }
    });
  }
}
