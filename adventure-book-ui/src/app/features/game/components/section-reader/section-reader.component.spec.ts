import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionReaderComponent } from './section-reader.component';
import { Section } from '../../../../core/models/book.model';

describe('SectionReaderComponent', () => {
  let component: SectionReaderComponent;
  let fixture: ComponentFixture<SectionReaderComponent>;

  const mockSection: Section = {
    id: 1,
    text: 'You are in a dark cave.',
    type: 'NODE',
    options: [
      { description: 'Go left', gotoId: 2 },
      { description: 'Go right', gotoId: 3 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionReaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionReaderComponent);
    component = fixture.componentInstance;
    component.section = mockSection;
    fixture.detectChanges();
  });

  it('should display section text', () => {
    const textElement = fixture.nativeElement.querySelector('.section-text p');
    expect(textElement.textContent).toContain('You are in a dark cave.');
  });

  it('should display options', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.choice-btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Go left');
    expect(buttons[1].textContent).toContain('Go right');
  });

  it('should emit choice when option clicked', () => {
    const emitSpy = vi.spyOn(component.makeChoice, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('.choice-btn');
    buttons[0].click();
    expect(emitSpy).toHaveBeenCalledWith(mockSection.options![0]);
  });
});
