import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GeneralReportComponent } from './general-report.component';
import { of } from 'rxjs/observable/of';
import { OverviewResultComponent } from '../overview-result/overview-result.component';
import { MaterialsModule } from '../../../../../materials.module';
import { ApiService } from '../../../../../services/api.service';
import { TableService } from '../../../../../services/table/table.service';
import { DiagReportService } from '../../../../../services/diag-report/diag-report.service';

@Component({ selector: 'app-result-layout', template: '' })
class ResultLayoutComponent {
  @Input()
  result: any;

  @Input()
  aggregationResult: any;
}

@Component({ selector: 'pingpong-overview-result', template: '' })
class PingPongOverviewResultComponent {
  @Input()
  result: any;
}

@Component({ selector: 'app-event-list', template: '' })
class EventListComponent {
  @Input()
  events: any;
}

@Component({ selector: 'app-nodes-info', template: '' })
class NodesInfoComponent {
  @Input()
  nodes: Array<any>;

  @Input()
  badNodes: Array<any>;
}

@Component({ selector: 'diag-task-table', template: '' })
class DiagTaskTableComponent {
  @Input()
  dataSource: any;

  @Input()
  currentData: any;

  @Input()
  customizableColumns: any;

  @Input()
  tableName: any;

  @Input()
  loadFinished: boolean;

  @Input()
  maxPageSize: number;

  @Output()
  updateLastIdEvent = new EventEmitter();

  @Input()
  public empty: boolean;
}

@Component({
  template: `
    <div class="error-message" *ngIf="result.aggregationResult != undefined && result.aggregationResult.Error != undefined">{{result.aggregationResult.Error}}</div>
  `
})
class WrapperComponent {
  public result = { aggregationResult: { Error: "error message" } };
}

class ApiServiceStub {
  static taskResult = [{
    customizedData: "Standard_H16r",
    jobId: 301,
    nodeName: "EVANCVMSS000002",
    state: "Finished"
  }];

  static jobResult = {
    id: 302,
    name: "cpu",
    aggregationResult: { Error: "error message" }
  };

  diag = {
    getDiagTasksByPage: (id: any, lastId, count) => of(ApiServiceStub.taskResult),
    getDiagJob: (id: any) => of(ApiServiceStub.jobResult),
    getJobAggregationResult: (id: any) => of({ Error: "error message" }),
    getJobEvents: (id: any) => of([])
  }
}

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined
}

class DiagReportServiceStub {
  hasError(result) {
    return true;
  }

  jobFinished(state) {
    return true;
  }

  getErrorMsg(err) {
    return { Error: err };
  }
}

fdescribe('GeneralReportComponent', () => {
  let component: GeneralReportComponent;
  let fixture: ComponentFixture<GeneralReportComponent>;

  let wrapperComponent: WrapperComponent;
  let wrapperFixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeneralReportComponent,
        ResultLayoutComponent,
        OverviewResultComponent,
        DiagTaskTableComponent,
        EventListComponent,
        NodesInfoComponent,
        WrapperComponent
      ],
      imports: [MaterialsModule],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: TableService, useValue: TableServiceStub },
        { provide: DiagReportService, useClass: DiagReportServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralReportComponent);
    component = fixture.componentInstance;

    wrapperFixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = wrapperFixture.componentInstance;

    component.result = { aggregationResult: { Error: "error message" } };

    fixture.detectChanges();
    wrapperFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message', () => {
    let wrapperComponent = wrapperFixture.componentInstance;
    let itemElement = wrapperFixture.debugElement.nativeElement;
    let text = itemElement.querySelector(".error-message").textContent;
    expect(text).toEqual('error message');
  });
});
