import React from 'react';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import BackgroundWrapper from './background-wrapper.component';

jest.mock('@openmrs/esm-framework', () => ({
  useConfig: jest.fn(),
}));

jest.mock('./background-wrapper.scss', () => ({
  backgroundWrapper: 'backgroundWrapper',
  customBackground: 'customBackground',
  splitScreenContainer: 'splitScreenContainer',
  backgroundPanel: 'backgroundPanel',
  'bgPosition-left': 'bgPosition-left',
  'bgPosition-right': 'bgPosition-right',
  content: 'content',
  overlay: 'overlay',
}));

const mockUseConfig = jest.mocked(useConfig<ConfigSchema>);

const defaultConfig: ConfigSchema = {
  chooseLocation: {
    enabled: true,
    locationsPerRequest: 50,
    numberToShow: 8,
    useLoginLocationTag: true,
  },
  footer: {
    additionalLogos: [],
  },
  links: {
    loginSuccess: '/home',
  },
  logo: {
    alt: 'Logo',
    src: '',
  },
  provider: {
    loginUrl: '/login',
    logoutUrl: '/logout',
    type: 'basic',
  },
  showPasswordOnSeparateScreen: true,
  layout: {
    loginFormPosition: 'center',
    showFooter: true,
  },
  background: {
    color: '',
    imageUrl: '',
  },
  branding: {
    title: '',
    subtitle: '',
    helpText: '',
  },
};

describe('BackgroundWrapper', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(defaultConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children with default background', () => {
    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with color background configuration', () => {
    const configWithColorBg = {
      ...defaultConfig,
      background: {
        color: '#ff0000',
        imageUrl: '',
      },
    };
    mockUseConfig.mockReturnValue(configWithColorBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders with image background configuration', () => {
    const configWithImageBg = {
      ...defaultConfig,
      background: {
        color: '',
        imageUrl: 'https://example.com/background.jpg',
      },
    };
    mockUseConfig.mockReturnValue(configWithImageBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders with both color and image background', () => {
    const configWithBothBg = {
      ...defaultConfig,
      background: {
        color: '#0071C5',
        imageUrl: 'https://example.com/background.jpg',
      },
    };
    mockUseConfig.mockReturnValue(configWithBothBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles empty background values gracefully', () => {
    const configWithEmptyBg = {
      ...defaultConfig,
      background: {
        color: '',
        imageUrl: '',
      },
    };
    mockUseConfig.mockReturnValue(configWithEmptyBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
