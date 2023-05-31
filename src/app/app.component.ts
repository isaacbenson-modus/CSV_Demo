import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import '@angular/localize/init';

interface Column {
  field: string;
  title: string;
}

interface DataItem {
  [key: string]: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [
    `
      .grid {
        background-color: #fff;
      }
    `,
  ],
})

export class AppComponent implements OnInit {
  public columns: Column[] = [];
  public gridData: GridDataResult = { data: [], total: 0 };
  public pageSize = 3000;
  public skip = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCSV();
    console.log(this.columns)
  }

  private loadCSV() {
    this.http.get('/assets/bigdata.txt', { responseType: 'text' }).subscribe(data => {
      const csvRows = data.split(/\r\n|\n/);
      var headerRow = csvRows[0].split('\t');
      headerRow = headerRow.map((str) => str.replace(/^"(.*)"$/, '$1'))
      //headerRow = headerRow.filter((str) => str !== '')
      this.columns = headerRow.map((column: string) => {
        return {
          field: column,
          title: column
        };
      });
      const dataRows = csvRows.slice(1);
      const dataItems: DataItem[] = dataRows.map((row: string) => {
        var rowValues = row.split('\t');
        rowValues = rowValues.map((str) => str.replace(/^"(.*)"$/, '$1'))
        // rowValues = rowValues.filter((str) => str !== '')

        console.log(rowValues)
        const dataItem: DataItem = {};
        headerRow.forEach((column, index) => dataItem[column] = rowValues[index]);
        return dataItem;
      });
      this.gridData = process(dataItems, { skip: this.skip, take: this.pageSize });
      console.log(this.gridData)
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.gridData = process(this.gridData.data, { skip: this.skip, take: this.pageSize });
  }
}