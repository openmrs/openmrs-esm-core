import { navigate } from '../navigation/navigate';
import { clearHistory, getHistory, goBackInHistory, setupHistory } from './history';

jest.mock('../navigation/navigate');
const mockNavigate = navigate as jest.Mock;

describe('history', () => {
  const originalWindowLocation = window.location;
  const originalDocumentReferrer = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'referrer',
  ) as PropertyDescriptor;
  const mockReferrer = 'https://o3.openmrs.org/openmrs/spa/lalaland';
  let mockLocationAssign;

  beforeAll(() => {
    delete (window as any).location;
    delete (document as any).referrer;
    (window as any).location = {
      assign: jest.fn(),
      href: 'https://o3.openmrs.org/openmrs/spa/chart',
      origin: 'https://o3.openmrs.org',
    };
    window.getOpenmrsSpaBase = () => 'https://o3.openmrs.org/openmrs/spa';
    Object.defineProperty(document, 'referrer', {
      value: mockReferrer,
      writable: true,
      configurable: true,
    });
    mockLocationAssign = window.location.assign as jest.Mock;
  });

  beforeEach(() => {
    mockLocationAssign.mockClear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    clearHistory();
  });

  afterAll(() => {
    window.location = originalWindowLocation;
    (document as any).referrer = originalDocumentReferrer;
    Object.defineProperty(document, 'referrer', originalDocumentReferrer);
  });

  it('should be initialized with document.referrer if available', () => {
    setupHistory();
    expect(getHistory()).toEqual([mockReferrer]);
  });

  it('should update history on routing events and go back correctly', () => {
    setupHistory();
    window.location.href = 'https://o3.openmrs.org/openmrs/spa/labs';
    window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
    expect(getHistory()).toEqual([mockReferrer, 'https://o3.openmrs.org/openmrs/spa/labs']);
    window.location.href = 'https://o3.openmrs.org/pharmacy';
    window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
    window.location.href = 'https://o3.openmrs.org/x-ray';
    window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
    expect(getHistory()).toEqual([
      mockReferrer,
      'https://o3.openmrs.org/openmrs/spa/labs',
      'https://o3.openmrs.org/pharmacy',
      'https://o3.openmrs.org/x-ray',
    ]);

    mockNavigate.mockImplementation((params: { to: string }) => {
      window.location.href = params.to;
      window.dispatchEvent(new CustomEvent('single-spa:routing-event'));
    });
    goBackInHistory({ toUrl: 'https://o3.openmrs.org/openmrs/spa/labs' });
    expect(getHistory()).toEqual([mockReferrer, 'https://o3.openmrs.org/openmrs/spa/labs']);
  });
});
