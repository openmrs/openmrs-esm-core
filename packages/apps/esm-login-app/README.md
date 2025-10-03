# openmrs-esm-login-app

openmrs-esm-login-app is responsible for rendering the loading page, the login page, and the location picker.

## Configuration

The login page can be customized through configuration. This allows implementers to:

- Choose from multiple layouts (default or split-screen)
- Customize backgrounds (colors, images, or gradients)
- Brand the login page with custom titles, subtitles, and logos
- Style the login card and buttons
- Add custom links and help text
- Configure the footer with additional logos

See the [configuration schema](src/config-schema.ts) for all available options.

## Configuration Examples

### Split-Screen Layout with Image Background

```json
{
  "@openmrs/esm-login-app": {
    "layout": {
      "type": "split-screen",
      "columnPosition": "right"
    },
    "background": {
      "type": "image",
      "value": "https://example.com/hospital-bg.jpg"
    }
  }
}
```

### Color Background

```json
{
  "@openmrs/esm-login-app": {
    "background": {
      "type": "color",
      "value": "#0066cc"
    }
  }
}
```

### Gradient Background

```json
{
  "@openmrs/esm-login-app": {
    "background": {
      "type": "gradient",
      "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  }
}
```

### Custom Branding

```json
{
  "@openmrs/esm-login-app": {
    "branding": {
      "title": "Welcome to My Clinic",
      "subtitle": "Electronic Medical Records System"
    },
    "logo": {
      "src": "https://example.com/logo.png",
      "alt": "My Clinic"
    },
    "button": {
      "backgroundColor": "#0071c5"
    }
  }
}
```