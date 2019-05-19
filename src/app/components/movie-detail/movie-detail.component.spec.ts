import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MovieDetailComponent } from './movie-detail.component';

describe('MovieDetailComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        MovieDetailComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MovieDetailComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'huawei-video-fe'`, () => {
    const fixture = TestBed.createComponent(MovieDetailComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('huawei-video-fe');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(MovieDetailComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to huawei-video-fe!');
  });
});
