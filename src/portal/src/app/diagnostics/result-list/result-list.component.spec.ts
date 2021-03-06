import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsModule } from '../../materials.module';
import { ApiService } from '../../services/api.service';
import { JobStateService } from '../../services/job-state/job-state.service';
import { ResultListComponent } from './result-list.component';
import { TableService } from '../../services/table/table.service';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router, ActivatedRoute } from '@angular/router';

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

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

@Directive({
  selector: '[appWindowScroll]',
})
class WindowScrollDirectiveStub {
  @Input() dataLength: number;
  @Input() pageSize: number;
  @Output() scrollEvent = new EventEmitter();
}

class ApiServiceStub {
  static results = [{ id: 5563, diagnosticTest: { name: 'test', category: 'test' }, progress: 0, state: 'Finished', name: 'test', createdAt: '2018-06-20T10:39:26.0930804+00:00', lastChangedAtAt: '2018-06-20T10:40:24.4964341+00:00' }];

  diag = {
    getDiagsByPage: (lastId: any, count: any, reverse: any) => of(ApiServiceStub.results)
  }
}

class JobStateServiceStub {
  stateClass(state) {
    return 'finished';
  }
  stateIcon(state) {
    return 'done';
  }
}

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

fdescribe('DiagResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;
  let viewport: CdkVirtualScrollViewport;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouterLinkDirectiveStub,
        ResultListComponent,
        WindowScrollDirectiveStub
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MaterialsModule,
        ScrollingModule
      ],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: JobStateService, useClass: JobStateServiceStub },
        { provide: TableService, useValue: TableServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
    viewport = component.cdkVirtualScrollViewport;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(viewport.getDataLength()).toEqual(1);
  });
});
