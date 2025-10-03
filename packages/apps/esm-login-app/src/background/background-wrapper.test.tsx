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
    type: 'default',
    columnPosition: 'center',
    showLogo: true,
    showFooter: true,
  },
  background: {
    type: 'default',
    value: '',
    alt: 'Background Image',
    size: 'cover',
    position: 'center',
    repeat: 'no-repeat',
    attachment: 'scroll',
    overlay: {
      enabled: false,
      color: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.3,
      blendMode: 'normal',
    },
  },
  card: {
    backgroundColor: '',
    borderRadius: '',
    width: '',
    padding: '',
    boxShadow: '',
  },
  button: {
    backgroundColor: '',
    textColor: '',
  },
  branding: {
    title: '',
    subtitle: '',
    customText: '',
    helpText: '',
    contactEmail: '',
    customLinks: [],
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
        ...defaultConfig.background,
        type: 'color' as const,
        value: '#ff0000',
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
        ...defaultConfig.background,
        type: 'image' as const,
        value: 'https://example.com/background.jpg',
        size: 'contain',
        position: 'top',
        repeat: 'repeat-x' as const,
        attachment: 'fixed' as const,
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

  it('renders with gradient background configuration', () => {
    const configWithGradientBg = {
      ...defaultConfig,
      background: {
        ...defaultConfig.background,
        type: 'gradient' as const,
        value: 'linear-gradient(45deg, #ff0000, #0000ff)',
      },
    };
    mockUseConfig.mockReturnValue(configWithGradientBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders with overlay configuration', () => {
    const configWithOverlay = {
      ...defaultConfig,
      background: {
        ...defaultConfig.background,
        type: 'color' as const,
        value: '#ff0000',
        overlay: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.5)',
          opacity: 0.5,
          blendMode: 'multiply' as const,
        },
      },
    };
    mockUseConfig.mockReturnValue(configWithOverlay);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders split-screen layout with right column position', () => {
    const configWithSplitScreen = {
      ...defaultConfig,
      layout: {
        ...defaultConfig.layout,
        type: 'split-screen' as const,
        columnPosition: 'right' as const,
      },
      background: {
        ...defaultConfig.background,
        type: 'image' as const,
        value: 'https://example.com/bg.jpg',
      },
    };
    mockUseConfig.mockReturnValue(configWithSplitScreen);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders split-screen layout with left column position', () => {
    const configWithSplitScreen = {
      ...defaultConfig,
      layout: {
        ...defaultConfig.layout,
        type: 'split-screen' as const,
        columnPosition: 'left' as const,
      },
      background: {
        ...defaultConfig.background,
        type: 'image' as const,
        value: 'https://example.com/bg.jpg',
      },
    };
    mockUseConfig.mockReturnValue(configWithSplitScreen);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('handles empty background value gracefully', () => {
    const configWithEmptyBg = {
      ...defaultConfig,
      background: {
        ...defaultConfig.background,
        type: 'image' as const,
        value: '',
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

  it('renders with custom background configuration', () => {
    const configWithCustomBg = {
      ...defaultConfig,
      background: {
        ...defaultConfig.background,
        type: 'color' as const,
        value: '#ff0000',
      },
    };
    mockUseConfig.mockReturnValue(configWithCustomBg);

    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
