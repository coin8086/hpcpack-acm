import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultDetailComponent } from './result-detail.component';
import { ReplaySubject, of } from 'rxjs';
import { ParamMap, Params, convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { GeneralReportComponent } from './diags/general-template/general-report/general-report.component';
import { RingReportComponent } from './diags/mpi/ring/ring-report/ring-report.component';
import { PingPongReportComponent } from './diags/mpi/pingpong/pingpong-report/pingpong-report.component';
import { ResultLayoutComponent } from './result-layout/result-layout.component';
import { MaterialsModule } from '../../materials.module';
import { OverviewResultComponent } from './diags/general-template/overview-result/overview-result.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { TaskTableComponent } from './task/task-table/task-table.component';
import { NodesInfoComponent } from './diags/nodes-info/nodes-info.component';
import { EventListComponent } from '../../widgets/event-list/event-list.component';
import { PingPongOverviewResultComponent } from './diags/mpi/pingpong/overview-result/overview-result.component';
import { GoodNodesComponent } from './diags/mpi/pingpong/good-nodes/good-nodes.component';
import { FailedReasonsComponent } from './diags/mpi/pingpong/failed-reasons/failed-reasons.component';
import { LoadingProgressBarComponent } from '../../widgets/loading-progress-bar/loading-progress-bar.component';
import { ScrollToTopComponent } from '../../widgets/scroll-to-top/scroll-to-top.component';
import { CUSTOM_ELEMENTS_SCHEMA, Directive, Input, NgModule } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableService } from '../../services/table/table.service';
import { JobStateService } from '../../services/job-state/job-state.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  };
}

class ApiServiceStub {
  results = { id: 5563, diagnosticTest: { name: 'test', category: 'test' }, progress: 0, state: 'Finished', name: 'test', createdAt: '2018-06-20T10:39:26.0930804+00:00', lastChangedAtAt: '2018-06-20T10:40:24.4964341+00:00', targetNodes: ["testNode1", "testNode2"] };
  taskResult = [{
    customizedData: "Standard_H16r",
    jobId: 301,
    nodeName: "EVANCVMSS000002",
    state: "Finished"
  }];
  diag = {
    getDiagJob: (id: any) => of(this.results),
    getDiagTasksByPage: () => of(this.taskResult),
    getJobAggregationResult: (id: any) => of({ Error: "error message" }),
    getJobEvents: (id: any) => of([])
  }
}

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

class JobStateServiceStub {
  stateClass(state) {
    return 'finished';
  }
  stateIcon(state) {
    return 'done';
  }
}

const routerStub = {
  navigate: () => { },
}

@NgModule({
  declarations: [
    PingPongReportComponent,
    TaskDetailComponent,
    PingPongOverviewResultComponent,
    TaskTableComponent,
    ResultLayoutComponent,
    RingReportComponent,
    NodesInfoComponent,
    OverviewResultComponent,
    GeneralReportComponent,
    FailedReasonsComponent,
    GoodNodesComponent,
    ScrollToTopComponent,
    LoadingProgressBarComponent,
    EventListComponent,
    RouterLinkDirectiveStub
  ],
  imports: [
    MaterialsModule, ChartModule, CommonModule, FormsModule, ScrollingModule
  ],
  entryComponents: [
    GeneralReportComponent, RingReportComponent, PingPongReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class TestModule { }

fdescribe('DiagResultDetailComponent', () => {
  let component: ResultDetailComponent;
  let fixture: ComponentFixture<ResultDetailComponent>;
  let activatedRoute = new ActivatedRouteStub({ id: 133 });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: TableService, useValue: TableServiceStub },
        { provide: JobStateService, useClass: JobStateServiceStub },
        { provide: Router, useValue: routerStub }
      ],
      imports: [TestModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
